"use client";

import React from 'react';
import { Box, Typography, Paper, Grid, Stack } from '@mui/material';
import { User, Building2, CheckCircle2, QrCode, ShieldCheck, Globe, ArrowRight, Smartphone, Mail, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';

// 1. IDiv System Flow Diagram (SVG)
export const IDivSystemFlow = () => (
    <Box sx={{ py: 6, px: 2, bgcolor: 'slate.50', borderRadius: 8, border: '1px solid', borderColor: 'grey.100', overflow: 'hidden' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center" justifyContent="center">
            
            <FlowStep icon={<User size={32} />} label="Traveler" desc="Applies for Visa" />
            <Arrow direction="right" />
            
            <FlowStep icon={<Building2 size={32} />} label="Visa Agency" desc="Sponsorship Verified" />
            <Arrow direction="right" />
            
            <FlowStep icon={<ShieldCheck size={32} />} label="Sponsor ID" desc="Unique ID Generated" />
            <Arrow direction="right" />
            
            <FlowStep icon={<QrCode size={32} />} label="Digital / Physical Card" desc="QR Encoded" />
            <Arrow direction="right" />
            
            <FlowStep icon={<Globe size={32} />} label="Verification" desc="Real-time Validation" />
        </Stack>
    </Box>
);

const FlowStep = ({ icon, label, desc }: { icon: React.ReactNode, label: string, desc: string }) => (
    <Box sx={{ textAlign: 'center', width: '160px', zIndex: 2 }}>
        <motion.div whileHover={{ scale: 1.05 }}>
            <Paper sx={{ 
                p: 3, 
                borderRadius: '24px', 
                bgcolor: 'white', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                color: 'primary.main',
                border: '2px solid transparent',
                '&:hover': { borderColor: 'primary.light' }
            }}>
                {icon}
            </Paper>
        </motion.div>
        <Typography variant="subtitle1" fontWeight={800} sx={{ color: 'text.primary', mb: 0.5 }}>{label}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>{desc}</Typography>
    </Box>
);

const Arrow = ({ direction }: { direction: 'right' | 'down' }) => (
    <Box sx={{ 
        display: { xs: 'none', md: 'flex' }, 
        alignItems: 'center', 
        color: 'grey.300',
        transform: direction === 'down' ? 'rotate(90deg)' : 'none'
    }}>
        <ArrowRight size={24} />
    </Box>
);

// 2. IDiv Step Process Graphic
export const IDivStepGraphic = ({ steps }: { steps: { title: string, desc: string }[] }) => (
    <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
            {steps.map((step, idx) => (
                <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ 
                        p: 4, 
                        bgcolor: 'primary.main', 
                        color: 'white', 
                        borderRadius: 6, 
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <Typography variant="h2" sx={{ 
                            position: 'absolute', 
                            top: -10, 
                            right: 10, 
                            opacity: 0.2, 
                            fontSize: '5rem', 
                            fontWeight: 900 
                        }}>
                            {idx + 1}
                        </Typography>
                        <Typography variant="h6" fontWeight={800} sx={{ mb: 2, position: 'relative' }}>{step.title}</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, position: 'relative', lineHeight: 1.6 }}>{step.desc}</Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    </Box>
);

// 3. QR Verification Mockup
export const IDivQrExample = () => (
    <Box sx={{ maxWidth: '400px', mx: 'auto', p: 4, bgcolor: '#f8fafc', borderRadius: 8, border: '1px dashed', borderColor: 'grey.300' }}>
        <Typography variant="caption" sx={{ textAlign: 'center', display: 'block', mb: 3, fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase' }}>
            SCANNING SIMULATION
        </Typography>
        <Paper sx={{ p: 4, borderRadius: 6, textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
            <Box sx={{ width: '120px', height: '120px', mx: 'auto', bgcolor: 'grey.50', borderRadius: 4, p: 2, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QrCode size={80} opacity={0.8} />
            </Box>
            <Typography variant="h6" fontWeight={900} color="green.600" sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <ShieldCheck size={20} /> VALID SPONSOR
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Verified by Indonesian Visas System<br/>
                ID: IV-9971-0024-88
            </Typography>
            <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 2, color: 'success.contrastText' }}>
                <Typography variant="caption" fontWeight={700}>MATCH FOUND: ACTIVE STAY PERMIT</Typography>
            </Box>
        </Paper>
    </Box>
);

// 4. Feature Highlights Grid
export const DocFeatures = ({ items }: { items: { icon: React.ReactNode, title: string, desc: string }[] }) => (
    <Grid container spacing={3}>
        {items.map((item, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', gap: 3, p: 3, borderRadius: 4, bgcolor: 'grey.50' }}>
                    <Box sx={{ color: 'primary.main', bgcolor: 'white', p: 1.5, borderRadius: 3, height: 'fit-content', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                        {item.icon}
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>{item.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{item.desc}</Typography>
                    </Box>
                </Box>
            </Grid>
        ))}
    </Grid>
);
