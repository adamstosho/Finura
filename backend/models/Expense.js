import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  budget: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget', required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  note: { type: String },
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense; 