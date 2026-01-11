const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  name: { type: String, required: true }, // wallet name: Cash, Bank, Paytm, UPI, Card
  balance: { type: Number, default: 0 },

  currency: { type: String, default: 'INR' }, // Optional
}, { timestamps: true });

module.exports = mongoose.model('Wallet', WalletSchema);
