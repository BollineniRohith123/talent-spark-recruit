import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/passwordUtils';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding database...');
  
  try {
    // Clean up existing data
    await cleanDatabase();
    
    // Seed locations
    const locations = await seedLocations();
    
    // Seed departments
    const departments = await seedDepartments();
    
    // Seed users
    const users = await seedUsers(departments[0].id, locations[0].id);
    
    // Update department manager
    await prisma.department.update({
      where: { id: departments[0].id },
      data: { managerId: users.manager.id }
    });
    
    // Seed jobs
    const jobs = await seedJobs(departments[0].id, locations[0].id, users.manager.id);
    
    // Seed candidates
    const candidates = await seedCandidates();
    
    // Seed applications
    await seedApplications(jobs[0].id, candidates[0].id);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function cleanDatabase() {
  console.log('Cleaning existing data...');
  
  // Delete all records in reverse order of dependencies
  await prisma.notification.deleteMany({});
  await prisma.notificationSettings.deleteMany({});
  await prisma.interviewFeedback.deleteMany({});
  await prisma.interview.deleteMany({});
  await prisma.budgetAllocation.deleteMany({});
  await prisma.budget.deleteMany({});
  await prisma.screening.deleteMany({});
  await prisma.offer.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.location.deleteMany({});
}

async function seedLocations() {
  console.log('Seeding locations...');
  
  const locations = [
    {
      name: 'Headquarters',
      address: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94105',
      phone: '+1 (415) 555-1234',
      isHeadquarters: true,
      timezone: 'America/Los_Angeles'
    },
    {
      name: 'New York Office',
      address: '456 Broadway',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10013',
      phone: '+1 (212) 555-6789',
      timezone: 'America/New_York'
    }
  ];
  
  const result = [];
  
  for (const location of locations) {
    const createdLocation = await prisma.location.create({
      data: location
    });
    result.push(createdLocation);
  }
  
  return result;
}

async function seedDepartments() {
  console.log('Seeding departments...');
  
  const departments = [
    {
      name: 'Engineering',
      description: 'Software development and engineering',
      budgetCode: 'ENG-2023'
    },
    {
      name: 'Marketing',
      description: 'Marketing and communications',
      budgetCode: 'MKT-2023'
    },
    {
      name: 'Human Resources',
      description: 'Recruitment and employee management',
      budgetCode: 'HR-2023'
    }
  ];
  
  const result = [];
  
  for (const department of departments) {
    const createdDepartment = await prisma.department.create({
      data: department
    });
    result.push(createdDepartment);
  }
  
  return result;
}

async function seedUsers(departmentId: number, locationId: number) {
  console.log('Seeding users...');
  
  const hashedPassword = await hashPassword('Password123!');
  
  // Create superadmin
  const superadmin = await prisma.user.create({
    data: {
      email: 'superadmin@talentspark.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPERADMIN',
      departmentId,
      locationId,
      phone: '+1 (555) 123-4567',
      customPermissions: []
    }
  });
  
  // Create admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@talentspark.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      departmentId,
      locationId,
      phone: '+1 (555) 234-5678',
      customPermissions: []
    }
  });
  
  // Create manager
  const manager = await prisma.user.create({
    data: {
      email: 'manager@talentspark.com',
      password: hashedPassword,
      firstName: 'Department',
      lastName: 'Manager',
      role: 'MANAGER',
      departmentId,
      locationId,
      phone: '+1 (555) 345-6789',
      customPermissions: []
    }
  });
  
  // Create recruiter
  const recruiter = await prisma.user.create({
    data: {
      email: 'recruiter@talentspark.com',
      password: hashedPassword,
      firstName: 'Talent',
      lastName: 'Recruiter',
      role: 'RECRUITER',
      departmentId,
      locationId,
      phone: '+1 (555) 456-7890',
      customPermissions: []
    }
  });
  
  // Create interviewer
  const interviewer = await prisma.user.create({
    data: {
      email: 'interviewer@talentspark.com',
      password: hashedPassword,
      firstName: 'Technical',
      lastName: 'Interviewer',
      role: 'INTERVIEWER',
      departmentId,
      locationId,
      phone: '+1 (555) 567-8901',
      customPermissions: []
    }
  });
  
  // Create notification settings for all users
  await Promise.all([
    prisma.notificationSettings.create({
      data: { userId: superadmin.id }
    }),
    prisma.notificationSettings.create({
      data: { userId: admin.id }
    }),
    prisma.notificationSettings.create({
      data: { userId: manager.id }
    }),
    prisma.notificationSettings.create({
      data: { userId: recruiter.id }
    }),
    prisma.notificationSettings.create({
      data: { userId: interviewer.id }
    })
  ]);
  
  return { superadmin, admin, manager, recruiter, interviewer };
}

async function seedCandidates() {
  console.log('Seeding candidates...');
  
  const hashedPassword = await hashPassword('Password123!');
  
  const candidates = [
    {
      email: 'candidate1@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'CANDIDATE',
      phone: '+1 (555) 678-9012'
    },
    {
      email: 'candidate2@example.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'CANDIDATE',
      phone: '+1 (555) 789-0123'
    }
  ];
  
  const result = [];
  
  for (const candidate of candidates) {
    const createdCandidate = await prisma.user.create({
      data: candidate
    });
    
    // Create notification settings
    await prisma.notificationSettings.create({
      data: { userId: createdCandidate.id }
    });
    
    result.push(createdCandidate);
  }
  
  return result;
}

async function seedJobs(departmentId: number, locationId: number, hiringManagerId: number) {
  console.log('Seeding jobs...');
  
  const now = new Date();
  const deadline = new Date();
  deadline.setMonth(deadline.getMonth() + 1);
  
  const jobs = [
    {
      title: 'Senior Software Engineer',
      description: 'We are looking for a Senior Software Engineer to join our team.',
      requirements: 'Bachelor\'s degree in Computer Science or related field. 5+ years of experience in software development.',
      responsibilities: 'Design and develop high-quality software. Collaborate with cross-functional teams.',
      departmentId,
      locationId,
      salaryRangeMin: 120000,
      salaryRangeMax: 160000,
      jobType: 'FULL_TIME',
      experienceLevel: 'SENIOR',
      status: 'OPEN',
      publishedAt: now,
      deadlineAt: deadline,
      hiringManagerId,
      isRemote: true,
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL'],
      benefits: ['Health Insurance', '401(k)', 'Flexible Working Hours', 'Remote Work'],
      numberOfOpenings: 2
    },
    {
      title: 'Product Manager',
      description: 'We are seeking a Product Manager to drive our product vision and roadmap.',
      requirements: 'Bachelor\'s degree in Business, Computer Science, or related field. 3+ years of product management experience.',
      responsibilities: 'Define product vision and strategy. Work with engineering, design, and marketing teams.',
      departmentId,
      locationId,
      salaryRangeMin: 110000,
      salaryRangeMax: 150000,
      jobType: 'FULL_TIME',
      experienceLevel: 'MID',
      status: 'OPEN',
      publishedAt: now,
      deadlineAt: deadline,
      hiringManagerId,
      isRemote: false,
      skills: ['Product Management', 'Agile', 'User Research', 'Roadmapping', 'Data Analysis'],
      benefits: ['Health Insurance', '401(k)', 'Flexible Working Hours', 'Professional Development'],
      numberOfOpenings: 1
    }
  ];
  
  const result = [];
  
  for (const job of jobs) {
    const createdJob = await prisma.job.create({
      data: job
    });
    result.push(createdJob);
  }
  
  return result;
}

async function seedApplications(jobId: number, candidateId: number) {
  console.log('Seeding applications...');
  
  const application = await prisma.application.create({
    data: {
      jobId,
      candidateId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'candidate1@example.com',
      phone: '+1 (555) 678-9012',
      coverLetter: 'I am excited to apply for this position and believe my skills are a great match.',
      resumeUrl: '/uploads/sample-resume.pdf',
      status: 'APPLIED',
      source: 'WEBSITE',
      expectedSalary: 130000,
      availableStartDate: new Date('2023-07-01'),
      education: [
        {
          institution: 'Stanford University',
          degree: 'Master of Science',
          fieldOfStudy: 'Computer Science',
          from: new Date('2015-09-01'),
          to: new Date('2017-06-01'),
          current: false
        },
        {
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          from: new Date('2011-09-01'),
          to: new Date('2015-05-01'),
          current: false
        }
      ],
      experience: [
        {
          company: 'Tech Innovations Inc.',
          position: 'Software Engineer',
          description: 'Developed and maintained web applications using React and Node.js.',
          from: new Date('2017-07-01'),
          to: new Date('2020-12-31'),
          current: false
        },
        {
          company: 'Global Solutions',
          position: 'Senior Software Engineer',
          description: 'Leading a team of 5 engineers to build scalable backend services.',
          from: new Date('2021-01-01'),
          to: null,
          current: true
        }
      ],
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
      portfolioUrl: 'https://johndoe-portfolio.com',
      linkedinUrl: 'https://linkedin.com/in/johndoe',
      githubUrl: 'https://github.com/johndoe'
    }
  });
  
  // Create a screening for the application
  await prisma.screening.create({
    data: {
      applicationId: application.id,
      type: 'RESUME_REVIEW',
      status: 'COMPLETED',
      completedAt: new Date(),
      score: 85,
      notes: 'Strong candidate with relevant experience. Recommended for interview.'
    }
  });
  
  // Create an interview
  const interview = await prisma.interview.create({
    data: {
      applicationId: application.id,
      interviewerId: candidateId, // Using candidate ID as interviewer for demo
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      duration: 60,
      type: 'TECHNICAL',
      status: 'SCHEDULED',
      location: 'Virtual (Zoom)',
      meetingLink: 'https://zoom.us/j/123456789',
      questions: [
        'Describe your experience with React and Node.js',
        'How do you approach testing in your projects?',
        'Tell us about a challenging project you worked on'
      ]
    }
  });
  
  console.log('Applications seeded successfully');
}

// Run the seed function
seed()
  .catch((error) => {
    console.error('Error during seeding:', error);
    process.exit(1);
  });