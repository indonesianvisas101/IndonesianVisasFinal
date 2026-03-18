"use client";

import React from 'react';
import { Container, Grid, Typography, Box, Button, Stack, Card, CardContent } from '@mui/material';
import { ShieldCheck, MessageCircle, ArrowRight, Star, Settings, QrCode } from 'lucide-react';
import IDivCardModern from '@/components/idiv/IDivCardModern';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SmartIDHub() {
    const params = useParams();
    const locale = params?.locale || 'en';

    return (
        <Box sx={{ bgcolor: '#fdfdfd', minHeight: '100vh', py: 12 }}>
            <Container maxWidth="lg">
                {/* 1. HERO SECTION */}
                <Box sx={{ textAlign: 'center', mb: 10, spaceY: 3 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography variant="overline" color="primary" fontWeight="900" letterSpacing={3} sx={{ bgcolor: 'rgba(25, 118, 210, 0.08)', px: 2, py: 1, borderRadius: 100 }}>
                            DIGITAL ECOSYSTEM
                        </Typography>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        style={{ fontSize: '3.5rem', fontWeight: 900, marginTop: '1.5rem', letterSpacing: '-1px' }}
                    >
                        Meet Your <span style={{ background: 'linear-gradient(45deg, #1976d2, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Smart ID</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        style={{ maxWidth: '600px', margin: '1rem auto 0', color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6 }}
                    >
                        The most advanced digital verification and support companion for travelers in Indonesia. Choose the card that matches your journey nodes node.
                    </motion.p>
                </Box>

                {/* 2. DUAL CARD GRID */}
                <Grid container spacing={6}>
                    {/* IDIV CARD */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            style={{ height: '100%' }}
                        >
                            <Card sx={{ 
                                height: '100%', borderRadius: 8, p: 4, 
                                border: '1px solid #f1f5f9', bgcolor: 'white',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
                                display: 'flex', flexDirection: 'column',
                                transition: 'transform 0.3s ease',
                                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 30px 60px rgba(0,0,0,0.06)' }
                            }}>
                                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', transform: 'scale(0.9)' }}>
                                    <IDivCardModern showDownload={false} autoRotate={false} />
                                </Box>
                                <CardContent sx={{ flexGrow: 1, p: 0, display: 'flex', flexDirection: 'column' }}>
                                    <Stack direction="row" alignItems="center" gap={1} mb={1}>
                                        <Star size={16} color="#D32F2F" fill="#D32F2F" />
                                        <Typography variant="subtitle2" color="#D32F2F" fontWeight="800">PREMIUM ADD-ON</Typography>
                                    </Stack>
                                    <Typography variant="h4" fontWeight="900" gutterBottom>Smart IDiv</Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph sx={{ minHeight: 60 }}>
                                        The official **Sponsor Verification ID** for travelers with active visas issued by IndonesianVisas.com. Legally guarantees your sponsorship standing node.
                                    </Typography>

                                    <Stack spacing={2} sx={{ mb: 4 }}>
                                        <Box display="flex" gap={1.5} alignItems="center">
                                            <ShieldCheck size={20} color="#10b981" />
                                            <Typography variant="body2" fontWeight="600">Official Visa Sponsor Guarantee</Typography>
                                        </Box>
                                        <Box display="flex" gap={1.5} alignItems="center">
                                            <QrCode size={20} color="#10b981" />
                                            <Typography variant="body2" fontWeight="600">Instant Immigration Verification Node</Typography>
                                        </Box>
                                        <Box display="flex" gap={1.5} alignItems="center">
                                            <Settings size={20} color="#10b981" />
                                            <Typography variant="body2" fontWeight="600">Real-time Cloud Database Synced</Typography>
                                        </Box>
                                    </Stack>

                                    <Box sx={{ mt: 'auto' }}>
                                        <Button 
                                            component={Link} 
                                            href={`/${locale}/id-indonesian-visas`} 
                                            variant="contained" 
                                            fullWidth
                                            sx={{ 
                                                bgcolor: '#D32F2F', '&:hover': { bgcolor: '#B71C1C' },
                                                py: 2, borderRadius: 4, fontWeight: 'bold', textTransform: 'none', fontSize: '1rem'
                                            }}
                                            endIcon={<ArrowRight size={18} />}
                                        >
                                            Explore IDiv Features
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* IDG CARD */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            style={{ height: '100%' }}
                        >
                            <Card sx={{ 
                                height: '100%', borderRadius: 8, p: 4, 
                                border: '1px solid #f1f5f9', bgcolor: 'white',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
                                display: 'flex', flexDirection: 'column',
                                transition: 'transform 0.3s ease',
                                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 30px 60px rgba(0,0,0,0.06)' }
                            }}>
                                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', transform: 'scale(0.9)' }}>
                                    <IDivCardModern mode="IDG" variant="purple" showDownload={false} autoRotate={false} />
                                </Box>
                                <CardContent sx={{ flexGrow: 1, p: 0, display: 'flex', flexDirection: 'column' }}>
                                    <Stack direction="row" alignItems="center" gap={1} mb={1}>
                                        <Star size={16} color="#7c3aed" fill="#7c3aed" />
                                        <Typography variant="subtitle2" color="#7c3aed" fontWeight="800">DIGITAL COMPANION</Typography>
                                    </Stack>
                                    <Typography variant="h4" fontWeight="900" gutterBottom>Smart IDg</Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph sx={{ minHeight: 60 }}>
                                        Your **24/7 Digital Assistant Hub**. Designed for short-term visitors who want legal backup and administrative support without requiring a local sponsor node.
                                    </Typography>

                                    <Stack spacing={2} sx={{ mb: 4 }}>
                                        <Box display="flex" gap={1.5} alignItems="center">
                                            <MessageCircle size={20} color="#10b981" />
                                            <Typography variant="body2" fontWeight="600">24/7 Live Human Helpline Access</Typography>
                                        </Box>
                                        <Box display="flex" gap={1.5} alignItems="center">
                                            <ShieldCheck size={20} color="#10b981" />
                                            <Typography variant="body2" fontWeight="600">Local Dispute & Emergency Backup</Typography>
                                        </Box>
                                        <Box display="flex" gap={1.5} alignItems="center">
                                            <QrCode size={20} color="#10b981" />
                                            <Typography variant="body2" fontWeight="600">Traceable Verification Code Node</Typography>
                                        </Box>
                                    </Stack>

                                    <Box sx={{ mt: 'auto' }}>
                                        <Button 
                                            component={Link} 
                                            href={`/${locale}/id-guide`} 
                                            variant="contained" 
                                            fullWidth
                                            sx={{ 
                                                bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' },
                                                py: 2, borderRadius: 4, fontWeight: 'bold', textTransform: 'none', fontSize: '1rem'
                                            }}
                                            endIcon={<ArrowRight size={18} />}
                                        >
                                            Explore IDg Features
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                </Grid>

                {/* 3. GLOBAL CTA */}
                <Box sx={{ textAlign: 'center', mt: 10 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Ready to Secure Your Stay?</Typography>
                    <Typography variant="body2" color="text.secondary" mb={4}>Add a Digital ID to your visa application today for absolute peace of mind.</Typography>
                    <Button 
                        component={Link} 
                        href={`/${locale}/add-on`} 
                        variant="outlined" 
                        size="large"
                        sx={{ 
                            px: 6, py: 1.8, borderRadius: 100, fontWeight: 'bold', textTransform: 'none', 
                            borderColor: '#334155', color: '#334155', borderWidth: 2, '&:hover': { borderWidth: 2, borderColor: '#1e293b', bgcolor: '#f8fafc' } 
                        }}
                    >
                        Order Smart ID Add-Ons
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
