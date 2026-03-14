
"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Stack,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    LinearProgress,
    CircularProgress,
    IconButton
} from "@mui/material";
import {
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    ShoppingCart as ShoppingCartIcon,
    Public as PublicIcon,
    Refresh as RefreshIcon,
    ArrowForward as ArrowForwardIcon
} from "@mui/icons-material";
import { formatCurrency } from "@/lib/utils";

export default function MarketingTab() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchMarketingData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/marketing');
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (e) {
            console.error("Marketing fetch failed", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarketingData();
    }, []);

    if (loading) return <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress /></Box>;
    if (!data) return <Box sx={{ p: 3 }}><Typography color="error">Failed to load marketing data.</Typography></Box>;

    const { funnel, sources, recentLeads } = data;

    return (
        <Box sx={{ p: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">Marketing Intelligence</Typography>
                <IconButton onClick={fetchMarketingData} size="small"><RefreshIcon /></IconButton>
            </Stack>

            <Grid container spacing={3}>
                {/* Funnel Overview */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Sales Funnel</Typography>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <FunnelStep 
                                label="Total Leads" 
                                count={funnel.totalLeads} 
                                percentage={100} 
                                icon={<PeopleIcon color="primary" />} 
                                color="#9155FD"
                            />
                            <FunnelStep 
                                label="Inquiries (Warm)" 
                                count={Math.round(funnel.totalLeads * 0.6)} 
                                percentage={60} 
                                icon={<TrendingUpIcon color="warning" />} 
                                color="#FFB400"
                            />
                            <FunnelStep 
                                label="Converted (Paid)" 
                                count={funnel.converted} 
                                percentage={Math.round((funnel.converted / funnel.totalLeads) * 100) || 0} 
                                icon={<ShoppingCartIcon color="success" />} 
                                color="#56CA00"
                            />
                        </Stack>
                        <Box sx={{ mt: 4, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Conversion Rate:</strong> {((funnel.converted / funnel.totalLeads) * 100).toFixed(1)}% from Lead to Paid.
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Source Performance */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Channel Performance</Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Source</TableCell>
                                        <TableCell align="right">Leads</TableCell>
                                        <TableCell align="right">Conv.</TableCell>
                                        <TableCell align="right">Revenue</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sources.map((source: any) => (
                                        <TableRow key={source.name}>
                                            <TableCell>{source.name === 'Organic/Direct' ? <Stack direction="row" spacing={1} alignItems="center"><PublicIcon fontSize="inherit"/> <span>{source.name}</span></Stack> : source.name}</TableCell>
                                            <TableCell align="right">{source.leads}</TableCell>
                                            <TableCell align="right">{source.conversions}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatCurrency(source.revenue)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Recent Leads */}
                <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Recent Ghost Leads (Step 1 Complete)</Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Contact</TableCell>
                                        <TableCell>Visa Interest</TableCell>
                                        <TableCell>Source</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Captured At</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentLeads.map((lead: any) => (
                                        <TableRow key={lead.id}>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{lead.name || 'Anonymous'}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{lead.email}</Typography>
                                                <Typography variant="caption" color="text.secondary">{lead.phone}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={lead.visaType} size="small" variant="outlined" />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="caption">{(lead.attributionData as any)?.utm_source || 'Direct'}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={lead.status} 
                                                    size="small" 
                                                    color={lead.status === 'CONVERTED' ? 'success' : 'primary'} 
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Date(lead.createdAt).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {recentLeads.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                                No leads captured yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

function FunnelStep({ label, count, percentage, icon, color }: any) {
    return (
        <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'action.hover' }}>{icon}</Box>
                <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" fontWeight="bold">{label}</Typography>
                        <Typography variant="body2" fontWeight="bold">{count}</Typography>
                    </Stack>
                    <Box sx={{ mt: 0.5 }}>
                        <LinearProgress 
                            variant="determinate" 
                            value={percentage} 
                            sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                bgcolor: 'action.hover',
                                '& .MuiLinearProgress-bar': { backgroundColor: color }
                            }} 
                        />
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
}
