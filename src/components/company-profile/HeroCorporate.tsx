'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Stack } from '@mui/material';
import { ShieldCheck, Award, Globe } from 'lucide-react';

export default function HeroCorporate() {
    const [stats, setStats] = useState({ years: 0, visas: 0, approval: 0 });

    useEffect(() => {
        let currentYear = 0;
        let currentVisa = 0;
        let currentApproval = 0;

        const interval = setInterval(() => {
            currentYear = Math.min(currentYear + 1, 16);
            currentVisa = Math.min(currentVisa + 500, 10000);
            currentApproval = Math.min(currentApproval + 5, 99);

            setStats({ years: currentYear, visas: currentVisa, approval: currentApproval });

            if (currentYear === 16 && currentVisa === 10000 && currentApproval === 99) {
                clearInterval(interval);
            }
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box 
            sx={{ 
                position: 'relative', 
                minHeight: '80vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: 'grey.900', // Placeholder for dark-overlay image
                color: 'common.white',
                background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(/images/hero-corporate-placeholder.jpg) center/cover',
                pt: 12, pb: 20
            }}
        >
            <Container maxWidth="lg" sx={{ textAlign: 'center', zIndex: 1, position: 'relative' }}>
                <Typography 
                    variant="h2" 
                    component="h1" 
                    fontWeight="900" 
                    gutterBottom
                    sx={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)', mb: 3 }}
                >
                    Your Trusted Legal Gateway to Indonesia
                </Typography>
                
                <Typography 
                    variant="h5" 
                    sx={{ mb: 8, opacity: 0.9, maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}
                >
                    More than just an agency, we are your certified legal partner for living, working, and thriving in Indonesia. Combining international governance standards with seamless local execution.
                </Typography>

                {/* Floating Stats Bar */}
                <Box 
                    sx={{ 
                        position: 'absolute', 
                        bottom: -100, 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        width: '100%',
                        maxWidth: 900,
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        borderRadius: 4,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        p: { xs: 3, md: 5 },
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Stack 
                        direction={{ xs: 'column', md: 'row' }} 
                        spacing={{ xs: 4, md: 0 }} 
                        justifyContent="space-around"
                        divider={<Box sx={{ width: { xs: '100%', md: '1px' }, height: { xs: '1px', md: '80px' }, bgcolor: 'divider' }} />}
                    >
                        <Box textAlign="center">
                            <Award size={32} strokeWidth={1.5} style={{ marginBottom: 12, color: 'var(--mui-palette-primary-main)' }} />
                            <Typography variant="h3" fontWeight="900" color="primary.main">{stats.years}+</Typography>
                            <Typography variant="body1" color="text.secondary" fontWeight="medium">Years of Excellence<br/>(Since 2010)</Typography>
                        </Box>
                        
                        <Box textAlign="center">
                            <Globe size={32} strokeWidth={1.5} style={{ marginBottom: 12, color: 'var(--mui-palette-primary-main)' }} />
                            <Typography variant="h3" fontWeight="900" color="primary.main">{stats.visas.toLocaleString()}+</Typography>
                            <Typography variant="body1" color="text.secondary" fontWeight="medium">Visas Successfully<br/>Processed</Typography>
                        </Box>

                        <Box textAlign="center">
                            <ShieldCheck size={32} strokeWidth={1.5} style={{ marginBottom: 12, color: 'var(--mui-palette-primary-main)' }} />
                            <Typography variant="h3" fontWeight="900" color="primary.main">{stats.approval}%</Typography>
                            <Typography variant="body1" color="text.secondary" fontWeight="medium">Industry-Leading<br/>Approval Rate</Typography>
                        </Box>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}
