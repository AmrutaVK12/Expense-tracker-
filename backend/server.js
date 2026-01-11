const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env variables
dotenv.config({ path: './config/config.env' });

// Connect DB
connectDB();

// ⭐ Prometheus client
const client = require("prom-client");
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const expenseRoutes = require('./routes/expenses');

const app = express();
app.use(cors());
app.use(express.json());

// ================= ROUTES =================

// Auth (ONLY ONE AUTH ROUTE – FIXED)
app.use("/api/v1/auth", require("./routes/auth"));

// Other API routes
app.use('/api/recurring', require('./routes/recurring'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/budgets', require('./routes/budget'));
app.use('/api/wallets', require('./routes/wallet'));
app.use('/api/insights', require('./routes/insights'));
app.use('/api/expenses', expenseRoutes);

// Uploads
app.use("/uploads", express.static("uploads"));
app.use("/api/upload", require("./routes/upload"));

// ⭐ Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.send(await register.metrics());
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack.red);
  res
    .status(res.statusCode === 200 ? 500 : res.statusCode)
    .json({ message: err.message });
});

// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`.yellow.bold)
);
