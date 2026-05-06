"use client";

import React from 'react';
import { Container, Grid, Typography, Box, Button, Stack, Card, CardContent } from '@mui/material';
import { ShieldCheck, ArrowRight, Star, Settings, QrCode, Share2, Info, MessageSquare, MessageCircle, Copy, Send, Share as ShareIcon, Zap } from 'lucide-react';
import IDivCardModern from '@/components/idiv/IDivCardModern';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { useState } from 'react';

export default function SmartIDHub() {
    const params = useParams();
    const locale = params?.locale || 'en';

    // Share Menu State
    const [shareAnchor, setShareAnchor] = useState<null | HTMLElement>(null);
    const [activeShare, setActiveShare] = useState<{ title: string, url: string } | null>(null);

    const handleShareOpen = (event: React.MouseEvent<HTMLButtonElement>, title: string, path: string) => {
        setShareAnchor(event.currentTarget);
        setActiveShare({
            title,
            url: window.location.origin + `/${locale}${path}`
        });
    };

    const handleShareClose = () => {
        setShareAnchor(null);
        setActiveShare(null);
    };

    const onShareAction = (platform: 'copy' | 'whatsapp' | 'telegram' | 'reddit' | 'discord' | 'x') => {
        if (!activeShare) return;
        const { title, url } = activeShare;
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);

        switch (platform) {
            case 'copy':
                navigator.clipboard.writeText(url);
                alert("Link copied to clipboard!");
                break;
            case 'whatsapp':
                window.open(`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`, '_blank');
                break;
            case 'telegram':
                window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`, '_blank');
                break;
            case 'reddit':
                window.open(`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`, '_blank');
                break;
            case 'discord':
                // Discord usually doesn't have a direct share URL like others, copy is best but we can open discord.com
                navigator.clipboard.writeText(url);
                alert("Link copied for Discord sharing!");
                window.open(`https://discord.com/channels/@me`, '_blank');
                break;
            case 'x':
                window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank');
                break;
        }
        handleShareClose();
    };

    return (
        <Box sx={{ bgcolor: '#fdfdfd', minHeight: '100vh', py: { xs: 16, md: 12 } }}>
            <Container maxWidth="xl">
                {/* 1. HERO SECTION */}
                <Box sx={{ textAlign: 'center', mb: 10 }}>
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
                        style={{ fontSize: '3.5rem', fontWeight: 900, marginTop: '1.5rem', letterSpacing: '-1px', color: '#1e293b' }}
                    >
                        Meet Your <span style={{ background: 'linear-gradient(45deg, #1976d2, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Smart ID</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        style={{ maxWidth: '600px', margin: '1rem auto 0', color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6 }}
                    >
                        The most advanced digital verification and support companion for travelers in Indonesia. Choose the card that matches your journey.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mt: 5, px: 2 }}>
                            <Button 
                                variant="contained" 
                                startIcon={<Share2 size={16} />}
                                onClick={(e) => handleShareOpen(e, 'Indonesian Visas Smart ID', '/smart-id')}
                                sx={{ 
                                    bgcolor: '#1e293b', color: 'white', borderRadius: 100, px: { xs: 2.5, sm: 4 }, py: 1.5, 
                                    textTransform: 'none', fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.9rem' },
                                    whiteSpace: 'nowrap', '&:hover': { bgcolor: '#334155' } 
                                }}
                            >
                                Share Page
                            </Button>
                            <Button 
                                component={Link}
                                href={`/${locale}/why-travelers-need-a-sponsor-id`}
                                variant="outlined"
                                sx={{ 
                                    borderColor: '#1e293b', color: '#1e293b', borderRadius: 100, px: { xs: 2.5, sm: 4 }, py: 1.5, 
                                    textTransform: 'none', fontWeight: 'bold', borderWidth: 2, fontSize: { xs: '0.75rem', sm: '0.9rem' },
                                    whiteSpace: 'nowrap', '&:hover': { borderWidth: 2, bgcolor: '#f8fafc' } 
                                }}
                            >
                                Why Sponsor ID?
                            </Button>
                        </Stack>
                    </motion.div>
                </Box>

                {/* 2. TRIPLE CARD GRID */}
                <Grid container spacing={4}>
                    {/* SMART ID CARD (NEW) */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            style={{ height: '100%' }}
                        >
                            <Card sx={{
                                height: '100%', borderRadius: 8, p: 2,
                                border: '1px solid #f1f5f9', bgcolor: 'white',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
                                display: 'flex', flexDirection: 'column',
                                transition: 'transform 0.3s ease',
                                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 30px 60px rgba(0,0,0,0.06)' }
                            }}>
                                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center', transformOrigin: 'top center' }} suppressHydrationWarning>
                                    <IDivCardModern mode="SMART" showDownload={false} autoRotate={false} showActions={false} />
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Share2 size={18} />}
                                        sx={{
                                            borderRadius: 100, px: 4, py: 1, textTransform: 'none', fontWeight: 'bold',
                                            borderColor: '#0369a1', color: '#0369a1', '&:hover': { borderColor: '#0284c7', bgcolor: 'rgba(3, 105, 161, 0.04)' }
                                        }}
                                        onClick={(e) => handleShareOpen(e, 'Smart ID - Indonesian Visas', '/ktp-id-card-smart-id')}
                                    >
                                        Share
                                    </Button>
                                </Box>

                                <CardContent sx={{ flexGrow: 1, p: 0, display: 'flex', flexDirection: 'column' }}>
                                    <Stack direction="row" alignItems="center" gap={1} mb={1}>
                                        <Star size={16} color="#0369a1" fill="#0369a1" />
                                        <Typography variant="subtitle2" color="#0369a1" fontWeight="800">RESIDENT IDENTITY</Typography>
                                    </Stack>
                                    <Typography variant="h4" fontWeight="900" gutterBottom>Smart ID</Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph sx={{ minHeight: 80 }}>
                                        The ultimate digital identity for **GCI and ITAP Holders**. Features full KTP-style data layout with NFC and secure global verification.
                                    </Typography>

                                    <Stack spacing={2} sx={{ mb: 4 }}>
                                        <Box display="flex" gap={1.5} alignItems="center">
                                            <ShieldCheck size={20} color="#0369a1" />
                                            <Typography variant="body2" fontWeight="600">Full KTP-style Biometric Data</Typography>
                                        </Box>
                                        <Box display="flex" gap={1.5} alignItems="center">
                                            <QrCode size={20} color="#0369a1" />
                                            <Typography variant="body2" fontWeight="600">NFC & Dual Verification System</Typography>
                                        </Box>
                                        <Box display="flex" gap={1.5} alignItems="center">
                                            <Settings size={20} color="#0369a1" />
                                            <Typography variant="body2" fontWeight="600">Passport Integration Node</Typography>
                                        </Box>
                                    </Stack>

                                    <Box sx={{ mt: 'auto' }}>
                                        <Button
                                            component={Link}
                                            href={`/${locale}/ktp-id-card-smart-id`}
                                            variant="contained"
                                            fullWidth
                                            sx={{
                                                bgcolor: '#0369a1', '&:hover': { bgcolor: '#0284c7' },
                                                py: 2, borderRadius: 4, fontWeight: 'bold', textTransform: 'none', fontSize: '1rem'
                                            }}
                                            endIcon={<ArrowRight size={18} />}
                                        >
                                            Get Smart ID
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* IDIV CARD */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            style={{ height: '100%' }}
                        >
                            <Card sx={{
                                height: '100%', borderRadius: 8, p: 2,
                                border: '1px solid #f1f5f9', bgcolor: 'white',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
                                display: 'flex', flexDirection: 'column',
                                transition: 'transform 0.3s ease',
                                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 30px 60px rgba(0,0,0,0.06)' }
                            }}>
                                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center', transformOrigin: 'top center' }} suppressHydrationWarning>
                                    <IDivCardModern showDownload={false} autoRotate={false} showActions={false} />
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Share2 size={18} />}
                                        sx={{
                                            borderRadius: 100, px: 4, py: 1, textTransform: 'none', fontWeight: 'bold',
                                            borderColor: '#D32F2F', color: '#D32F2F', '&:hover': { borderColor: '#B71C1C', bgcolor: 'rgba(211, 47, 47, 0.04)' }
                                        }}
                                        onClick={(e) => handleShareOpen(e, 'IDiv Card - Indonesian Visas', '/id-indonesian-visas')}
                                    >
                                        Share
                                    </Button>
                                </Box>

                                <CardContent sx={{ flexGrow: 1, p: 0, display: 'flex', flexDirection: 'column' }}>
                                    <Stack direction="row" alignItems="center" gap={1} mb={1}>
                                        <Star size={16} color="#D32F2F" fill="#D32F2F" />
                                        <Typography variant="subtitle2" color="#D32F2F" fontWeight="800">SPONSOR VERIFIED</Typography>
                                    </Stack>
                                    <Typography variant="h4" fontWeight="900" gutterBottom>IDiv</Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph sx={{ minHeight: 80 }}>
                                        The official **Sponsor Verification ID** for travelers with active ITAS or Multiple Entry Visas. Proof of legal sponsorship.
                                    </Typography>

                                    <Stack spacing={2} sx={{ mb: 4 }}>
                                        <Box display="flex" gap={1.5} alignItems="center">
                                            <ShieldCheck size={20} color="#10b981" />
                                            <Typography variant="body2" fontWeight="600">Official Visa Sponsor Guarantee</Typography>
                                        </Box>
                                        <Box display="flex" gap={1.5} alignItems="center">
                                            <QrCode size={20} color="#10b981" />
                                            <Typography variant="body2" fontWeight="600">Instant Verification Node</Typography>
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
                                            Explore IDiv
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* IDG CARD */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            style={{ height: '100%' }}
                        >
                            <Card sx={{
                                height: '100%', borderRadius: 8, p: 2,
                                border: '1px solid #f1f5f9', bgcolor: 'white',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
                                display: 'flex', flexDirection: 'column',
                                transition: 'transform 0.3s ease',
                                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 30px 60px rgba(0,0,0,0.06)' }
                            }}>
                                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center', transformOrigin: 'top center' }} suppressHydrationWarning>
                                    <IDivCardModern mode="IDG" variant="purple" showDownload={false} autoRotate={false} showActions={false} />
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Share2 size={18} />}
                                        sx={{
                                            borderRadius: 100, px: 4, py: 1, textTransform: 'none', fontWeight: 'bold',
                                            borderColor: '#7c3aed', color: '#7c3aed', '&:hover': { borderColor: '#6d28d9', bgcolor: 'rgba(124, 58, 237, 0.04)' }
                                        }}
                                        onClick={(e) => handleShareOpen(e, 'Smart IDg - Indonesian Visas', '/id-guide')}
                                    >
                                        Share
                                    </Button>
                                </Box>

                                <CardContent sx={{ flexGrow: 1, p: 0, display: 'flex', flexDirection: 'column' }}>
                                    <Stack direction="row" alignItems="center" gap={1} mb={1}>
                                        <Star size={16} color="#7c3aed" fill="#7c3aed" />
                                        <Typography variant="subtitle2" color="#7c3aed" fontWeight="800">DIGITAL COMPANION</Typography>
                                    </Stack>
                                    <Typography variant="h4" fontWeight="900" gutterBottom>Smart IDg</Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph sx={{ minHeight: 80 }}>
                                        Your **24/7 Digital Assistant Hub**. Designed for short-term visitors (VOA/B211A) who want legal backup and guidance.
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
                                            Explore IDg
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

                {/* SHARE MENU */}
                <Menu
                    anchorEl={shareAnchor}
                    open={Boolean(shareAnchor)}
                    onClose={handleShareClose}
                    PaperProps={{
                        sx: { borderRadius: 3, mt: 1, minWidth: 180, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }
                    }}
                >
                    <MenuItem onClick={() => onShareAction('copy')}>
                        <ListItemIcon><Copy size={18} /></ListItemIcon>
                        <ListItemText>Copy Link</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => onShareAction('whatsapp')}>
                        <ListItemIcon><MessageSquare size={18} color="#25D366" /></ListItemIcon>
                        <ListItemText>WhatsApp</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => onShareAction('telegram')}>
                        <ListItemIcon><Send size={18} color="#0088cc" /></ListItemIcon>
                        <ListItemText>Telegram</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => onShareAction('reddit')}>
                        <ListItemIcon><ShareIcon size={18} color="#FF4500" /></ListItemIcon>
                        <ListItemText>Reddit</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => onShareAction('discord')}>
                        <ListItemIcon><MessageCircle size={18} color="#5865F2" /></ListItemIcon>
                        <ListItemText>Discord</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => onShareAction('x')}>
                        <ListItemIcon><Zap size={18} color="#000000" /></ListItemIcon>
                        <ListItemText>X (Twitter)</ListItemText>
                    </MenuItem>
                </Menu>
            </Container>
        </Box>
    );
}
