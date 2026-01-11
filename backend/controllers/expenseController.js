const asyncHandler = require("express-async-handler");
const Expense = require("../models/Expense");
const Wallet = require('../models/Wallet'); // if needed
const { adjustWalletBalance } = require('./walletController'); // helper


// GET /api/expenses?search=&sort=latest&page=1&limit=10&category=&month=YYYY-MM
exports.getExpenses = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    search,
    sort = "latest",
    page = 1,
    limit = 10,
    category,
    month,
  } = req.query;

  const query = { user: userId };
  if (search) query.title = { $regex: search, $options: "i" };
  if (category) query.category = category;
  if (month) {
    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);
    query.date = { $gte: start, $lt: end };
  }

  let q = Expense.find(query);
  if (sort === "highest") q = q.sort({ amount: -1 });
  else if (sort === "oldest") q = q.sort({ date: 1 });
  else q = q.sort({ date: -1 });

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Expense.countDocuments(query);
  const data = await q.skip(skip).limit(Number(limit));
  res.json({
    data,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

exports.createExpense = asyncHandler(async (req, res) => {
  const { title, amount, category, date, notes } = req.body;
  // Adjust wallet balance if walletId exists
  const { adjustWalletBalance } = require("./walletController");

  if (req.body.walletId) {
    await adjustWalletBalance(req.body.walletId, req.body.amount);
  }

  const expense = await Expense.create({
    user: req.user._id,
    title,
    amount,
    category,
    date: date || Date.now(),
    notes: notes || "",
  });
  res.status(201).json(expense);
});

exports.updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }
  if (expense.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }
  const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json(updated);
});

exports.deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }
  if (expense.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }
  // await expense.deleteOne();
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});
