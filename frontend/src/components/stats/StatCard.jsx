import React from "react";
import AnimatedNumber from "../stats/AnimatedNumber";
import { Paper, Typography } from "@mui/material";

export default function StatCard({ title, value, color }) {
  return (
    <Paper sx={{ p: 2 }} elevation={2}>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5" sx={{ color }}>
        $<AnimatedNumber value={value.replace("$", "")} />
      </Typography>
    </Paper>
  );
}
