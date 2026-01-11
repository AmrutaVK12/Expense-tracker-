exports.uploadReceipt = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  res.json({
    success: true,
    fileUrl: `/uploads/${req.file.filename}`
  });
};
