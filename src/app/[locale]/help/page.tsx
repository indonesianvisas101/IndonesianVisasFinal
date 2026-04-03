
"use client";

import React from 'react';
import SectionWrapper from '@/components/layout/SectionWrapper';
import { Typography, Grid, Paper, Box, Button } from '@mui/material';
import { 
    HelpCircle, 
    CreditCard, 
    ShieldCheck, 
    Search, 
    AlertTriangle, 
    MessageCircle,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatNavLink } from '@/utils/seo';

export default function HelpCenterPage() {
    const params = useParams();
    const locale = (params?.locale as string) || 'en';

    const helpCategories = [
        {
            title: "Payment Methods",
            desc: "Understand how to pay via DOKU, PayPal, or Bank Transfer.",
            icon: <CreditCard size={28} className="text-blue-500" />,
            link: formatNavLink(locale, "/help/payment-methods"),
            color: "bg-blue-50"
        },
        {
            title: "Payment Verification",
            desc: "Verify if your payment was processed through our official channels.",
            icon: <ShieldCheck size={28} className="text-green-500" />,
            link: formatNavLink(locale, "/help/payment-verification"),
            color: "bg-green-50"
        },
        {
            title: "Order Not Found",
            desc: "Troubleshoot issues finding your application or invoice.",
            icon: <Search size={28} className="text-amber-500" />,
            link: formatNavLink(locale, "/help/order-not-found"),
            color: "bg-amber-50"
        },
        {
            title: "Scam Warning",
            desc: "Protect yourself from fake websites and unofficial agents.",
            icon: <AlertTriangle size={28} className="text-red-500" />,
            link: formatNavLink(locale, "/help/scam-warning"),
            color: "bg-red-50"
        }
    ];

    return (
        <SectionWrapper id="help-center" className="py-20 bg-slate-50 dark:bg-zinc-950">
            <div className="max-w-6xl mx-auto px-4">
                
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                        <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                            <HelpCircle size={40} />
                        </div>
                    </Box>
                    <Typography variant="h2" fontWeight="900" className="text-slate-900 dark:text-white mb-4">
                        How can we help you?
                    </Typography>
                    <Typography variant="h6" align="center" className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto font-normal text-center">
                        Select a category below to find answers to common questions about payments, orders, and safety.
                    </Typography>
                </div>

                {/* Categories Grid */}
                <Grid container spacing={4} justifyContent="center">
                    {helpCategories.map((cat, idx) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                            <Paper 
                                elevation={0} 
                                className={`p-8 rounded-3xl border border-slate-200 dark:border-white/5 transition-all hover:shadow-xl hover:-translate-y-1 group flex flex-col h-full bg-white dark:bg-zinc-900`}
                            >
                                <div className={`w-14 h-14 ${cat.color} dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    {cat.icon}
                                </div>
                                <Typography variant="h5" fontWeight="800" className="mb-3">
                                    {cat.title}
                                </Typography>
                                <Typography className="text-slate-600 dark:text-gray-400 text-sm mb-8 flex-grow">
                                    {cat.desc}
                                </Typography>
                                <Link href={cat.link} className="inline-flex items-center text-primary font-bold gap-2 text-sm hover:underline">
                                    Learn More <ChevronRight size={16} />
                                </Link>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Contact Section */}
                <Paper 
                    elevation={0} 
                    className="mt-20 p-10 rounded-3xl border border-dashed border-primary/30 bg-primary/5 dark:bg-primary/10 text-center"
                >
                    <Typography variant="h5" fontWeight="800" align="center" className="mb-2">
                        Still need assistance?
                    </Typography>
                    <Typography align="center" className="text-slate-600 dark:text-gray-400 mb-8 max-w-lg mx-auto text-center">
                        Our support team is available via WhatsApp and Email to assist with specific inquiries and custom visa requirements.
                    </Typography>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button 
                            variant="contained" 
                            startIcon={<MessageCircle />}
                            href="https://wa.me/6285727041992"
                            target="_blank"
                            sx={{ 
                                py: 1.5, px: 4, borderRadius: '12px', bgcolor: '#25D366', 
                                '&:hover': { bgcolor: '#128C7E' }, textTransform: 'none', fontWeight: 'bold' 
                            }}
                        >
                            WhatsApp Support
                        </Button>
                        <Button 
                            variant="outlined" 
                            startIcon={<Search />}
                            href="/check-status"
                            sx={{ 
                                py: 1.5, px: 4, borderRadius: '12px', textTransform: 'none', fontWeight: 'bold' 
                            }}
                        >
                            Track Order Status
                        </Button>
                    </div>
                </Paper>

            </div>
        </SectionWrapper>
    );
}
