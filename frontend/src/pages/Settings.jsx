import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Box,
  MenuItem,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

/**
 * Settings page (keeps current UI + adds real settings + save to backend)
 * - Fetches user settings from /auth/me
 * - PUT /auth/settings to save
 * - Persists theme preference to localStorage so existing dark-mode logic in App.jsx can use it
 *
 * No other files are changed.
 */

const CURRENCIES = ["USD", "INR", "EUR", "GBP", "JPY", "AUD", "CAD"];

export default function Settings() {
  const { user, setUser } = useContext(AuthContext || {}); // setUser maybe undefined - optional
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState(false);
  const [autoBackup, setAutoBackup] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [themeDark, setThemeDark] = useState(() => localStorage.getItem("dark") === "true");

  const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get("/auth/me"); // expects /api/v1/auth/me
        if (!mounted) return;
        const settings = res.data?.settings || {};
        setNotifications(!!settings.notifications);
        setAutoBackup(!!settings.autoBackup);
        setCurrency(settings.currency || "USD");

        // If backend stores theme preference:
        if (settings.theme === "dark") setThemeDark(true);
        else if (settings.theme === "light") setThemeDark(false);

      } catch (err) {
        // If backend not available, we silently keep defaults
        console.warn("Could not load settings:", err?.response?.data || err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        notifications,
        autoBackup,
        currency,
        theme: themeDark ? "dark" : "light",
      };

      await api.put("/auth/settings", payload);
      // Optionally refresh user info in context
      try {
        const me = await api.get("/auth/me");
        if (setUser) setUser(me.data);
      } catch (_) {}

      // Persist theme locally so App.jsx dark logic picks it up
      localStorage.setItem("dark", themeDark ? "true" : "false");

      setSnack({ open: true, severity: "success", message: "Settings saved." });
    } catch (err) {
      console.error(err);
      setSnack({
        open: true,
        severity: "error",
        message: err.response?.data?.message || "Failed to save settings",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleThemeToggle = (e) => {
    setThemeDark(e.target.checked);
    // update localStorage immediately so other parts reading it can act (App requires reload to fully re-theme)
    localStorage.setItem("dark", e.target.checked ? "true" : "false");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Settings
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Personalization
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
          <FormControlLabel
            control={<Switch checked={themeDark} onChange={handleThemeToggle} />}
            label="Dark mode (toggle)"
          />
          <Typography variant="body2" color="text.secondary">
            Toggling this will save your preference. Reload if UI does not switch automatically.
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Notifications & Backup
        </Typography>

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
            }
            label="Email notifications"
          />

          <FormControlLabel
            control={
              <Switch
                checked={autoBackup}
                onChange={(e) => setAutoBackup(e.target.checked)}
              />
            }
            label="Auto backup"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Currency
        </Typography>

        <TextField
          select
          label="Preferred currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          sx={{ minWidth: 160, mb: 2 }}
        >
          {CURRENCIES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Settings"}
          </Button>
          <Button
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={() => {
              // reload settings from server (discard local edits)
              setLoading(true);
              api.get("/auth/me")
                .then((res) => {
                  const s = res.data?.settings || {};
                  setNotifications(!!s.notifications);
                  setAutoBackup(!!s.autoBackup);
                  setCurrency(s.currency || "USD");
                  if (s.theme === "dark") setThemeDark(true);
                  else if (s.theme === "light") setThemeDark(false);
                })
                .catch(() => {})
                .finally(() => setLoading(false));
            }}
          >
            Reset
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
