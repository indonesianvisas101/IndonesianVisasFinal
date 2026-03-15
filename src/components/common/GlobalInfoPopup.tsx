
"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button, Fade, useTheme } from '@mui/material';
import { X, Info, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function GlobalInfoPopup({ locale }: { locale: string }) {
    const [config, setConfig] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch('/api/admin/settings');
                if (res.ok) {
                    const settings = await res.json();
                    const popupSetting = settings.find((s: any) => s.key === 'GLOBAL_INFO_POPUP');
                    if (popupSetting && popupSetting.isEnabled) {
                        let val;
                        try {
                            val = JSON.parse(popupSetting.value);
                            if (typeof val === 'string') val = { description: val, title: "Official Announcement", isActive: true };
                            if (!val.title) val.title = "Official Announcement";
                            if (val.isActive === undefined) val.isActive = true;
                        } catch (e) {
                            // Fallback for plain text
                            val = {
                                title: "Official Announcement",
                                description: popupSetting.value,
                                isActive: true
                            };
                        }

                        if (val.isActive) {
                            setConfig(val);
                            const suppressed = localStorage.getItem('popup_suppressed_v1');
                            if (!suppressed) {
                                setTimeout(() => {
                                    setIsVisible(true);
                                    setTimeout(() => setIsVisible(false), 20000); // 20s for long text
                                }, 3000);
                            }
                        }
                    }
                }
            } catch (e) {
                console.error("Failed to load global popup config", e);
            }
        };

        fetchConfig();
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // localStorage.setItem('popup_suppressed_v1', 'true'); // Optional: suppressing for session
    };

    if (!config) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 24,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 9999,
                        width: '90%',
                        maxWidth: 600,
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    >
                        <Box
                            sx={{
                                background: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(20px) saturate(180%)',
                                borderRadius: 6,
                                border: '1px solid rgba(255, 255, 255, 0.4)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                                p: 4,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Decorative Blur */}
                            <Box sx={{ 
                                position: 'absolute', top: '-20%', left: '-10%', width: 150, height: 150, 
                                background: 'radial-gradient(circle, rgba(145, 85, 253, 0.15) 0%, transparent 70%)',
                                zIndex: 0
                            }} />

                            <IconButton
                                size="small"
                                onClick={handleClose}
                                sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(0,0,0,0.05)', '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' } }}
                            >
                                <X size={18} />
                            </IconButton>

                            <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                                <Box display="flex" justifyContent="center" mb={2}>
                                    <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: 'rgba(145, 85, 253, 0.1)', color: '#9155FD' }}>
                                        <Info size={24} />
                                    </Box>
                                </Box>
                                
                                <Typography variant="h5" fontWeight="900" gutterBottom sx={{ color: '#1a1a1a', letterSpacing: -0.5 }}>
                                    {config.title}
                                </Typography>
                                
                                <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.6, mb: 3, textAlign: 'left' }}>
                                    {config.description}
                                </Typography>

                                <Box display="flex" gap={2} justifyContent="center">
                                    <Button
                                        variant="contained"
                                        component={Link}
                                        href={`/${locale}/indonesia-visa-updates`}
                                        onClick={handleClose}
                                        sx={{ 
                                            borderRadius: 4, px: 3, py: 1.2, 
                                            bgcolor: '#1a1a1a', color: 'white', '&:hover': { bgcolor: '#333' },
                                            fontWeight: 'bold', textTransform: 'none'
                                        }}
                                        endIcon={<ArrowRight size={18} />}
                                    >
                                        Immigration Updates
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={handleClose}
                                        sx={{ 
                                            borderRadius: 4, px: 3, py: 1.2, 
                                            border: '2px solid #1a1a1a', color: '#1a1a1a', '&:hover': { border: '2px solid #333', bgcolor: 'transparent' },
                                            fontWeight: 'bold', textTransform: 'none'
                                        }}
                                    >
                                        Close
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </motion.div>
                </Box>
            )}
        </AnimatePresence>
    );
}
