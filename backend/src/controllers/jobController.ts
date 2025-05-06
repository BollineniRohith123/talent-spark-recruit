import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

// Create a new job
export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      requirements,
      responsibilities,
      departmentId,
      locationId,
      salaryRangeMin,
      salaryRangeMax,
      jobType,
      experienceLevel,
      status,
      publishedAt,
      deadlineAt,
      hiringManagerId,
      isRemote,
      skills,
      benefits,
      numberOfOpenings
    } = req.body;
    
    // Create new job
    const job = await prisma.job.create({
      data: {
        title,
        description,
        requirements,
        responsibilities,
        departmentId,
        locationId,
        salaryRangeMin,
        salaryRangeMax,
        jobType,
        experienceLevel,
        status,
        publishedAt,
        deadlineAt,
        hiringManagerId,
        isRemote,
        skills,
        benefits: benefits || [],
        numberOfOpenings
      },
      include: {
        department: {
          select: {
            id: true,
            name: true
          }
        },
        location: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            country: true
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
    });
    
    logger.info(`Job created: ${job.title}`);
    
    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    logger.error(`Error creating job: ${error}`);
    res.status(500).json({
      message: 'An error occurred while creating the job',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Get all jobs
export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      status, 
      departmentId, 
      locationId, 
      isRemote, 
      experienceLevel,
      jobType,
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
    } else if (!req.user) {
      // For public access, only show open jobs
      filter.status = 'OPEN';
    }
    
    if (departmentId) {
      filter.departmentId = Number(departmentId);
    }
    
    if (locationId) {
      filter.locationId = Number(locationId);
    }
    
    if (isRemote !== undefined) {
      filter.isRemote = isRemote === 'true';
    }
    
    if (experienceLevel) {
      filter.experienceLevel = experienceLevel;
    }
    
    if (jobType) {
      filter.jobType = jobType;
    }
    
    if (search) {
      filter.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { skills: { has: search } }
      ];
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Define order object
    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;
    
    // Get total count of jobs matching the filter
    const totalJobs = await prisma.job.count({ where: filter });
    
    // Get jobs with pagination
    const jobs = await prisma.job.findMany({
      where: filter,
      include: {
        department: {
          select: {
            id: true,
            name: true
          }
        },
        location: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            country: true
          }
        },
        hiringManager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      },
      orderBy,
      skip,
      take: Number(limit)
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(totalJobs / Number(limit));
    
    res.status(200).json({
      jobs,
      pagination: {
        totalJobs,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    logger.error(`Error getting jobs: ${error}`);
    res.status(500).json({
      message: 'An error occurred while fetching jobs',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Get job by ID
export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const job = await prisma.job.findUnique({
      where: { id: Number(id) },
      include: {
        department: {
          select: {
            id: true,
            name: true
          }
        },
        location: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            country: true
          }
        },
        hiringManager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    });
    
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    
    // If user is not authenticated and job is not open, return 404
    if (!req.user && job.status !== 'OPEN') {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    
    res.status(200).json({ job });
  } catch (error) {
    logger.error(`Error getting job by ID: ${error}`);
    res.status(500).json({
      message: 'An error occurred while fetching the job',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Update job
export const updateJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      requirements,
      responsibilities,
      departmentId,
      locationId,
      salaryRangeMin,
      salaryRangeMax,
      jobType,
      experienceLevel,
      status,
      publishedAt,
      deadlineAt,
      hiringManagerId,
      isRemote,
      skills,
      benefits,
      numberOfOpenings
    } = req.body;
    
    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id: Number(id) }
    });
    
    if (!existingJob) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    
    // Update job
    const updatedJob = await prisma.job.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        requirements,
        responsibilities,
        departmentId,
        locationId,
        salaryRangeMin,
        salaryRangeMax,
        jobType,
        experienceLevel,
        status,
        publishedAt,
        deadlineAt,
        hiringManagerId,
        isRemote,
        skills,
        benefits: benefits || [],
        numberOfOpenings
      },
      include: {
        department: {
          select: {
            id: true,
            name: true
          }
        },
        location: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            country: true
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
    });
    
    logger.info(`Job updated: ${updatedJob.title}`);
    
    res.status(200).json({
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    logger.error(`Error updating job: ${error}`);
    res.status(500).json({
      message: 'An error occurred while updating the job',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Delete job
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: Number(id) },
      include: {
        applications: true
      }
    });
    
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    
    // If job has applications, don't delete it - soft delete by setting status to CLOSED
    if (job.applications.length > 0) {
      await prisma.job.update({
        where: { id: Number(id) },
        data: { status: 'CLOSED' }
      });
      
      logger.info(`Job soft-deleted (status changed to CLOSED): ${job.title}`);
      
      res.status(200).json({
        message: 'Job has existing applications and cannot be permanently deleted. Status changed to CLOSED instead.'
      });
      return;
    }
    
    // Delete job
    await prisma.job.delete({
      where: { id: Number(id) }
    });
    
    logger.info(`Job deleted: ${job.title}`);
    
    res.status(200).json({
      message: 'Job deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting job: ${error}`);
    res.status(500).json({
      message: 'An error occurred while deleting the job',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Get jobs by department
export const getJobsByDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { departmentId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter: any = {
      departmentId: Number(departmentId)
    };
    
    if (status) {
      filter.status = status;
    } else if (!req.user) {
      // For public access, only show open jobs
      filter.status = 'OPEN';
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Get total count
    const totalJobs = await prisma.job.count({ where: filter });
    
    // Get jobs
    const jobs = await prisma.job.findMany({
      where: filter,
      include: {
        department: {
          select: {
            id: true,
            name: true
          }
        },
        location: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            country: true
          }
        },
        hiringManager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(totalJobs / Number(limit));
    
    res.status(200).json({
      jobs,
      pagination: {
        totalJobs,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    logger.error(`Error getting jobs by department: ${error}`);
    res.status(500).json({
      message: 'An error occurred while fetching jobs by department',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Get jobs by location
export const getJobsByLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { locationId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter: any = {
      locationId: Number(locationId)
    };
    
    if (status) {
      filter.status = status;
    } else if (!req.user) {
      // For public access, only show open jobs
      filter.status = 'OPEN';
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Get total count
    const totalJobs = await prisma.job.count({ where: filter });
    
    // Get jobs
    const jobs = await prisma.job.findMany({
      where: filter,
      include: {
        department: {
          select: {
            id: true,
            name: true
          }
        },
        location: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            country: true
          }
        },
        hiringManager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(totalJobs / Number(limit));
    
    res.status(200).json({
      jobs,
      pagination: {
        totalJobs,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    logger.error(`Error getting jobs by location: ${error}`);
    res.status(500).json({
      message: 'An error occurred while fetching jobs by location',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Get job statistics
export const getJobsStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get count of jobs by status
    const jobsByStatus = await prisma.job.groupBy({
      by: ['status'],
      _count: true
    });
    
    // Get count of jobs by department
    const jobsByDepartment = await prisma.job.groupBy({
      by: ['departmentId'],
      _count: true
    });
    
    // Get department names for the counts
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true
      }
    });
    
    // Map department IDs to names
    const departmentMap = departments.reduce((acc, dept) => {
      acc[dept.id] = dept.name;
      return acc;
    }, {} as Record<number, string>);
    
    // Create formatted department stats
    const departmentStats = jobsByDepartment.map(stat => ({
      departmentId: stat.departmentId,
      departmentName: departmentMap[stat.departmentId] || 'Unknown',
      count: stat._count
    }));
    
    // Get count of jobs by location
    const jobsByLocation = await prisma.job.groupBy({
      by: ['locationId'],
      _count: true
    });
    
    // Get location names for the counts
    const locations = await prisma.location.findMany({
      select: {
        id: true,
        name: true
      }
    });
    
    // Map location IDs to names
    const locationMap = locations.reduce((acc, loc) => {
      acc[loc.id] = loc.name;
      return acc;
    }, {} as Record<number, string>);
    
    // Create formatted location stats
    const locationStats = jobsByLocation.map(stat => ({
      locationId: stat.locationId,
      locationName: locationMap[stat.locationId] || 'Unknown',
      count: stat._count
    }));
    
    // Get count of jobs by experience level
    const jobsByExperienceLevel = await prisma.job.groupBy({
      by: ['experienceLevel'],
      _count: true
    });
    
    // Get count of jobs by job type
    const jobsByType = await prisma.job.groupBy({
      by: ['jobType'],
      _count: true
    });
    
    // Get count of remote vs. on-site jobs
    const remoteJobs = await prisma.job.count({
      where: { isRemote: true }
    });
    
    const onsiteJobs = await prisma.job.count({
      where: { isRemote: false }
    });
    
    // Get total open jobs
    const openJobs = await prisma.job.count({
      where: { status: 'OPEN' }
    });
    
    // Get total number of jobs
    const totalJobs = await prisma.job.count();
    
    // Get average time to fill a job (from creation to hired)
    // This would require more complex analysis of applications and job status changes
    // For now, we'll provide the existing statistics
    
    res.status(200).json({
      jobsByStatus,
      departmentStats,
      locationStats,
      jobsByExperienceLevel,
      jobsByType,
      workArrangement: {
        remote: remoteJobs,
        onsite: onsiteJobs
      },
      openJobs,
      totalJobs
    });
  } catch (error) {
    logger.error(`Error getting job statistics: ${error}`);
    res.status(500).json({
      message: 'An error occurred while fetching job statistics',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};