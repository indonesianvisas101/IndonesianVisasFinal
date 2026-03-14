'use client';

import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import Image from 'next/image';
import { Linkedin } from 'lucide-react';

export default function LeadershipProfile() {
    return (
        <Box sx={{ py: { xs: 10, md: 15 }, bgcolor: 'grey.900', color: 'common.white' }}>
            <Container maxWidth="lg">
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={8} alignItems="center">
                    <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 5' } }}>
                        <Box 
                            sx={{ 
                                position: 'relative', 
                                height: { xs: '400px', md: '500px' }, 
                                borderRadius: 4, 
                                overflow: 'hidden',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                                border: '1px solid',
                                borderColor: 'rgba(255,255,255,0.1)'
                            }}
                        >
                            <Image
                                src="/images/bayu-ceo.webp" // Placeholder path
                                alt="Bayu Damopolii - Founder"
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </Box>
                    </Box>
                    
                    <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 7' } }}>
                        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 'bold', letterSpacing: 2 }}>
                            Key Leadership
                        </Typography>
                        <Typography variant="h2" component="h3" fontWeight="900" sx={{ mt: 1, mb: 2 }}>
                            Bayu Damopolii-Manoppo
                        </Typography>
                        <Typography variant="h5" sx={{ color: 'grey.400', mb: 4, fontWeight: 'medium' }}>
                            Founder & Managing Director
                        </Typography>
                        
                        <Typography variant="body1" sx={{ color: 'grey.300', mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}>
                            As the driving force behind PT Indonesian Visas Agency™, Bayu brings a vision to revolutionize immigration and business legalities in Indonesia. Under his leadership, the company has transformed from a boutique local agency into a national authority trusted by global corporations.
                        </Typography>

                        <Button 
                            variant="outlined" 
                            color="inherit" 
                            size="large"
                            startIcon={<Linkedin />}
                            href="https://www.linkedin.com/in/bayu-damopolii-887ab883/"
                            target="_blank"
                            sx={{ 
                                borderRadius: 8, 
                                px: 4, 
                                borderColor: 'rgba(255,255,255,0.3)',
                                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' }
                            }}
                        >
                            Connect on LinkedIn
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
