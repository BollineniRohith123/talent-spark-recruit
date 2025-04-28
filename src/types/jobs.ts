// Job listing types and mock data

export type JobStatus = 'draft' | 'published' | 'in-progress' | 'on-hold' | 'filled' | 'closed';

export type JobPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface JobListing {
  id: string;
  title: string;
  description: string;
  department: string;
  departmentId: string;
  location: string;
  locationId: string;
  status: JobStatus;
  priority: JobPriority;
  assignedTo: string | null; // User ID
  assignedToName: string | null; // User name
  applicantsCount: number;
  createdAt: string;
  updatedAt: string;
  deadline: string | null;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  // Profit optimization fields
  clientBudget?: number; // Amount client pays per hour
  companyProfit?: number; // Amount company keeps from client budget
  companyProfitPercentage?: number; // Percentage company keeps from client budget
  candidateOffer?: number; // Amount offered to candidate per hour
  consultancyFee?: number; // Amount company keeps from candidate offer
  consultancyFeePercentage?: number; // Percentage company keeps from candidate offer
  finalCandidateRate?: number; // Final amount candidate receives per hour

  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  isRemote: boolean;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'temporary' | 'internship';
}

export interface JobCandidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  notes: string;
  appliedAt: string;
  lastUpdated: string;
}

// Mock data for job listings
export const mockJobListings: JobListing[] = [
  {
    id: 'job-1',
    title: 'Senior Software Engineer',
    description: 'We are looking for a Senior Software Engineer to join our team...',
    department: 'IT Department',
    departmentId: 'dept-1',
    location: 'Miami Headquarters',
    locationId: 'loc-1',
    status: 'published',
    priority: 'high',
    assignedTo: 'user-3', // Jamie Garcia (Scout)
    assignedToName: 'Jamie Garcia',
    applicantsCount: 12,
    createdAt: '2023-06-15T00:00:00Z',
    updatedAt: '2023-06-20T00:00:00Z',
    deadline: '2023-07-30T00:00:00Z',
    salary: {
      min: 120000,
      max: 150000,
      currency: 'USD'
    },
    clientBudget: 100,
    companyProfit: 35,
    companyProfitPercentage: 35,
    candidateOffer: 65,
    consultancyFee: 19.5,
    consultancyFeePercentage: 30,
    finalCandidateRate: 45.5,
    requirements: [
      '5+ years of experience in software development',
      'Strong knowledge of JavaScript and TypeScript',
      'Experience with React and Node.js',
      'Bachelor\'s degree in Computer Science or related field'
    ],
    responsibilities: [
      'Design and implement new features',
      'Collaborate with cross-functional teams',
      'Mentor junior developers',
      'Participate in code reviews'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      '401(k) matching',
      'Flexible work hours'
    ],
    isRemote: true,
    employmentType: 'full-time'
  },
  {
    id: 'job-2',
    title: 'Marketing Manager',
    description: 'We are seeking a Marketing Manager to lead our marketing efforts...',
    department: 'Marketing',
    departmentId: 'dept-2',
    location: 'Miami Headquarters',
    locationId: 'loc-1',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: 'user-4', // Robin Taylor (Team Member)
    assignedToName: 'Robin Taylor',
    applicantsCount: 8,
    createdAt: '2023-06-10T00:00:00Z',
    updatedAt: '2023-06-18T00:00:00Z',
    deadline: '2023-07-25T00:00:00Z',
    salary: {
      min: 90000,
      max: 110000,
      currency: 'USD'
    },
    requirements: [
      '3+ years of experience in marketing',
      'Experience with digital marketing campaigns',
      'Strong analytical skills',
      'Bachelor\'s degree in Marketing or related field'
    ],
    responsibilities: [
      'Develop and implement marketing strategies',
      'Manage social media presence',
      'Analyze marketing metrics',
      'Coordinate with sales team'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      '401(k) matching',
      'Professional development opportunities'
    ],
    isRemote: false,
    employmentType: 'full-time'
  },
  {
    id: 'job-3',
    title: 'Financial Analyst',
    description: 'We are looking for a Financial Analyst to join our finance team...',
    department: 'Finance',
    departmentId: 'dept-4',
    location: 'New York Office',
    locationId: 'loc-2',
    status: 'published',
    priority: 'medium',
    assignedTo: null,
    assignedToName: null,
    applicantsCount: 5,
    createdAt: '2023-06-12T00:00:00Z',
    updatedAt: '2023-06-15T00:00:00Z',
    deadline: '2023-07-20T00:00:00Z',
    salary: {
      min: 80000,
      max: 100000,
      currency: 'USD'
    },
    requirements: [
      '2+ years of experience in finance',
      'Strong Excel skills',
      'Knowledge of financial modeling',
      'Bachelor\'s degree in Finance or related field'
    ],
    responsibilities: [
      'Prepare financial reports',
      'Analyze financial data',
      'Assist with budgeting',
      'Support financial planning'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      '401(k) matching',
      'Flexible work hours'
    ],
    isRemote: false,
    employmentType: 'full-time'
  },
  {
    id: 'job-4',
    title: 'Product Designer',
    description: 'We are seeking a Product Designer to create amazing user experiences...',
    department: 'Product Development',
    departmentId: 'dept-6',
    location: 'San Francisco Branch',
    locationId: 'loc-3',
    status: 'on-hold',
    priority: 'low',
    assignedTo: 'user-3', // Jamie Garcia (Scout)
    assignedToName: 'Jamie Garcia',
    applicantsCount: 10,
    createdAt: '2023-06-05T00:00:00Z',
    updatedAt: '2023-06-25T00:00:00Z',
    deadline: '2023-07-15T00:00:00Z',
    salary: {
      min: 100000,
      max: 130000,
      currency: 'USD'
    },
    requirements: [
      '3+ years of experience in product design',
      'Proficiency with design tools (Figma, Sketch)',
      'Understanding of UX principles',
      'Portfolio of previous work'
    ],
    responsibilities: [
      'Create user interfaces',
      'Conduct user research',
      'Collaborate with developers',
      'Iterate on designs based on feedback'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      '401(k) matching',
      'Remote work options'
    ],
    isRemote: true,
    employmentType: 'full-time'
  },
  {
    id: 'job-5',
    title: 'Sales Representative',
    description: 'We are looking for a Sales Representative to join our growing team...',
    department: 'Sales',
    departmentId: 'dept-5',
    location: 'New York Office',
    locationId: 'loc-2',
    status: 'filled',
    priority: 'high',
    assignedTo: 'user-4', // Robin Taylor (Team Member)
    assignedToName: 'Robin Taylor',
    applicantsCount: 15,
    createdAt: '2023-05-20T00:00:00Z',
    updatedAt: '2023-06-30T00:00:00Z',
    deadline: '2023-06-30T00:00:00Z',
    salary: {
      min: 70000,
      max: 90000,
      currency: 'USD'
    },
    requirements: [
      '2+ years of sales experience',
      'Strong communication skills',
      'Self-motivated and goal-oriented',
      'Bachelor\'s degree preferred'
    ],
    responsibilities: [
      'Generate new sales leads',
      'Meet or exceed sales targets',
      'Maintain customer relationships',
      'Provide product demonstrations'
    ],
    benefits: [
      'Competitive base salary + commission',
      'Health insurance',
      '401(k) matching',
      'Sales training and development'
    ],
    isRemote: false,
    employmentType: 'full-time'
  },
  {
    id: 'job-6',
    title: 'HR Coordinator',
    description: 'We are seeking an HR Coordinator to support our human resources team...',
    department: 'Human Resources',
    departmentId: 'dept-3',
    location: 'Miami Headquarters',
    locationId: 'loc-1',
    status: 'draft',
    priority: 'medium',
    assignedTo: null,
    assignedToName: null,
    applicantsCount: 0,
    createdAt: '2023-06-28T00:00:00Z',
    updatedAt: '2023-06-28T00:00:00Z',
    deadline: null,
    salary: {
      min: 55000,
      max: 65000,
      currency: 'USD'
    },
    requirements: [
      '1+ years of HR experience',
      'Knowledge of HR practices and procedures',
      'Strong organizational skills',
      'Bachelor\'s degree in Human Resources or related field'
    ],
    responsibilities: [
      'Assist with recruitment and onboarding',
      'Maintain employee records',
      'Support HR initiatives',
      'Answer employee questions'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      '401(k) matching',
      'Professional development opportunities'
    ],
    isRemote: false,
    employmentType: 'full-time'
  },
  {
    id: 'job-7',
    title: 'DevOps Engineer',
    description: 'We are looking for a DevOps Engineer to help us build and maintain our infrastructure...',
    department: 'IT Department',
    departmentId: 'dept-1',
    location: 'Miami Headquarters',
    locationId: 'loc-1',
    status: 'closed',
    priority: 'high',
    assignedTo: 'user-3', // Jamie Garcia (Scout)
    assignedToName: 'Jamie Garcia',
    applicantsCount: 7,
    createdAt: '2023-05-15T00:00:00Z',
    updatedAt: '2023-06-25T00:00:00Z',
    deadline: '2023-06-15T00:00:00Z',
    salary: {
      min: 110000,
      max: 140000,
      currency: 'USD'
    },
    requirements: [
      '3+ years of DevOps experience',
      'Experience with AWS or Azure',
      'Knowledge of CI/CD pipelines',
      'Familiarity with containerization'
    ],
    responsibilities: [
      'Maintain cloud infrastructure',
      'Implement CI/CD pipelines',
      'Automate deployment processes',
      'Monitor system performance'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      '401(k) matching',
      'Remote work options'
    ],
    isRemote: true,
    employmentType: 'full-time'
  }
];

// Mock data for job candidates
export const mockJobCandidates: JobCandidate[] = [
  {
    id: 'candidate-1',
    jobId: 'job-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '(555) 123-4567',
    resumeUrl: '/resumes/alex-johnson.pdf',
    status: 'interview',
    notes: 'Strong technical skills, good cultural fit',
    appliedAt: '2023-06-16T00:00:00Z',
    lastUpdated: '2023-06-22T00:00:00Z'
  },
  {
    id: 'candidate-2',
    jobId: 'job-1',
    name: 'Sam Smith',
    email: 'sam.smith@example.com',
    phone: '(555) 234-5678',
    resumeUrl: '/resumes/sam-smith.pdf',
    status: 'screening',
    notes: 'Good experience, needs technical assessment',
    appliedAt: '2023-06-17T00:00:00Z',
    lastUpdated: '2023-06-20T00:00:00Z'
  },
  {
    id: 'candidate-3',
    jobId: 'job-2',
    name: 'Jordan Lee',
    email: 'jordan.lee@example.com',
    phone: '(555) 345-6789',
    resumeUrl: '/resumes/jordan-lee.pdf',
    status: 'offer',
    notes: 'Excellent marketing experience, great communicator',
    appliedAt: '2023-06-12T00:00:00Z',
    lastUpdated: '2023-06-25T00:00:00Z'
  },
  {
    id: 'candidate-4',
    jobId: 'job-2',
    name: 'Taylor Chen',
    email: 'taylor.chen@example.com',
    phone: '(555) 456-7890',
    resumeUrl: '/resumes/taylor-chen.pdf',
    status: 'new',
    notes: 'Interesting background, needs initial screening',
    appliedAt: '2023-06-18T00:00:00Z',
    lastUpdated: '2023-06-18T00:00:00Z'
  },
  {
    id: 'candidate-5',
    jobId: 'job-4',
    name: 'Morgan Davis',
    email: 'morgan.davis@example.com',
    phone: '(555) 567-8901',
    resumeUrl: '/resumes/morgan-davis.pdf',
    status: 'rejected',
    notes: 'Not enough experience for senior role',
    appliedAt: '2023-06-10T00:00:00Z',
    lastUpdated: '2023-06-15T00:00:00Z'
  },
  {
    id: 'candidate-6',
    jobId: 'job-5',
    name: 'Casey Wilson',
    email: 'casey.wilson@example.com',
    phone: '(555) 678-9012',
    resumeUrl: '/resumes/casey-wilson.pdf',
    status: 'hired',
    notes: 'Excellent sales background, great cultural fit',
    appliedAt: '2023-05-25T00:00:00Z',
    lastUpdated: '2023-06-28T00:00:00Z'
  }
];

// Helper functions
export const getJobListingsByLocationId = (locationId: string): JobListing[] => {
  return mockJobListings.filter(job => job.locationId === locationId);
};

export const getJobListingsByAssignedUser = (userId: string): JobListing[] => {
  return mockJobListings.filter(job => job.assignedTo === userId);
};

export const getJobCandidatesByJobId = (jobId: string): JobCandidate[] => {
  return mockJobCandidates.filter(candidate => candidate.jobId === jobId);
};

export const getJobListingById = (jobId: string): JobListing | undefined => {
  return mockJobListings.find(job => job.id === jobId);
};

// Status color mapping for UI
export const getStatusColor = (status: JobStatus): string => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'published':
      return 'bg-blue-100 text-blue-800';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'on-hold':
      return 'bg-purple-100 text-purple-800';
    case 'filled':
      return 'bg-green-100 text-green-800';
    case 'closed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Priority color mapping for UI
export const getPriorityColor = (priority: JobPriority): string => {
  switch (priority) {
    case 'low':
      return 'bg-gray-100 text-gray-800';
    case 'medium':
      return 'bg-blue-100 text-blue-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'urgent':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
