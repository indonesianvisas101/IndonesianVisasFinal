"use client";

import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Grid, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip, IconButton, 
    Stack, LinearProgress, Tooltip, Button, alpha, useTheme
} from '@mui/material';
import { 
    Refresh as RefreshIcon,
    CameraAlt as CameraIcon,
    Badge as BadgeIcon,
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    ShoppingCart as ShoppingCartIcon,
    Public as PublicIcon,
    ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import DocumentViewer from '../DocumentViewer';

export default function MarketingTab() {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [funnel, setFunnel] = useState({ totalLeads: 0, converted: 0, abandoned: 0 });
    const [sources, setSources] = useState<any[]>([]);
    const [recentLeads, setRecentLeads] = useState<any[]>([]);
    const [viewingDoc, setViewingDoc] = useState<{ url: string; name: string } | null>(null);

    const fetchMarketingData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/marketing');
            const data = await res.json();
            if (data.funnel) setFunnel(data.funnel);
            if (data.sources) setSources(data.sources);
            if (data.recentLeads) setRecentLeads(data.recentLeads);
        } catch (error) {
            console.error('Failed to fetch marketing data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarketingData();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <Box sx={{ p: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: '-0.02em' }}>
                    Marketing Intelligence
                </Typography>
                <IconButton onClick={fetchMarketingData} size="small" sx={{ bgcolor: 'action.hover' }}>
                    <RefreshIcon />
                </IconButton>
            </Stack>

            <Grid container spacing={3}>
                {/* Funnel Overview */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper sx={{ p: 3, height: '100%', borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Conversion Funnel</Typography>
                        <Stack spacing={3} sx={{ mt: 3 }}>
                            <FunnelStep 
                                label="Total Leads" 
                                count={funnel.totalLeads} 
                                percentage={100} 
                                icon={<PeopleIcon />} 
                                color={theme.palette.primary.main}
                            />
                            <FunnelStep 
                                label="High Intent (Ghosts)" 
                                count={recentLeads.length} 
                                percentage={Math.round((recentLeads.length / funnel.totalLeads) * 100) || 0} 
                                icon={<TrendingUpIcon />} 
                                color={theme.palette.warning.main}
                            />
                            <FunnelStep 
                                label="Converted (Paid)" 
                                count={funnel.converted} 
                                percentage={Math.round((funnel.converted / funnel.totalLeads) * 100) || 0} 
                                icon={<ShoppingCartIcon />} 
                                color={theme.palette.success.main}
                            />
                        </Stack>
                        <Box sx={{ mt: 4, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2, border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.1) }}>
                            <Typography variant="body2" color="text.secondary" fontWeight="bold">
                                🎯 Current Conversion: {funnel.totalLeads > 0 ? ((funnel.converted / funnel.totalLeads) * 100).toFixed(1) : 0}%
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Source Performance */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper sx={{ p: 3, height: '100%', borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Acquisition Channels</Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Source</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Leads</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Conv.</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Revenue</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sources.map((source: any) => (
                                        <TableRow key={source.name} hover>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <PublicIcon fontSize="small" color="disabled" />
                                                    <Typography variant="body2" fontWeight="bold">{source.name}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="right">{source.leads}</TableCell>
                                            <TableCell align="right">{source.conversions}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: '900', color: 'success.main' }}>
                                                {formatCurrency(source.revenue)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Lead Intelligence Hub - Detailed Sub-Panel */}
            <Box sx={{ mt: 4 }}>
                <Paper sx={{ p: 0, borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                    <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.03), borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.main', color: 'white', display: 'flex' }}>
                                <PeopleIcon />
                            </Box>
                            <Box>
                                <Typography variant="h6" fontWeight="900">Lead Intelligence Hub</Typography>
                                <Typography variant="caption" color="text.secondary">Detailed organization of recent high-intent prospects and ghost leads</Typography>
                            </Box>
                        </Stack>
                    </Box>
                    
                    <TableContainer>
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead sx={{ bgcolor: alpha(theme.palette.action.hover, 0.5) }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>PROSPECT</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>CONTACT INFO</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>INTENT</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>DOCUMENTS</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>ATTRIBUTION</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>ACTION</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentLeads.map((lead: any) => {
                                    const whatsappLink = lead.phone ? `https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}` : null;
                                    
                                    return (
                                        <TableRow key={lead.id} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="900" sx={{ color: 'primary.main' }}>
                                                    {lead.name || 'Anonymous Applicant'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ID: {lead.id.substring(0, 8)} • {new Date(lead.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack spacing={0.5}>
                                                    <Typography variant="body2" fontWeight="bold">{lead.email}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{lead.phone || 'No Phone Number'}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={lead.visaType} 
                                                    size="small" 
                                                    sx={{ 
                                                        borderRadius: '6px', 
                                                        fontWeight: '900', 
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1), 
                                                        color: 'primary.main',
                                                        border: '1px solid',
                                                        borderColor: alpha(theme.palette.primary.main, 0.2)
                                                    }} 
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    {lead.photoUrl ? (
                                                        <Tooltip title="View Photo">
                                                            <IconButton 
                                                                size="small" 
                                                                sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}
                                                                onClick={() => setViewingDoc({ url: lead.photoUrl, name: `${lead.name}'s Photo` })}
                                                            >
                                                                <CameraIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    ) : (
                                                        <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <CameraIcon fontSize="small" sx={{ opacity: 0.2 }} />
                                                        </Box>
                                                    )}
                                                    {lead.passportUrl ? (
                                                        <Tooltip title="View Passport">
                                                            <IconButton 
                                                                size="small" 
                                                                sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main' }}
                                                                onClick={() => setViewingDoc({ url: lead.passportUrl, name: `${lead.name}'s Passport` })}
                                                            >
                                                                <BadgeIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    ) : (
                                                        <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <BadgeIcon fontSize="small" sx={{ opacity: 0.2 }} />
                                                        </Box>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold' }}>
                                                    {(lead.attributionData as any)?.utm_source || 'Direct Traffic'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {(lead.attributionData as any)?.utm_medium || 'Organic'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                {whatsappLink && (
                                                    <Button 
                                                        variant="contained" 
                                                        size="small" 
                                                        href={whatsappLink} 
                                                        target="_blank"
                                                        startIcon={<ArrowForwardIcon />}
                                                        sx={{ 
                                                            borderRadius: '12px', 
                                                            textTransform: 'none', 
                                                            fontWeight: '900',
                                                            bgcolor: '#25D366',
                                                            boxShadow: 'none',
                                                            '&:hover': { bgcolor: '#128C7E', boxShadow: 'none' }
                                                        }}
                                                    >
                                                        WhatsApp
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {recentLeads.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                            <Typography color="text.secondary">No leads captured yet.</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>

            {/* Document Viewer Integration */}
            {viewingDoc && (
                <DocumentViewer 
                    open={!!viewingDoc}
                    onClose={() => setViewingDoc(null)}
                    documentUrl={viewingDoc.url}
                    documentName={viewingDoc.name}
                />
            )}
        </Box>
    );
}

function FunnelStep({ label, count, percentage, icon, color }: any) {
    const theme = useTheme();
    return (
        <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(color, 0.1), color: color, display: 'flex' }}>{icon}</Box>
                <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" fontWeight="bold">{label}</Typography>
                        <Typography variant="body2" fontWeight="bold">{count}</Typography>
                    </Stack>
                    <Box sx={{ mt: 1 }}>
                        <LinearProgress 
                            variant="determinate" 
                            value={percentage} 
                            sx={{ 
                                height: 6, 
                                borderRadius: 3,
                                bgcolor: alpha(color, 0.1),
                                '& .MuiLinearProgress-bar': { backgroundColor: color }
                            }} 
                        />
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
}
