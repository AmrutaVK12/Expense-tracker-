// src/pages/ExpensesPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Paper, Box, Button } from "@mui/material";
import api from "../utils/api";
import ExpenseItem from "../components/ExpenseItem";
import ExpenseForm from "../components/ExpenseForm";
import ReactPaginate from "react-paginate";
import { deleteExpense, addExpense } from "../services/expenseService";
import { getWallets } from "../services/walletService";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // EDITING STATE  ⬅⬅⬅ IMPORTANT
  const [editing, setEditing] = useState(null);

  // Wallet
  const [wallets, setWallets] = useState([]);
  const [walletId, setWalletId] = useState("");

  // Inline Add Form
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Others");
  const [date, setDate] = useState("");

  // Load Expenses
  const load = async () => {
    try {
      const res = await api.get("/expenses", {
        params: { search, sort, page, limit: 5 },
      });
      setExpenses(res.data.data || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      setExpenses([]);
      setPages(1);
    }
  };

  useEffect(() => {
    load();
  }, [search, sort, page]);

  // Load wallets (once)
  useEffect(() => {
    const loadWalletList = async () => {
      try {
        const res = await getWallets();
        setWallets(res.data.data || []);
      } catch (err) {
        console.error("Wallet loading failed", err);
      }
    };
    loadWalletList();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await deleteExpense(id);
      await load();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleAdd = async () => {
    if (!title || !amount || !date) {
      alert("Please fill title, amount and date.");
      return;
    }

    const payload = {
      title,
      amount: Number(amount),
      category,
      date,
      walletId: walletId || undefined,
    };

    try {
      await addExpense(payload);
      await load();

      // Reset form
      setTitle("");
      setAmount("");
      setCategory("Others");
      setDate("");
      setWalletId("");
    } catch (err) {
      console.error("Add failed", err);
      alert("Failed to add expense.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      {/* Show EDIT FORM when editing */}
      {editing && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <ExpenseForm
            editing={editing}
            setEditing={setEditing}
            onSaved={load}
          />
        </Paper>
      )}

      {/* Hide inline add form when editing */}
      {!editing && (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1 }}
              />

              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest</option>
              </select>
            </Box>
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                placeholder="Amount (pos = income / neg = expense)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Food</option>
                <option>Travel</option>
                <option>Salary</option>
                <option>Bills</option>
                <option>Shopping</option>
                <option>Others</option>
              </select>

              <select
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
              >
                <option value="">Select Wallet</option>
                {wallets.map((w) => (
                  <option key={w._id} value={w._id}>
                    {w.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <Button variant="contained" onClick={handleAdd}>
                ADD
              </Button>
            </Box>
          </Paper>
        </>
      )}

      {/* Expense List */}
      <div>
        {expenses.map((e) => (
          <ExpenseItem
            key={e._id}
            tx={e}
            onDeleted={load}
            onEdit={() => setEditing(e)} // <-- FIXED
            onDeleteClick={() => handleDelete(e._id)}
          />
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <Stack
          spacing={2}
          sx={{ mt: 3, display: "flex", justifyContent: "center" }}
        >
          <Pagination
            count={pages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="large"
            variant="outlined"
            shape="rounded"
          />
        </Stack>
      )}
    </Container>
  );
}
