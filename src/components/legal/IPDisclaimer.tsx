'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Copyright } from 'lucide-react';

export default function IPDisclaimer() {
    return (
        <Box sx={{ py: 8, bgcolor: 'background.default' }}>
            <Container maxWidth="md">
                <Box 
                    sx={{ 
                        p: 4, 
                        bgcolor: 'grey.50', 
                        borderRadius: 2, 
                        borderLeft: '4px solid',
                        borderColor: 'text.primary'
                    }}
                >
                    <Box display="flex" gap={2} alignItems="center" mb={2}>
                        <Copyright size={24} className="text-slate-800" />
                        <Typography variant="h6" fontWeight="900" sx={{ textTransform: 'uppercase' }}>
                            Intellectual Property Status
                        </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        The brand name and mark <strong>INDONESIAN VISAS</strong> are currently in the final stages of the trademark registration process at the 
                        <strong> Directorate General of Intellectual Property (DJKI - Direktorat Jenderal Kekayaan Intelektual)</strong>. 
                        We enforce strict protection of our intellectual property. Unauthorized use of our trade names, 
                        logos, or service marks is strictly prohibited and subject to legal action under Indonesian IP Law.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
