import express from 'express';
import { 
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} from '../controllers/departmentController';
import { authenticate } from '../middleware/authMiddleware';
import { checkPermission } from '../middleware/rbacMiddleware';
import { validateDepartmentData } from '../middleware/validationMiddleware';

const router = express.Router();

// All routes are protected
router.post('/', authenticate, checkPermission('departments.create'), validateDepartmentData, createDepartment);
router.get('/', authenticate, checkPermission('departments.view'), getDepartments);
router.get('/:id', authenticate, checkPermission('departments.view'), getDepartmentById);
router.put('/:id', authenticate, checkPermission('departments.edit'), validateDepartmentData, updateDepartment);
router.delete('/:id', authenticate, checkPermission('departments.delete'), deleteDepartment);

export default router;