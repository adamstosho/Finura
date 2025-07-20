import asyncHandler from 'express-async-handler';
import Expense from '../models/Expense.js';

// @desc    Add expense to budget
// @route   POST /api/expenses
// @access  Private
const addExpense = asyncHandler(async (req, res) => {
  const { budgetId, category, amount, date, note } = req.body;
  const expense = await Expense.create({
    budget: budgetId,
    category,
    amount,
    date,
    note,
  });
  res.status(201).json(expense);
});

// @desc    Get all expenses for a budget
// @route   GET /api/expenses?budgetId=xyz
// @access  Private
const getExpenses = asyncHandler(async (req, res) => {
  const { budgetId } = req.query;
  let query = {};
  if (budgetId) {
    query.budget = budgetId;
  }
  // Optionally, you may want to filter by user’s budgets here for security
  const expenses = await Expense.find(query);
  res.json(expenses);
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  res.json({ message: 'Expense removed' });
});

export { addExpense, getExpenses, deleteExpense }; 