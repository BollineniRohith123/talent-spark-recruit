import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

// Extend the Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
        firstName: string;
        lastName: string;
        customPermissions?: string[];
      };
    }
  }
}

// Middleware to authenticate JWT token
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Access denied. No token provided.' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.id) {
      res.status(401).json({ message: 'Invalid token.' });
      return;
    }
    
    // Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        isActive: true,
        customPermissions: true
      }
    });
    
    if (!user) {
      res.status(401).json({ message: 'User not found.' });
      return;
    }
    
    if (!user.isActive) {
      res.status(403).json({ message: 'Account is inactive. Please contact an administrator.' });
      return;
    }
    
    // Set user in request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      customPermissions: user.customPermissions
    };
    
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error}`);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Optional authentication - doesn't require token but will use it if provided
export const optionalAuthenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    // If no token, continue without setting user
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.id) {
      return next(); // Invalid token, but continue without auth
    }
    
    // Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        isActive: true,
        customPermissions: true
      }
    });
    
    if (user && user.isActive) {
      // Set user in request object
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        customPermissions: user.customPermissions
      };
    }
    
    next();
  } catch (error) {
    // Continue without authentication on error
    next();
  }
};