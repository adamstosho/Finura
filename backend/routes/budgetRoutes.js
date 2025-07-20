import express from 'express';
import {
  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createBudget)
  .get(protect, getBudgets);

router.route('/:id')
  .get(protect, getBudget)
  .put(protect, updateBudget)
  .delete(protect, deleteBudget);

export default router; 