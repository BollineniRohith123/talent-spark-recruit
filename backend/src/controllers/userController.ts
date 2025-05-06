import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { hashPassword, generateRandomPassword } from '../utils/passwordUtils';

// Get all users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      role, 
      departmentId, 
      locationId, 
      isActive, 
      search,
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter object based on query parameters
    const filter: any = {};
    
    if (role) {
      filter.role = role;
    }
    
    if (departmentId) {
      filter.departmentId = Number(departmentId);
    }
    
    if (locationId) {
      filter.locationId = Number(locationId);
    }
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
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
    
    // Get total count of users matching the filter
    const totalUsers = await prisma.user.count({ where: filter });
    
    // Get users with pagination
    const users = await prisma.user.findMany({
      where: filter,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        avatarUrl: true,
        customPermissions: true,
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
      },
      orderBy,
      skip,
      take: Number(limit)
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / Number(limit));
    
    res.status(200).json({
      users,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    logger.error(`Error getting users: ${error}`);
    res.status(500).json({
      message: 'An error occurred while fetching users',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        avatarUrl: true,
        customPermissions: true,
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
        notificationSettings: true
      }
    });
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.status(200).json({ user });
  } catch (error) {
    logger.error(`Error getting user by ID: ${error}`);
    res.status(500).json({
      message: 'An error occurred while fetching the user',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Create user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      departmentId,
      locationId,
      phone,
      customPermissions,
      isActive = true,
      sendInvite = true
    } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      res.status(409).json({ message: 'User with this email already exists' });
      return;
    }
    
    // Generate a random password if not provided and sending invite
    const userPassword = password || (sendInvite ? generateRandomPassword() : undefined);
    
    if (!userPassword) {
      res.status(400).json({ message: 'Password is required when not sending an invite' });
      return;
    }
    
    // Hash password
    const hashedPassword = await hashPassword(userPassword);
    
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'CANDIDATE',
        departmentId: departmentId ? Number(departmentId) : undefined,
        locationId: locationId ? Number(locationId) : undefined,
        phone,
        customPermissions: customPermissions || [],
        isActive
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
        customPermissions: true,
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
    });
    
    // Create notification settings
    await prisma.notificationSettings.create({
      data: { userId: newUser.id }
    });
    
    logger.info(`New user created: ${newUser.email}`);
    
    // In a real application, send an invite email with the generated password
    if (sendInvite && !password) {
      logger.info(`Invite with temporary password sent to ${email}: ${userPassword}`);
    }
    
    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
      ...(sendInvite && !password ? { tempPassword: userPassword } : {})
    });
  } catch (error) {
    logger.error(`Error creating user: ${error}`);
    res.status(500).json({
      message: 'An error occurred while creating the user',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      email,
      firstName,
      lastName,
      role,
      departmentId,
      locationId,
      phone,
      customPermissions,
      isActive
    } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) }
    });
    
    if (!existingUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Check if email is being changed and if it conflicts with another user
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });
      
      if (emailExists) {
        res.status(409).json({ message: 'Email already in use by another user' });
        return;
      }
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        email,
        firstName,
        lastName,
        role,
        departmentId: departmentId ? Number(departmentId) : null,
        locationId: locationId ? Number(locationId) : null,
        phone,
        customPermissions,
        isActive
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        avatarUrl: true,
        customPermissions: true,
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
    });
    
    logger.info(`User updated: ${updatedUser.email}`);
    
    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    logger.error(`Error updating user: ${error}`);
    res.status(500).json({
      message: 'An error occurred while updating the user',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: Number(id) }
    });
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Check if user has dependencies that would prevent deletion
    const userDependencies = await checkUserDependencies(Number(id));
    
    if (userDependencies.hasDependencies) {
      // Instead of deleting, deactivate the user
      await prisma.user.update({
        where: { id: Number(id) },
        data: { isActive: false }
      });
      
      logger.info(`User deactivated instead of deleted due to dependencies: ${user.email}`);
      
      res.status(200).json({
        message: 'User has dependencies and cannot be permanently deleted. Account has been deactivated instead.',
        dependencies: userDependencies.dependencies
      });
      return;
    }
    
    // Delete user's notification settings
    await prisma.notificationSettings.deleteMany({
      where: { userId: Number(id) }
    });
    
    // Delete user's notifications
    await prisma.notification.deleteMany({
      where: { recipientId: Number(id) }
    });
    
    // Delete the user
    await prisma.user.delete({
      where: { id: Number(id) }
    });
    
    logger.info(`User deleted: ${user.email}`);
    
    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting user: ${error}`);
    res.status(500).json({
      message: 'An error occurred while deleting the user',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Update user profile (for current user)
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const userId = req.user.id;
    const { firstName, lastName, phone } = req.body;
    
    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        avatarUrl: true,
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
    });
    
    logger.info(`User profile updated: ${updatedUser.email}`);
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    logger.error(`Error updating profile: ${error}`);
    res.status(500).json({
      message: 'An error occurred while updating the profile',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Reset user password (admin function)
export const resetUserPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { sendEmail = true } = req.body;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: Number(id) }
    });
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Generate new random password
    const newPassword = generateRandomPassword();
    
    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update user with new password
    await prisma.user.update({
      where: { id: Number(id) },
      data: { password: hashedPassword }
    });
    
    logger.info(`Password reset for user: ${user.email}`);
    
    // In a real application, send an email with the new password
    if (sendEmail) {
      logger.info(`Password reset email sent to ${user.email}: ${newPassword}`);
    }
    
    res.status(200).json({
      message: 'Password reset successfully',
      temporaryPassword: newPassword
    });
  } catch (error) {
    logger.error(`Error resetting password: ${error}`);
    res.status(500).json({
      message: 'An error occurred while resetting the password',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Get user statistics
export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get count of users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true
    });
    
    // Get count of users by department
    const usersByDepartment = await prisma.user.groupBy({
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
    const departmentStats = usersByDepartment
      .filter(stat => stat.departmentId !== null)
      .map(stat => ({
        departmentId: stat.departmentId,
        departmentName: departmentMap[stat.departmentId as number] || 'Unknown',
        count: stat._count
      }));
    
    // Get count of users by location
    const usersByLocation = await prisma.user.groupBy({
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
    const locationStats = usersByLocation
      .filter(stat => stat.locationId !== null)
      .map(stat => ({
        locationId: stat.locationId,
        locationName: locationMap[stat.locationId as number] || 'Unknown',
        count: stat._count
      }));
    
    // Get count of active vs. inactive users
    const activeUsers = await prisma.user.count({
      where: { isActive: true }
    });
    
    const inactiveUsers = await prisma.user.count({
      where: { isActive: false }
    });
    
    // Get total users
    const totalUsers = await prisma.user.count();
    
    // Get new users in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });
    
    res.status(200).json({
      usersByRole,
      departmentStats,
      locationStats,
      activityStatus: {
        active: activeUsers,
        inactive: inactiveUsers
      },
      totalUsers,
      newUsers
    });
  } catch (error) {
    logger.error(`Error getting user statistics: ${error}`);
    res.status(500).json({
      message: 'An error occurred while fetching user statistics',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Update notification settings
export const updateNotificationSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const userId = req.user.id;
    const {
      emailNotifications,
      applicationUpdates,
      interviewReminders,
      jobAlerts,
      offerUpdates,
      systemAnnouncements
    } = req.body;
    
    // Check if settings exist
    const existingSettings = await prisma.notificationSettings.findUnique({
      where: { userId }
    });
    
    let settings;
    
    if (existingSettings) {
      // Update existing settings
      settings = await prisma.notificationSettings.update({
        where: { userId },
        data: {
          emailNotifications,
          applicationUpdates,
          interviewReminders,
          jobAlerts,
          offerUpdates,
          systemAnnouncements
        }
      });
    } else {
      // Create new settings
      settings = await prisma.notificationSettings.create({
        data: {
          userId,
          emailNotifications,
          applicationUpdates,
          interviewReminders,
          jobAlerts,
          offerUpdates,
          systemAnnouncements
        }
      });
    }
    
    logger.info(`Notification settings updated for user ID: ${userId}`);
    
    res.status(200).json({
      message: 'Notification settings updated successfully',
      settings
    });
  } catch (error) {
    logger.error(`Error updating notification settings: ${error}`);
    res.status(500).json({
      message: 'An error occurred while updating notification settings',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Helper function to check if a user has dependencies that would prevent deletion
async function checkUserDependencies(userId: number) {
  const dependencies: Record<string, number> = {};
  let hasDependencies = false;
  
  // Check if user is a department manager
  const managedDepartments = await prisma.department.count({
    where: { managerId: userId }
  });
  
  if (managedDepartments > 0) {
    dependencies.managedDepartments = managedDepartments;
    hasDependencies = true;
  }
  
  // Check if user is a hiring manager for any jobs
  const managedJobs = await prisma.job.count({
    where: { hiringManagerId: userId }
  });
  
  if (managedJobs > 0) {
    dependencies.managedJobs = managedJobs;
    hasDependencies = true;
  }
  
  // Check if user has interviews scheduled
  const interviews = await prisma.interview.count({
    where: { interviewerId: userId }
  });
  
  if (interviews > 0) {
    dependencies.interviews = interviews;
    hasDependencies = true;
  }
  
  // Check if user has provided interview feedback
  const feedbacks = await prisma.interviewFeedback.count({
    where: { interviewerId: userId }
  });
  
  if (feedbacks > 0) {
    dependencies.feedbacks = feedbacks;
    hasDependencies = true;
  }
  
  // Check if user has created budgets
  const createdBudgets = await prisma.budget.count({
    where: { createdById: userId }
  });
  
  if (createdBudgets > 0) {
    dependencies.createdBudgets = createdBudgets;
    hasDependencies = true;
  }
  
  // Check if user has requested budget allocations
  const requestedAllocations = await prisma.budgetAllocation.count({
    where: { requestedById: userId }
  });
  
  if (requestedAllocations > 0) {
    dependencies.requestedAllocations = requestedAllocations;
    hasDependencies = true;
  }
  
  // Check if user has approved budget allocations
  const approvedAllocations = await prisma.budgetAllocation.count({
    where: { approvedById: userId }
  });
  
  if (approvedAllocations > 0) {
    dependencies.approvedAllocations = approvedAllocations;
    hasDependencies = true;
  }
  
  return { hasDependencies, dependencies };
}