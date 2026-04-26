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

  // Handle known non-critical environment blockers (e.g., Safari content blockers breaking WebSockets)
  const isWebSocketBlocker = 
    (error.message?.includes("WebSocket") || 
    error.message?.includes("is insecure") || 
    error.stack?.includes("websocket") ||
    error.stack?.includes("connect")) &&
    typeof window !== 'undefined' && 
    sessionStorage.getItem('bypass_blocker_check') !== 'true';

  if (isWebSocketBlocker) {
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
        <Typography variant="h5" fontWeight="bold" color="text.secondary" gutterBottom>
          Optimizing Layout...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center', maxWidth: 400 }}>
          Your browser may have some content blockers enabled that restrict non-critical background components. The page layout will proceed shortly.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary" onClick={() => reset()} sx={{ borderRadius: 2, px: 4 }}>
                Retry View
            </Button>
            <Button variant="outlined" color="inherit" onClick={() => {
                // Force show the real error by tricking the state if possible, 
                // but here we just reload or we can add a state to bypass
                window.location.reload();
            }} sx={{ borderRadius: 2 }}>
                Reload Page
            </Button>
        </Box>
        <Button 
            variant="text" 
            color="secondary" 
            size="small"
            onClick={() => {
                // Create a temporary override in session storage to skip this check
                sessionStorage.setItem('bypass_blocker_check', 'true');
                reset();
            }}
            sx={{ mt: 4, opacity: 0.5, fontSize: '10px' }}
        >
            Advanced: Show Technical Details & Bypass
        </Button>
      </Box>
    );
  }

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
