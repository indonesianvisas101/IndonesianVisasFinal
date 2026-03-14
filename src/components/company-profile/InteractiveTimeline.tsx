'use client';

import React from 'react';
import { Box, Container, Typography, Stack, useTheme, useMediaQuery } from '@mui/material';

export default function InteractiveTimeline() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const TIMELINE_DATA = [
        {
            year: "2010",
            title: "The Foundation",
            description: "Founded in Denpasar, Bali by a team of legal scholars and immigration experts aiming to simplify the visa process."
        },
        {
            year: "2016",
            title: "National Expansion",
            description: "Expanded operations nationally to facilitate broader cross-border mobility and service corporate clients across the archipelago."
        },
        {
            year: "2024 - Present",
            title: "Digital Transformation",
            description: "Achieved complete digital transformation, enabling express paths (1-4 hours turnaround) and a 100% secure, bank-level encrypted online process for VIPs."
        }
    ];

    return (
        <Box sx={{ py: { xs: 12, md: 24 }, bgcolor: 'grey.50' }}>
            <Container maxWidth="md">
                <Box textAlign="center" mb={10}>
                    <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom textTransform="uppercase" letterSpacing={2}>
                        Heritage & Evolution
                    </Typography>
                    <Typography variant="h3" component="h2" fontWeight="900">
                        A Decade of Industry Leadership
                    </Typography>
                </Box>

                <Box sx={{ position: 'relative' }}>
                    {/* Vertical Line */}
                    {!isMobile && (
                        <Box sx={{ 
                            position: 'absolute', 
                            left: '50%', 
                            transform: 'translateX(-50%)', 
                            top: 0, 
                            bottom: 0, 
                            width: 4, 
                            bgcolor: 'grey.200',
                            borderRadius: 2
                        }} />
                    )}

                    <Stack spacing={8}>
                        {TIMELINE_DATA.map((item, idx) => (
                            <Box 
                                key={idx} 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    flexDirection: isMobile ? 'column' : (idx % 2 === 0 ? 'row' : 'row-reverse'),
                                    position: 'relative'
                                }}
                            >
                                {/* Dot for Desktop */}
                                {!isMobile && (
                                    <Box sx={{ 
                                        position: 'absolute', 
                                        left: '50%', 
                                        top: '50%', 
                                        transform: 'translate(-50%, -50%)', 
                                        width: 20, 
                                        height: 20, 
                                        bgcolor: 'primary.main',
                                        borderRadius: '50%',
                                        border: '4px solid white',
                                        boxShadow: '0 0 0 4px rgba(0,0,0,0.05)',
                                        zIndex: 2
                                    }} />
                                )}

                                <Box sx={{ width: isMobile ? '100%' : '45%', textAlign: isMobile ? 'center' : (idx % 2 === 0 ? 'right' : 'left'), px: { md: 4 } }}>
                                    <Typography variant="h3" fontWeight="900" color="primary">{item.year}</Typography>
                                </Box>
                                
                                <Box sx={{ width: isMobile ? '100%' : '45%', px: { md: 4 }, mt: { xs: 2, md: 0 }, textAlign: isMobile ? 'center' : 'left' }}>
                                    <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="h5" fontWeight="bold" gutterBottom>{item.title}</Typography>
                                        <Typography color="text.secondary" lineHeight={1.8}>{item.description}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}
