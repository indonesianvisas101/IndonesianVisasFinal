
"use client";

import React, { useState } from 'react';
import SectionWrapper from '@/components/layout/SectionWrapper';
import { 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    CircularProgress, 
    Alert,
    Divider,
    Grid,
    Chip
} from '@mui/material';
import { Search, History, ShieldCheck, Mail, CreditCard, Hash } from 'lucide-react';

export default function CheckStatusPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");
    const [searchData, setSearchData] = useState({
        order_id: "",
        invoice_number: "",
        email: "",
        passport_number: ""
    });

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await fetch('/api/public/order-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(searchData)
            });

            const data = await res.json();
            if (res.ok) {
                setResult(data);
            } else {
                setError(data.error || "Execution failed. Please try again.");
            }
        } catch (err) {
            setError("Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const s = status?.toLowerCase();
        if (s === 'paid' || s === 'active' || s === 'completed' || s === 'approved') return 'success';
        if (s === 'pending' || s === 'processing') return 'warning';
        if (s === 'failed' || s === 'rejected') return 'error';
        return 'default';
    };

    return (
        <SectionWrapper id="check-status" className="py-20 bg-slate-50 dark:bg-zinc-950 min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
                
                {/* Header */}
                <div className="text-center mb-12">
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                        <div className="p-4 bg-primary/10 rounded-full text-primary">
                            <History size={40} />
                        </div>
                    </Box>
                    <Typography variant="h3" fontWeight="900" className="text-slate-900 dark:text-white mb-4">
                        Check Order Status
                    </Typography>
                    <Typography className="text-slate-600 dark:text-gray-400 max-w-xl mx-auto">
                        Track your visa application progress in real-time. Enter your order details below to get an instant update.
                    </Typography>
                </div>

                {/* Search Form */}
                <Paper elevation={0} className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 glass-card mb-10">
                    <form onSubmit={handleSearch}>
                        <Grid container spacing={3} sx={{ '& .MuiGrid-root': { width: '100%' } }}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Hash size={16} className="text-primary" />
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Order ID or Slug</label>
                                </div>
                                <TextField 
                                    fullWidth
                                    placeholder="e.g. mark-a2c3-b211"
                                    value={searchData.order_id}
                                    onChange={(e) => setSearchData({...searchData, order_id: e.target.value})}
                                    variant="outlined"
                                    size="medium"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <CreditCard size={16} className="text-primary" />
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Invoice Number</label>
                                </div>
                                <TextField 
                                    fullWidth
                                    placeholder="e.g. INV-ABCDEF"
                                    value={searchData.invoice_number}
                                    onChange={(e) => setSearchData({...searchData, invoice_number: e.target.value})}
                                    variant="outlined"
                                />
                            </Grid>
                            
                            <Grid size={{ xs: 12 }}>
                                <div className="flex items-center gap-2 my-2">
                                    <Divider className="flex-grow" />
                                    <span className="text-[10px] font-bold text-gray-400">OR SEARCH BY PERSONAL INFO</span>
                                    <Divider className="flex-grow" />
                                </div>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Mail size={16} className="text-primary" />
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Applicant Email</label>
                                </div>
                                <TextField 
                                    fullWidth
                                    type="email"
                                    placeholder="your@email.com"
                                    value={searchData.email}
                                    onChange={(e) => setSearchData({...searchData, email: e.target.value})}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <ShieldCheck size={16} className="text-primary" />
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Passport Number</label>
                                </div>
                                <TextField 
                                    fullWidth
                                    placeholder="Enter Passport Number"
                                    value={searchData.passport_number}
                                    onChange={(e) => setSearchData({...searchData, passport_number: e.target.value})}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Button 
                                    type="submit"
                                    variant="contained" 
                                    fullWidth 
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Search />}
                                    sx={{ 
                                        py: 2, 
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #4B0082 0%, #1E005A 100%)',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        boxShadow: '0 8px 20px rgba(75, 0, 130, 0.3)'
                                    }}
                                >
                                    {loading ? "Searching..." : "Track My Application"}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>

                {error && (
                    <Alert severity="error" className="mb-8 rounded-2xl" variant="filled">
                        {error}
                    </Alert>
                )}

                {/* Results Area */}
                {result && (
                    <Paper elevation={0} className="p-8 rounded-3xl border-2 border-primary/20 bg-white dark:bg-zinc-900 shadow-2xl">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div>
                                <Typography variant="h5" fontWeight="900" color="primary">
                                    Order Found
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    ID: {result.order_id} • Applied on {new Date(result.applied_at).toLocaleDateString()}
                                </Typography>
                            </div>
                            <Chip 
                                label={result.application_status.toUpperCase()} 
                                color={getStatusColor(result.application_status)} 
                                sx={{ fontWeight: 'bold', borderRadius: '8px', px: 2, py: 2.5 }}
                            />
                        </div>

                        <Divider className="mb-8" />

                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <div className="space-y-6">
                                    <div>
                                        <Typography variant="caption" className="uppercase tracking-widest text-gray-400 font-bold block mb-1">
                                            Visa Type
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold">
                                            {result.visa_name || "Standard Application"}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography variant="caption" className="uppercase tracking-widest text-gray-400 font-bold block mb-1">
                                            Applicant
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold">
                                            {result.applicant_first_name} ****
                                        </Typography>
                                    </div>
                                </div>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <div className="space-y-6">
                                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                                        <Typography variant="caption" className="uppercase tracking-widest text-gray-400 font-bold block mb-1">
                                            Financial Status
                                        </Typography>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${result.invoice_status === 'PAID' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
                                            <Typography variant="body1" fontWeight="bold">
                                                Invoice: {result.invoice_status}
                                            </Typography>
                                        </div>
                                        <Typography variant="caption" color="text.secondary">
                                            Via {result.payment_method}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography variant="caption" className="uppercase tracking-widest text-gray-400 font-bold block mb-1">
                                            Last Updated
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(result.last_update).toLocaleString()}
                                        </Typography>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>

                        <div className="mt-10 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <Typography variant="body2" className="text-center italic">
                                For detailed information or to download documents, please log in to your dashboard or check your registered email.
                            </Typography>
                        </div>
                    </Paper>
                )}

                {/* Footer Info */}
                <div className="mt-12 text-center text-gray-400 text-sm">
                    <p>Protected by Indonesian Visas Security Protocol</p>
                    <p className="mt-1">NIB: 0402260034806 | Licensed Immigration Sponsor</p>
                </div>
            </div>
        </SectionWrapper>
    );
}
