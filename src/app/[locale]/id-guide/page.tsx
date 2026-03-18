"use client";

import React from 'react';
import { Container, Grid, Typography, Box, Button, Stack, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import { ShieldCheck, CheckCircle, Info, CreditCard, ArrowRight, UserCheck, Search, MessageCircle, HelpCircle, Zap, Shield, Heart, MapPin, ChevronDown } from 'lucide-react';
import IDivCardModern from '@/components/idiv/IDivCardModern';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function IDGPage() {
    const params = useParams();
    const locale = params?.locale || 'en';

    return (
        <Box sx={{ bgcolor: '#fdfdfd' }}>
            {/* 1. HERO SECTION */}
            <Box sx={{ py: 12, borderBottom: '1px solid #eee' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={8} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="overline" color="#7c3aed" fontWeight="900" letterSpacing={2}>
                                DIGITAL COMPANION
                            </Typography>
                            <Typography variant="h2" fontWeight="900" gutterBottom sx={{ mt: 1, lineHeight: 1.1 }}>
                                Indonesian <br />
                                <span style={{ color: '#7c3aed' }}>ID Guide (IDg)</span>
                            </Typography>
                            <Typography variant="h6" color="text.secondary" paragraph sx={{ mt: 3, mb: 5 }}>
                                Your 24/7 Digital Assistant in Indonesia. IDg is a verified identification system that provides instant access to local help, emergency contacts, and administrative guidance without the need for sponsorship.
                            </Typography>

                            <Stack spacing={3} mb={6}>
                                <Box display="flex" gap={2}>
                                    <CheckCircle color="#7c3aed" />
                                    <Typography variant="body1"><strong>24/7 Live Assistance</strong> - Real human help for any local situation.</Typography>
                                </Box>
                                <Box display="flex" gap={2}>
                                    <CheckCircle color="#7c3aed" />
                                    <Typography variant="body1"><strong>Verified Digital ID</strong> - Traceable on the official /idiv-search system.</Typography>
                                </Box>
                                <Box display="flex" gap={2}>
                                    <CheckCircle color="#7c3aed" />
                                    <Typography variant="body1"><strong>No Sponsorship Required</strong> - Ideal for VOA, B1, and C-Type visitors.</Typography>
                                </Box>
                            </Stack>

                            <Button 
                                variant="contained" 
                                size="large" 
                                component={Link}
                                href={`/${locale}/add-on`}
                                sx={{ 
                                    px: 6, py: 2, borderRadius: 4, fontWeight: 'bold', fontSize: '1.1rem',
                                    bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' }
                                }}
                                endIcon={<ArrowRight />}
                            >
                                Get Your IDg Now ($10.00)
                            </Button>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }} display="flex" justifyContent="center">
                            <Box sx={{ position: 'relative' }}>
                                <Box sx={{ 
                                    position: 'absolute', top: -40, right: -40, width: 200, height: 200, 
                                    bgcolor: '#7c3aed', opacity: 0.1, borderRadius: '50%', filter: 'blur(60px)' 
                                }} />
                                
                                <Stack spacing={4} alignItems="center">
                                   <IDivCardModern mode="IDG" variant="purple" showDownload={false} shareUrl="https://indonesianvisas.com/id-guide" />
                                    <Box textAlign="center">
                                        <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ display: 'block', maxWidth: 300, mb: 2 }}>
                                            The IDg Card is a digital facilitation document provided by IndonesianVisas.agency for guidance purposes.
                                        </Typography>
                                        
                                        <Link href={`/${locale}/idiv-search`} style={{ textDecoration: 'none' }}>
                                            <Button 
                                                variant="outlined" 
                                                sx={{ color: '#7c3aed', borderColor: '#7c3aed', borderRadius: 100, fontSize: '0.7rem', textTransform: 'none' }}
                                                startIcon={<Search size={16} />}
                                            >
                                                Track your IDg Status
                                            </Button>
                                        </Link>
                                    </Box>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* 2. WHAT IS IDg? & 3. 24/7 SUPPORT */}
            <Container maxWidth="lg" sx={{ py: 15 }}>
                <Grid container spacing={10}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ p: 4, bgcolor: '#f8f7ff', borderRadius: 8 }}>
                            <MessageCircle size={48} color="#7c3aed" />
                            <Typography variant="h4" fontWeight="bold" sx={{ mt: 2, mb: 3 }}>Your 24/7 Digital Hub</Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                IDg is more than just a card. It's a connection to our local support team that works around the clock to ensure your stay in Indonesia is smooth.
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Whether you're dealing with a bike rental dispute, need a fast hospital recommendation, or just want to verify a local rule, your IDg membership gives you direct access to the experts.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} display="flex" flexDirection="column" justifyContent="center">
                        <Typography variant="h4" fontWeight="bold" mb={4}>Perfect for All Visitors</Typography>
                        <Stack spacing={4}>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">Visitor Visa (B1/VOA)</Typography>
                                <Typography variant="body2" color="text.secondary">Perfect for short-term tourists who want an extra layer of security without the need for a local sponsor.</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">Digital Nomads (C-Type)</Typography>
                                <Typography variant="body2" color="text.secondary">Get help with long-term housing, local bank account guidance, and administrative tasks.</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">Pre-Investment Visitors</Typography>
                                <Typography variant="body2" color="text.secondary">Ensure you are following local procedures from day one with professional guidance.</Typography>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>

            {/* 7. PRICING TIERS */}
            <Box sx={{ py: 15, bgcolor: '#f5f3ff' }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" fontWeight="900" textAlign="center" mb={2}>Choose Your Protection</Typography>
                    <Typography variant="h6" color="text.secondary" textAlign="center" mb={8}>Flexible plans for every type of traveler.</Typography>
                    
                    <Grid container spacing={4}>
                        {[
                            { title: "Standard IDg", price: "$10", term: "30 Days", desc: "Essential 24/7 guide assistance for short trips.", icon: Zap },
                            { title: "Extended IDg", price: "$15", term: "60 Days", desc: "Double the coverage for long-term explorers.", icon: Shield, featured: true },
                            { title: "Premium IDg", price: "$20", term: "60 Days", desc: "Priority support and expedited guide response.", icon: Heart }
                        ].map((tier, i) => (
                            <Grid key={i} size={{ xs: 12, md: 4 }}>
                                <Card sx={{ 
                                    height: '100%', borderRadius: 6, position: 'relative', 
                                    border: tier.featured ? '2px solid #7c3aed' : '1px solid #eee',
                                    boxShadow: tier.featured ? '0 20px 40px rgba(124,58,237,0.1)' : 'none'
                                }}>
                                    {tier.featured && (
                                        <Box sx={{ 
                                            position: 'absolute', top: 16, right: 16, bgcolor: '#7c3aed', 
                                            color: 'white', px: 2, py: 0.5, borderRadius: 100, fontSize: '0.7rem', fontWeight: 'bold' 
                                        }}>
                                            MOST POPULAR
                                        </Box>
                                    )}
                                    <CardContent sx={{ p: 5, textAlign: 'center' }}>
                                        <tier.icon size={48} color="#7c3aed" style={{ marginBottom: '1.5rem' }} />
                                        <Typography variant="h5" fontWeight="bold" gutterBottom>{tier.title}</Typography>
                                        <Box sx={{ my: 3 }}>
                                            <Typography variant="h3" fontWeight="900" display="inline">{tier.price}</Typography>
                                            <Typography variant="body1" color="text.secondary" display="inline"> / {tier.term}</Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" mb={4}>{tier.desc}</Typography>
                                        <Button 
                                            fullWidth 
                                            variant={tier.featured ? "contained" : "outlined"}
                                            sx={{ 
                                                borderRadius: 4, py: 1.5, fontWeight: 'bold',
                                                ...(tier.featured ? { bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } } : { color: '#7c3aed', borderColor: '#7c3aed' })
                                            }}
                                        >
                                            Get Started
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    
                    <Box mt={6} textAlign="center">
                        <Typography variant="body2" color="text.secondary">
                            Looking for longer terms? <Link href={`/${locale}/contact`} style={{ color: '#7c3aed', fontWeight: 'bold' }}>Contact Sales</Link> for 1-year custom plans.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* 4. LOCAL ASSISTANCE & 5. DIGITAL NOMAD FOCUS */}
            <Container maxWidth="lg" sx={{ py: 15 }}>
                <Typography variant="h4" fontWeight="bold" textAlign="center" mb={8}>What's Included in Your Guide?</Typography>
                <Grid container spacing={4}>
                    {[
                        { title: "Emergency Support", desc: "Instant help for hospital admissions or police reports.", icon: ShieldCheck },
                        { title: "Bike & Car Help", desc: "Expert tips on rentals and avoiding common scams.", icon: MapPin },
                        { title: "Visa Reminders", desc: "We track your expiry so you never overstay.", icon: ChevronDown },
                        { title: "Digital Nomad Tips", desc: "Best workspaces, local communities, and internet hacks.", icon: Zap }
                    ].map((item, i) => (
                        <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <item.icon size={32} color="#7c3aed" style={{ marginBottom: '1rem' }} />
                                <Typography variant="h6" fontWeight="bold" gutterBottom>{item.title}</Typography>
                                <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* 12. FAQ SECTION */}
            <Box sx={{ py: 15, bgcolor: '#fff' }}>
                <Container maxWidth="md">
                    <Typography variant="h4" fontWeight="bold" textAlign="center" mb={6}>Common Questions</Typography>
                    {[
                        { q: "Is IDg a Visa?", a: "No, IDg is a Guide and Facilitation ID. It does not replace your visa or passport. It is a support service to help you navigate Indonesia safely." },
                        { q: "Can I use it for immigration checks?", a: "The IDg is a verified digital document. While it shows your intent and verified status with our agency, you must always carry your passport and official visa for immigration checks." },
                        { q: "How do I access 24/7 support?", a: "Once your IDg is active, you will receive a VIP WhatsApp link and access code directly on your verification page." },
                        { q: "Can I upgrade my plan?", a: "Yes, you can extend your IDg at any time via your dashboard." }
                    ].map((faq, i) => (
                        <Accordion key={i} sx={{ mb: 2, boxShadow: 'none', border: '1px solid #eee', borderRadius: '12px !important', '&:before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ChevronDown />}>
                                <Typography fontWeight="bold">{faq.q}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography color="text.secondary">{faq.a}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Container>
            </Box>

            {/* 14. FINAL CTA */}
            <Box sx={{ py: 10, bgcolor: '#7c3aed', color: 'white' }}>
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight="900" mb={3}>Travel Indonesia with Confidence</Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 6 }}>Join 10,000+ travelers who use our ID system for a stress-free experience.</Typography>
                    <Button 
                        variant="contained" 
                        size="large" 
                        component={Link}
                        href={`/${locale}/add-on`}
                        sx={{ 
                            bgcolor: 'white', color: '#7c3aed', px: 8, py: 2, borderRadius: 4, fontWeight: '900',
                            '&:hover': { bgcolor: '#f3f4f6' }
                        }}
                    >
                        GET MY IDg CARD NOW
                    </Button>
                </Container>
            </Box>
        </Box>
    );
}
