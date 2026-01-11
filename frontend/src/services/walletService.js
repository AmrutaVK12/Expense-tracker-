import api from "../utils/api";

export const getWallets = () => api.get("/wallets");
export const createWallet = (data) => api.post("/wallets", data);
export const updateWallet = (id, data) => api.put(`/wallets/${id}`, data);
export const deleteWallet = (id) => api.delete(`/wallets/${id}`);

export const transferWallet = (payload) => api.post('/wallets/transfer', payload);

// analytics
export const getWalletAnalytics = () => api.get('/wallets/analytics');