"use client";

import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import { Box } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const theme = useTheme();

    return (
        <ThemeRegistry>
            <Box
                sx={{
                    display: "flex",
                    minHeight: "100vh",
                    bgcolor: "background.default",
                }}
                data-theme={theme.palette.mode} // 🔥 INI KUNCINYA
            >
                {children}
            </Box>
        </ThemeRegistry>
    );
}
