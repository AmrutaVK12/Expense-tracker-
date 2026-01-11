const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const Wallet = require("../models/Wallet");

exports.getInsights = async (req, res) => {
  try {
    const userId = req.user._id;

    // Load all user expenses
    const expenses = await Expense.find({ user: userId }).sort({ date: 1 });

    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const prevMonth = new Date(now.setMonth(now.getMonth() - 1))
      .toISOString()
      .slice(0, 7);

    const monthlyExpenses = expenses.filter(e =>
      e.date.toISOString().startsWith(currentMonth)
    );

    const lastMonthExpenses = expenses.filter(e =>
      e.date.toISOString().startsWith(prevMonth)
    );

    // Totals
    const totalSpent = monthlyExpenses
      .filter(e => e.amount < 0)
      .reduce((s, e) => s + Math.abs(e.amount), 0);

    const lastSpent = lastMonthExpenses
      .filter(e => e.amount < 0)
      .reduce((s, e) => s + Math.abs(e.amount), 0);

    // Highest category
    const categoryTotals = {};
    monthlyExpenses.forEach(e => {
      if (e.amount < 0) {
        categoryTotals[e.category] =
          (categoryTotals[e.category] || 0) + Math.abs(e.amount);
      }
    });

    let highestCategory = null;
    let highestValue = 0;
    Object.entries(categoryTotals).forEach(([cat, val]) => {
      if (val > highestValue) {
        highestValue = val;
        highestCategory = cat;
      }
    });

    // Biggest single expense
    const biggestExpense = monthlyExpenses
      .filter(e => e.amount < 0)
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))[0];

    // Wallets
    const wallets = await Wallet.find({ user: userId });
    const highestWallet = wallets.length
      ? wallets.sort((a, b) => b.balance - a.balance)[0]
      : null;

    // Budget
    const budget = await Budget.findOne({
      user: userId,
      month: currentMonth,
    });

    let budgetProgress = null;
    if (budget) {
      budgetProgress = {
        used: totalSpent,
        total: budget.totalBudget,
        percent: Math.round((totalSpent / budget.totalBudget) * 100),
      };
    }

    res.json({
      success: true,
      data: {
        totalSpent,
        lastSpent,
        highestCategory,
        highestValue,
        biggestExpense,
        highestWallet,
        budgetProgress,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
