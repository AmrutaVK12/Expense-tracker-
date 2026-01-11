import React, { useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import StatCard from "../components/stats/StatCard";
import AdvancedChartsPanel from "../components/charts/AdvancedChartsPanel.jsx";
import TopCategories from "../components/stats/TopCategories";
import Navbar from "../components/layout/Navbar";
import api from "../utils/api";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSidebar, setOpenSidebar] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/expenses", {
        params: { limit: 1000, page: 1 },
      });
      setExpenses(res.data.data);
    } catch {
      setExpenses([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const income = expenses.filter(e => e.amount > 0).reduce((s, e) => s + e.amount, 0);
  const expense = expenses.filter(e => e.amount < 0).reduce((s, e) => s + Math.abs(e.amount), 0);
  const balance = income - expense;

  // --------------------------
  // LOADING STATE
  // --------------------------
  if (loading) {
    return (
      <>
        <Navbar onMenuClick={() => setOpenSidebar(true)} />

        <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
          <Grid container spacing={3}>
            {/* STAT CARDS */}
            <Grid item xs={12} md={4}>
              <StatCard title="Balance" value={`$${balance.toFixed(2)}`} color="#111" />
            </Grid>
            <Grid item xs={6} md={4}>
              <StatCard title="Income" value={`$${income.toFixed(2)}`} color="#2e7d32" />
            </Grid>
            <Grid item xs={6} md={4}>
              <StatCard title="Expense" value={`$${expense.toFixed(2)}`} color="#c62828" />
            </Grid>

            <Grid item xs={12}>
              <AdvancedChartsPanel expenses={expenses} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TopCategories expenses={expenses} />
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }

  // --------------------------
  // MAIN PAGE (AFTER LOADING)
  // --------------------------
  return (
    <>
      <Navbar onMenuClick={() => setOpenSidebar(true)} />

      <div style={{ paddingTop: "90px" }}>
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
          <Grid container spacing={3}>
            {/* STAT CARDS */}
            <Grid item xs={12} md={4}>
              <StatCard title="Balance" value={`$${balance.toFixed(2)}`} color="#111" />
            </Grid>
            <Grid item xs={6} md={4}>
              <StatCard title="Income" value={`$${income.toFixed(2)}`} color="#2e7d32" />
            </Grid>
            <Grid item xs={6} md={4}>
              <StatCard title="Expense" value={`$${expense.toFixed(2)}`} color="#c62828" />
            </Grid>

            {/* CHARTS */}
            <Grid item xs={12}>
              <AdvancedChartsPanel expenses={expenses} />
            </Grid>

            {/* TOP CATEGORIES */}
            <Grid item xs={12} md={4}>
              <TopCategories expenses={expenses} />
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
}
