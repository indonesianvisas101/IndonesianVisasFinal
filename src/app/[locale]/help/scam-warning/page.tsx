
"use client";

import React from 'react';
import SectionWrapper from '@/components/layout/SectionWrapper';
import { Typography, Paper, Box, Button, Grid, Chip } from '@mui/material';
import { AlertTriangle, ShieldCheck, XCircle, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatNavLink } from '@/utils/seo';

export default function ScamWarningPage() {
    const params = useParams();
    const locale = (params?.locale as string) || 'en';

    return (
        <SectionWrapper id="scam-warning" className="py-20 bg-slate-50 dark:bg-zinc-950">
            <div className="max-w-4xl mx-auto px-4">
                
                {/* Back Button */}
                <Link href={formatNavLink(locale, "/help")} className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8 text-sm font-bold uppercase tracking-widest">
                    <ArrowLeft size={16} /> Help Center
                </Link>

                {/* Hero */}
                <Box sx={{ mb: 10, textAlign: 'center' }}>
                    <div className="inline-flex p-4 bg-red-500/10 text-red-600 rounded-3xl mb-6">
                        <AlertTriangle size={48} />
                    </div>
                    <Typography variant="h3" fontWeight="900" className="text-slate-900 dark:text-white mb-4">
                        Scam Warning & Safety
                    </Typography>
                    <Typography className="text-slate-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                        Learn how to identify official Indonesian Visas channels and protect yourself from fraudulent agents and websites.
                    </Typography>
                </Box>

                {/* Main Content */}
                <div className="space-y-16">
                    
                    {/* Official Channels */}
                    <Box>
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="text-green-500" />
                            <Typography variant="h5" fontWeight="800">Our Official Identity</Typography>
                        </div>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper elevation={0} className="p-6 rounded-2xl border-2 border-green-500/20 bg-green-50/50 dark:bg-green-500/5 h-full">
                                    <Chip label="TRUE" size="small" color="success" sx={{ mb: 2, fontWeight: 'bold' }} />
                                    <Typography variant="h6" fontWeight="bold" className="mb-2">Official Domain</Typography>
                                    <Typography variant="body2" className="font-mono text-green-700 dark:text-green-400">indonesianvisas.com</Typography>
                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                                        Always check the address bar for the padlock and our primary domain.
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper elevation={0} className="p-6 rounded-2xl border-2 border-green-500/20 bg-green-50/50 dark:bg-green-500/5 h-full">
                                    <Chip label="TRUE" size="small" color="success" sx={{ mb: 2, fontWeight: 'bold' }} />
                                    <Typography variant="h6" fontWeight="bold" className="mb-2">Official Contact</Typography>
                                    <Typography variant="body2" className="font-mono text-green-700 dark:text-green-400">+62 857 2704 1992</Typography>
                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                                        Registered business WhatsApp with PT Indonesian Visas Agency identifier.
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Red Flags */}
                    <Box>
                        <div className="flex items-center gap-3 mb-6">
                            <XCircle className="text-red-500" />
                            <Typography variant="h5" fontWeight="800">Red Flags (Beware)</Typography>
                        </div>
                        <div className="space-y-4">
                            {[
                                "Requests for payment via personal Western Union or MoneyGram.",
                                "Websites using '.visa' or '.gov' incorrectly in the subdomain (e.g. indonesian-visa.gov-office.com).",
                                "Agents promising 100% guaranteed entry bypassing immigration checks.",
                                "Unofficial staff requesting passport photos via private personal WhatsApp (not our business account)."
                            ].map((flag, i) => (
                                <div key={i} className="flex gap-4 p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl">
                                    <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                                        <XCircle size={14} className="text-red-500" />
                                    </div>
                                    <Typography variant="body2" fontWeight="500">{flag}</Typography>
                                </div>
                            ))}
                        </div>
                    </Box>

                    {/* Scam Verification Box */}
                    <Paper 
                        elevation={0} 
                        className="p-10 rounded-3xl bg-red-600 text-white"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-grow">
                                <Typography variant="h4" fontWeight="900" className="mb-4">
                                    Verify Official Agents
                                </Typography>
                                <Typography className="text-red-100 mb-6">
                                    Check the authenticity of any document, visa, or agent using our official verification system.
                                </Typography>
                                <div className="flex gap-3">
                                    <Button 
                                        variant="contained" 
                                        href={formatNavLink(locale, "/check-status")}
                                        sx={{ bgcolor: 'white', color: 'red', fontWeight: 'bold', borderRadius: '10px', '&:hover': { bgcolor: '#fefefe' } }}
                                    >
                                        Verify Now
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        href="https://wa.me/6285727041992"
                                        sx={{ borderColor: 'white', color: 'white', fontWeight: 'bold', borderRadius: '10px' }}
                                    >
                                        Report Scam
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-shrink-0 animate-pulse">
                                <AlertTriangle size={120} strokeWidth={1} />
                            </div>
                        </div>
                    </Paper>

                    {/* Institutional Logos / Trust Marks */}
                    <Box className="text-center">
                        <Typography variant="caption" className="uppercase tracking-widest text-gray-400 font-bold block mb-4">
                            Licensed Member of
                        </Typography>
                        <Typography variant="body2" className="text-slate-500">
                            NIB: 0402260034806 | PT Indonesian Visas Agency™<br />
                            Officially Registered with the Ministry of Law & Human Rights Indonesia.
                        </Typography>
                    </Box>
                </div>
            </div>
        </SectionWrapper>
    );
}
