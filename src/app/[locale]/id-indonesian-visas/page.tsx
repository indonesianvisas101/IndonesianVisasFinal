"use client";

import React from 'react';
import { Container, Grid, Typography, Box, Button, Stack, Card, CardContent } from '@mui/material';
import { ShieldCheck, CheckCircle, Info, CreditCard, ArrowRight, UserCheck, Search } from 'lucide-react';
import IDivCardModern from '@/components/idiv/IDivCardModern';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function IDIVPage() {
    const params = useParams();
    const locale = params?.locale || 'en';

    return (
        <Box sx={{ py: 12, bgcolor: '#fdfdfd' }}>
            <Container maxWidth="lg">
                <Grid container spacing={8} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="overline" color="primary" fontWeight="900" letterSpacing={2}>
                            PREMIUM ADD-ON
                        </Typography>
                        <Typography variant="h2" fontWeight="900" gutterBottom sx={{ mt: 1, lineHeight: 1.1 }}>
                            ID Indonesian <br />
                            <span style={{ color: '#D32F2F' }}>Visas (IDIV)</span>
                        </Typography>
                        <Typography variant="h6" color="text.secondary" paragraph sx={{ mt: 3, mb: 5 }}>
                            The official Digital ID Card for travelers in Indonesia. This acts as your verified sponsor ID, providing security and peace of mind during your stay.
                        </Typography>

                        <Stack spacing={3} mb={6}>
                            <Box display="flex" gap={2}>
                                <CheckCircle color="#2E7D32" />
                                <Typography variant="body1"><strong>Official Verified Sponsor ID</strong> - Link your visa to a verified sponsor.</Typography>
                            </Box>
                            <Box display="flex" gap={2}>
                                <CheckCircle color="#2E7D32" />
                                <Typography variant="body1"><strong>Proven Results</strong> - Has helped 5,000+ travelers with local authorities.</Typography>
                            </Box>
                            <Box display="flex" gap={2}>
                                <CheckCircle color="#2E7D32" />
                                <Typography variant="body1"><strong>Digital Access</strong> - Available anytime on your phone.</Typography>
                            </Box>
                        </Stack>

                        <Button 
                            variant="contained" 
                            size="large" 
                            sx={{ px: 6, py: 2, borderRadius: 4, fontWeight: 'bold', fontSize: '1.1rem' }}
                            endIcon={<ArrowRight />}
                        >
                            Get Your IDIV Now ($20.00)
                        </Button>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }} display="flex" justifyContent="center">
                        <Box sx={{ position: 'relative' }}>
                            {/* Decorative Elements */}
                            <Box sx={{ 
                                position: 'absolute', top: -40, right: -40, w: 200, h: 200, 
                                bgcolor: 'primary.main', opacity: 0.1, borderRadius: '50%', filter: 'blur(60px)' 
                            }} />
                            
                            <Stack spacing={4} alignItems="center">
                                <IDivCardModern />
                                <Box textAlign="center">
                                    <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ display: 'block', maxWidth: 300, mb: 2 }}>
                                        Disclaimer: The IDIV Card is a digital facilitation document provided by IndonesianVisas.agency and does not replace official passports.
                                    </Typography>
                                    
                                    <Link href={`/${locale}/idiv-search`} style={{ textDecoration: 'none' }}>
                                        <Button 
                                            variant="outlined" 
                                            color="primary" 
                                            size="small"
                                            startIcon={<Search size={16} />}
                                            sx={{ borderRadius: 100, fontSize: '0.7rem', textTransform: 'none' }}
                                        >
                                            Track your IDiv Status
                                        </Button>
                                    </Link>
                                </Box>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 15 }}>
                    <Typography variant="h4" fontWeight="bold" textAlign="center" mb={6}>Why Do You Need IDIV?</Typography>
                    <Grid container spacing={4}>
                        {[
                            { title: "Legal Safety", icon: ShieldCheck, desc: "Always have your verified sponsor details ready for local immigration checks." },
                            { title: "Instant Verification", icon: UserCheck, desc: "Authorities can scan and verify your digital ID in seconds." },
                            { title: "Peace of Mind", icon: Info, desc: "A proven facilitation tool that has helped thousands avoid bureaucratic delays." }
                        ].map((item, i) => (
                            <Grid key={i} size={{ xs: 12, md: 4 }}>
                                <Card sx={{ height: '100%', borderRadius: 5, border: '1px solid #eee', boxShadow: 'none', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)' } }}>
                                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                        <item.icon size={48} color="#D32F2F" style={{ marginBottom: '1.5rem' }} />
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>{item.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
