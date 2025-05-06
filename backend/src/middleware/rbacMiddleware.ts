import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Define permission types
export type Permission = 
  // User management
  | 'users.view' | 'users.create' | 'users.edit' | 'users.delete'
  // Job management
  | 'jobs.view' | 'jobs.create' | 'jobs.edit' | 'jobs.delete' 
  // Department management
  | 'departments.view' | 'departments.create' | 'departments.edit' | 'departments.delete'
  // Location management
  | 'locations.view' | 'locations.create' | 'locations.edit' | 'locations.delete'
  // Application management
  | 'applications.view' | 'applications.process' | 'applications.delete'
  // Interview management
  | 'interviews.view' | 'interviews.schedule' | 'interviews.feedback'
  // Offer management
  | 'offers.view' | 'offers.create' | 'offers.approve' | 'offers.reject'
  // Budget management
  | 'budget.view' | 'budget.manage'
  // Reports and analytics
  | 'reports.view' | 'analytics.view'
  // System settings
  | 'settings.view' | 'settings.edit';

// Define roles and their permissions
const rolePermissions: Record<string, Permission[]> = {
  'superadmin': [
    'users.view', 'users.create', 'users.edit', 'users.delete',
    'jobs.view', 'jobs.create', 'jobs.edit', 'jobs.delete',
    'departments.view', 'departments.create', 'departments.edit', 'departments.delete',
    'locations.view', 'locations.create', 'locations.edit', 'locations.delete',
    'applications.view', 'applications.process', 'applications.delete',
    'interviews.view', 'interviews.schedule', 'interviews.feedback',
    'offers.view', 'offers.create', 'offers.approve', 'offers.reject',
    'budget.view', 'budget.manage',
    'reports.view', 'analytics.view',
    'settings.view', 'settings.edit'
  ],
  'admin': [
    'users.view', 'users.create', 'users.edit',
    'jobs.view', 'jobs.create', 'jobs.edit', 'jobs.delete',
    'departments.view', 'departments.create', 'departments.edit',
    'locations.view', 'locations.create', 'locations.edit',
    'applications.view', 'applications.process',
    'interviews.view', 'interviews.schedule', 'interviews.feedback',
    'offers.view', 'offers.create', 'offers.approve',
    'budget.view',
    'reports.view', 'analytics.view',
    'settings.view'
  ],
  'manager': [
    'users.view',
    'jobs.view', 'jobs.create', 'jobs.edit',
    'departments.view',
    'locations.view',
    'applications.view', 'applications.process',
    'interviews.view', 'interviews.schedule', 'interviews.feedback',
    'offers.view', 'offers.create',
    'budget.view',
    'reports.view'
  ],
  'recruiter': [
    'jobs.view',
    'applications.view', 'applications.process',
    'interviews.view', 'interviews.schedule', 'interviews.feedback',
    'offers.view', 'offers.create',
    'reports.view'
  ],
  'interviewer': [
    'jobs.view',
    'applications.view',
    'interviews.view', 'interviews.feedback'
  ],
  'candidate': [
    // Candidates can only view public information and manage their own applications
  ]
};

// Middleware to check if user has permission
export const checkPermission = (requiredPermission: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Super admins have all permissions
    if (user.role === 'superadmin') {
      return next();
    }
    
    // Get permissions for user's role
    const permissions = rolePermissions[user.role];
    
    if (!permissions) {
      logger.error(`No permissions defined for role: ${user.role}`);
      return res.status(403).json({ message: 'Forbidden: Role has no permissions' });
    }
    
    // Check if user has the required permission
    if (permissions.includes(requiredPermission)) {
      return next();
    }
    
    // Check for custom permissions assigned directly to user
    if (user.customPermissions && user.customPermissions.includes(requiredPermission)) {
      return next();
    }
    
    logger.warn(`Access denied for user ${user.id}: missing permission ${requiredPermission}`);
    return res.status(403).json({ 
      message: 'Forbidden: You do not have permission to perform this action' 
    });
  };
};

// Middleware to check if user is accessing their own resource
export const checkSelfOrPermission = (requiredPermission: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const resourceUserId = req.params.userId || req.body.userId;
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Check if user is accessing their own resource
    if (resourceUserId && user.id.toString() === resourceUserId.toString()) {
      return next();
    }
    
    // Otherwise, check for the required permission
    return checkPermission(requiredPermission)(req, res, next);
  };
};