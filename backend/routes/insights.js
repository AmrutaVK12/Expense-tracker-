const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getInsights } = require("../controllers/insightsController");

router.get("/", protect, getInsights);

module.exports = router;
