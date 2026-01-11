// client/src/pages/WalletsPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Paper, Box, Typography, Button, TextField, Grid } from "@mui/material";
import { getWallets, createWallet, deleteWallet, transferWallet, getWalletAnalytics } from "../services/walletService";
import { Pie } from 'react-chartjs-2';

export default function WalletsPage() {
  const [wallets, setWallets] = useState([]);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [analytics, setAnalytics] = useState(null);

  const loadWallets = async () => {
    const res = await getWallets();
    setWallets(res.data.data || []);
  };

  const loadAnalytics = async () => {
    try {
      const res = await getWalletAnalytics();
      setAnalytics(res.data.data);
    } catch (err) {
      console.error("Analytics load failed", err);
    }
  };

  useEffect(() => {
    loadWallets();
    loadAnalytics();
  }, []);

  const addWallet = async () => {
    if (!name) return alert("Enter wallet name");
    await createWallet({ name, balance: Number(balance) || 0 });
    setName(""); setBalance("");
    await loadWallets(); await loadAnalytics();
  };

  const removeWallet = async (id) => {
    if (!window.confirm("Delete this wallet?")) return;
    await deleteWallet(id);
    await loadWallets(); await loadAnalytics();
  };

  const doTransfer = async () => {
    if (!fromId || !toId || !transferAmount) return alert("Fill transfer fields");
    if (fromId === toId) return alert("Choose different wallets");
    await transferWallet({ fromWalletId: fromId, toWalletId: toId, amount: Number(transferAmount) });
    setTransferAmount(''); setFromId(''); setToId('');
    await loadWallets(); await loadAnalytics();
  };

  const pieData = {
    labels: wallets.map(w => w.name),
    datasets: [{ data: wallets.map(w => w.balance), backgroundColor: wallets.map((_,i)=>['#4caf50','#ff7043','#42a5f5','#9c27b0','#ffca28','#90a4ae'][i%6]) }]
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h5">Add Wallet</Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <TextField label="Wallet Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <TextField label="Initial Balance" type="number" value={balance} onChange={(e)=>setBalance(e.target.value)} />
          <Button variant="contained" onClick={addWallet}>Add</Button>
        </Box>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Wallets</Typography>
            {wallets.map(w => (
              <Box key={w._id} sx={{ display:'flex', justifyContent:'space-between', p:1, borderBottom:'1px solid #eee' }}>
                <Box>
                  <Typography>{w.name}</Typography>
                  <Typography variant="caption">Balance: ₹{w.balance}</Typography>
                </Box>
                <Box>
                  <Button color="error" onClick={()=>removeWallet(w._id)}>Delete</Button>
                </Box>
              </Box>
            ))}
          </Paper>

          <Paper sx={{ p:2, mt:2 }}>
            <Typography variant="h6">Transfer</Typography>
            <Box sx={{ display:'flex', gap:2, mt:1 }}>
              <select value={fromId} onChange={e=>setFromId(e.target.value)}>
                <option value="">From</option>
                {wallets.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
              </select>
              <select value={toId} onChange={e=>setToId(e.target.value)}>
                <option value="">To</option>
                {wallets.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
              </select>
              <TextField value={transferAmount} onChange={e=>setTransferAmount(e.target.value)} placeholder="Amount" type="number" />
              <Button variant="contained" onClick={doTransfer}>Transfer</Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p:2 }}>
            <Typography variant="h6">Wallet Analytics</Typography>
            <Typography variant="subtitle2">Total: ₹{analytics?.total ?? wallets.reduce((s,w)=>s+w.balance,0)}</Typography>
            <Box sx={{ mt:2 }}>{wallets.length>0 ? <Pie data={pieData} /> : <Typography>No wallets yet</Typography>}</Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
