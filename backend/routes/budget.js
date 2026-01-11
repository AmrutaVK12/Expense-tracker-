const express = require('express');
const { setBudget, getBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');
const r = express.Router();
r.post('/', protect, setBudget);
r.get('/', protect, getBudget);
module.exports = r;
