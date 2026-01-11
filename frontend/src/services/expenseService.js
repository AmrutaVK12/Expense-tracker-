import api from "../utils/api";

export const addExpense = async (payload) => {
  return await api.post("/expenses", payload);
};

export const deleteExpense = async (id) => {
  return await api.delete(`/expenses/${id}`);
};

export const getExpenses = async (query = {}) => {
  return await api.get("/expenses", { params: query });
};

export const updateExpense = async (id, payload) => {
  return await api.put(`/expenses/${id}`, payload);
};
