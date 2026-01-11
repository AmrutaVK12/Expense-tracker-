import React from "react";
import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";

import BarChartIcon from "@mui/icons-material/BarChart"; // NEW icon for Insights
import ListAltIcon from "@mui/icons-material/ListAlt";
import SavingsIcon from "@mui/icons-material/Savings";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ open, onClose, dark }) {
  const { pathname } = useLocation();

  return (
    <Drawer
      variant="persistent"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 260,
          bgcolor: dark ? "#16161D" : "#ffffff",
          borderRight: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "4px 0px 20px rgba(0,0,0,0.05)",
        },
      }}
    >
      <Toolbar />
      <Divider />

      <List>
        {/* INSIGHTS (Renamed Dashboard) */}
        <ListItemButton
          component={Link}
          to="/"
          onClick={onClose}
          selected={pathname === "/"}
          sx={{ borderRadius: "10px", mx: 1 }}
        >
          <ListItemIcon>
            <BarChartIcon /> {/* Better Insights icon */}
          </ListItemIcon>
          <ListItemText primary="Insights" />
        </ListItemButton>

        {/* Expenses */}
        <ListItemButton
          component={Link}
          to="/expenses"
          onClick={onClose}
          selected={pathname === "/expenses"}
          sx={{ borderRadius: "10px", mx: 1 }}
        >
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <ListItemText primary="Expenses" />
        </ListItemButton>

        {/* Reports */}
        <ListItemButton
          component={Link}
          to="/reports"
          onClick={onClose}
          selected={pathname === "/reports"}
          sx={{ borderRadius: "10px", mx: 1 }}
        >
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItemButton>

        {/* Budgets */}
        <ListItemButton
          component={Link}
          to="/budgets"
          onClick={onClose}
          selected={pathname === "/budgets"}
          sx={{ borderRadius: "10px", mx: 1 }}
        >
          <ListItemIcon>
            <SavingsIcon />
          </ListItemIcon>
          <ListItemText primary="Budgets" />
        </ListItemButton>

        {/* Wallets */}
        <ListItemButton
          component={Link}
          to="/wallets"
          onClick={onClose}
          selected={pathname === "/wallets"}
          sx={{
            borderRadius: "10px",
            mx: 1,
            "&:hover": {
              bgcolor: "primary.light",
              color: "#fff",
              "& .MuiListItemIcon-root": { color: "#fff" },
            },
          }}
        >
          <ListItemIcon>
            <AccountBalanceWalletIcon />
          </ListItemIcon>
          <ListItemText primary="Wallets" />
        </ListItemButton>

        {/* Removed:
            - Old Insights (duplicate)
            - Empty ListItem (useless)
        */}
      </List>

      <Divider />
    </Drawer>
  );
}
