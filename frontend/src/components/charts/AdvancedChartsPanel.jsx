import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import Chart from "react-apexcharts";

export default function AdvancedChartsPanel({ expenses = [] }) {
  const categories = ["Food", "Travel", "Salary", "Bills", "Shopping", "Others"];

  // CATEGORY TOTALS
  const catTotals = categories.map((c) =>
    expenses
      .filter((e) => e.category === c)
      .reduce((s, t) => s + Math.abs(t.amount), 0)
  );

  // MONTHLY GROUPING
  const monthly = {};
  expenses.forEach((e) => {
    const m = new Date(e.date).toISOString().slice(0, 7);
    monthly[m] = monthly[m] || { income: 0, expense: 0 };
    if (e.amount >= 0) monthly[m].income += e.amount;
    else monthly[m].expense += Math.abs(e.amount);
  });

  const months = Object.keys(monthly).sort();

  // TOTALS
  const totalIncome = expenses
    .filter((e) => e.amount > 0)
    .reduce((s, e) => s + e.amount, 0);

  const totalExpense = expenses
    .filter((e) => e.amount < 0)
    .reduce((s, e) => s + Math.abs(e.amount), 0);

  // ⭐ BEAUTIFUL COLORS
  const colors = [
    "#6a5acd",
    "#ff7043",
    "#42a5f5",
    "#66bb6a",
    "#ab47bc",
    "#ffa726",
  ];

  // ⭐ DONUT CHART — CATEGORY BREAKDOWN
  const pieChart = {
    series: catTotals,
    options: {
      chart: { type: "donut" },
      labels: categories,
      colors,
      legend: { position: "bottom" },
      dataLabels: { enabled: true },
      stroke: { width: 1, colors: ["#fff"] },
      plotOptions: {
        pie: {
          donut: {
            size: "70%",
            labels: {
              show: true,
              total: {
                show: true,
                label: "Total",
                formatter: () =>
                  catTotals.reduce((s, x) => s + x, 0).toLocaleString(),
              },
            },
          },
        },
      },
    },
  };

  // ⭐ BAR CHART — INCOME VS EXPENSE
  const barChart = {
    series: [
      { name: "Income", data: [totalIncome] },
      { name: "Expense", data: [totalExpense] },
    ],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      xaxis: { categories: ["Totals"] },
      colors: ["#66bb6a", "#ef5350"],
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: "40%",
        },
      },
      dataLabels: { enabled: true },
    },
  };

  // ⭐ AREA CHART — MONTHLY TREND
  const trendChart = {
    series: [
      {
        name: "Income",
        data: months.map((m) => monthly[m].income),
      },
      {
        name: "Expense",
        data: months.map((m) => monthly[m].expense),
      },
    ],
    options: {
      chart: { type: "area", animations: { speed: 900 }, toolbar: { show: false } },
      stroke: { curve: "smooth", width: 2 },
      colors: ["#4caf50", "#ef5350"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.5,
          opacityFrom: 0.5,
          opacityTo: 0.1,
          stops: [0, 90, 100],
        },
      },
      xaxis: { categories: months },
      dataLabels: { enabled: false },
      yaxis: {
        labels: {
          formatter: (v) => (v ? "₹" + v.toLocaleString() : "0"),
        },
      },
    },
  };

  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>

      {/* CATEGORY BREAKDOWN */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Category Breakdown
          </Typography>
          <Chart
            options={pieChart.options}
            series={pieChart.series}
            type="donut"
            height={330}
          />
        </Paper>
      </Grid>

      {/* TOTAL INCOME VS EXPENSE */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Income vs Expense
          </Typography>
          <Chart
            options={barChart.options}
            series={barChart.series}
            type="bar"
            height={330}
          />
        </Paper>
      </Grid>

      {/* MONTHLY TREND */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Monthly Trend
          </Typography>
          <Chart
            options={trendChart.options}
            series={trendChart.series}
            type="area"
            height={350}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
