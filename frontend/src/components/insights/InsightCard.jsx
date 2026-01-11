import React from "react";
import { Paper, Typography } from "@mui/material";

export default function InsightCard({ title, text }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography sx={{ mt: 1 }} color="text.secondary">
        {text}
      </Typography>
    </Paper>
  );
}
