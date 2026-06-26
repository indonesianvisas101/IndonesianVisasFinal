"use client";

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, IconButton, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, Grid, CircularProgress, Alert, Stack,
    TextField, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReplayIcon from '@mui/icons-material/Replay';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SearchIcon from '@mui/icons-material/Search';

export default function MessagePanel() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMsg, setSelectedMsg] = useState<any | null>(null);
    const [updating, setUpdating] = useState(false);
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filterType !== 'all') queryParams.append('type', filterType);
            if (filterStatus) queryParams.append('status', filterStatus);
            if (searchQuery) queryParams.append('search', searchQuery);

            const res = await fetch(`/api/admin/contact-messages?${queryParams.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch contact messages");
            const data = await res.json();
            setMessages(data.results || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchMessages();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [filterType, filterStatus, searchQuery]);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/contact-messages/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error("Update failed");

            // Update local state
            setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m));
            if (selectedMsg && selectedMsg.id === id) {
                setSelectedMsg({ ...selectedMsg, status: newStatus });
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setUpdating(false);
        }
    };

    const StatusChip = ({ status, type }: { status: string; type: string }) => {
        if (status === 'RESOLVED') {
            return <Chip label="RESOLVED" color="success" size="small" variant="filled" />;
        }
        
        return type === 'complaint' 
            ? <Chip label="PENDING" color="error" size="small" variant="filled" />
            : <Chip label="PENDING" color="warning" size="small" variant="filled" />;
    };

    const TypeChip = ({ type }: { type: string }) => {
        return type === 'complaint'
            ? <Chip label="COMPLAINT" color="error" size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />
            : <Chip label="INQUIRY" color="secondary" size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />;
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ReportProblemIcon color="primary" /> Customer Message & Complaint Panel
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        View, manage, and resolve inquiries and escalated complaints from customers.
                    </Typography>
                </Box>
                <Button variant="outlined" onClick={fetchMessages}>
                    Refresh List
                </Button>
            </Box>

            {/* Filter controls */}
            <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search email, whatsapp, message..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="type-select-label">Type</InputLabel>
                            <Select
                                labelId="type-select-label"
                                label="Type"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as string)}
                            >
                                <MenuItem value="all">All Messages</MenuItem>
                                <MenuItem value="inquiry">Inquiries Only</MenuItem>
                                <MenuItem value="complaint">Complaints Only</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="status-select-label">Status</InputLabel>
                            <Select
                                labelId="status-select-label"
                                label="Status"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as string)}
                            >
                                <MenuItem value="">All Statuses</MenuItem>
                                <MenuItem value="PENDING">Pending</MenuItem>
                                <MenuItem value="RESOLVED">Resolved</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading && messages.length === 0 ? (
                <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>
            ) : (
                <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 3 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Date Submitted</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Sender</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>WhatsApp</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Message Excerpt</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {messages.length === 0 ? (
                                <TableRow><TableCell colSpan={8} align="center">No messages or complaints found matching criteria.</TableCell></TableRow>
                            ) : (
                                messages.map((msg) => (
                                    <TableRow key={msg.id} hover>
                                        <TableCell>{new Date(msg.createdAt).toLocaleString()}</TableCell>
                                        <TableCell><TypeChip type={msg.type} /></TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold">{msg.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{msg.email}</Typography>
                                        </TableCell>
                                        <TableCell>{msg.whatsapp}</TableCell>
                                        <TableCell>
                                            {msg.type === 'complaint' ? (
                                                <Chip label={msg.category || "Others"} size="small" color="error" variant="outlined" />
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">-</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {msg.message}
                                        </TableCell>
                                        <TableCell><StatusChip status={msg.status} type={msg.type} /></TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <IconButton color="primary" onClick={() => setSelectedMsg(msg)}>
                                                    <VisibilityIcon />
                                                </IconButton>
                                                {msg.status !== 'RESOLVED' ? (
                                                    <IconButton color="success" onClick={() => handleStatusUpdate(msg.id, 'RESOLVED')} disabled={updating}>
                                                        <CheckCircleIcon />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton color="warning" onClick={() => handleStatusUpdate(msg.id, 'PENDING')} disabled={updating}>
                                                        <ReplayIcon />
                                                    </IconButton>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* View Detail Dialog */}
            <Dialog open={!!selectedMsg} onClose={() => setSelectedMsg(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                {selectedMsg && (
                    <>
                        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Box display="flex" alignItems="center" gap={1.5}>
                                <Typography variant="h6" fontWeight="bold">Message Details</Typography>
                                <TypeChip type={selectedMsg.type} />
                            </Box>
                            <StatusChip status={selectedMsg.status} type={selectedMsg.type} />
                        </DialogTitle>
                        <DialogContent dividers>
                            <Stack spacing={3} py={1}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary">Sender Name</Typography>
                                        <Typography variant="body2" fontWeight="bold">{selectedMsg.name || "Anonymous"}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary">Submitted At</Typography>
                                        <Typography variant="body2">{new Date(selectedMsg.createdAt).toLocaleString()}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary">Email Address</Typography>
                                        <Typography variant="body2" fontWeight="bold">
                                            <a href={`mailto:${selectedMsg.email}`} style={{ color: '#7c3aed', textDecoration: 'none' }}>{selectedMsg.email}</a>
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary">WhatsApp Number</Typography>
                                        <Typography variant="body2" fontWeight="bold">
                                            <a href={`https://wa.me/${selectedMsg.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none' }}>{selectedMsg.whatsapp}</a>
                                        </Typography>
                                    </Grid>
                                    {selectedMsg.type === 'complaint' && (
                                        <Grid size={{ xs: 12 }}>
                                            <Typography variant="caption" color="text.secondary">Complaint Category</Typography>
                                            <Box mt={0.5}>
                                                <Chip label={selectedMsg.category || "Others"} color="error" variant="filled" size="small" />
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>

                                <Box sx={{ bgcolor: 'action.hover', p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                                    <Typography variant="caption" color="text.secondary" display="block" mb={1} fontWeight="bold">Message/Complaint Description</Typography>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{selectedMsg.message}</Typography>
                                </Box>
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ p: 2.5, justifyContent: 'space-between' }}>
                            <Button variant="outlined" onClick={() => setSelectedMsg(null)} sx={{ borderRadius: 2 }}>Close</Button>
                            {selectedMsg.status !== 'RESOLVED' ? (
                                <Button 
                                    variant="contained" 
                                    color="success" 
                                    startIcon={<CheckCircleIcon />}
                                    onClick={() => {
                                        handleStatusUpdate(selectedMsg.id, 'RESOLVED');
                                        setSelectedMsg(null);
                                    }}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Mark as Resolved
                                </Button>
                            ) : (
                                <Button 
                                    variant="contained" 
                                    color="warning" 
                                    startIcon={<ReplayIcon />}
                                    onClick={() => {
                                        handleStatusUpdate(selectedMsg.id, 'PENDING');
                                        setSelectedMsg(null);
                                    }}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Reopen Message
                                </Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}
