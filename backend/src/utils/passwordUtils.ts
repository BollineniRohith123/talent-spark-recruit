import bcrypt from 'bcryptjs';
import { logger } from './logger';

// Salt rounds for bcrypt
const SALT_ROUNDS = 12;

// Hash password using bcrypt
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    logger.error(`Error hashing password: ${error}`);
    throw new Error('Error hashing password');
  }
};

// Compare password with hashed password
export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error(`Error comparing passwords: ${error}`);
    return false;
  }
};

// Generate random password
export const generateRandomPassword = (length: number = 12): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars.charAt(randomIndex);
  }
  
  return password;
};

// Validate password strength
export const validatePasswordStrength = (password: string): boolean => {
  // Password must be at least 8 characters long
  if (password.length < 8) {
    return false;
  }
  
  // Password must contain at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  
  // Password must contain at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }
  
  // Password must contain at least one digit
  if (!/[0-9]/.test(password)) {
    return false;
  }
  
  // Password must contain at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return false;
  }
  
  return true;
};