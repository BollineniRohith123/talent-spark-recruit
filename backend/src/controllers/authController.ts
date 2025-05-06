import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { hashPassword, comparePasswords } from '../utils/passwordUtils';
import { generateToken, verifyToken } from '../utils/jwtUtils';
import { logger } from '../utils/logger';

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, role, departmentId, locationId, phone } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      res.status(409).json({ message: 'User with this email already exists' });
      return;
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'CANDIDATE',
        departmentId,
        locationId,
        phone,
        customPermissions: [],
        isActive: true
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        departmentId: true,
        locationId: true,
        phone: true,
        customPermissions: true,
        isActive: true,
        createdAt: true
      }
    });
    
    // Generate JWT token
    const token = generateToken({ 
      id: newUser.id, 
      email: newUser.email, 
      role: newUser.role,
      firstName: newUser.firstName,
      lastName: newUser.lastName
    });
    
    // Create notification settings
    await prisma.notificationSettings.create({
      data: {
        userId: newUser.id,
        emailNotifications: true,
        applicationUpdates: true,
        interviewReminders: true,
        jobAlerts: true,
        offerUpdates: true,
        systemAnnouncements: true
      }
    });
    
    logger.info(`New user registered: ${newUser.email}`);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      token
    });
  } catch (error) {
    logger.error(`Error in register: ${error}`);
    res.status(500).json({ message: 'An error occurred during registration' });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
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
            name: true
          }
        }
      }
    });
    
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    
    // Check if user is active
    if (!user.isActive) {
      res.status(403).json({ message: 'Account is inactive. Please contact an administrator.' });
      return;
    }
    
    // Compare passwords
    const isPasswordValid = await comparePasswords(password, user.password);
    
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    
    // Generate JWT token
    const token = generateToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    });
    
    logger.info(`User logged in: ${user.email}`);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    logger.error(`Error in login: ${error}`);
    res.status(500).json({ message: 'An error occurred during login' });
  }
};

// Get current user profile
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json({
      user: userWithoutPassword
    });
  } catch (error) {
    logger.error(`Error in getCurrentUser: ${error}`);
    res.status(500).json({ message: 'An error occurred while fetching user profile' });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token is required' });
      return;
    }
    
    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    
    if (!decoded || !decoded.id) {
      res.status(401).json({ message: 'Invalid or expired refresh token' });
      return;
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    
    if (!user || !user.isActive) {
      res.status(401).json({ message: 'User not found or inactive' });
      return;
    }
    
    // Generate new token
    const token = generateToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    });
    
    res.status(200).json({
      message: 'Token refreshed successfully',
      token
    });
  } catch (error) {
    logger.error(`Error in refreshToken: ${error}`);
    res.status(500).json({ message: 'An error occurred while refreshing token' });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Verify current password
    const isPasswordValid = await comparePasswords(currentPassword, user.password);
    
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }
    
    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
    
    logger.info(`Password changed for user: ${user.email}`);
    
    res.status(200).json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error(`Error in changePassword: ${error}`);
    res.status(500).json({ message: 'An error occurred while changing password' });
  }
};

// Request password reset
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      // Don't reveal that the user doesn't exist
      res.status(200).json({
        message: 'If an account with that email exists, a password reset link has been sent'
      });
      return;
    }
    
    // Generate reset token (expires in 1 hour)
    const resetToken = generateToken({ id: user.id, email: user.email }, '1h');
    
    // In a real application, send an email with the reset link
    // For now, just log it
    logger.info(`Password reset token for ${email}: ${resetToken}`);
    
    res.status(200).json({
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  } catch (error) {
    logger.error(`Error in requestPasswordReset: ${error}`);
    res.status(500).json({ message: 'An error occurred while requesting password reset' });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.id) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
    
    logger.info(`Password reset for user: ${user.email}`);
    
    res.status(200).json({
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    logger.error(`Error in resetPassword: ${error}`);
    res.status(500).json({ message: 'An error occurred while resetting password' });
  }
};

// Logout
export const logout = (req: Request, res: Response): void => {
  // In a real application with refresh tokens, you would invalidate the token
  // For JWT, client-side cleanup is usually sufficient
  res.status(200).json({
    message: 'Logout successful'
  });
};