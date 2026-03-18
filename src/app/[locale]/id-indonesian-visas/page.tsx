"use client";

import React from 'react';
import { Container, Grid, Typography, Box, Button, Stack, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import { ShieldCheck, CheckCircle, Info, ArrowRight, UserCheck, Search, Shield, ChevronDown, Award, Globe, HelpCircle } from 'lucide-react';
import IDivCardModern from '@/components/idiv/IDivCardModern';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function IDIVPage() {
    const params = useParams();
    const locale = params?.locale || 'en';

    return (
        <Box sx={{ bgcolor: '#fdfdfd' }}>
            {/* 1. HERO SECTION */}
            <Box sx={{ py: 12, borderBottom: '1px solid #eee' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={8} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="overline" color="#D32F2F" fontWeight="900" letterSpacing={2}>
                                PREMIUM ADD-ON
                            </Typography>
                            <Typography variant="h2" fontWeight="900" gutterBottom sx={{ mt: 1, lineHeight: 1.1 }}>
                                ID Indonesian <br />
                                <span style={{ color: '#D32F2F' }}>Visas (IDIV)</span>
                            </Typography>
                            <Typography variant="h6" color="text.secondary" paragraph sx={{ mt: 3, mb: 5 }}>
                                The official Digital ID Card for travelers in Indonesia. This acts as your verified sponsor ID, providing legal safety, emergency backup, and absolute peace of mind during your stay.
                            </Typography>

                            <Stack spacing={3} mb={6}>
                                <Box display="flex" gap={2}>
                                    <CheckCircle color="#D32F2F" />
                                    <Typography variant="body1"><strong>Official Verified Sponsor ID</strong> - Link your visa to a verified sponsor.</Typography>
                                </Box>
                                <Box display="flex" gap={2}>
                                    <CheckCircle color="#D32F2F" />
                                    <Typography variant="body1"><strong>Legally Backed Setup</strong> - Handles checks by local immigration or police.</Typography>
                                </Box>
                                <Box display="flex" gap={2}>
                                    <CheckCircle color="#D32F2F" />
                                    <Typography variant="body1"><strong>Traceable Access</strong> - Verifiable anytime in the live /idiv-search system.</Typography>
                                </Box>
                            </Stack>

                            <Button 
                                variant="contained" 
                                size="large" 
                                component={Link}
                                href={`/${locale}/add-on`}
                                sx={{ 
                                    px: 6, py: 2, borderRadius: 4, fontWeight: 'bold', fontSize: '1.1rem',
                                    bgcolor: '#D32F2F', '&:hover': { bgcolor: '#B71C1C' }
                                }}
                                endIcon={<ArrowRight />}
                            >
                                Get Your IDIV Now ($20.00)
                            </Button>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }} display="flex" justifyContent="center">
                            <Box sx={{ position: 'relative' }}>
                                <Box sx={{ 
                                    position: 'absolute', top: -40, right: -40, width: 200, height: 200, 
                                    bgcolor: '#D32F2F', opacity: 0.1, borderRadius: '50%', filter: 'blur(60px)' 
                                }} />
                                
                                <Stack spacing={4} alignItems="center">
                                    <IDivCardModern showDownload={false} shareUrl="https://indonesianvisas.com/id-indonesian-visas" />
                                    <Box textAlign="center">
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 300, mb: 2 }}>
                                            The IDIV Card is a digital facilitation document provided by IndonesianVisas.agency and does not replace official passports.
                                        </Typography>
                                        
                                        <Link href={`/${locale}/idiv-search`} style={{ textDecoration: 'none' }}>
                                            <Button 
                                                variant="outlined" 
                                                sx={{ color: '#D32F2F', borderColor: '#D32F2F', borderRadius: 100, fontSize: '0.7rem', textTransform: 'none' }}
                                                startIcon={<Search size={16} />}
                                            >
                                                Track your IDiv Status
                                            </Button>
                                        </Link>
                                    </Box>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* 2. CORE UTILITY */}
            <Container maxWidth="lg" sx={{ py: 12 }}>
                <Grid container spacing={10} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ p: 4, bgcolor: '#fff5f5', borderRadius: 8 }}>
                            <ShieldCheck size={48} color="#D32F2F" />
                            <Typography variant="h4" fontWeight="bold" sx={{ mt: 2, mb: 3 }}>Absolute Legal Security</Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                Your IDIV establishes a secure, traceable profile connected to your fully verified local sponsor nodes. 
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                In the event you are asked for identification or verification by local authorities, hotels, or rental clinics, your card operates with exact alignment coordinates corresponding directly to your official stay procedures.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} display="flex" flexDirection="column" justifyContent="center">
                        <Typography variant="h4" fontWeight="bold" mb={4}>Why You Need It</Typography>
                        <Stack spacing={4}>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">Prevent bureaucratic delays</Typography>
                                <Typography variant="body2" color="text.secondary">Avoid time-consuming questions by showing verification instant lookup scans linked to our active agency profile.</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">Digital Multi-backup</Typography>
                                <Typography variant="body2" color="text.secondary">Lose your documents? You have ready, scanned downloads of our support nodes directly inside the dashboard with single touches.</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">Expedited Processes</Typography>
                                <Typography variant="body2" color="text.secondary">Priority extension slots available for IDIV holders seeking longer term residency maintenance inside Bali/Jakarta.</Typography>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>

            {/* 3. PRICING TIERS ($20 and $50) */}
            <Box sx={{ py: 15, bgcolor: '#FEF2F2' }}>
                <Container maxWidth="md">
                    <Typography variant="h3" fontWeight="900" textAlign="center" mb={2} color="#111827">Premium Protection Tiers</Typography>
                    <Typography variant="h6" color="text.secondary" textAlign="center" mb={8}>Plans crafted for short stays and long-term expat security.</Typography>
                    
                    <Grid container spacing={4} justifyContent="center">
                        {[
                            { title: "Standard IDIV", price: "$20", term: "Classic", desc: "Essential verification and sponsor backup for standard stays.", icon: Shield },
                            { title: "Long-Term IDIV", price: "$50", term: "Annual / Long", desc: "For expats or investors staying up to 1 year needing continuous protection nodes.", icon: Award, featured: true }
                        ].map((tier, i) => (
                            <Grid key={i} size={{ xs: 12, sm: 6 }}>
                                <Card sx={{ 
                                    height: '100%', borderRadius: 6, position: 'relative', 
                                    border: tier.featured ? '2px solid #D32F2F' : '1px solid #eee',
                                    boxShadow: tier.featured ? '0 20px 40px rgba(211,47,47,0.1)' : 'none'
                                }}>
                                    {tier.featured && (
                                        <Box sx={{ 
                                            position: 'absolute', top: 16, right: 16, bgcolor: '#D32F2F', 
                                            color: 'white', px: 2, py: 0.5, borderRadius: 100, fontSize: '0.7rem', fontWeight: 'bold' 
                                        }}>
                                            MOST POPULAR
                                        </Box>
                                    )}
                                    <CardContent sx={{ p: 5, textAlign: 'center' }}>
                                        <tier.icon size={48} color="#D32F2F" style={{ marginBottom: '1.5rem' }} />
                                        <Typography variant="h5" fontWeight="bold" gutterBottom>{tier.title}</Typography>
                                        <Box sx={{ my: 3 }}>
                                            <Typography variant="h3" fontWeight="900" display="inline">{tier.price}</Typography>
                                            <Typography variant="body1" color="text.secondary" display="inline"> / {tier.term}</Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" mb={4}>{tier.desc}</Typography>
                                        <Button 
                                            fullWidth 
                                            variant={tier.featured ? "contained" : "outlined"}
                                            component={Link}
                                            href={`/${locale}/add-on`}
                                            sx={{ 
                                                borderRadius: 4, py: 1.5, fontWeight: 'bold',
                                                ...(tier.featured ? { bgcolor: '#D32F2F', '&:hover': { bgcolor: '#B71C1C' } } : { color: '#D32F2F', borderColor: '#D32F2F' })
                                            }}
                                        >
                                            Get Started
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* 4. WHAT'S INCLUDED Grid */}
            <Container maxWidth="lg" sx={{ py: 15 }}>
                <Typography variant="h4" fontWeight="bold" textAlign="center" mb={8}>What's Included in Your IDiv?</Typography>
                <Grid container spacing={4}>
                    {[
                        { title: "Direct Sponsor Linking", desc: "Secure node linking verification directly tracing back to certified local hosts.", icon: Globe },
                        { title: "Emergency Support Hotline", desc: "Instant routing instructions for hospital admissions or driver updates.", icon: UserCheck },
                        { title: "Document Vault Access", desc: "Read and save standard PDF outputs from single interfaces easily on demand.", icon: ShieldCheck },
                        { title: "Fast-Track Services Eligibility", desc: "Standardized VIP Slots for extension slots prioritizing holders node slots.", icon: Award }
                    ].map((item, i) => (
                        <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <item.icon size={32} color="#D32F2F" style={{ marginBottom: '1rem' }} />
                                <Typography variant="h6" fontWeight="bold" gutterBottom>{item.title}</Typography>
                                <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* 5. FAQ SECTION */}
            <Box sx={{ py: 15, bgcolor: '#fff' }}>
                <Container maxWidth="md">
                    <Typography variant="h4" fontWeight="bold" textAlign="center" mb={6}>Common Questions</Typography>
                    {[
                        { q: "Is the IDiv Card a replacement for a KITAS?", a: "No, the IDIV card is a Digital Facilitation tool provided by IndonesianVisas.agency that maps and secures your current standing, it complements but does not replace legal state immigration cards like a KITAS." },
                        { q: "Can access be rendered to local rental locations?", a: "Yes. Simply pulling up your verify barcode lets local bike renters, villas, and clinics verify directly against accurate server nodes, speedying checkpoints safely." },
                        { q: "How is it activated?", a: "Your IDiv dashboard initializes state setups once appropriate order batches process standard node clearances." },
                        { q: "Do items automatically expire?", a: "Yes, nodes trace accurately against the validity limit matching appropriate selected purchase logs accurately." }
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

            {/* 6. FINAL CTA */}
            <Box sx={{ py: 10, bgcolor: '#D32F2F', color: 'white' }}>
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight="900" mb={3}>Secure Your Indonesian Travel Now</Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 6 }}>Secure, verified, and backed by high-tier corporate assistance networks.</Typography>
                    <Button 
                        variant="contained" 
                        size="large" 
                        component={Link}
                        href={`/${locale}/add-on`}
                        sx={{ 
                            bgcolor: 'white', color: '#D32F2F', px: 8, py: 2, borderRadius: 4, fontWeight: '900',
                            '&:hover': { bgcolor: '#f3f4f6' }
                        }}
                    >
                        GET MY IDIV CARD NOW
                    </Button>
                </Container>
            </Box>
        </Box>
    );
}
