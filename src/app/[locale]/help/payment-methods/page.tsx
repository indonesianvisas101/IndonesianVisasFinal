
"use client";

import React from 'react';
import SectionWrapper from '@/components/layout/SectionWrapper';
import { Typography, Paper, Box, Grid, Button, Divider } from '@mui/material';
import { CreditCard, Banknote, Globe, ArrowLeft, Info, Landmark } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatNavLink } from '@/utils/seo';

export default function PaymentMethodsPage() {
    const params = useParams();
    const locale = (params?.locale as string) || 'en';

    return (
        <SectionWrapper id="payment-methods" className="py-20 bg-white dark:bg-zinc-950">
            <div className="max-w-4xl mx-auto px-4">
                
                <Link href={formatNavLink(locale, "/help")} className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 text-sm font-bold uppercase tracking-widest">
                    <ArrowLeft size={16} /> Help Center
                </Link>

                <Box sx={{ mb: 8 }}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                            <CreditCard size={32} />
                        </div>
                        <Typography variant="h3" fontWeight="900">
                            Supported Payment Methods
                        </Typography>
                    </div>
                    <Typography className="text-slate-600 dark:text-gray-400 text-lg">
                        Choose from a variety of secure payment options to process your visa application.
                    </Typography>
                </Box>

                <div className="space-y-12">
                    
                    {/* Method 1: DOKU */}
                    <Box>
                        <Typography variant="h5" fontWeight="800" className="mb-4">
                            1. DOKU Payment Gateway (IDR Only)
                        </Typography>
                        <Typography className="text-slate-600 dark:text-gray-400 mb-6">
                            Our primary gateway for local and international cards. Payments are processed in Indonesian Rupiah (IDR).
                        </Typography>
                        <Grid container spacing={3}>
                            {['Credit/Debit Card (Visa, Mastercard, JCB)', 'Virtual Account (BCA, Mandiri, BNI)', 'QRIS (Gopay, ShopeePay)', 'Alfamart / Indomaret'].map((m, i) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={i}>
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        <Typography variant="body2" fontWeight="bold">{m}</Typography>
                                    </div>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Method 2: International */}
                    <Box>
                        <Typography variant="h5" fontWeight="800" className="mb-4">
                            2. International Payments (USD/EUR)
                        </Typography>
                        <Typography className="text-slate-600 dark:text-gray-400 mb-6">
                            For users outside Indonesia who prefer paying in their local currency.
                        </Typography>
                        <div className="space-y-4">
                            <Paper elevation={0} className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-zinc-900">
                                <div className="flex items-start gap-4">
                                    <Globe className="text-primary mt-1" />
                                    <div>
                                        <Typography fontWeight="bold">PayPal & Wise</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Contact our support team for a dedicated PayPal or Wise payment link. We apply a 5% processing fee for international currency conversions.
                                        </Typography>
                                    </div>
                                </div>
                            </Paper>
                        </div>
                    </Box>

                    {/* Method 3: Direct Transfer */}
                    <Box>
                        <Typography variant="h5" fontWeight="800" className="mb-4">
                            3. Direct Bank Transfer (BCA)
                        </Typography>
                        <Typography className="text-slate-600 dark:text-gray-400 mb-6">
                            You can also pay via direct transfer to our corporate account.
                        </Typography>
                        <Paper elevation={0} className="p-6 rounded-2xl border border-dashed border-primary/30 bg-primary/5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Typography variant="caption" fontWeight="bold" color="text.secondary">BANK NAME</Typography>
                                    <Typography variant="body1" fontWeight="bold">Bank Central Asia (BCA)</Typography>
                                </div>
                                <div>
                                    <Typography variant="caption" fontWeight="bold" color="text.secondary">ACCOUNT NUMBER</Typography>
                                    <Typography variant="body1" fontWeight="bold">611-017850</Typography>
                                </div>
                                <div>
                                    <Typography variant="caption" fontWeight="bold" color="text.secondary">ACCOUNT HOLDER</Typography>
                                    <Typography variant="body1" fontWeight="bold">Indonesian Visas Agency</Typography>
                                </div>
                                <div>
                                    <Typography variant="caption" fontWeight="bold" color="text.secondary">SWIFT CODE</Typography>
                                    <Typography variant="body1" fontWeight="bold">CENAIDJA</Typography>
                                </div>
                                <div className="sm:col-span-2">
                                    <Typography variant="caption" fontWeight="bold" color="text.secondary">BRANCH ADDRESS</Typography>
                                    <Typography variant="body1" fontWeight="bold">Jl. Tibung Sari No 11, Denpasar, Bali 80117</Typography>
                                </div>
                            </div>
                        </Paper>
                        <Box sx={{ mt: 3, p: 2, bgcolor: 'amber.50', borderRadius: 2, border: '1px solid #FFD54F' }}>
                            <Typography variant="caption" color="warning.main" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Info size={14} /> IMPORTANT: Include your Order Reference in the transfer note.
                            </Typography>
                        </Box>
                    </Box>

                </div>
            </div>
        </SectionWrapper>
    );
}
