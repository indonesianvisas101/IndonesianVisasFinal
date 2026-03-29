
"use client";

import React from 'react';
import SectionWrapper from '@/components/layout/SectionWrapper';
import { Typography, Paper, Box, Button, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Search, ChevronDown, ArrowLeft, Mail, Smartphone, History } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatNavLink } from '@/utils/seo';

export default function OrderNotFoundPage() {
    const params = useParams();
    const locale = (params?.locale as string) || 'en';

    return (
        <SectionWrapper id="order-troubleshooting" className="py-20 bg-slate-50 dark:bg-zinc-950">
            <div className="max-w-4xl mx-auto px-4">
                
                <Link href={formatNavLink(locale, "/help")} className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8 text-sm font-bold uppercase tracking-widest">
                    <ArrowLeft size={16} /> Help Center
                </Link>

                <Box sx={{ mb: 8 }}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
                            <Search size={32} />
                        </div>
                        <Typography variant="h3" fontWeight="900">
                            Order Troubleshooting
                        </Typography>
                    </div>
                    <Typography className="text-slate-600 dark:text-gray-400 text-lg">
                        Can't find your application or invoice? Follow these steps to locate your records.
                    </Typography>
                </Box>

                <div className="space-y-8">
                    
                    <Accordion defaultExpanded className="rounded-2xl border-none before:hidden shadow-sm overflow-hidden mb-4">
                        <AccordionSummary expandIcon={<ChevronDown />} className="px-6 py-2 bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-white/5">
                            <Typography fontWeight="bold">1. Check your spam/junk folder</Typography>
                        </AccordionSummary>
                        <AccordionDetails className="px-6 py-6 bg-slate-50/50 dark:bg-zinc-900/50">
                            <Typography variant="body2" className="text-slate-600 dark:text-gray-400">
                                Most confirmation emails are sent immediately. Please check your spam folder for an email from <strong>info@indonesianvisas.com</strong> or <strong>noreply@indonesianvisas.com</strong>.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion className="rounded-2xl border-none before:hidden shadow-sm overflow-hidden mb-4">
                        <AccordionSummary expandIcon={<ChevronDown />} className="px-6 py-2 bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-white/5">
                            <Typography fontWeight="bold">2. Search by Passport Number</Typography>
                        </AccordionSummary>
                        <AccordionDetails className="px-6 py-6 bg-slate-50/50 dark:bg-zinc-900/50">
                            <Typography variant="body2" className="text-slate-600 dark:text-gray-400 mb-4">
                                If you applied via an agent or guest checkout, you can still find your application using your passport number and email address on our status tracker.
                            </Typography>
                            <Button 
                                variant="contained" 
                                startIcon={<History size={16} />} 
                                href={formatNavLink(locale, "/check-status")}
                                sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 'bold' }}
                            >
                                Open Status Tracker
                            </Button>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion className="rounded-2xl border-none before:hidden shadow-sm overflow-hidden">
                        <AccordionSummary expandIcon={<ChevronDown />} className="px-6 py-2 bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-white/5">
                            <Typography fontWeight="bold">3. Contact Support with Transaction ID</Typography>
                        </AccordionSummary>
                        <AccordionDetails className="px-6 py-6 bg-slate-50/50 dark:bg-zinc-900/50">
                            <Typography variant="body2" className="text-slate-600 dark:text-gray-400 mb-6">
                                If you have a credit card statement showing a payment to <strong>INDONESIAN VISAS</strong> but no email, we can find your order using the last 4 digits of your card and the transaction date.
                            </Typography>
                            <div className="flex flex-wrap gap-4">
                                <Button 
                                    variant="outlined" 
                                    startIcon={<Mail size={16} />}
                                    href="mailto:support@indonesianvisas.agency"
                                    sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 'bold' }}
                                >
                                    Email Support
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    startIcon={<Smartphone size={16} />}
                                    href="https://wa.me/6285727041992"
                                    sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 'bold' }}
                                >
                                    WhatsApp
                                </Button>
                            </div>
                        </AccordionDetails>
                    </Accordion>

                </div>

                <div className="mt-16 text-center">
                    <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-widest">
                        System Uptime: 99.9%
                    </Typography>
                </div>
            </div>
        </SectionWrapper>
    );
}
