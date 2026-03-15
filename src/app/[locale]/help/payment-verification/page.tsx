
"use client";

import React from 'react';
import SectionWrapper from '@/components/layout/SectionWrapper';
import { Typography, Paper, Box, Button, Divider, Alert } from '@mui/material';
import { ShieldCheck, CheckCircle, Smartphone, Globe, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PaymentVerificationPage() {
    const params = useParams();
    const locale = params?.locale || 'en';

    return (
        <SectionWrapper id="payment-verification" className="py-20 bg-white dark:bg-zinc-950">
            <div className="max-w-4xl mx-auto px-4">
                
                {/* Back Button */}
                <Link href={`/${locale}/help`} className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 text-sm font-bold uppercase tracking-widest">
                    <ArrowLeft size={16} /> Back to Help Center
                </Link>

                {/* Hero */}
                <Box sx={{ mb: 6 }}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                            <ShieldCheck size={32} />
                        </div>
                        <Typography variant="h3" fontWeight="900" className="text-slate-900 dark:text-white">
                            Payment Verification
                        </Typography>
                    </div>
                    <Typography className="text-slate-600 dark:text-gray-400 text-lg">
                        Ensuring your transaction is safe, official, and correctly recorded in our system.
                    </Typography>
                </Box>

                <Alert severity="info" className="mb-10 rounded-2xl border border-blue-100" icon={<ShieldCheck />}>
                    <Typography variant="body2" fontWeight="bold">
                        Indonesian Visas never requests payment via personal bank accounts not listed here, or via untraceable crypto methods.
                    </Typography>
                </Alert>

                {/* Verification Steps */}
                <div className="space-y-12">
                    
                    {/* Official Merchant Details */}
                    <Box>
                        <Typography variant="h5" fontWeight="800" className="mb-4">
                            1. Check the Merchant Statement
                        </Typography>
                        <Typography className="text-slate-600 dark:text-gray-400 mb-6">
                            When you make a payment, the following descriptor will appear on your bank statement or credit card bill:
                        </Typography>
                        
                        <Paper elevation={0} className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-zinc-900">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Primary Merchant</label>
                                    <Typography variant="h6" fontWeight="bold" className="font-mono text-primary">DOKU *INDONESIAN VISAS</Typography>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Backup Merchant</label>
                                    <Typography variant="h6" fontWeight="bold" className="font-mono text-primary">JOKUL *VISA AGENCY</Typography>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Manual Transfer (BCA)</label>
                                    <Typography variant="h6" fontWeight="bold" className="font-mono text-primary">Wahyudin Damopolii</Typography>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Official Website</label>
                                    <Typography variant="h6" fontWeight="bold" className="font-mono text-primary">indonesianvisas.com</Typography>
                                </div>
                            </div>
                        </Paper>
                    </Box>

                    {/* Official Domain */}
                    <Box>
                        <Typography variant="h5" fontWeight="800" className="mb-4">
                            2. Verify the Payment Domain
                        </Typography>
                        <Typography className="text-slate-600 dark:text-gray-400 mb-6">
                            All automated payments (DOKU/Credit Card) is strictly handled on the official domain. Never enter credit card details on satellite domains.
                        </Typography>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl">
                                <CheckCircle className="text-green-500" />
                                <div>
                                    <Typography fontWeight="bold" className="text-green-700 dark:text-green-400">Official URL</Typography>
                                    <Typography variant="body2" className="font-mono">https://indonesianvisas.com/invoice/...</Typography>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl">
                                <Globe size={24} className="text-amber-500" />
                                <div>
                                    <Typography fontWeight="bold" className="text-amber-700 dark:text-amber-400">Satellite Redirects</Typography>
                                    <Typography variant="body2" className="font-mono text-gray-500">*.agency / *.online / *.bali.enterprises</Typography>
                                    <Typography variant="caption" color="text.secondary">These domains must REDIRECT to indonesianvisas.com before payment.</Typography>
                                </div>
                            </div>
                        </div>
                    </Box>

                    {/* Verification Tool */}
                    <Paper 
                        elevation={0} 
                        className="p-10 rounded-3xl bg-slate-900 text-white relative overflow-hidden"
                    >
                        <div className="relative z-10 text-center">
                            <Typography variant="h5" fontWeight="900" className="mb-4">
                                Still Unsure?
                            </Typography>
                            <Typography className="text-gray-400 mb-8">
                                If you have a transaction ID or Order ID, use our live verification tool to check its validity.
                            </Typography>
                            <Button 
                                variant="contained" 
                                href="/check-status" 
                                color="primary"
                                sx={{ borderRadius: '12px', px: 4, py: 1.5, fontWeight: 'bold' }}
                            >
                                Re-verify Transaction
                            </Button>
                        </div>
                        {/* Abstract background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32" />
                    </Paper>

                    {/* Contact Support */}
                    <Box className="text-center pt-8">
                        <Typography variant="body2" className="text-gray-400 mb-4 italic">
                            Report suspicious activity or unauthorized payment requests.
                        </Typography>
                        <Button 
                            variant="outlined" 
                            startIcon={<Smartphone />}
                            href="https://wa.me/6285727041992"
                            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 'bold' }}
                        >
                            Contact Fraud Department
                        </Button>
                    </Box>
                </div>
            </div>
        </SectionWrapper>
    );
}
