'use client';

import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';

export default function CorporateRegistryTable() {
    const REGISTRY_DATA = [
        { label: "Entity Name", value: "PT Indonesian Visas Agency™" },
        { label: "Business Registration Number (NIB)", value: "0402260034806" },
        { label: "Tax Identification Number (NPWP)", value: "1000000008117681" },
        { label: "Registered Taxpayer Certificate (SKT)", value: "S-04449/SKT-WP-CT/KPP.1701/2026" },
        { label: "Ministry of Law and Human Rights (AHU)", value: "AHU-00065.AH.02.01.TAHUN 2020" },
        { label: "Verified Immigration Sponsor", value: "Registered and active (2010, 2014, 2023, 2024, 2026)" },
    ];

    return (
        <Box sx={{ py: 8, bgcolor: 'background.default' }}>
            <Container maxWidth="md">
                <Typography variant="h5" fontWeight="900" sx={{ mb: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Corporate Registry Data
                </Typography>
                
                <Box component="dl" sx={{ m: 0 }}>
                    {REGISTRY_DATA.map((item, idx) => (
                        <Box key={idx}>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    py: 2.5,
                                    gap: { xs: 1, sm: 4 }
                                }}
                            >
                                <Typography 
                                    component="dt" 
                                    variant="subtitle2" 
                                    sx={{ 
                                        width: { sm: '300px' }, 
                                        flexShrink: 0, 
                                        color: 'text.secondary',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {item.label}
                                </Typography>
                                <Typography 
                                    component="dd" 
                                    variant="body1" 
                                    sx={{ 
                                        m: 0, 
                                        fontWeight: 'bold',
                                        color: 'text.primary',
                                        wordBreak: 'break-all'
                                    }}
                                >
                                    {item.value}
                                </Typography>
                            </Box>
                            {idx < REGISTRY_DATA.length - 1 && <Divider />}
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
