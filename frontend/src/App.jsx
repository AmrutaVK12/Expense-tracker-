import React, { useMemo, useState, useContext } from "react";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Topbar from "./components/layout/Topbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/Footer";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import ReportsPage from "./pages/ReportsPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import BudgetsPage from "./pages/BudgetsPage";
import WalletsPage from "./pages/WalletsPage";
import { AuthContext } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";

import StyledContainer from "./components/StyledContainer";   // ⭐ ADDED

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("dark") === "true"
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: dark ? "dark" : "light",
          primary: { main: "#6A5ACD" },
          background: {
            default: dark ? "#0F0F14" : "#F6F7FB",
            paper: dark ? "rgba(20,20,28,0.6)" : "rgba(255,255,255,0.6)",
          },
        },
        shape: { borderRadius: 14 },
        typography: {
          fontFamily: `"Inter", "Roboto", sans-serif`,
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backdropFilter: "blur(12px)",
                borderRadius: "20px",
                padding: "20px",
                transition: "0.3s ease",
                boxShadow: dark
                  ? "0px 4px 20px rgba(0,0,0,0.4)"
                  : "0px 4px 20px rgba(0,0,0,0.1)",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                padding: "10px 22px",
                textTransform: "none",
                borderRadius: "10px",
                fontWeight: 600,
                transition: "0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 14px rgba(106,90,205,0.3)",
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  transition: "0.25s ease",

                  "& fieldset": {
                    borderColor: "rgba(0,0,0,0.2)",
                  },

                  "&:hover fieldset": {
                    borderColor: "#6A5ACD",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: "#6A5ACD",
                    boxShadow: "0 0 8px rgba(106,90,205,0.4)",
                  },
                },
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              outlined: {
                borderRadius: "12px",
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6A5ACD",
                },
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                background: dark ? "#14141c" : "#ffffff",
                borderRight: "1px solid rgba(0,0,0,0.1)",
                paddingTop: "10px",
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: "12px",
                margin: "4px 8px",
                "&.Mui-selected": {
                  background: "linear-gradient(90deg, #6A5ACD, #8F7BFF)",
                  color: "white",
                },
                "&:hover": {
                  background: "rgba(106,90,205,0.08)",
                },
              },
            },
          },
        },
      }),
    [dark]
  );

  const toggleDark = () => {
  // Add glow flash class for premium animation
  document.body.classList.add("theme-flash");

  // Remove flash after animation ends
  setTimeout(() => {
    document.body.classList.remove("theme-flash");
  }, 600);

  // Toggle theme state
  setDark(!dark);
};


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>
        <Box sx={{ display: "flex" }}>
          <Topbar
            dark={dark}
            setDark={toggleDark}
            toggleSidebar={() => setSidebarOpen(true)}
          />

          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* ⭐⭐ THE ONLY CHANGE: WE WRAPPED MAIN CONTENT WITH StyledContainer */}
          <StyledContainer>
            <Box
              sx={{ flexGrow: 1, paddingBottom: "0px", paddingTop: "0px" }}
            >
              <Routes>
                {/* Public */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected */}
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <DashboardPage />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/expenses"
                  element={
                    <PrivateRoute>
                      <ExpensesPage />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/reports"
                  element={
                    <PrivateRoute>
                      <ReportsPage />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/budgets"
                  element={
                    <PrivateRoute>
                      <BudgetsPage />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/wallets"
                  element={
                    <PrivateRoute>
                      <WalletsPage />
                    </PrivateRoute>
                  }
                />

                {/* New Pages */}
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/settings"
                  element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  }
                />

                <Route path="/home" element={<LandingPage />} />
                <Route path="/" element={<Navigate to="/home" />} />

                {/* Invalid Route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>

              <Footer />
            </Box>
          </StyledContainer>
        </Box>
      </Router>
    </ThemeProvider>
  );
}
