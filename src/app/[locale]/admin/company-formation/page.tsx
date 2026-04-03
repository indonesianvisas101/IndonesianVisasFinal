"use client";

import React, { useState, useEffect } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Typography, 
    Chip, 
    Button, 
    IconButton,
    TextField,
    InputAdornment,
    Box,
    Card,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    CircularProgress
} from '@mui/material';
import { 
    Search as SearchIcon, 
    Visibility as ViewIcon, 
    Download as DownloadIcon,
    FilterAlt as FilterIcon,
    Business as BusinessIcon
} from '@mui/icons-material';

interface FormationRequest {
    id: string;
    companyName: string;
    applicantName: string;
    applicantEmail: string;
    equityCapital: string;
    paymentStatus: string;
    formationStatus: string;
    createdAt: string;
}

export default function AdminCompanyFormationPage() {
    const [requests, setRequests] = useState<FormationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/company-formation');
            const data = await res.json();
            setRequests(data);
        } catch (e) {
            console.error("Failed to fetch requests", e);
        } finally {
            setLoading(false);
        }
    };

    const filteredRequests = requests.filter(r => 
        r.companyName.toLowerCase().includes(search.toLowerCase()) || 
        r.applicantName.toLowerCase().includes(search.toLowerCase())
    );

    const handleViewDetail = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/company-formation?id=${id}`);
            const data = await res.json();
            setSelectedRequest(data);
            setOpenDialog(true);
        } catch (e) {
            console.error("Failed to fetch detail", e);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'success';
            case 'UNPAID': return 'error';
            case 'DONE': return 'success';
            case 'PROCESSING': return 'warning';
            default: return 'default';
        }
    };

    return (
        <Box p={4}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <div>
                    <Typography variant="h4" fontWeight="bold">Company Formation Requests</Typography>
                    <Typography variant="body1" color="text.secondary">Review and manage PT PMA formation applications.</Typography>
                </div>
            </Stack>

            <Card sx={{ p: 2, mb: 4 }}>
                <TextField
                    fullWidth
                    placeholder="Search by company or applicant name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Card>

            <TableContainer component={Paper} sx={{ borderRadius: '1rem', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                        <TableRow>
                            <TableCell><Typography fontWeight="bold">COMPANY NAME</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">APPLICANT</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">EQUITY</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">PAYMENT</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">STATUS</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">SUBMITTED</Typography></TableCell>
                            <TableCell align="right"><Typography fontWeight="bold">ACTIONS</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : filteredRequests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                                    No requests found.
                                </TableCell>
                            </TableRow>
                        ) : filteredRequests.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell><Typography fontWeight="bold">{row.companyName}</Typography></TableCell>
                                <TableCell>
                                    <Typography variant="body2">{row.applicantName}</Typography>
                                    <Typography variant="caption" color="text.secondary">{row.applicantEmail}</Typography>
                                </TableCell>
                                <TableCell>Rp {Number(row.equityCapital).toLocaleString('id-ID')}</TableCell>
                                <TableCell>
                                    <Chip label={row.paymentStatus} color={getStatusColor(row.paymentStatus)} size="small" />
                                </TableCell>
                                <TableCell>
                                    <Chip label={row.formationStatus} variant="outlined" color={getStatusColor(row.formationStatus)} size="small" />
                                </TableCell>
                                <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleViewDetail(row.id)}>
                                        <ViewIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Detail Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                {selectedRequest && (
                    <>
                        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <BusinessIcon color="primary" fontSize="large" />
                                <div>
                                    <Typography variant="h5" fontWeight="bold">{selectedRequest.companyName}</Typography>
                                    <Typography variant="caption">Formation ID: {selectedRequest.id}</Typography>
                                </div>
                            </Stack>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={4} sx={{ mt: 1 }}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>APPLICANT INFORMATION</Typography>
                                    <Typography variant="body1"><b>Name:</b> {selectedRequest.applicantName}</Typography>
                                    <Typography variant="body1"><b>Email:</b> {selectedRequest.applicantEmail}</Typography>
                                    <Typography variant="body1"><b>Phone:</b> {selectedRequest.applicantPhone}</Typography>
                                    <Typography variant="body1"><b>NPWP:</b> {selectedRequest.taxDetails?.npwp || '-'}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>CAPITAL DETAILS</Typography>
                                    <Typography variant="body1"><b>Equity:</b> Rp {Number(selectedRequest.equityCapital).toLocaleString('id-ID')}</Typography>
                                    <Typography variant="body1"><b>Deposited:</b> Rp {Number(selectedRequest.depositedCapital).toLocaleString('id-ID')}</Typography>
                                    <Typography variant="body1"><b>Address:</b> {selectedRequest.address}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>KBLI CODES</Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                        {selectedRequest.kbliCodes?.map((k: any) => (
                                            <Chip key={k.code} label={`${k.code}: ${k.name}`} size="small" />
                                        ))}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>DOCUMENTS</Typography>
                                    <Stack direction="row" spacing={2}>
                                        <Button startIcon={<DownloadIcon />} variant="outlined" size="small">Passport / KTP</Button>
                                        <Button startIcon={<DownloadIcon />} variant="outlined" size="small">Office Proof</Button>
                                        <Button startIcon={<DownloadIcon />} variant="outlined" size="small">Invoice</Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
                            <Button onClick={() => setOpenDialog(false)}>Close</Button>
                            <Button variant="contained" color="warning">Update Status</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}

// Simple Grid for MUI if not using full library
function Grid({ children, container, item, xs, md, spacing, sx }: any) {
    return <Box sx={{ display: container ? 'flex' : 'block', flexWrap: container ? 'wrap' : 'nowrap', width: item ? `${(xs/12)*100}%` : 'auto', p: spacing ? spacing * 0.5 : 0, ...sx }}>{children}</Box>;
}
