const asyncHandler = require('express-async-handler');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

exports.setBudget = asyncHandler(async (req, res) => {
  const { month, totalBudget, categoryBudgets } = req.body;
  const filter = { user: req.user._id, month };
  const doc = await Budget.findOneAndUpdate(filter, { totalBudget, categoryBudgets }, { upsert:true, new:true });
  res.json({ success:true, data: doc });
});

exports.getBudget = asyncHandler(async (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0,7);
  const doc = await Budget.findOne({ user: req.user._id, month });
  // sum spent this month
  const spentAgg = await Expense.aggregate([
    { $match: { user: req.user._id, date: { $gte: new Date(`${month}-01`), $lt: new Date(`${month}-01`) } } },
  ]);
  res.json({ success:true, data: doc });
});
