import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export default function Topbar({ dark, setDark, toggleSidebar }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setAnchorEl(null);
  };

  const goSettings = () => {
    navigate("/settings");
    setAnchorEl(null);
  };
  const goProfile = () => {
    navigate("/profile");
    setAnchorEl(null);
  };
  const goRegister = () => {
    navigate("/register");
    setAnchorEl(null);
  };

  // Theme toggle function
  const toggleDark = () => {
    setDark(!dark);
  };

  return (
    <AppBar position="fixed" color="inherit" elevation={1}>
      <Toolbar>
        <IconButton sx={{ mr: 2 }} onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Expense Dashboard
        </Typography>

        {/* -------------------------- */}
        {/* OLD THEME TOGGLE REMOVED   */}
        {/* -------------------------- */}

        {/* NOTIFICATION ICON */}
        <IconButton sx={{ mx: 1, "&:hover": { color: "#6A5ACD" } }}>
          <NotificationsOutlinedIcon />
        </IconButton>

        {/* SETTINGS ICON */}
        <IconButton sx={{ mx: 1, "&:hover": { color: "#6A5ACD" } }}>
          <SettingsOutlinedIcon />
        </IconButton>

        {/* PROFILE AVATAR */}
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            ml: 1,
            "&:hover": { transform: "scale(1.05)", transition: "0.2s" },
          }}
        >
          <Avatar sx={{ bgcolor: "#6A5ACD" }}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>
        </IconButton>

        {/* -------------------------------------------------- */}
        {/*    NEW FLIP-CARD THEME TOGGLE BUTTON (INSERTED)   */}
        {/* -------------------------------------------------- */}
        <div className="profile" style={{ marginLeft: "14px" }}>
          <div className="theme-toggle-wrapper" onClick={toggleDark}>
            <div className="theme-toggle-card">
              {/* FRONT FACE — Sun (Light mode) */}
              <div className="theme-toggle-front">
                <LightModeIcon style={{ fontSize: 22 }} />
              </div>

              {/* BACK FACE — Moon (Dark mode) */}
              <div className="theme-toggle-back">
                <DarkModeIcon style={{ fontSize: 22 }} />
              </div>
            </div>
          </div>
        </div>

        <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={goProfile}>Profile</MenuItem>
          <MenuItem onClick={goSettings}>Settings</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>

          {!user && <MenuItem onClick={goRegister}>Register</MenuItem>}

          {user && <MenuItem onClick={handleLogout}>Logout</MenuItem>}
           <MenuItem onClick={() => navigate("/login")}>Login</MenuItem>
              
        </Menu>

      
      </Toolbar>
    </AppBar>
  );
}
