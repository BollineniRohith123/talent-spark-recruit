import express from 'express';
import { 
  applyForJob,
  getApplicationById,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
  getApplicationsByJob,
  getApplicationsByCandidate,
  getApplicationStats
} from '../controllers/applicationController';
import { authenticate } from '../middleware/authMiddleware';
import { checkPermission, checkSelfOrPermission } from '../middleware/rbacMiddleware';
import { validateApplicationData } from '../middleware/validationMiddleware';
import { uploadResume } from '../middleware/uploadMiddleware';

const router = express.Router();

// Public routes for candidates
router.post('/apply', uploadResume, validateApplicationData, applyForJob);

// Protected routes
router.get('/', authenticate, checkPermission('applications.view'), getApplications);
router.get('/stats', authenticate, checkPermission('applications.view'), getApplicationStats);
router.get('/job/:jobId', authenticate, checkPermission('applications.view'), getApplicationsByJob);
router.get('/candidate/:candidateId', authenticate, checkSelfOrPermission('applications.view'), getApplicationsByCandidate);
router.get('/:id', authenticate, checkPermission('applications.view'), getApplicationById);
router.put('/:id/status', authenticate, checkPermission('applications.process'), updateApplicationStatus);
router.delete('/:id', authenticate, checkPermission('applications.delete'), deleteApplication);

export default router;