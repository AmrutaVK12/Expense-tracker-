const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ----------------------------------------------------
// REGISTER  (Your original code - untouched)
// ----------------------------------------------------
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please include all fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id)
  });
});

// ----------------------------------------------------
// LOGIN (Your original code - untouched)
// ----------------------------------------------------
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && await user.matchPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// ----------------------------------------------------
// GET ME (Updated — now returns full user except password)
// ----------------------------------------------------
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

// ----------------------------------------------------
// UPDATE PROFILE (NEW)
// ----------------------------------------------------
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, company } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (company !== undefined) user.company = company;

  await user.save();

  res.json({
    message: "Profile updated",
    user: user.toObject({ getters: true, virtuals: false })
  });
});

// ----------------------------------------------------
// CHANGE PASSWORD (NEW)
// ----------------------------------------------------
exports.changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const matches = await user.matchPassword(oldPassword);
  if (!matches) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword; // will be hashed by pre-save hook
  await user.save();

  res.json({ message: "Password updated successfully" });
});

// ----------------------------------------------------
// UPDATE SETTINGS (NEW)
// ----------------------------------------------------
exports.updateSettings = asyncHandler(async (req, res) => {
  const { notifications, currency } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.settings = {
    ...user.settings,
    notifications: notifications ?? user.settings.notifications,
    currency: currency ?? user.settings.currency
  };

  await user.save();

  res.json({
    message: "Settings updated",
    settings: user.settings
  });
});
