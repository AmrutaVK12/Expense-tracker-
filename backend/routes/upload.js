const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadReceipt } = require("../controllers/uploadController");

router.post("/", upload.single("receipt"), uploadReceipt);

module.exports = router;
