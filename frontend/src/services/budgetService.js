// client/src/services/budgetService.js

import api from "../utils/api";

// Save or update budget
export const saveBudget = (data) => {
  return api.post("/budgets", data);
};

// Get budget for a specific month
export const getBudget = (month) => {
  return api.get("/budgets", { params: { month } });
};
