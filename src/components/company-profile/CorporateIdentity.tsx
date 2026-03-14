'use client';

import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { Target, Leaf, Lock } from 'lucide-react';

export default function CorporateIdentity() {
    return (
        <Box sx={{ py: { xs: 15, md: 24 }, bgcolor: 'background.paper', pt: { xs: 20, md: 28 } }}>
            <Container maxWidth="lg">
                <Box textAlign="center" mb={10}>
                    <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom textTransform="uppercase" letterSpacing={2}>
                        Corporate Identity
                    </Typography>
                    <Typography variant="h3" component="h2" fontWeight="900" gutterBottom>
                        The Bali Enterprises Ecosystem
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', mt: 3, fontStyle: 'italic' }}>
                        "To simplify Indonesian bureaucracy for the world. We believe that borders should not be barriers to opportunity."
                    </Typography>
                </Box>

                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                    <Box>
                        <Paper elevation={0} sx={{ p: 4, height: '100%', bgcolor: 'grey.50', borderRadius: 4, border: '1px solid', borderColor: 'divider', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-8px)' } }}>
                            <Lock size={40} className="text-primary mb-4" />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>Bank-Level Security</Typography>
                            <Typography color="text.secondary">
                                Absolute data privacy controls. Corporate documents and passports are encrypted using enterprise-grade protocols.
                            </Typography>
                        </Paper>
                    </Box>
                    
                    <Box>
                        <Paper elevation={0} sx={{ p: 4, height: '100%', bgcolor: 'grey.50', borderRadius: 4, border: '1px solid', borderColor: 'divider', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-8px)' } }}>
                            <Target size={40} className="text-primary mb-4" />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>Zero-Tolerance Policy</Typography>
                            <Typography color="text.secondary">
                                We operate strictly by the book. No bribery, no hidden fees, and absolute compliance with Indonesian Immigration Law.
                            </Typography>
                        </Paper>
                    </Box>

                    <Box>
                        <Paper elevation={0} sx={{ p: 4, height: '100%', bgcolor: 'grey.50', borderRadius: 4, border: '1px solid', borderColor: 'divider', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-8px)' } }}>
                            <Leaf size={40} className="text-primary mb-4" />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>Transparent ecosystem</Typography>
                            <Typography color="text.secondary">
                                As a key subsidiary of Bali Enterprises, our pricing structure is 100% transparent with itemized government levies.
                            </Typography>
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
