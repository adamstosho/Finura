import asyncHandler from 'express-async-handler';
import Budget from '../models/Budget.js';

// @desc    Create new budget
// @route   POST /api/budget
// @access  Private
const createBudget = asyncHandler(async (req, res) => {
  const { month, income, categories } = req.body;
  const budget = await Budget.create({
    user: req.user._id,
    month,
    income,
    categories,
  });
  res.status(201).json(budget);
});

// @desc    Get all budgets for user
// @route   GET /api/budget
// @access  Private
const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ user: req.user._id });
  res.json(budgets);
});

// @desc    Get single budget
// @route   GET /api/budget/:id
// @access  Private
const getBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });
  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }
  res.json(budget);
});

// @desc    Update budget
// @route   PUT /api/budget/:id
// @access  Private
const updateBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }
  res.json(budget);
});

// @desc    Delete budget
// @route   DELETE /api/budget/:id
// @access  Private
const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }
  res.json({ message: 'Budget removed' });
});

export { createBudget, getBudgets, getBudget, updateBudget, deleteBudget }; 