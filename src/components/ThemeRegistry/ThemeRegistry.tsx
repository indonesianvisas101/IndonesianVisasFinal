"use client";

import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, createTheme, Theme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { getDesignTokens } from "./theme";
import { PaletteMode } from "@mui/material";

// --- Context Definition ---
interface ColorModeContextType {
    toggleColorMode: () => void;
    mode: PaletteMode;
}

export const ColorModeContext = createContext<ColorModeContextType>({
    toggleColorMode: () => { },
    mode: 'light',
});

export const useColorMode = () => useContext(ColorModeContext);

// --- ThemeRegistry Component ---
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    const options = { key: "mui" };

    // 1. Emotion Cache
    const [{ cache, flush }] = useState(() => {
        const cache = createCache(options);
        cache.compat = true;
        const prevInsert = cache.insert;
        let inserted: string[] = [];
        cache.insert = (...args) => {
            const serialized = args[1];
            if (cache.inserted[serialized.name] === undefined) {
                inserted.push(serialized.name);
            }
            return prevInsert(...args);
        };
        const flush = () => {
            const prevInserted = inserted;
            inserted = [];
            return prevInserted;
        };
        return { cache, flush };
    });

    useServerInsertedHTML(() => {
        const names = flush();
        if (names.length === 0) {
            return null;
        }
        let styles = "";
        for (const name of names) {
            styles += cache.inserted[name];
        }
        return (
            <style
                key={cache.key}
                data-emotion={`${cache.key} ${names.join(" ")}`}
                dangerouslySetInnerHTML={{
                    __html: styles,
                }}
            />
        );
    });

    // 2. Color Mode State
    // Default to light, but could check local storage or system preference in strict useEffect
    const [mode, setMode] = useState<PaletteMode>('light');

    // Load preference from local storage on mount
    useEffect(() => {
        const savedMode = localStorage.getItem('themeMode');
        if (savedMode === 'dark' || savedMode === 'light') {
            setMode(savedMode);
        }
    }, []);

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === 'light' ? 'dark' : 'light';
                    localStorage.setItem('themeMode', newMode);
                    return newMode;
                });
            },
            mode,
        }),
        [mode]
    );

    // 3. Create Theme based on mode
    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    return (
        <CacheProvider value={cache}>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </ColorModeContext.Provider>
        </CacheProvider>
    );
}
