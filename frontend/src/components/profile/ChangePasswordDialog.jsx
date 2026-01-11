import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import api from "../../utils/api";

export default function ChangePasswordDialog({ open, onClose }) {
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirm, setConfirm] = useState("");

  const submit = async () => {
    if (newPwd !== confirm) return alert("New passwords do not match");
    try {
      await api.put("/auth/password", { oldPassword: oldPwd, newPassword: newPwd });
      alert("Password changed");
      setOldPwd(""); setNewPwd(""); setConfirm("");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Error changing password");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change password</DialogTitle>
      <DialogContent sx={{ display: "grid", gap: 1, width: 360 }}>
        <TextField label="Current password" type="password" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} />
        <TextField label="New password" type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
        <TextField label="Confirm new password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={submit} variant="contained">Change</Button>
      </DialogActions>
    </Dialog>
  );
}
