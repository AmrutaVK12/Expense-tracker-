import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 3, md: 10 },
        py: { xs: 6, md: 0 },
        position: "relative",
        overflow: "hidden",
      }}
    >

      {/* Curve Background */}
      <Box
        sx={{
          position: "absolute",
          right: "-200px",
          top: "-150px",
          width: "750px",
          height: "750px",
          background: "linear-gradient(135deg, #6A5ACD, #3F51B5)",
          borderRadius: "50%",
          filter: "blur(70px)",
          opacity: 0.25,
          zIndex: 0,
        }}
      />

      {/* LEFT SECTION — TEXT */}
      <Box sx={{ zIndex: 2, maxWidth: "480px" }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            lineHeight: 1.2,
            mb: 2,
            color: "#1e1e1e",
          }}
        >
          The only app that{" "}
          <span style={{ color: "#6A5ACD" }}>
            gets your money into shape
          </span>
        </Typography>

        <Typography sx={{ mb: 4, color: "#555" }}>
          Track expenses, manage budgets, and stay on top of your finances.
        </Typography>

        <Button
          variant="contained"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "18px",
            borderRadius: "12px",
            background: "linear-gradient(90deg,#6A5ACD,#9B78FF)",
            boxShadow: "0 4px 20px rgba(106, 90, 205, 0.4)",
          }}
          onClick={() => navigate("/login")}
        >
          Get Started
        </Button>

        <Button
          variant="outlined"
          sx={{
            ml: 2,
            px: 4,
            py: 1.4,
            fontSize: "16px",
            borderRadius: "12px",
            borderColor: "#6A5ACD",
            color: "#6A5ACD",
            "&:hover": {
              borderColor: "#9B78FF",
              color: "#9B78FF",
            },
          }}
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
      </Box>

      {/* RIGHT SECTION — APP MOCKUP IMAGES */}
      <Box
        sx={{
          position: "relative",
          display: { xs: "none", md: "block" },
          zIndex: 2,
        }}
      >
        <img
          src="/mockup1.png"
          alt="mockup"
          style={{
            width: "320px",
            position: "absolute",
            top: 0,
            right: "180px",
            borderRadius: "30px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
          }}
        />
        <img
          src="/mockup2.png"
          alt="mockup"
          style={{
            width: "330px",
            position: "absolute",
            top: "90px",
            right: "20px",
            borderRadius: "30px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
          }}
        />
      </Box>
    </Box>
  );
}
