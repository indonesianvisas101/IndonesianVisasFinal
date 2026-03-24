"use client";

import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TextField,
    Grid,
    Chip,
    TablePagination,
    CircularProgress,
    ButtonGroup,
    Tooltip
} from '@mui/material';
import { Download, FileText, Search, RefreshCw, Info } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function FinancePanel() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [period, setPeriod] = useState<'30d' | '90d' | '1y' | 'all'>('all');

    const fetchFinanceData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/applications'); // Admin GET returns all
            if (res.ok) {
                const data = await res.json();
                // We want only applications with invoices
                const appsWithInvoices = data.filter((app: any) => app.invoice && app.invoice.status === 'PAID');
                setInvoices(appsWithInvoices);
            }
        } catch (error) {
            console.error("Failed to fetch finance data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredInvoices = invoices.filter(item => {
        const matchesSearch = item.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.slug?.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSearch) return false;
        if (period === 'all') return true;

        const date = new Date(item.appliedAt);
        const now = new Date();
        const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

        if (period === '30d') return diffDays <= 30;
        if (period === '90d') return diffDays <= 90;
        if (period === '1y') return diffDays <= 365;

        return true;
    });

    const exportToCSV = () => {
        const headers = ["Date", "Order ID", "Customer", "Visa", "Service Fee", "PPh 23 (2%)", "Gateway Fee", "Grand Total", "Status"];
        const rows = filteredInvoices.map(item => [
            new Date(item.appliedAt).toLocaleDateString(),
            item.slug,
            item.guestName,
            item.visaName,
            item.invoice?.serviceFee || 0,
            item.invoice?.pph23Amount || 0,
            item.invoice?.gatewayFee || 0,
            item.invoice?.amount || 0,
            item.invoice?.status
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `tax_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Calculate Totals
    const totalService = filteredInvoices.reduce((acc, curr) => acc + Number(curr.invoice?.serviceFee || 0), 0);
    const totalTax = filteredInvoices.reduce((acc, curr) => acc + Number(curr.invoice?.pph23Amount || 0), 0);
    const totalGateway = filteredInvoices.reduce((acc, curr) => acc + Number(curr.invoice?.gatewayFee || 0), 0);
    const totalGrand = filteredInvoices.reduce((acc, curr) => acc + Number(curr.invoice?.amount || 0), 0);

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">Finance & Tax Reports</Typography>
                <Box display="flex" gap={2} alignItems="center">
                    <ButtonGroup size="small" variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                        <Button variant={period === '30d' ? 'contained' : 'outlined'} onClick={() => setPeriod('30d')}>30 Days</Button>
                        <Button variant={period === '90d' ? 'contained' : 'outlined'} onClick={() => setPeriod('90d')}>90 Days</Button>
                        <Button variant={period === '1y' ? 'contained' : 'outlined'} onClick={() => setPeriod('1y')}>1 Year</Button>
                        <Button variant={period === 'all' ? 'contained' : 'outlined'} onClick={() => setPeriod('all')}>All</Button>
                    </ButtonGroup>

                    <Button 
                        variant="outlined" 
                        startIcon={<RefreshCw size={18} />} 
                        onClick={fetchFinanceData}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<Download size={18} />} 
                        onClick={exportToCSV}
                        color="primary"
                    >
                        Export CSV
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12, sm: 3 }}>
                    <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 2 }}>
                        <Tooltip title="Sum of all visa application service fees for PAID invoices within the period." arrow placement="top">
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 'bold' }}>Total Service Revenue</Typography>
                                <Info size={14} style={{ opacity: 0.8 }} />
                            </Box>
                        </Tooltip>
                        <Typography variant="h5" fontWeight="bold">IDR {totalService.toLocaleString()}</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                    <Paper sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.contrastText', borderRadius: 2 }}>
                        <Tooltip title="Estimated 2% withholding tax for standard corporate financial audits." arrow placement="top">
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 'bold' }}>PPh 23 Tax Collected</Typography>
                                <Info size={14} style={{ opacity: 0.8 }} />
                            </Box>
                        </Tooltip>
                        <Typography variant="h5" fontWeight="bold">IDR {totalTax.toLocaleString()}</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                    <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 2 }}>
                        <Tooltip title="Combined platform and gateway fees parsed from client payment processors." arrow placement="top">
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 'bold' }}>Gateway Fees Incurred</Typography>
                                <Info size={14} style={{ opacity: 0.8 }} />
                            </Box>
                        </Tooltip>
                        <Typography variant="h5" fontWeight="bold">IDR {totalGateway.toLocaleString()}</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                    <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText', borderRadius: 2 }}>
                        <Tooltip title="Net settler and Grand amount of all Cash Invoices that are fully settled/PAID." arrow placement="top">
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 'bold' }}>Grand Total (Cash In)</Typography>
                                <Info size={14} style={{ opacity: 0.8 }} />
                            </Box>
                        </Tooltip>
                        <Typography variant="h5" fontWeight="bold">IDR {totalGrand.toLocaleString()}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Monthly Summary Section */}
            <Typography variant="h6" fontWeight="bold" mb={2}>Monthly Tax Summaries</Typography>
            <Grid container spacing={3} mb={4}>
                {Object.entries(
                    filteredInvoices.reduce((acc: any, curr) => {
                        const month = new Date(curr.appliedAt).toLocaleString('default', { month: 'long', year: 'numeric' });
                        if (!acc[month]) acc[month] = { service: 0, tax: 0, total: 0, count: 0 };
                        acc[month].service += Number(curr.invoice?.serviceFee || 0);
                        acc[month].tax += Number(curr.invoice?.pph23Amount || 0);
                        acc[month].total += Number(curr.invoice?.amount || 0);
                        acc[month].count += 1;
                        return acc;
                    }, {})
                ).map(([month, stats]: [string, any]) => (
                    <Grid size={{ xs: 12, md: 4 }} key={month}>
                        <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" color="primary">{month}</Typography>
                            <Box display="flex" justifyContent="space-between" mt={1}>
                                <Typography variant="body2" color="text.secondary">Applications:</Typography>
                                <Typography variant="body2" fontWeight="bold">{stats.count}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">Tax (PPh 23):</Typography>
                                <Typography variant="body2" fontWeight="bold">IDR {stats.tax.toLocaleString()}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mt={1} pt={1} borderTop="1px dashed" borderColor="divider">
                                <Typography variant="body2" fontWeight="bold">Total Revenue:</Typography>
                                <Typography variant="body2" fontWeight="bold" color="success.main">IDR {stats.total.toLocaleString()}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h6" fontWeight="bold" mb={2}>Transaction Details</Typography>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <Box p={2}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search by ID or Name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <Search size={18} className="mr-2 text-gray-400" />
                        }}
                    />
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell align="right">Service Fee</TableCell>
                                <TableCell align="right">PPh 23</TableCell>
                                <TableCell align="right">Gateway Fee</TableCell>
                                <TableCell align="right">Total</TableCell>
                                <TableCell align="center">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : filteredInvoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{new Date(item.appliedAt).toLocaleDateString()}</TableCell>
                                    <TableCell><Typography variant="body2" fontWeight="bold">{item.slug}</Typography></TableCell>
                                    <TableCell>{item.guestName || item.user?.name}</TableCell>
                                    <TableCell align="right">{Number(item.invoice?.serviceFee || 0).toLocaleString()}</TableCell>
                                    <TableCell align="right">{Number(item.invoice?.pph23Amount || 0).toLocaleString()}</TableCell>
                                    <TableCell align="right">{Number(item.invoice?.gatewayFee || 0).toLocaleString()}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                        {Number(item.invoice?.amount || 0).toLocaleString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip 
                                            label={item.invoice?.status} 
                                            size="small" 
                                            color={item.invoice?.status === 'PAID' ? 'success' : 'warning'}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && filteredInvoices.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                        No financial data found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={filteredInvoices.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
