import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  LinearProgress,
  Divider,
} from "@mui/material";

import api from "../utils/api";
import { saveBudget, getBudget } from "../services/budgetService";

const categories = ["Food", "Travel", "Salary", "Bills", "Shopping", "Others"];

export default function BudgetsPage() {
  const [month, setMonth] = useState(() =>
    new Date().toISOString().slice(0, 7)
  );

  const [totalBudget, setTotalBudget] = useState("");
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [spent, setSpent] = useState(0);
  const [catSpent, setCatSpent] = useState({});
  const [loading, setLoading] = useState(true);
  const [savedBudget, setSavedBudget] = useState(null);

  // Glass Card Style
  const cardStyle = {
    background: "rgba(255, 255, 255, 0.15)",
    padding: "20px",
    borderRadius: "16px",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    marginBottom: "20px",
  };

  // -------------------------------------------------
  // Load Budget + Expense data
  // -------------------------------------------------
  const load = async () => {
    try {
      const budgetRes = await getBudget(month);

      const b = budgetRes.data?.data || null;

      if (b) {
        setSavedBudget(b);
        setTotalBudget(b.totalBudget || "");
        setCategoryBudgets(b.categories || {});
      }

      // Load expenses for selected month
      const expenseRes = await api.get("/expenses", {
        params: { page: 1, limit: 5000, month },
      });

      const list = expenseRes.data.data || [];

      // Total spent
      const totalSpent = list
        .filter((x) => x.amount < 0)
        .reduce((sum, x) => sum + Math.abs(x.amount), 0);

      setSpent(totalSpent);

      // Category totals
      const catTotals = {};
      categories.forEach((c) => (catTotals[c] = 0));

      list.forEach((x) => {
        if (x.amount < 0 && categories.includes(x.category)) {
          catTotals[x.category] += Math.abs(x.amount);
        }
      });

      setCatSpent(catTotals);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [month]);

  // -------------------------------------------------
  // Save Budget
  // -------------------------------------------------
  const handleSave = async () => {
    try {
      await saveBudget({
        month,
        totalBudget,
        categories: categoryBudgets,
      });

      setTotalBudget("");
      setCategoryBudgets({});

      load();

      alert("Budget saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save budget");
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 10 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Budgets
      </Typography>

      {/* Month Selector */}
      <Paper sx={cardStyle}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Select Month
        </Typography>

        <TextField
          type="month"
          fullWidth
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          variant="outlined"
        />
      </Paper>

      {/* Total Budget */}
      <Paper sx={cardStyle}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Total Monthly Budget
        </Typography>

        <Box sx={{ mt: 2 }}>
          <TextField
            label="Total Budget"
            type="number"
            fullWidth
            value={totalBudget}
            onChange={(e) => setTotalBudget(Number(e.target.value))}
          />
        </Box>

        {totalBudget > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Spent: ${spent} / ${totalBudget}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={(spent / totalBudget) * 100}
              sx={{ height: 12, borderRadius: 6, mt: 1 }}
            />
          </Box>
        )}
      </Paper>

      {/* Saved Budget Summary */}
      {savedBudget && (
        <Paper sx={cardStyle}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Saved Budget Summary
          </Typography>

          <Typography sx={{ mt: 2 }}>
            <b>Month:</b> {savedBudget.month}
          </Typography>

          <Typography>
            <b>Total Budget:</b> ${savedBudget.totalBudget}
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600 }}>
            Category Budgets
          </Typography>

          <ul>
            {Object.entries(savedBudget.categories || {}).map(([cat, val]) => (
              <li key={cat}>
                <b>{cat}:</b> ${val}
              </li>
            ))}
          </ul>
        </Paper>
      )}

      {/* Category Budgets */}
      <Paper sx={cardStyle}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Category Budgets
        </Typography>

        {categories.map((cat) => (
          <Box key={cat} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              type="number"
              label={`${cat} Budget`}
              value={categoryBudgets[cat] || ""}
              onChange={(e) =>
                setCategoryBudgets({
                  ...categoryBudgets,
                  [cat]: Number(e.target.value),
                })
              }
            />

            {categoryBudgets[cat] > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Spent: ${catSpent[cat] || 0} / ${categoryBudgets[cat]}
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={(catSpent[cat] / categoryBudgets[cat]) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 5,
                  }}
                />
              </Box>
            )}

            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </Paper>

      {/* Save Button */}
      <Button
        variant="contained"
        sx={{
          mt: 3,
          width: "100%",
          py: 1.4,
          fontSize: "16px",
          borderRadius: "12px",
          background: "linear-gradient(90deg,#6A5ACD,#9B78FF)",
        }}
        onClick={handleSave}
      >
        Save Budget
      </Button>
    </Container>
  );
}
