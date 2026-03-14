'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { ShieldAlert } from 'lucide-react';

export default function LegalHeader() {
    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Box sx={{ pt: { xs: 20, md: 28 }, pb: 8, bgcolor: 'background.default' }}>
            <Container maxWidth="md">
                <Box mb={6}>
                    <Typography 
                        variant="h1" 
                        fontWeight="900" 
                        sx={{ 
                            fontSize: { xs: '2.5rem', md: '4rem' },
                            color: 'text.primary',
                            letterSpacing: '-0.02em',
                            mb: 2
                        }}
                    >
                        Legal & Compliance Portal
                    </Typography>
                    <Typography 
                        variant="subtitle1" 
                        sx={{ 
                            color: 'text.secondary', 
                            fontWeight: 'bold', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.1em' 
                        }}
                    >
                        Last Updated: {today}
                    </Typography>
                </Box>

                <Box 
                    sx={{ 
                        p: { xs: 3, md: 5 }, 
                        border: '2px solid',
                        borderColor: 'error.main',
                        borderRadius: 2,
                        bgcolor: 'rgba(211, 47, 47, 0.02)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box display="flex" gap={3} alignItems="flex-start">
                        <ShieldAlert className="text-error flex-shrink-0" size={32} />
                        <Box>
                            <Typography variant="h6" fontWeight="900" color="error.main" gutterBottom sx={{ textTransform: 'uppercase' }}>
                                Mandatory Regulatory Disclaimer
                            </Typography>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    color: 'text.primary', 
                                    lineHeight: 1.8, 
                                    fontWeight: 'medium',
                                    fontSize: '1.05rem'
                                }}
                            >
                                PT Indonesian Visas Agency™ is a privately owned and operated administrative service provider. 
                                We are <strong>not affiliated with, endorsed by, or representing the Indonesian Government</strong>. 
                                The sole legal authority for issuing visas and immigration approvals remains strictly with the 
                                <strong> Directorate General of Immigration of the Republic of Indonesia (evisa.imigrasi.go.id)</strong>. 
                                Our services provide B2B and B2C administrative assistance, legal consultation, and document preparation.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
