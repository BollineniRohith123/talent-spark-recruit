import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { Prisma } from '@prisma/client';

// Custom error class for API errors
export class ApiError extends Error {
  statusCode: number;
  errors?: any[];
  
  constructor(statusCode: number, message: string, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    
    // Set the prototype explicitly
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Central error handler middleware
export const errorHandler = (
  err: Error | ApiError | Prisma.PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logger.error(`Error: ${err.message}`);
  logger.error(`Stack: ${err.stack}`);
  
  // Handle ApiError instances
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors
    });
    return;
  }
  
  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const code = err.code;
    
    if (code === 'P2002') {
      // Unique constraint violation
      res.status(409).json({
        message: 'A record with this data already exists',
        details: err.meta
      });
      return;
    }
    
    if (code === 'P2025') {
      // Record not found
      res.status(404).json({
        message: 'Record not found',
        details: err.meta
      });
      return;
    }
    
    if (code === 'P2003') {
      // Foreign key constraint failed
      res.status(400).json({
        message: 'Invalid reference to a related record',
        details: err.meta
      });
      return;
    }
    
    // Handle other Prisma errors
    res.status(400).json({
      message: 'Database operation failed',
      code,
      details: err.meta
    });
    return;
  }
  
  // Handle SyntaxError (typically for JSON parsing)
  if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
    res.status(400).json({
      message: 'Invalid JSON',
      details: err.message
    });
    return;
  }
  
  // Handle other errors
  res.status(500).json({
    message: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Function to wrap async route handlers with error handling
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};