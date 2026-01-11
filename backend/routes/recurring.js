// server/routes/recurring.js
const express = require('express');
const router = express.Router();
const { createRecurring, getAll, runDue } = require('../controllers/recurringController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createRecurring);
router.get('/', protect, getAll);

// public/admin call to run due tasks (protect in production)
router.post('/run-due', protect, runDue);

module.exports = router;
