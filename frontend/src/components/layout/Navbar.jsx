import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

export default function Navbar({ onMenuClick }) {
  return (
    <div
      style={{
        height: "70px",
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        padding: "0 25px",
        boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
      }}
    >
      {/* Menu Button */}
      <button
        onClick={onMenuClick}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          marginRight: "15px",
        }}
      >
        <MenuIcon style={{ fontSize: "26px", color: "#333" }} />
      </button>

      {/* Title */}
      <h2 style={{ fontWeight: 500, margin: 0, fontSize: "20px" }}>
        Expense Dashboard
      </h2>

      {/* Right Icons */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
        <SettingsIcon style={{ fontSize: "22px", marginRight: "25px", cursor: "pointer" }} />
        <NotificationsNoneIcon style={{ fontSize: "22px", marginRight: "25px", cursor: "pointer" }} />

        {/* Profile Circle */}
        <div
          style={{
            background: "#6C4BFF",
            color: "white",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          P
        </div>
      </div>
    </div>
  );
}
