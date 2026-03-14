'use client';

import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function CorporateCTA() {
    return (
        <Box 
            sx={{ 
                py: { xs: 15, md: 24 }, 
                bgcolor: 'primary.main', 
                color: 'common.white',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background Pattern Hint */}
            <Box 
                sx={{ 
                    position: 'absolute', 
                    top: -100, 
                    right: -100, 
                    opacity: 0.05,
                    transform: 'rotate(15deg)'
                }}
            >
                <ShieldAlert size={600} />
            </Box>

            <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Typography variant="h2" component="h2" fontWeight="900" gutterBottom>
                    Ready to Start Your Journey with the Industry Leader?
                </Typography>
                
                <Typography variant="h6" sx={{ mb: 6, opacity: 0.9, fontWeight: 'medium' }}>
                    Connect with our corporate handling desk for priority immigration routing and enterprise solutions.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        size="large"
                        endIcon={<ArrowRight />}
                        href="https://wa.me/6285727041992" // Contact/WhatsApp link
                        target="_blank"
                        sx={{ 
                            px: 5, py: 2, borderRadius: 8, fontSize: '1.1rem', fontWeight: 'bold',
                            bgcolor: 'white', color: 'primary.main',
                            '&:hover': { bgcolor: 'grey.100' }
                        }}
                    >
                        Partner with Us
                    </Button>
                    <Button 
                        variant="outlined" 
                        color="inherit" 
                        size="large"
                        href="/services"
                        sx={{ px: 5, py: 2, borderRadius: 8, fontSize: '1.1rem', borderWidth: 2, '&:hover': { borderWidth: 2, bgcolor: 'rgba(255,255,255,0.1)' } }}
                    >
                        Explore Visa Services
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
}
