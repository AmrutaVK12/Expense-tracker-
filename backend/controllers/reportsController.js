// server/controllers/reportsController.js
const asyncHandler = require('express-async-handler');
const Expense = require('../models/Expense');

exports.getReports = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const year = Number(req.query.year) || new Date().getFullYear();

  // category totals
  const catAgg = await Expense.aggregate([
    { $match: { user: user } },
    { $group: { _id: '$category', total: { $sum: { $abs: '$amount' } } } }
  ]);

  // monthly income/expense
  const monthAgg = await Expense.aggregate([
    { $match: { user: user, date: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year+1}-01-01`) } } },
    { $project: { month: { $dateToString: { format: '%Y-%m', date: '$date' } }, amount: '$amount' } },
    { $group: { _id: '$month', income: { $sum: { $cond: [{ $gt: ['$amount', 0] }, '$amount', 0] } }, expense: { $sum: { $cond: [{ $lt: ['$amount', 0] }, { $abs: '$amount' }, 0] } } } },
    { $sort: { _id: 1 } }
  ]);

  const totalIncome = await Expense.aggregate([{ $match:{ user }, $group:{ _id:null, total: { $sum: { $cond:[{ $gt:['$amount',0] }, '$amount', 0] } } } }]);
  const totalExpense = await Expense.aggregate([{ $match:{ user }, $group:{ _id:null, total: { $sum: { $cond:[{ $lt:['$amount',0] }, { $abs:'$amount' }, 0] } } } }]);

  res.json({
    category: catAgg,
    monthly: monthAgg,
    totals: {
      income: totalIncome[0]?.total || 0,
      expense: totalExpense[0]?.total || 0
    }
  });
});
