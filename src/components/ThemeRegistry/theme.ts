import { PaletteMode } from "@mui/material";
import { Inter } from "next/font/google";

const inter = Inter({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
    display: "swap",
});

export const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // Light Mode (Materio)
                primary: {
                    main: "#9155FD",
                    light: "#A876FE",
                    dark: "#7E44E6",
                    contrastText: "#ffffff",
                },
                secondary: {
                    main: "#8A8D93",
                    light: "#9C9FA4",
                    dark: "#4D5056",
                    contrastText: "#ffffff",
                },
                background: {
                    default: "#ffffff",
                    paper: "#ffffff",
                },
                text: {
                    primary: "rgba(58, 53, 65, 0.87)",
                    secondary: "rgba(58, 53, 65, 0.68)",
                    disabled: "rgba(58, 53, 65, 0.38)",
                },
            }
            : {
                // Dark Mode (Materio)
                primary: {
                    main: "#9155FD", // Keep brand color
                    light: "#A876FE",
                    dark: "#7E44E6",
                    contrastText: "#ffffff",
                },
                secondary: {
                    main: "#8A8D93",
                    light: "#9C9FA4",
                    dark: "#4D5056",
                    contrastText: "#ffffff",
                },
                background: {
                    default: "#28243D", // Deep purple/grey
                    paper: "#312D4B",   // Slightly lighter for cards
                },
                text: {
                    primary: "rgba(231, 227, 252, 0.87)",
                    secondary: "rgba(231, 227, 252, 0.68)",
                    disabled: "rgba(231, 227, 252, 0.38)",
                },
                divider: "rgba(231, 227, 252, 0.12)",
            }),
    },
    typography: {
        fontFamily: inter.style.fontFamily,
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        subtitle1: { letterSpacing: "0.15px" },
        subtitle2: { letterSpacing: "0.1px", fontWeight: 500 },
        body1: { letterSpacing: "0.15px" },
        body2: { letterSpacing: "0.15px" },
        button: { letterSpacing: "0.3px", fontWeight: 500, textTransform: "none" },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: "10px",
                    boxShadow: mode === 'light'
                        ? "0px 4px 6px -1px rgba(0, 0, 0, 0.05), 0px 2px 4px -1px rgba(0, 0, 0, 0.03)"
                        : "0px 4px 6px -1px rgba(0, 0, 0, 0.2), 0px 2px 4px -1px rgba(0, 0, 0, 0.14)", // Darker shadow
                    backgroundImage: "none", // Remove default gradient in dark mode
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "0px 2px 4px -1px rgba(0, 0, 0, 0.1)",
                    },
                },
                containedPrimary: {
                    boxShadow: "0px 4px 14px 0px rgb(145 85 253 / 39%)",
                    "&:hover": {
                        boxShadow: "0px 6px 20px 0px rgb(145 85 253 / 39%)",
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: mode === 'light'
                        ? "1px solid rgba(58, 53, 65, 0.12)"
                        : "1px solid rgba(231, 227, 252, 0.12)",
                },
                head: {
                    fontWeight: 600,
                    color: mode === 'light' ? "rgba(58, 53, 65, 0.87)" : "rgba(231, 227, 252, 0.87)",
                    letterSpacing: "0.17px",
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                },
            },
        },
        // Add Scrollbar styling for dark mode if needed
    },
});
