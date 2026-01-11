// server/controllers/recurringController.js
const asyncHandler = require('express-async-handler');
const Recurring = require('../models/Recurring');
const Expense = require('../models/Expense'); // existing expense model

// create recurring
exports.createRecurring = asyncHandler(async (req, res) => {
  const r = await Recurring.create({ ...req.body, user: req.user._id, nextRun: req.body.startDate || Date.now() });
  res.status(201).json({ success: true, data: r });
});

// list
exports.getAll = asyncHandler(async (req, res) => {
  const data = await Recurring.find({ user: req.user._id });
  res.json({ success: true, data });
});

// toggle / update / delete omitted for brevity (similar)
exports.runDue = asyncHandler(async (req, res) => {
  // find all active recurring where nextRun <= now
  const due = await Recurring.find({ active: true, nextRun: { $lte: new Date() } });
  const created = [];
  for (const r of due) {
    const e = await Expense.create({
      user: r.user,
      title: r.title,
      amount: r.amount,
      category: r.category,
      date: r.nextRun || new Date()
    });
    created.push(e);
    // advance nextRun
    let next = new Date(r.nextRun || r.startDate || Date.now());
    if (r.frequency === 'daily') next.setDate(next.getDate()+1);
    else if (r.frequency === 'weekly') next.setDate(next.getDate()+7);
    else if (r.frequency === 'monthly') next.setMonth(next.getMonth()+1);
    else if (r.frequency === 'yearly') next.setFullYear(next.getFullYear()+1);
    r.nextRun = next;
    await r.save();
  }
  res.json({ success: true, created });
});
