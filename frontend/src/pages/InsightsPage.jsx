import React, { useEffect, useState } from "react";
import { Container, Typography, Grid } from "@mui/material";
import { getInsights } from "../services/insightsService";
import InsightCard from "../components/insights/InsightCard";

export default function InsightsPage() {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    getInsights().then(res => setInsights(res.data.data));
  }, []);

  if (!insights) return <Container sx={{ mt: 10 }}>Loading...</Container>;

  const items = [
    insights.highestCategory && {
      title: "Top Spending Category",
      text: `${insights.highestCategory}: ₹${insights.highestValue}`,
    },
    insights.biggestExpense && {
      title: "Biggest Expense",
      text: `${insights.biggestExpense.title} – ₹${Math.abs(
        insights.biggestExpense.amount
      )}`,
    },
    {
      title: "Total Spent This Month",
      text: `₹${insights.totalSpent}`,
    },
    {
      title: "Last Month Spending",
      text: `₹${insights.lastSpent}`,
    },
    insights.highestWallet && {
      title: "Highest Wallet Balance",
      text: `${insights.highestWallet.name}: ₹${insights.highestWallet.balance}`,
    },
    insights.budgetProgress && {
      title: "Budget Usage",
      text: `${insights.budgetProgress.percent}% used`,
    },
  ];

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Smart Insights
      </Typography>

      <Grid container spacing={2}>
        {items
          .filter(Boolean)
          .map((c, i) => (
            <Grid item xs={12} md={6} key={i}>
              <InsightCard title={c.title} text={c.text} />
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}
