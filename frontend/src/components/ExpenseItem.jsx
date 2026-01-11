import React from "react";
import { Paper, Box, Typography, Button } from "@mui/material";
import api from "../utils/api";

export default function ExpenseItem({ tx, onDeleted, onEdit }) {
  const remove = async () => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    try {
      await api.delete(`/expenses/${tx._id}`);
      onDeleted && onDeleted();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="subtitle1">{tx.title}</Typography>
          <Typography variant="caption" color="text.secondary">
            {tx.category} • {new Date(tx.date).toLocaleDateString()}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <Typography
            sx={{
              color: tx.amount >= 0 ? "success.main" : "error.main",
              fontWeight: 600,
            }}
          >
            {tx.amount >= 0 ? `+$${tx.amount}` : `-$${Math.abs(tx.amount)}`}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <div>
              <Button
                onClick={() => onEdit(tx)}
                size="small"
                sx={{ color: "#6a45ff" }}
              >
                EDIT
              </Button>

              <Button
                onClick={remove}
                size="small"
                sx={{ color: "red" }}
              >
                DELETE
              </Button>
            </div>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
