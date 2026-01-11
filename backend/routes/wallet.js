const express = require('express');
const router = express.Router();

const {
  createWallet,
  getWallets,
  updateWallet,
  deleteWallet,
  transfer,
  getAnalytics
} = require('../controllers/walletController');

const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createWallet);
router.get('/', protect, getWallets);
router.put('/:id', protect, updateWallet);
router.delete('/:id', protect, deleteWallet);

// Transfer money between wallets
router.post('/transfer', protect, transfer);

// Wallet analytics
router.get('/analytics', protect, getAnalytics);

module.exports = router;
