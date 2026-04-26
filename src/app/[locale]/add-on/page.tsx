"use client";

import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, Button, Stack, Chip } from '@mui/material';
import { CreditCard, ShieldCheck, Zap, ArrowRight, Download, Share2, Star } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const ADDON_TEMPLATES: Record<string, any> = {
    'IDIV': {
        subtitle: 'The Gold Standard of Visa Identification',
        image: '/images/IndonesianVisas/IDiv-Mockup.webp',
        features: [
            'Instant QR Verification',
            '3D Anti-Counterfeit Layer',
            'Legal Sponsor Residency ID',
            'High-DPI PDF/PNG Export'
        ]
    },
    'EXPRESS': {
        subtitle: 'Skip the Queue & Get Approved Faster',
        image: '/images/IndonesianVisas/VIP-FastTrack.webp',
        features: [
            '24-Hour Review Cycle',
            'Priority Queue Status',
            'Direct Agent Line',
            'Express Notification'
        ]
    },
    'INSURANCE': {
        subtitle: 'Comprehensive Medical Coverage for Bali',
        image: '/images/IndonesianVisas/Insurance.webp',
        features: [
            'COVID-19 & General Medical',
            'Local Hospital Coverages',
            'Instant Digital Policy',
            '24/7 Claim Support'
        ]
    },
    'VIP': {
        subtitle: 'Luxury Pickup & Skip Airport Hassle',
        image: '/images/IndonesianVisas/VIP-Transfer.webp',
        features: [
            'Private Luxury Chauffeur',
            'Luggage Assistance Support',
            'No Airport Taxi Haggles',
            'Water & Snacks aboard'
        ]
    },
    'IDG': {
        subtitle: '24/7 Digital Assistant & Help Desk',
        image: '/images/IndonesianVisas/IDg-Card.webp',
        features: [
            '24/7 Live Support Access',
            'Verified Guide Digital ID',
            'Emergency & Local Aid',
            'Digital Nomad Work Tips'
        ]
    }
};

import { useApplication } from '@/components/application/ApplicationContext';

export default function AddOnPage() {
    const { openPanel } = useApplication();
    const [dynamicAddons, setDynamicAddons] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchAddons = async () => {
            try {
                const res = await fetch('/api/addons');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setDynamicAddons(data);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch addons", e);
            } finally {
                setLoading(false);
            }
        };
        fetchAddons();
    }, []);

    // Map dynamic items using templates
    const displayedAddons = dynamicAddons.map(dyn => {
        const template = ADDON_TEMPLATES[dyn.sku.toUpperCase()] || {};
        return {
            id: dyn.id,
            sku: dyn.sku,
            title: dyn.name,
            subtitle: template.subtitle || 'Premium Service Add-on',
            description: dyn.description || 'Enhance your legal visa journey with descriptive assistance packages.',
            price: dyn.price,
            currency: dyn.currency || 'IDR',
            image: template.image || '/images/placeholder.webp',
            features: template.features || ['Local Assistance Support'],
            hot: dyn.sku.toUpperCase() === 'IDIV' || dyn.sku.toUpperCase() === 'IDG',
            isActive: dyn.isActive
        };
    }).filter(i => i.isActive);

    return (
        <Box sx={{ minHeight: '100vh', pt: { xs: 12, md: 16 }, pb: 10, bgcolor: 'background.default' }}>
            <Container maxWidth="lg">
                <Box textAlign="center" mb={10}>
                    <Typography variant="h2" fontWeight="900" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, color: 'text.primary', mb: 2 }}>
                        Premium <span style={{ color: '#0369a1' }}>Add-ons</span>
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: '700px', mx: 'auto' }}>
                        Enhance your visa experience with our exclusive digital and physical products designed for the modern traveler.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {displayedAddons.map((item, index) => (
                        <Grid size={{ xs: 12, md: 6 }} key={item.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    borderRadius: 6,
                                    overflow: 'hidden',
                                    position: 'relative',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-10px)'
                                    }
                                }}>
                                    {item.hot && (
                                        <Chip 
                                            label="MOST POPULAR" 
                                            sx={{ 
                                                position: 'absolute', 
                                                top: 20, 
                                                right: 20, 
                                                zIndex: 10,
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                fontSize: '0.7rem'
                                            }} 
                                        />
                                    )}
                                    <Box sx={{ height: 240, bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {/* Fallback icon if image doesn't exist */}
                                        {item.sku === 'idiv-card' ? (
                                            <CreditCard size={80} color="#0369a1" />
                                        ) : (
                                            <ShieldCheck size={80} color="#0369a1" />
                                        )}
                                    </Box>
                                    <CardContent sx={{ p: 4, flexGrow: 1 }}>
                                        <Typography variant="h4" fontWeight="800" sx={{ mb: 1 }}>{item.title}</Typography>
                                        <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 700, mb: 2 }}>{item.subtitle}</Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>{item.description}</Typography>
                                        
                                        <Stack spacing={1.5} mb={4}>
                                            {item.features.map((f: string) => (
                                                <Box key={f} display="flex" alignItems="center" gap={1.5}>
                                                    <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: 'rgba(3,105,161,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Zap size={10} color="#0369a1" />
                                                    </Box>
                                                    <Typography variant="body2" fontWeight="600">{f}</Typography>
                                                </Box>
                                            ))}
                                        </Stack>

                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: 1 }}>STARTING FROM</Typography>
                                                <Typography variant="h4" fontWeight="900" sx={{ color: 'text.primary' }}>
                                                    {item.currency === 'USD' ? '$' : 'IDR '}{item.currency === 'IDR' ? Number(item.price).toLocaleString() : item.price}
                                                </Typography>
                                            </Box>
                                            <Button 
                                                variant="contained" 
                                                size="large"
                                                onClick={() => openPanel()}
                                                endIcon={<ArrowRight size={18} />}
                                                sx={{ 
                                                    borderRadius: 4, 
                                                    px: 3, 
                                                    py: 1.5,
                                                    bgcolor: '#0369a1',
                                                    '&:hover': { bgcolor: '#075985' }
                                                }}
                                            >
                                                Order Now
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                <Box mt={12} p={6} sx={{ bgcolor: 'rgba(3,105,161,0.03)', borderRadius: 8, textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="800" sx={{ mb: 2 }}>Don't See What You Need?</Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: '600px', mx: 'auto' }}>
                        Our agency offers customized legal and relocation services. Contact our support team for specialized requests or B2B volume orders.
                    </Typography>
                    <Button component={Link} href="/contact" variant="outlined" sx={{ borderRadius: 4, px: 4, py: 1.5 }}>Contact Agent Hub</Button>
                </Box>
            </Container>
        </Box>
    );
}
