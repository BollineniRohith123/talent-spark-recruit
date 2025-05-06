import jwt from 'jsonwebtoken';
import { logger } from './logger';

// Set JWT secret key from environment variable
const SECRET_KEY = process.env.JWT_SECRET || 'your-default-secret-key-for-development';

// Token expiration times
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '24h';

// Generate JWT token
export const generateToken = (
  payload: {
    id: number;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  },
  expiresIn: string = ACCESS_TOKEN_EXPIRY
): string => {
  try {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
  } catch (error) {
    logger.error(`Error generating JWT token: ${error}`);
    throw new Error('Error generating token');
  }
};

// Verify JWT token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    logger.error(`Error verifying JWT token: ${error}`);
    return null;
  }
};

// Decode JWT token without verification
export const decodeToken = (token: string): any => {
  try {
    return jwt.decode(token);
  } catch (error) {
    logger.error(`Error decoding JWT token: ${error}`);
    return null;
  }
};