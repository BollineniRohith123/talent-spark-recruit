import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { parseResume } from '../utils/resumeParser';

// Apply for a job
export const applyForJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      jobId,
      candidateId,
      firstName,
      lastName,
      email,
      phone,
      coverLetter,
      resumeUrl,
      source,
      referralName,
      expectedSalary,
      availableStartDate,
      education,
      experience,
      skills,
      portfolioUrl,
      linkedinUrl,
      githubUrl
    } = req.body;
    
    // Check if job exists and is open
    const job = await prisma.job.findUnique({
      where: { id: Number(jobId) }
    });
    
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    
    if (job.status !== 'OPEN') {
      res.status(400).json({ message: 'This job is not currently accepting applications' });
      return;
    }
    
    // Check if deadline has passed
    if (job.deadlineAt && new Date() > new Date(job.deadlineAt)) {
      res.status(400).json({ message: 'The application deadline for this job has passed' });
      return;
    }
    
    // Check if the candidate has already applied for this job
    if (candidateId) {
      const existingApplication = await prisma.application.findFirst({
        where: {
          jobId: Number(jobId),
          candidateId: Number(candidateId)
        }
      });
      
      if (existingApplication) {
        res.status(409).json({ message: 'You have already applied for this job' });
        return;
      }
    } else {
      // Check if someone with this email has already applied
      const existingApplication = await prisma.application.findFirst({
        where: {
          jobId: Number(jobId),
          email
        }
      });
      
      if (existingApplication) {
        res.status(409).json({ message: 'An application with this email already exists for this job' });
        return;
      }
    }
    
    // Parse resume if available
    let parsedResumeData = {};
    if (resumeUrl) {
      try {
        parsedResumeData = await parseResume(resumeUrl);
        logger.info(`Resume parsed successfully: ${resumeUrl}`);
      } catch (parseError) {
        logger.warn(`Resume parsing failed: ${parseError}`);
        // Continue with application even if parsing fails
      }
    }
    
    // Create application
    const application = await prisma.application.create({
      data: {
        jobId: Number(jobId),
        candidateId: candidateId ? Number(candidateId) : undefined,
        firstName,
        lastName,
        email,
        phone,
        coverLetter,
        resumeUrl,
        status: 'APPLIED',
        source: source || 'WEBSITE',
        referralName,
        expectedSalary: expectedSalary ? Number(expectedSalary) : undefined,
        availableStartDate: availableStartDate ? new Date(availableStartDate) : undefined,
        education: education || [],
        experience: experience || [],
        skills: skills || [],
        portfolioUrl,
        linkedinUrl,
        githubUrl
      }
    });
    
    logger.info(`New application submitted for job ID ${jobId} by ${firstName} ${lastName} (${email})`);
    
    // Create initial screening for resume review
    await prisma.screening.create({
      data: {
        applicationId: application.id,
        type: 'RESUME_REVIEW',
        status: 'PENDING'
      }
    });
    
    // In a production app, send notifications to recruiters/managers here
    
    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: application.id
    });
  } catch (error) {
    logger.error(`Error applying for job: ${error}`);
    res.status(500).json({
      message: 'An error occurred while submitting your application',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Get all applications
export const getApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      status, 
      jobId, 
      departmentId,
      source,
      search,
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter object based on query parameters
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (jobId) {
      filter.jobId = Number(jobId);
    }
    
    if (departmentId) {
      filter.job = {
        departmentId: Number(departmentId)
      };
    }
    
    if (source) {
      filter.source = source;
    }
    
    if (search) {
      filter.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Define order object
    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;
    
    // Get total count of applications matching the filter
    const totalApplications = await prisma.application.count({ where: filter });
    
    // Get applications with pagination
    const applications = await prisma.application.findMany({
      where: filter,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            departmentId: true,
            department: {
              select: {
                id: true,
                name: true
              }
            },
            location: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        interviews: {
          select: {
            id: true,
            scheduledAt: true,
            status: true,
            type: true
          }
        },
        screenings: {
          select: {
            id: true,
            type: true,
            status: true,
            score: true
          }
        },
        _count: {
          select: {
            interviews: true,
            screenings: true,
            offers: true
          }
        }
      },
      orderBy,
      skip,
      take: Number(limit)
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(totalApplications / Number(limit));
    
    res.status(200).json({
      applications,
      pagination: {
        totalApplications,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    logger.error(`Error getting applications: ${error}`);
    res.status(500).json({
      message: 'An error occurred while fetching applications',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Get application by ID
export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const application = await prisma.application.findUnique({
      where: { id: Number(id) },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            departmentId: true,
            department: {
              select: {
                id: true,
                name: true
              }
            },
            location: {
              select: {
                id: true,
                name: true
              }
            },
            hiringManager: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        interviews: {
          include: {
            interviewer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
            feedback: true
          }
        },
        screenings: true,
        offers: true
      }
    });
    
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }
    
    res.status(200).json({ application });
  } catch (error) {
    logger.error(`Error getting application by ID: ${error}`);
    res.status(500).json({
      message: 'An error occurred while fetching the application',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Update application status
export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    // Check if application exists
    const application = await prisma.application.findUnique({
      where: { id: Number(id) },
      include: {
        job: {
          select: {
            title: true
          }
        }
      }
    });
    
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }
    
    // Update application
    const updatedApplication = await prisma.application.update({
      where: { id: Number(id) },
      data: {
        status,
        notes
      }
    });
    
    logger.info(`Application status updated for ID ${id} from ${application.status} to ${status}`);
    
    // In a production app, send notification to candidate about status change
    
    res.status(200).json({
      message: 'Application status updated successfully',
      application: updatedApplication
    });
  } catch (error) {
    logger.error(`Error updating application status: ${error}`);
    res.status(500).json({
      message: 'An error occurred while updating application status',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Delete application
export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if application exists
    const application = await prisma.application.findUnique({
      where: { id: Number(id) },
      include: {
        interviews: true,
        offers: true,
        screenings: true
      }
    });
    
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }
    
    // Start transaction to delete all related records
    await prisma.$transaction(async (prismaClient) => {
      // Delete interviews and their feedback
      for (const interview of application.interviews) {
        await prismaClient.interviewFeedback.deleteMany({
          where: { interviewId: interview.id }
        });
      }
      
      await prismaClient.interview.deleteMany({
        where: { applicationId: Number(id) }
      });
      
      // Delete offers
      await prismaClient.offer.deleteMany({
        where: { applicationId: Number(id) }
      });
      
      // Delete screenings
      await prismaClient.screening.deleteMany({
        where: { applicationId: Number(id) }
      });
      
      // Delete the application
      await prismaClient.application.delete({
        where: { id: Number(id) }
      });
    });
    
    logger.info(`Application deleted: ID ${id}`);
    
    res.status(200).json({
      message: 'Application deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting application: ${error}`);
    res.status(500).json({
      message: 'An error occurred while deleting the application',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Get applications by job
export const getApplicationsByJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter: any = {
      jobId: Number(jobId)
    };
    
    if (status) {
      filter.status = status;
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Get total count
    const totalApplications = await prisma.application.count({ where: filter });
    
    // Get applications
    const applications = await prisma.application.findMany({
      where: filter,
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        interviews: {
          select: {
            id: true,
            scheduledAt: true,
            status: true,
            type: true
          }
        },
        screenings: {
          select: {
            id: true,
            type: true,
            status: true,
            score: true
          }
        },
        _count: {
          select: {
            interviews: true,
            screenings: true,
            offers: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });
    
    // Get job details
    const job = await prisma.job.findUnique({
      where: { id: Number(jobId) },
      select: {
        id: true,
        title: true,
        department: {
          select: {
            id: true,
            name: true
          }
        },
        location: {
          select: {
            id: true,
            name: true
          }
        },
        hiringManager: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        numberOfOpenings: true
      }
    });
    
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    
    // Calculate total pages
    const totalPages = Math.ceil(totalApplications / Number(limit));
    
    // Get application counts by status
    const statusCounts = await prisma.application.groupBy({
      by: ['status'],
      where: { jobId: Number(jobId) },
      _count: true
    });
    
    res.status(200).json({
      applications,
      job,
      statusCounts,
      pagination: {
        totalApplications,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    logger.error(`Error getting applications by job: ${error}`);
    res.status(500).json({
      message: 'An error occurred while fetching applications by job',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Get applications by candidate
export const getApplicationsByCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { candidateId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter: any = {
      candidateId: Number(candidateId)
    };
    
    if (status) {
      filter.status = status;
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Get total count
    const totalApplications = await prisma.application.count({ where: filter });
    
    // Get applications
    const applications = await prisma.application.findMany({
      where: filter,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            department: {
              select: {
                id: true,
                name: true
              }
            },
            location: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        interviews: {
          select: {
            id: true,
            scheduledAt: true,
            status: true,
            type: true
          }
        },
        screenings: {
          select: {
            id: true,
            type: true,
            status: true
          }
        },
        offers: {
          select: {
            id: true,
            status: true,
            expiryDate: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });
    
    // Get candidate details
    const candidate = await prisma.user.findUnique({
      where: { id: Number(candidateId) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true
      }
    });
    
    if (!candidate) {
      res.status(404).json({ message: 'Candidate not found' });
      return;
    }
    
    // Calculate total pages
    const totalPages = Math.ceil(totalApplications / Number(limit));
    
    // Get application counts by status
    const statusCounts = await prisma.application.groupBy({
      by: ['status'],
      where: { candidateId: Number(candidateId) },
      _count: true
    });
    
    res.status(200).json({
      applications,
      candidate,
      statusCounts,
      pagination: {
        totalApplications,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    logger.error(`Error getting applications by candidate: ${error}`);
    res.status(500).json({
      message: 'An error occurred while fetching applications by candidate',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Get application statistics
export const getApplicationStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get count of applications by status
    const applicationsByStatus = await prisma.application.groupBy({
      by: ['status'],
      _count: true
    });
    
    // Get count of applications by source
    const applicationsBySource = await prisma.application.groupBy({
      by: ['source'],
      _count: true
    });
    
    // Get count of applications by job
    const applicationsByJob = await prisma.application.groupBy({
      by: ['jobId'],
      _count: true
    });
    
    // Get job titles for the counts
    const jobs = await prisma.job.findMany({
      select: {
        id: true,
        title: true
      }
    });
    
    // Map job IDs to titles
    const jobMap = jobs.reduce((acc, job) => {
      acc[job.id] = job.title;
      return acc;
    }, {} as Record<number, string>);
    
    // Create formatted job stats
    const jobStats = applicationsByJob.map(stat => ({
      jobId: stat.jobId,
      jobTitle: jobMap[stat.jobId] || 'Unknown',
      count: stat._count
    }));
    
    // Get count of applications by department
    const applicationsByDepartment = await prisma.application.groupBy({
      by: ['job.departmentId'],
      _count: true
    });
    
    // Get top 5 jobs by number of applications
    const topJobs = await prisma.job.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            applications: true
          }
        }
      },
      orderBy: {
        applications: {
          _count: 'desc'
        }
      },
      take: 5
    });
    
    // Get applications created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentApplications = await prisma.application.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });
    
    // Get total number of applications
    const totalApplications = await prisma.application.count();
    
    // Get applications by time (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    // Format date to YYYY-MM
    const formatYearMonth = (date: Date) => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    };
    
    // Get applications by month
    const applicationsByMonth = await prisma.$queryRaw<{month: string, count: number}[]>`
      SELECT TO_CHAR("createdAt", 'YYYY-MM') as month, COUNT(*) as count
      FROM applications
      WHERE "createdAt" >= ${sixMonthsAgo}
      GROUP BY month
      ORDER BY month ASC
    `;
    
    res.status(200).json({
      applicationsByStatus,
      applicationsBySource,
      jobStats,
      topJobs,
      recentApplications,
      totalApplications,
      applicationsByMonth
    });
  } catch (error) {
    logger.error(`Error getting application statistics: ${error}`);
    res.status(500).json({
      message: 'An error occurred while fetching application statistics',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};