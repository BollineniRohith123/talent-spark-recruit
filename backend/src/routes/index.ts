import express from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import jobRoutes from './jobRoutes';
import applicationRoutes from './applicationRoutes';
import interviewRoutes from './interviewRoutes';
import locationRoutes from './locationRoutes';
import departmentRoutes from './departmentRoutes';
import offerRoutes from './offerRoutes';
import budgetRoutes from './budgetRoutes';
import { healthCheck } from '../controllers/healthController';

const router = express.Router();

// Health check route
router.get('/health', healthCheck);

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/interviews', interviewRoutes);
router.use('/locations', locationRoutes);
router.use('/departments', departmentRoutes);
router.use('/offers', offerRoutes);
router.use('/budgets', budgetRoutes);

export default router;