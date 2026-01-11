import React, { useState, useEffect } from "react";
import { Box, TextField, Button, MenuItem } from "@mui/material";
import api from "../../utils/api";

const currencies = ["USD", "INR", "EUR", "GBP", "JPY"];

export default function ProfileForm({ initial = {}, onSaved }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    if (initial) {
      setName(initial.name || "");
      setPhone(initial.phone || "");
      setCompany(initial.company || "");
      setCurrency(initial.settings?.currency || "USD");
    }
  }, [initial]);

  const save = async (e) => {
    e.preventDefault();
    try {
      // profile update endpoint
      const res = await api.put("/auth/profile", { name, phone, company });
      // settings update endpoint for currency (separate)
      await api.put("/auth/settings", { currency: currency });
      if (onSaved) onSaved();
      alert("Saved");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving");
    }
  };

  return (
    <Box component="form" onSubmit={save} sx={{ display: "grid", gap: 2 }}>
      <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
      <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <TextField label="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
      <TextField
        select
        label="Preferred currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      >
        {currencies.map((c) => (
          <MenuItem key={c} value={c}>
            {c}
          </MenuItem>
        ))}
      </TextField>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button type="submit" variant="contained">
          Save
        </Button>
        <Button type="button" onClick={() => window.location.reload()}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
