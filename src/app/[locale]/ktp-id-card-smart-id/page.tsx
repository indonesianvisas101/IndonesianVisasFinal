"use client";

import React from 'react';
import { Container, Grid, Typography, Box, Button, Stack, Card, CardContent, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ShieldCheck, CheckCircle, ArrowRight, Search, Shield, ChevronDown, Award, Globe } from 'lucide-react';
import IDivCardModern from '@/components/idiv/IDivCardModern';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function SmartIDPage() {
    const params = useParams();
    const locale = params?.locale || 'en';

    return (
        <Box sx={{ bgcolor: '#fdfdfd' }}>
            {/* 1. HERO SECTION */}
            <Box sx={{ py: 12, borderBottom: '1px solid #eee' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={8} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="overline" color="#0ea5e9" fontWeight="900" letterSpacing={2}>
                                PREMIUM KTP-STYLE ID
                            </Typography>
                            <Typography variant="h2" fontWeight="900" gutterBottom sx={{ mt: 1, lineHeight: 1.1 }}>
                                Indonesian Visas <br />
                                <span style={{ color: '#0ea5e9' }}>Smart System</span>
                            </Typography>
                            <Typography variant="h6" color="text.secondary" paragraph sx={{ mt: 3, mb: 5 }}>
                                The high-density, KTP-inspired digital identity card for long-term residents. Designed for ITAP/GCI holders with NFC-ready integration.
                            </Typography>

                            <Stack spacing={3} mb={6}>
                                <Box display="flex" gap={2}>
                                    <CheckCircle color="#0ea5e9" />
                                    <Typography variant="body1"><strong>Complete Biographical Data</strong> - Includes Birthplace, Gender, and Occupation.</Typography>
                                </Box>
                                <Box display="flex" gap={2}>
                                    <CheckCircle color="#0ea5e9" />
                                    <Typography variant="body1"><strong>NFC Integration Ready</strong> - Built for modern verification checkpoints.</Typography>
                                </Box>
                                <Box display="flex" gap={2}>
                                    <CheckCircle color="#0ea5e9" />
                                    <Typography variant="body1"><strong>Long-Term Validity</strong> - Designed for stay permits up to 10 years.</Typography>
                                </Box>
                            </Stack>

                            <Button 
                                variant="contained" 
                                size="large" 
                                component={Link}
                                href={`/${locale}/add-on`}
                                sx={{ 
                                    px: 6, py: 2, borderRadius: 4, fontWeight: 'bold', fontSize: '1.1rem',
                                    bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' }
                                }}
                                endIcon={<ArrowRight />}
                            >
                                Upgrade to Smart ID (Rp 1.000.000)
                            </Button>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }} display="flex" justifyContent="center">
                            <Box sx={{ position: 'relative' }}>
                                <Box sx={{ 
                                    position: 'absolute', top: -40, right: -40, width: 200, height: 200, 
                                    bgcolor: '#0ea5e9', opacity: 0.1, borderRadius: '50%', filter: 'blur(60px)' 
                                }} />
                                
                                <Stack spacing={4} alignItems="center">
                                    <IDivCardModern mode="SMART" showDownload={false} shareUrl="https://indonesianvisas.com/ktp-id-card-smart-id" />
                                    <Box textAlign="center">
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 300, mb: 2 }}>
                                            The Smart ID Card is an advanced verification document for long-term visa holders.
                                        </Typography>
                                        
                                        <Link href={`/${locale}/idiv-search`} style={{ textDecoration: 'none' }}>
                                            <Button 
                                                variant="outlined" 
                                                sx={{ color: '#0ea5e9', borderColor: '#0ea5e9', borderRadius: 100, fontSize: '0.7rem', textTransform: 'none' }}
                                                startIcon={<Search size={16} />}
                                            >
                                                Verify Smart ID
                                            </Button>
                                        </Link>
                                    </Box>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* 3. PRICING TIERS */}
            <Box sx={{ py: 15, bgcolor: '#f0f9ff' }}>
                <Container maxWidth="md">
                    <Typography variant="h3" fontWeight="900" textAlign="center" mb={2} color="#0f172a">Premium KTP-Style Protection</Typography>
                    <Typography variant="h6" color="text.secondary" textAlign="center" mb={8}>The ultimate digital identity companion for expats in Indonesia.</Typography>
                    
                    <Grid container spacing={4} justifyContent="center">
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Card sx={{ 
                                height: '100%', borderRadius: 6, position: 'relative', 
                                border: '2px solid #0ea5e9',
                                boxShadow: '0 20px 40px rgba(14, 165, 233, 0.1)'
                            }}>
                                <Box sx={{ 
                                    position: 'absolute', top: 16, right: 16, bgcolor: '#0ea5e9', 
                                    color: 'white', px: 2, py: 0.5, borderRadius: 100, fontSize: '0.7rem', fontWeight: 'bold' 
                                }}>
                                    MOST ADVANCED
                                </Box>
                                <CardContent sx={{ p: 5, textAlign: 'center' }}>
                                    <Award size={48} color="#0ea5e9" style={{ marginBottom: '1.5rem' }} />
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>Smart ID Premium</Typography>
                                    <Box sx={{ my: 3 }}>
                                        <Typography variant="h3" fontWeight="900" display="inline">Rp 1.000.000</Typography>
                                        <Typography variant="body1" color="text.secondary" display="inline"> / Stay</Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" mb={4}>NFC-ready KTP equivalent for ITAP/GCI holders with comprehensive data.</Typography>
                                    <Button 
                                        fullWidth 
                                        variant="contained"
                                        component={Link}
                                        href={`/${locale}/add-on`}
                                        sx={{ 
                                            borderRadius: 4, py: 1.5, fontWeight: 'bold',
                                            bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' }
                                        }}
                                    >
                                        Secure Your Smart ID
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}
