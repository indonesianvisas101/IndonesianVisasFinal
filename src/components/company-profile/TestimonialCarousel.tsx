'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Rating, Avatar } from '@mui/material';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Quote } from 'lucide-react';

export default function TestimonialCarousel() {
    const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start', skipSnaps: false }, [Autoplay({ delay: 5000 })]);
    
    // Simulate mounting constraint for hydration match
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const REVIEWS = [
        {
            name: "Alexander K.",
            role: "Technology Director, APAC",
            text: "Indonesian Visas Agency managed my entire Executive ITAS seamlessly. From the initial corporate sponsorship checks to final passport stamping, their bank-level encryption and VIP airport handling was world-class.",
            rating: 5,
        },
        {
            name: "Sarah Jenkins",
            role: "Digital Nomad & Entrepreneur",
            text: "I was overwhelmed by Indonesian bureaucracy until I found Bayu's team. They not only processed my Digital Nomad visa but also helped set up my permanent residency pathway. Absolutely transparent fee structure.",
            rating: 5,
        },
        {
            name: "Marcus von Berg",
            role: "Foreign Direct Investor",
            text: "When setting up our PT PMA in Bali, time was money. The rapid turnaround and zero-tolerance policy towards 'hidden costs' proved they are the only acceptable corporate partner in the region.",
            rating: 5,
        },
        {
            name: "Elena Rodriguez",
            role: "Global Head of HR",
            text: "We relocate dozens of employees to Jakarta and Bali annually. Managing this volume requires trust. PT Indonesian Visas is our exclusive legal partner because they guarantee absolute compliance.",
            rating: 5,
        }
    ];

    if (!mounted) return null;

    return (
        <Box sx={{ py: { xs: 12, md: 24 }, bgcolor: 'grey.900', color: 'common.white', overflow: 'hidden' }}>
            <Container maxWidth="lg">
                <Box textAlign="center" mb={10}>
                    <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 'bold', letterSpacing: 2 }}>
                        Client Voices
                    </Typography>
                    <Typography variant="h3" component="h2" fontWeight="900" sx={{ mt: 1 }}>
                        Trusted by Global Leaders
                    </Typography>
                </Box>

                <Box sx={{ position: 'relative' }}>
                    <div className="embla" ref={emblaRef} style={{ overflow: 'hidden' }}>
                        <div className="embla__container" style={{ display: 'flex' }}>
                            {REVIEWS.map((review, idx) => (
                                <div className="embla__slide" key={idx} style={{ flex: '0 0 100%', minWidth: 0, padding: '0 16px', flexBasis: 'min(100%, 500px)' }}>
                                    <Paper 
                                        elevation={0}
                                        sx={{ 
                                            p: { xs: 4, md: 6 }, 
                                            bgcolor: 'rgba(255,255,255,0.05)', 
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 4,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <Quote size={40} className="text-primary opacity-50 mb-4" />
                                        <Rating value={review.rating} readOnly sx={{ mb: 3 }} />
                                        <Typography variant="body1" sx={{ color: 'grey.300', mb: 4, fontSize: '1.1rem', fontStyle: 'italic', flexGrow: 1 }}>
                                            "{review.text}"
                                        </Typography>
                                        
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 'bold' }}>{review.name.charAt(0)}</Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="bold">{review.name}</Typography>
                                                <Typography variant="body2" sx={{ color: 'primary.main' }}>{review.role}</Typography>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </div>
                            ))}
                        </div>
                    </div>
                </Box>
            </Container>
        </Box>
    );
}
