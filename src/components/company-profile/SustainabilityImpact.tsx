'use client';

import React from 'react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function SustainabilityImpact() {
    const CSR_DATA = [
        {
            title: "Beach Cleanups",
            desc: "Preserving Indonesia's pristine coastlines from plastic pollution through consistent community-driven efforts.",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
        },
        {
            title: "Forest Restoration",
            desc: "Active reforestation efforts partnering with local NGOs to secure a greener, sustainable future.",
            image: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop"
        },
        {
            title: "Coral Planting",
            desc: "Rehabilitating underwater ecosystems vital to the archipelago's diverse and fragile marine life.",
            image: "https://images.unsplash.com/photo-1546500840-ae38253aba9b?q=80&w=1200&auto=format&fit=crop"
        }
    ];

    return (
        <Box sx={{ py: { xs: 12, md: 24 }, bgcolor: 'background.paper' }}>
            <Container maxWidth="lg">
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={8} alignItems="center">
                    <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 5' } }}>
                        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 'bold', letterSpacing: 2 }}>
                            Corporate Social Responsibility
                        </Typography>
                        <Typography variant="h3" component="h2" fontWeight="900" sx={{ mt: 1, mb: 3 }}>
                            Beyond Business: Protecting the Archipelago
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
                            A portion of every visa processed through our gateway is directly allocated to real-world conservation and education projects across Indonesia. When you partner with us, you invest in the nation's future.
                        </Typography>

                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="large"
                            endIcon={<ArrowRight />}
                            href="https://balihelp.id/csr"
                            target="_blank"
                            sx={{ borderRadius: 8, px: 4, py: 1.5 }}
                        >
                            View Our CSR Initiatives
                        </Button>
                    </Box>

                    <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 7' } }}>
                        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={3}>
                            {CSR_DATA.map((csr, idx) => (
                                <Box key={idx} sx={{ gridColumn: { xs: 'span 12', sm: idx === 0 ? 'span 12' : 'span 6' } }}>
                                    <Box 
                                        sx={{ 
                                            position: 'relative', 
                                            height: idx === 0 ? 300 : 250, 
                                            borderRadius: 4, 
                                            overflow: 'hidden',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <Image 
                                            src={csr.image} 
                                            alt={csr.title} 
                                            fill 
                                            style={{ objectFit: 'cover' }}
                                            onError={(e) => {
                                                // Fallback to absolute grey for placeholder look if image missing
                                                (e.target as HTMLImageElement).src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%232c3e50%22%2F%3E%3C%2Fsvg%3E';
                                            }}
                                        />
                                        <Box 
                                            sx={{ 
                                                position: 'absolute', 
                                                bottom: 0, 
                                                width: '100%', 
                                                p: 3, 
                                                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                                color: 'white'
                                            }}
                                        >
                                            <Typography variant="h6" fontWeight="bold">{csr.title}</Typography>
                                            {idx === 0 && <Typography variant="body2" sx={{ opacity: 0.9 }}>{csr.desc}</Typography>}
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
