// server/models/Recurring.js
const mongoose = require('mongoose');

const RecurringSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'Others' },
  startDate: { type: Date, default: Date.now },
  frequency: { type: String, enum: ['daily','weekly','monthly','yearly'], default: 'monthly' },
  nextRun: { type: Date },
  active: { type: Boolean, default: true },
  meta: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Recurring', RecurringSchema);
