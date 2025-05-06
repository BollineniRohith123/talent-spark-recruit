import express from 'express';
import { 
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  getBudgetsByDepartment,
  getBudgetUtilization,
  allocateBudget
} from '../controllers/budgetController';
import { authenticate } from '../middleware/authMiddleware';
import { checkPermission } from '../middleware/rbacMiddleware';
import { validateBudgetData, validateBudgetAllocationData } from '../middleware/validationMiddleware';

const router = express.Router();

// All routes are protected
router.post('/', authenticate, checkPermission('budget.manage'), validateBudgetData, createBudget);
router.get('/', authenticate, checkPermission('budget.view'), getBudgets);
router.get('/department/:departmentId', authenticate, checkPermission('budget.view'), getBudgetsByDepartment);
router.get('/utilization', authenticate, checkPermission('budget.view'), getBudgetUtilization);
router.get('/:id', authenticate, checkPermission('budget.view'), getBudgetById);
router.put('/:id', authenticate, checkPermission('budget.manage'), validateBudgetData, updateBudget);
router.delete('/:id', authenticate, checkPermission('budget.manage'), deleteBudget);
router.post('/allocate', authenticate, checkPermission('budget.manage'), validateBudgetAllocationData, allocateBudget);

export default router;