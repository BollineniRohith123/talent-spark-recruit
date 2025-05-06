import express from 'express';
import { 
  scheduleInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
  getInterviewsByApplication,
  getInterviewsByInterviewer,
  submitFeedback,
  getInterviewStats
} from '../controllers/interviewController';
import { authenticate } from '../middleware/authMiddleware';
import { checkPermission, checkSelfOrPermission } from '../middleware/rbacMiddleware';
import { validateInterviewData, validateFeedbackData } from '../middleware/validationMiddleware';

const router = express.Router();

// All routes are protected
router.post('/', authenticate, checkPermission('interviews.schedule'), validateInterviewData, scheduleInterview);
router.get('/', authenticate, checkPermission('interviews.view'), getInterviews);
router.get('/stats', authenticate, checkPermission('interviews.view'), getInterviewStats);
router.get('/application/:applicationId', authenticate, checkPermission('interviews.view'), getInterviewsByApplication);
router.get('/interviewer/:interviewerId', authenticate, checkSelfOrPermission('interviews.view'), getInterviewsByInterviewer);
router.get('/:id', authenticate, checkPermission('interviews.view'), getInterviewById);
router.put('/:id', authenticate, checkPermission('interviews.schedule'), validateInterviewData, updateInterview);
router.delete('/:id', authenticate, checkPermission('interviews.schedule'), deleteInterview);
router.post('/:id/feedback', authenticate, checkPermission('interviews.feedback'), validateFeedbackData, submitFeedback);

export default router;