// server/controllers/walletController.js
const Wallet = require('../models/Wallet');
const asyncHandler = require('express-async-handler');

// Create wallet
exports.createWallet = asyncHandler(async (req, res) => {
  const wallet = await Wallet.create({
    user: req.user._id,
    name: req.body.name,
    balance: req.body.balance || 0,
    currency: req.body.currency || "INR"
  });
  res.status(201).json({ success: true, data: wallet });
});

// Get all wallets
exports.getWallets = asyncHandler(async (req, res) => {
  const wallets = await Wallet.find({ user: req.user._id });
  res.json({ success: true, data: wallets });
});

// Update wallet
exports.updateWallet = asyncHandler(async (req, res) => {
  const updated = await Wallet.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: updated });
});

// Delete wallet
exports.deleteWallet = asyncHandler(async (req, res) => {
  await Wallet.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Wallet deleted" });
});

// Helper: adjust balance by amount (positive to increase, negative to decrease)
exports.adjustWalletBalance = async (walletId, amount) => {
  if (!walletId) return;
  await Wallet.findByIdAndUpdate(walletId, { $inc: { balance: amount } });
};

// Transfer between wallets: subtract from source, add to destination
exports.transfer = async (req, res) => {
  try {
    const { fromWalletId, toWalletId, amount } = req.body;

    if (!fromWalletId || !toWalletId || !amount)
      return res.status(400).json({ success: false, message: "Missing fields" });

    if (fromWalletId === toWalletId)
      return res.status(400).json({ success: false, message: "Cannot transfer to same wallet" });

    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0)
      return res.status(400).json({ success: false, message: "Invalid amount" });

    // Step 1: remove money from source wallet
    await Wallet.findByIdAndUpdate(fromWalletId, { $inc: { balance: -amt } });

    // Step 2: add money to destination wallet
    await Wallet.findByIdAndUpdate(toWalletId, { $inc: { balance: amt } });

    return res.json({ success: true, message: "Transfer successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Analytics: total and breakdown
exports.getAnalytics = asyncHandler(async (req, res) => {
  const wallets = await Wallet.find({ user: req.user._id });
  const total = wallets.reduce((s, w) => s + (w.balance || 0), 0);
  res.json({ success: true, data: { total, wallets } });
});
