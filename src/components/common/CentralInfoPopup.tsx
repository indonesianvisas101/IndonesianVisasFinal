
"use client";

import React from 'react';
import { Box, Typography, IconButton, Fade, Backdrop, Button, Portal } from '@mui/material';
import { X, Info, ShieldCheck, CheckCircle2, Zap, Clock, Star, ListChecks, Mail, Globe, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface StaticPopupInfo {
    id: string;
    title: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
}

interface CentralInfoPopupProps {
    isOpen: boolean;
    onClose: () => void;
    info: StaticPopupInfo | null;
}

export default function CentralInfoPopup({ isOpen, onClose, info }: CentralInfoPopupProps) {
    if (!info) return null;

    return (
        <Portal>
            <Backdrop
                open={isOpen}
                onClick={onClose}
                sx={{ 
                    zIndex: 10000, 
                    backdropFilter: 'blur(8px)',
                    bgcolor: 'rgba(0,0,0,0.4)'
                }}
            >
                <AnimatePresence>
                    {isOpen && (
                        <Box
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                                width: '90%',
                                maxWidth: 550,
                                position: 'relative'
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                            >
                                <Box
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                                        backgroundImage: 'radial-gradient(at 0% 0%, rgba(145, 85, 253, 0.05) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(3, 105, 161, 0.05) 0, transparent 50%)',
                                        backdropFilter: 'blur(20px)',
                                        borderRadius: 8,
                                        border: '1px solid rgba(255, 255, 255, 0.5)',
                                        boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
                                        p: { xs: 3, sm: 6 },
                                        position: 'relative',
                                        overflowY: 'auto',
                                        maxHeight: { xs: '45vh', sm: '85vh' },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        '&::-webkit-scrollbar': {
                                            width: '6px',
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            background: 'rgba(0,0,0,0.02)',
                                            borderRadius: '10px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            background: 'rgba(3, 105, 161, 0.2)',
                                            borderRadius: '10px',
                                            '&:hover': {
                                                background: 'rgba(3, 105, 161, 0.3)',
                                            }
                                        }
                                    }}
                                >
                                    <IconButton
                                        onClick={onClose}
                                        sx={{ 
                                            position: 'absolute', 
                                            top: 20, 
                                            right: 20, 
                                            bgcolor: 'rgba(0,0,0,0.03)',
                                            zIndex: 100,
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' }
                                        }}
                                    >
                                        <X size={20} />
                                    </IconButton>

                                    <Box sx={{ textAlign: 'center' }}>
                                        <Box display="flex" justifyContent="center" mb={3}>
                                            <Box sx={{ 
                                                p: 2, 
                                                borderRadius: '24px', 
                                                bgcolor: 'rgba(3, 105, 161, 0.08)', 
                                                color: '#0369a1',
                                                boxShadow: '0 8px 16px rgba(3, 105, 161, 0.1)'
                                            }}>
                                                {info.icon || <Info size={32} />}
                                            </Box>
                                        </Box>

                                        <Typography 
                                            variant="h4" 
                                            fontWeight="900" 
                                            gutterBottom 
                                            sx={{ 
                                                color: '#1e293b', 
                                                letterSpacing: -1,
                                                fontSize: { xs: '1.75rem', sm: '2.25rem' },
                                                lineHeight: 1.1,
                                                mb: 3
                                            }}
                                        >
                                            {info.title}
                                        </Typography>

                                        <Box sx={{ textAlign: 'left', color: '#475569' }}>
                                            {info.content}
                                        </Box>

                                        <Box sx={{ mt: 5 }}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={onClose}
                                                sx={{
                                                    borderRadius: 4,
                                                    py: 2,
                                                    bgcolor: '#0369a1',
                                                    '&:hover': { bgcolor: '#075985' },
                                                    fontWeight: '900',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: 2,
                                                    fontSize: '0.8rem',
                                                    boxShadow: '0 10px 20px rgba(3, 105, 161, 0.2)'
                                                }}
                                            >
                                                Got it, Close
                                            </Button>
                                        </Box>
                                    </Box>

                                    {/* Decorative Elements for AI readability */}
                                    <div style={{ display: 'none' }}>
                                        <h3>AI Analysis Metadata</h3>
                                        <p>Section ID: {info.id}</p>
                                        <p>Orchestration Logic: Governance Multi-Agent</p>
                                    </div>
                                </Box>
                            </motion.div>
                        </Box>
                    )}
                </AnimatePresence>
            </Backdrop>
        </Portal>
    );
}
