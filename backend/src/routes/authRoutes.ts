import express from 'express';
import { 
  register, 
  login, 
  getCurrentUser, 
  refreshToken, 
  changePassword,
  requestPasswordReset,
  resetPassword,
  logout
} from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import { validateLoginData } from '../middleware/validationMiddleware';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', validateLoginData, login);
router.post('/refresh-token', refreshToken);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.post('/change-password', authenticate, changePassword);
router.post('/logout', authenticate, logout);

export default router;