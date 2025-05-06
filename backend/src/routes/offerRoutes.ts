import express from 'express';
import { 
  createOffer,
  getOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
  approveOffer,
  rejectOffer,
  acceptOffer,
  declineOffer,
  getOffersByApplication,
  getOfferStats
} from '../controllers/offerController';
import { authenticate } from '../middleware/authMiddleware';
import { checkPermission } from '../middleware/rbacMiddleware';
import { validateOfferData } from '../middleware/validationMiddleware';

const router = express.Router();

// All routes are protected
router.post('/', authenticate, checkPermission('offers.create'), validateOfferData, createOffer);
router.get('/', authenticate, checkPermission('offers.view'), getOffers);
router.get('/stats', authenticate, checkPermission('offers.view'), getOfferStats);
router.get('/application/:applicationId', authenticate, checkPermission('offers.view'), getOffersByApplication);
router.get('/:id', authenticate, checkPermission('offers.view'), getOfferById);
router.put('/:id', authenticate, checkPermission('offers.create'), validateOfferData, updateOffer);
router.delete('/:id', authenticate, checkPermission('offers.create'), deleteOffer);
router.post('/:id/approve', authenticate, checkPermission('offers.approve'), approveOffer);
router.post('/:id/reject', authenticate, checkPermission('offers.reject'), rejectOffer);
router.post('/:id/accept', authenticate, acceptOffer); // Candidates can accept their own offers
router.post('/:id/decline', authenticate, declineOffer); // Candidates can decline their own offers

export default router;