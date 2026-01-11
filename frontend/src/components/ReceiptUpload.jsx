import React, { useState } from "react";
import { uploadReceipt } from "../services/uploadService";
import { Button } from "@mui/material";

export default function ReceiptUpload({ onUploaded }) {
  const [preview, setPreview] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    const res = await uploadReceipt(file);
    onUploaded(res.data.fileUrl);
  };

  return (
    <div style={{ marginTop: 10 }}>
      <input type="file" onChange={handleFile} accept="image/*" />

      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{
            width: 120,
            height: 120,
            objectFit: "cover",
            borderRadius: 8,
            marginTop: 10,
          }}
        />
      )}
    </div>
  );
}
