"use client";

import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 4,
        bgcolor: "#f8fafc",
      }}
    >
      <Typography variant="h4" fontWeight="bold" color="error" gutterBottom>
        Application Error Diagnostics
      </Typography>
      <Box
        sx={{
          p: 3,
          bgcolor: "white",
          borderRadius: 2,
          border: "1px solid #fee2e2",
          maxWidth: "700px",
          width: "100%",
          mb: 4,
          maxHeight: "60vh",
          overflow: "auto",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
          Exception Message:
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
            color: "#b91c1c",
            bgcolor: "#fff1f1",
            p: 1.5,
            borderRadius: 1,
            mb: 2
          }}
        >
          {error.message || "Unknown client-side exception"}
        </Typography>
        
        {error.stack && (
            <>
              <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                Stack Trace:
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "monospace",
                  display: "block",
                  color: "text.secondary",
                  whiteSpace: "pre-wrap"
                }}
              >
                {error.stack}
              </Typography>
            </>
        )}
      </Box>
      <Button variant="contained" color="primary" onClick={() => reset()} sx={{ borderRadius: 2, px: 4 }}>
        Reload Page
      </Button>
    </Box>
  );
}
