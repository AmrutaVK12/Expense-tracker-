import React from "react";
import { Paper, Typography, Box } from "@mui/material";

export default function TopCategories({ expenses }) {
  const totals = {};

  expenses.forEach(e => {
    if (e.amount < 0) {
      totals[e.category] = (totals[e.category] || 0) + Math.abs(e.amount);
    }
  });

  const sorted = Object.entries(totals)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Top Spending Categories</Typography>
      <Box sx={{ mt: 2 }}>
        {sorted.map(([cat, val]) => (
          <Box key={cat} sx={{ mb:1 }}>
            <Typography>{cat}: ${val}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
