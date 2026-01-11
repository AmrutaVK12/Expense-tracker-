import React, { useEffect, useState } from 'react';
import { Paper, Box, Button } from '@mui/material';
import api from '../utils/api';

const categories = ['Food', 'Travel', 'Salary', 'Bills', 'Shopping', 'Others'];

export default function ExpenseForm({ onSaved, editing, setEditing }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Others');
  const [date, setDate] = useState('');
  const [receipt, setReceipt] = useState("");


  useEffect(() => {
    if (editing && editing._id) {
      setTitle(editing.title || '');
      setAmount(editing.amount?.toString() ?? '');
      setCategory(editing.category || 'Others');
      setDate(editing.date ? editing.date.slice(0, 10) : '');
    } else {
      setTitle('');
      setAmount('');
      setCategory('Others');
      setDate('');
    }
  }, [editing]);

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      amount: Number(amount),
      category,
      date: date || undefined, 
      receipt
    };

    try {
      if (editing && editing._id) {
        // UPDATE
        await api.put(`/expenses/${editing._id}`, payload);
      } else {
        // ADD NEW
        await api.post('/expenses', payload);
      }

      onSaved && onSaved();

      // Reset form
      setTitle('');
      setAmount('');
      setCategory('Others');
      setDate('');

      // Close form after save
      setEditing(null);

    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const cancel = () => {
    setEditing(null);
    setTitle('');
    setAmount('');
    setCategory('Others');
    setDate('');
  };

  return (
    <Box component="form" onSubmit={submit} sx={{ mb: 2 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 160px 120px', gap: 8 }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input placeholder="Amount (pos income, neg expense)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <Box sx={{ mt: 1 }}>
        <Button type="submit" variant="contained" sx={{ mr: 1 }}>
          {editing && editing._id ? 'Update' : 'Add'}
        </Button>
        {editing && <Button onClick={cancel}>Cancel</Button>}
      </Box>
    </Box>
  );
}
