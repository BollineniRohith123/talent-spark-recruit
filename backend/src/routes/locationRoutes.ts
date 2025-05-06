import express from 'express';
import { 
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation
} from '../controllers/locationController';
import { authenticate } from '../middleware/authMiddleware';
import { checkPermission } from '../middleware/rbacMiddleware';
import { validateLocationData } from '../middleware/validationMiddleware';

const router = express.Router();

// All routes are protected
router.post('/', authenticate, checkPermission('locations.create'), validateLocationData, createLocation);
router.get('/', authenticate, checkPermission('locations.view'), getLocations);
router.get('/:id', authenticate, checkPermission('locations.view'), getLocationById);
router.put('/:id', authenticate, checkPermission('locations.edit'), validateLocationData, updateLocation);
router.delete('/:id', authenticate, checkPermission('locations.delete'), deleteLocation);

export default router;