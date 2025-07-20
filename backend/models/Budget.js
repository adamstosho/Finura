import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  limit: { type: Number, required: true },
});

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  income: { type: Number, required: true },
  month: { type: String, required: true },
  categories: [categorySchema],
}, { timestamps: true });

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget; 