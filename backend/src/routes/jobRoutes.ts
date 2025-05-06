import express from 'express';
import { 
  createJob, 
  getJobs, 
  getJobById, 
  updateJob, 
  deleteJob, 
  getJobsByDepartment,
  getJobsByLocation,
  getJobsStats
} from '../controllers/jobController';
import { authenticate } from '../middleware/authMiddleware';
import { checkPermission } from '../middleware/rbacMiddleware';
import { validateJobData } from '../middleware/validationMiddleware';

const router = express.Router();

// Public routes
router.get('/public', getJobs); // Get all active public jobs
router.get('/public/:id', getJobById); // Get a specific public job

// Protected routes
router.post('/', authenticate, checkPermission('jobs.create'), validateJobData, createJob);
router.get('/', authenticate, checkPermission('jobs.view'), getJobs);
router.get('/stats', authenticate, checkPermission('jobs.view'), getJobsStats);
router.get('/department/:departmentId', authenticate, checkPermission('jobs.view'), getJobsByDepartment);
router.get('/location/:locationId', authenticate, checkPermission('jobs.view'), getJobsByLocation);
router.get('/:id', authenticate, checkPermission('jobs.view'), getJobById);
router.put('/:id', authenticate, checkPermission('jobs.edit'), validateJobData, updateJob);
router.delete('/:id', authenticate, checkPermission('jobs.delete'), deleteJob);

export default router;