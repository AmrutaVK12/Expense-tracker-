import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Box, Button, MenuItem, Select } from "@mui/material";
import api from "../utils/api";
import { Pie, Bar, Line } from "react-chartjs-2";
import html2canvas from "html2canvas";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function ReportsPage() {
  const [expenses, setExpenses] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  const load = async () => {
    try {
      const res = await api.get("/expenses", { params: { limit: 1000 } });
      setExpenses(res.data.data);
    } catch (err) {
      setExpenses([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!expenses.length) {
    return (
      <Container sx={{ mt: 10 }}>
        <Typography variant="h4">Reports</Typography>
        <Typography sx={{ mt: 2 }} color="text.secondary">
          No data available. Add some transactions.
        </Typography>
      </Container>
    );
  }

  // FILTER BY YEAR (ADDED)
  const filtered = expenses.filter((e) => e.date.startsWith(year.toString()));

  // CATEGORY PIE DATA
  const categories = ["Food", "Travel", "Salary", "Bills", "Shopping", "Others"];
  const catTotals = categories.map((c) =>
    filtered
      .filter((e) => e.category === c)
      .reduce((s, t) => s + Math.abs(t.amount), 0)
  );

  const pieData = {
    labels: categories,
    datasets: [
      {
        data: catTotals,
        backgroundColor: [
          "#4caf50",
          "#ff7043",
          "#42a5f5",
          "#9c27b0",
          "#ffca28",
          "#90a4ae",
        ],
      },
    ],
  };

  // TOTAL INCOME & EXPENSE
  const income = filtered
    .filter((e) => e.amount > 0)
    .reduce((s, e) => s + e.amount, 0);

  const expense = filtered
    .filter((e) => e.amount < 0)
    .reduce((s, e) => s + Math.abs(e.amount), 0);

  const biggestExpense = filtered
    .filter((e) => e.amount < 0)
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))[0];

  // BAR CHART
  const barData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Totals",
        data: [income, expense],
        backgroundColor: ["#66bb6a", "#ef5350"],
      },
    ],
  };

  // MONTHLY TREND
  const monthly = {};
  filtered.forEach((e) => {
    const m = new Date(e.date).toISOString().slice(0, 7);
    monthly[m] = monthly[m] || { income: 0, expense: 0 };
    if (e.amount >= 0) monthly[m].income += e.amount;
    else monthly[m].expense += Math.abs(e.amount);
  });

  const months = Object.keys(monthly).sort();

  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: months.map((m) => monthly[m].income),
        borderColor: "#4caf50",
        tension: 0.4,
      },
      {
        label: "Expense",
        data: months.map((m) => monthly[m].expense),
        borderColor: "#ef5350",
        tension: 0.4,
      },
    ],
  };

  // NET SAVINGS LINE (ADDED)
  const netSavingsData = {
    labels: months,
    datasets: [
      {
        label: "Net Savings",
        data: months.map((m) => monthly[m].income - monthly[m].expense),
        borderColor: "#673ab7",
        tension: 0.4,
      },
    ],
  };

  // CATEGORY WITH MAX SPEND (ADDED)
  const maxSpendCategory = categories[
    catTotals.indexOf(Math.max(...catTotals))
  ];

  // DOWNLOAD REPORT (ADDED)
  const downloadReport = () => {
    const report = document.getElementById("report-area");
    html2canvas(report).then((canvas) => {
      const link = document.createElement("a");
      link.download = `Expense_Report_${year}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h4">Reports</Typography>

      {/* YEAR DROPDOWN */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Select Year</Typography>
        <Select value={year} onChange={(e) => setYear(e.target.value)} sx={{ mt: 1 }}>
          <MenuItem value={2023}>2023</MenuItem>
          <MenuItem value={2024}>2024</MenuItem>
          <MenuItem value={2025}>2025</MenuItem>
          <MenuItem value={2026}>2026</MenuItem>
        </Select>
      </Box>

      {/* DOWNLOAD BUTTON */}
      <Button variant="contained" sx={{ mt: 2 }} onClick={downloadReport}>
        Download Report (PNG)
      </Button>

      <div id="report-area">
        {/* TOP INSIGHTS */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6">Insights</Typography>
          <Typography>Total Income: ${income.toFixed(2)}</Typography>
          <Typography>Total Expense: ${expense.toFixed(2)}</Typography>
          <Typography sx={{ mt: 1 }}>
            Biggest Expense:{" "}
            {biggestExpense ? `${biggestExpense.title} ($${Math.abs(biggestExpense.amount)})` : "None"}
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Top Spending Category: {maxSpendCategory}
          </Typography>
        </Paper>

        {/* CATEGORY PIE */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Category Breakdown
          </Typography>
          <Pie data={pieData} />
        </Paper>

        {/* INCOME vs EXPENSE */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Income vs Expense
          </Typography>
          <Bar data={barData} />
        </Paper>

        {/* MONTHLY TREND */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Monthly Trend
          </Typography>
          <Line data={lineData} />
        </Paper>

        {/* NET SAVINGS */}
        <Paper sx={{ p: 3, mt: 3, mb: 5 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Monthly Net Savings
          </Typography>
          <Line data={netSavingsData} />
        </Paper>
      </div>
    </Container>
  );
}
