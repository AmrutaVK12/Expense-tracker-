// server/models/Budget.js
const mongoose = require('mongoose');
const BudgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true }, // YYYY-MM
  totalBudget: { type: Number, default: 0 },
  categoryBudgets: { type: Map, of: Number, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Budget', BudgetSchema);
