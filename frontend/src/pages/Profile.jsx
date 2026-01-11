import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  TextField,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);

  // ------------------------------
  // NEW STATES FOR EDITABLE FIELDS
  // ------------------------------
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [company, setCompany] = useState(user?.company || "");

  const [currency, setCurrency] = useState("USD");
  const [notifications, setNotifications] = useState(true);

  const [pwdOpen, setPwdOpen] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  // ------------------------------
  // LOAD SETTINGS FROM BACKEND
  // ------------------------------
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await api.get("/auth/me");
        setCurrency(res.data?.settings?.currency || "USD");
        setNotifications(res.data?.settings?.notifications || false);
      } catch (err) {
        console.log(err);
      }
    };
    loadSettings();
  }, []);

  // ------------------------------
  // SAVE PROFILE DETAILS
  // ------------------------------
  const saveProfile = async () => {
    try {
      const res = await api.put("/auth/profile", {
        name,
        phone,
        company,
      });

      alert("Profile updated!");

      // Update AuthContext user
      if (setUser) setUser({ ...user, name, phone, company });
    } catch (err) {
      alert(err.response?.data?.message || "Error updating profile");
    }
  };

  // ------------------------------
  // SAVE SETTINGS
  // ------------------------------
  const saveSettings = async () => {
    try {
      await api.put("/auth/settings", {
        currency,
        notifications,
      });

      alert("Settings saved!");
    } catch (err) {
      alert(err.response?.data?.message || "Error saving settings");
    }
  };

  // ------------------------------
  // CHANGE PASSWORD
  // ------------------------------
  const changePassword = async () => {
    if (newPwd !== confirmPwd) return alert("New passwords do not match!");

    try {
      await api.put("/auth/password", {
        oldPassword: oldPwd,
        newPassword: newPwd,
      });

      alert("Password changed successfully!");

      setPwdOpen(false);
      setOldPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (err) {
      alert(err.response?.data?.message || "Error changing password");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Paper sx={{ p: 4 }}>
        {/* ---------------------------------------
           YOUR ORIGINAL EXISTING PROFILE CODE
        ---------------------------------------- */}
        <Typography variant="h4" sx={{ mb: 3 }}>
          Profile
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Avatar sx={{ width: 80, height: 80 }}>
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </Avatar>

          <Box>
            <Typography variant="h6">{user?.name || "User Name"}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email || "user@example.com"}
            </Typography>
          </Box>
        </Box>

        {/* ---------------------------------------
           NEW • EDIT PROFILE FORM
        ---------------------------------------- */}
        <Divider sx={{ my: 3 }} />

        <Typography variant="h6">Edit Profile</Typography>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            mt: 2,
            maxWidth: 400,
          }}
        >
          <TextField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <TextField
            label="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <Button variant="contained" onClick={saveProfile}>
            Save Profile
          </Button>
        </Box>

        {/* ---------------------------------------
           NEW • ACCOUNT SETTINGS
        ---------------------------------------- */}
        <Divider sx={{ my: 4 }} />

        <Typography variant="h6">Account Settings</Typography>

        <Grid container spacing={2} sx={{ mt: 1, maxWidth: 400 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Preferred Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email Notifications (true / false)"
              value={notifications}
              onChange={(e) => setNotifications(e.target.value === "true")}
            />
          </Grid>

          <Grid item xs={12}>
            <Button fullWidth variant="contained" onClick={saveSettings}>
              Save Settings
            </Button>
          </Grid>
        </Grid>

        {/* ---------------------------------------
           NEW • CHANGE PASSWORD BUTTON
        ---------------------------------------- */}
        <Divider sx={{ my: 4 }} />

        <Button
          variant="outlined"
          color="error"
          onClick={() => setPwdOpen(true)}
        >
          Change Password
        </Button>
      </Paper>

      {/* ---------------------------------------
         NEW • CHANGE PASSWORD POPUP
      ---------------------------------------- */}
      <Dialog open={pwdOpen} onClose={() => setPwdOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, mt: 1, width: 350 }}>
          <TextField
            type="password"
            label="Current Password"
            value={oldPwd}
            onChange={(e) => setOldPwd(e.target.value)}
          />
          <TextField
            type="password"
            label="New Password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
          />
          <TextField
            type="password"
            label="Confirm New Password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPwdOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={changePassword}>
            Change
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
