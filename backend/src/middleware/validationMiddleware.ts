import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { logger } from '../utils/logger';

// Helper function to validate request data
const validateRequest = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      logger.warn(`Validation error: ${errorMessages.join(', ')}`);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errorMessages 
      });
    }
    
    // Update req.body with validated data
    req.body = value;
    next();
  };
};

// User validation
export const validateUserData = validateRequest(Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8)
    .when('id', { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required() }),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  role: Joi.string().valid('superadmin', 'admin', 'manager', 'recruiter', 'interviewer', 'candidate').required(),
  departmentId: Joi.number().allow(null),
  locationId: Joi.number().allow(null),
  phone: Joi.string().allow('', null),
  customPermissions: Joi.array().items(Joi.string()).allow(null),
  isActive: Joi.boolean().default(true)
}));

// Login validation
export const validateLoginData = validateRequest(Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
}));

// Job validation
export const validateJobData = validateRequest(Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  requirements: Joi.string().required(),
  responsibilities: Joi.string().required(),
  departmentId: Joi.number().required(),
  locationId: Joi.number().required(),
  salaryRangeMin: Joi.number().min(0).required(),
  salaryRangeMax: Joi.number().min(Joi.ref('salaryRangeMin')).required(),
  jobType: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP').required(),
  experienceLevel: Joi.string().valid('ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'EXECUTIVE').required(),
  status: Joi.string().valid('DRAFT', 'OPEN', 'CLOSED', 'ON_HOLD').default('DRAFT'),
  publishedAt: Joi.date().allow(null),
  deadlineAt: Joi.date().allow(null),
  hiringManagerId: Joi.number().required(),
  isRemote: Joi.boolean().default(false),
  skills: Joi.array().items(Joi.string()).min(1).required(),
  benefits: Joi.array().items(Joi.string()),
  numberOfOpenings: Joi.number().integer().min(1).default(1)
}));

// Application validation
export const validateApplicationData = validateRequest(Joi.object({
  jobId: Joi.number().required(),
  candidateId: Joi.number(),  // Optional as it could be set by the system for logged-in users
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow('', null),
  coverLetter: Joi.string().allow('', null),
  resumeUrl: Joi.string().allow(null),  // Will be populated by upload middleware
  status: Joi.string().valid(
    'APPLIED', 'SCREENING', 'INTERVIEW', 'ASSESSMENT', 
    'OFFER', 'HIRED', 'REJECTED', 'WITHDRAWN'
  ).default('APPLIED'),
  source: Joi.string().valid(
    'WEBSITE', 'REFERRAL', 'LINKEDIN', 'INDEED', 'GLASSDOOR', 'OTHER'
  ).default('WEBSITE'),
  referralName: Joi.string().allow('', null),
  expectedSalary: Joi.number().allow(null),
  availableStartDate: Joi.date().allow(null),
  education: Joi.array().items(Joi.object({
    institution: Joi.string().required(),
    degree: Joi.string().required(),
    fieldOfStudy: Joi.string().required(),
    from: Joi.date().required(),
    to: Joi.date().allow(null),
    current: Joi.boolean().default(false)
  })),
  experience: Joi.array().items(Joi.object({
    company: Joi.string().required(),
    position: Joi.string().required(),
    description: Joi.string().allow('', null),
    from: Joi.date().required(),
    to: Joi.date().allow(null),
    current: Joi.boolean().default(false)
  })),
  skills: Joi.array().items(Joi.string()),
  portfolioUrl: Joi.string().uri().allow('', null),
  linkedinUrl: Joi.string().uri().allow('', null),
  githubUrl: Joi.string().uri().allow('', null)
}));

// Interview validation
export const validateInterviewData = validateRequest(Joi.object({
  applicationId: Joi.number().required(),
  interviewerId: Joi.number().required(),
  scheduledAt: Joi.date().required(),
  duration: Joi.number().integer().min(15).default(60), // Duration in minutes
  type: Joi.string().valid('PHONE', 'VIDEO', 'IN_PERSON', 'TECHNICAL', 'BEHAVIORAL').required(),
  status: Joi.string().valid('SCHEDULED', 'COMPLETED', 'CANCELED', 'RESCHEDULED').default('SCHEDULED'),
  notes: Joi.string().allow('', null),
  location: Joi.string().allow('', null),
  meetingLink: Joi.string().uri().allow('', null),
  questions: Joi.array().items(Joi.string()).allow(null)
}));

// Feedback validation
export const validateFeedbackData = validateRequest(Joi.object({
  interviewId: Joi.number().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  strengths: Joi.string().required(),
  weaknesses: Joi.string().required(),
  notes: Joi.string().required(),
  recommendation: Joi.string().valid('HIRE', 'REJECT', 'CONSIDER').required(),
  skillAssessments: Joi.array().items(Joi.object({
    skill: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    notes: Joi.string().allow('', null)
  })).min(1)
}));

// Offer validation
export const validateOfferData = validateRequest(Joi.object({
  applicationId: Joi.number().required(),
  salary: Joi.number().min(0).required(),
  bonus: Joi.number().min(0).default(0),
  stockOptions: Joi.number().min(0).default(0),
  benefits: Joi.array().items(Joi.string()),
  startDate: Joi.date().required(),
  expiryDate: Joi.date().greater(Joi.ref('startDate')).required(),
  jobTitle: Joi.string().required(),
  status: Joi.string().valid(
    'DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 
    'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED'
  ).default('DRAFT'),
  notes: Joi.string().allow('', null),
  approvalWorkflow: Joi.array().items(Joi.object({
    approverId: Joi.number().required(),
    status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED').default('PENDING'),
    notes: Joi.string().allow('', null)
  })).min(1)
}));

// Department validation
export const validateDepartmentData = validateRequest(Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('', null),
  managerId: Joi.number().allow(null),
  parentDepartmentId: Joi.number().allow(null),
  budgetCode: Joi.string().allow('', null),
  isActive: Joi.boolean().default(true)
}));

// Location validation
export const validateLocationData = validateRequest(Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  postalCode: Joi.string().required(),
  phone: Joi.string().allow('', null),
  isHeadquarters: Joi.boolean().default(false),
  isActive: Joi.boolean().default(true),
  timezone: Joi.string().required()
}));

// Budget validation
export const validateBudgetData = validateRequest(Joi.object({
  fiscalYear: Joi.number().integer().required(),
  departmentId: Joi.number().required(),
  totalAmount: Joi.number().min(0).required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required(),
  description: Joi.string().allow('', null),
  status: Joi.string().valid('DRAFT', 'ACTIVE', 'CLOSED').default('DRAFT'),
  createdById: Joi.number().required(),
  categories: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    description: Joi.string().allow('', null)
  })).min(1)
}));

// Budget allocation validation
export const validateBudgetAllocationData = validateRequest(Joi.object({
  budgetId: Joi.number().required(),
  categoryId: Joi.number().required(),
  amount: Joi.number().min(0).required(),
  description: Joi.string().required(),
  jobId: Joi.number().allow(null),
  departmentId: Joi.number().allow(null),
  locationId: Joi.number().allow(null),
  requestedById: Joi.number().required(),
  approvedById: Joi.number().allow(null),
  status: Joi.string().valid('REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED').default('REQUESTED')
}));

// Notification settings validation
export const validateNotificationSettingsData = validateRequest(Joi.object({
  userId: Joi.number().required(),
  emailNotifications: Joi.boolean().default(true),
  applicationUpdates: Joi.boolean().default(true),
  interviewReminders: Joi.boolean().default(true),
  jobAlerts: Joi.boolean().default(true),
  offerUpdates: Joi.boolean().default(true),
  systemAnnouncements: Joi.boolean().default(true)
}));