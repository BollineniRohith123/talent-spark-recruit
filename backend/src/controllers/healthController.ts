import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'ok',
      message: 'API is running',
      timestamp: new Date(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      timestamp: new Date(),
      environment: process.env.NODE_ENV || 'development'
    });
  }
};