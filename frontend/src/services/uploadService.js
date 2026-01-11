import api from "../utils/api";

export const uploadReceipt = async (file) => {
  const formData = new FormData();
  formData.append("receipt", file);
  return api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};
