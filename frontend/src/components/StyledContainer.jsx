import React from "react";
import { Box } from "@mui/material";

export default function StyledContainer({ children }) {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        paddingTop: "100px",        // navbar space
        paddingBottom: "40px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",        // center container
          padding: "20px",
        }}
      >
        {/* MAIN APP SHELL */}
        <div className="app-shell">

          <main className="main-layout">
            {/* Sidebar placeholder */}
            <aside className="card" style={{ display: "none" }} aria-hidden></aside>

            {/* PAGE CONTENT */}
            <section style={{ width: "100%" }}>
              {children}
            </section>
          </main>

          {/* footer (optional) */}
          {/* <footer className="footer card">Made with — ExpenseTracker</footer> */}
        </div>
      </Box>
    </Box>
  );
}
