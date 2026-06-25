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
    IconButton,
    TextField,
    Chip,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Divider,
    Alert,
    CircularProgress
} from '@mui/material';
import { Mail, Search, Eye, RefreshCw, Send } from 'lucide-react';

export default function EmailLogPanel() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLog, setSelectedLog] = useState<any | null>(null);

    // Compose state
    const [composeTo, setComposeTo] = useState("");
    const [composeSubject, setComposeSubject] = useState("");
    const [composeBody, setComposeBody] = useState("");
    const [sendingEmail, setSendingEmail] = useState(false);
    const [sendResult, setSendResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/email-logs');
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (error) {
            console.error("Failed to fetch email logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleSendEmail = async () => {
        if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
            setSendResult({ type: 'error', message: 'Please fill in all fields: To, Subject, and Message.' });
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(composeTo.trim())) {
            setSendResult({ type: 'error', message: 'Please enter a valid email address.' });
            return;
        }

        setSendingEmail(true);
        setSendResult(null);

        try {
            const res = await fetch('/api/admin/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'FREE_TEXT',
                    email: composeTo.trim(),
                    data: {
                        subject: composeSubject.trim(),
                        body: composeBody.trim()
                    }
                })
            });

            if (res.ok) {
                setSendResult({ type: 'success', message: `✅ Email successfully sent to ${composeTo.trim()}` });
                // Clear form
                setComposeTo('');
                setComposeSubject('');
                setComposeBody('');
                // Refresh log
                await fetchLogs();
            } else {
                const err = await res.json();
                setSendResult({ type: 'error', message: `❌ Failed to send: ${err.error || 'Unknown error'}` });
            }
        } catch (err: any) {
            setSendResult({ type: 'error', message: `❌ Error: ${err.message}` });
        } finally {
            setSendingEmail(false);
        }
    };

    const filteredLogs = logs.filter(log => 
        log.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box>
            {/* === COMPOSE & SEND EMAIL SECTION === */}
            <Paper sx={{ mb: 3, p: 3, border: '1px solid', borderColor: 'primary.100', borderRadius: 3 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2.5}>
                    <Box sx={{ p: 1, bgcolor: 'primary.50', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
                        <Send size={20} className="text-primary" />
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">Compose & Send Email</Typography>
                        <Typography variant="caption" color="text.secondary">
                            Send a branded email directly from the Indonesian Visas system to any customer.
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="To (Customer Email)"
                        type="email"
                        size="small"
                        fullWidth
                        value={composeTo}
                        onChange={(e) => { setComposeTo(e.target.value); setSendResult(null); }}
                        placeholder="customer@example.com"
                        InputProps={{
                            startAdornment: <Mail size={16} className="mr-2 text-gray-400" />
                        }}
                    />
                    <TextField
                        label="Subject"
                        size="small"
                        fullWidth
                        value={composeSubject}
                        onChange={(e) => { setComposeSubject(e.target.value); setSendResult(null); }}
                        placeholder="e.g. Your Application Update — Indonesian Visas"
                    />
                    <TextField
                        label="Message"
                        size="small"
                        fullWidth
                        multiline
                        rows={6}
                        value={composeBody}
                        onChange={(e) => { setComposeBody(e.target.value); setSendResult(null); }}
                        placeholder={"Dear [Customer Name],\n\nWe are writing to inform you...\n\nBest regards,\nIndonesian Visas Team"}
                        helperText="Plain text. Line breaks are preserved. The email will be wrapped in the official Indonesian Visas branded template automatically."
                    />

                    {sendResult && (
                        <Alert severity={sendResult.type} onClose={() => setSendResult(null)} sx={{ borderRadius: 2 }}>
                            {sendResult.message}
                        </Alert>
                    )}

                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSendEmail}
                            disabled={sendingEmail || !composeTo || !composeSubject || !composeBody}
                            startIcon={sendingEmail ? <CircularProgress size={16} color="inherit" /> : <Send size={16} />}
                            sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', px: 4 }}
                        >
                            {sendingEmail ? 'Sending...' : 'Send Email'}
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* === EMAIL LOG TABLE === */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">Email Communication Logs</Typography>
                <Button 
                    variant="outlined" 
                    startIcon={<RefreshCw size={18} />} 
                    onClick={fetchLogs}
                    disabled={loading}
                >
                    Refresh
                </Button>
            </Box>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <Box p={2}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search logs..."
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
                                <TableCell>Date Sent</TableCell>
                                <TableCell>Recipient</TableCell>
                                <TableCell>Subject</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>{new Date(log.sentAt).toLocaleString()}</TableCell>
                                    <TableCell>{log.recipient}</TableCell>
                                    <TableCell><Typography variant="body2" fontWeight="600">{log.subject}</Typography></TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={log.status} 
                                            size="small" 
                                            color={log.status === 'SENT' ? 'success' : 'error'}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton size="small" onClick={() => setSelectedLog(log)}>
                                            <Eye size={18} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={filteredLogs.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, p) => setPage(p)}
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                />
            </Paper>

            <Dialog open={!!selectedLog} onClose={() => setSelectedLog(null)} maxWidth="md" fullWidth>
                <DialogTitle>Email Content Preview</DialogTitle>
                <DialogContent dividers>
                    {selectedLog && (
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">To: {selectedLog.recipient}</Typography>
                            <Typography variant="subtitle1" fontWeight="bold" mb={2}>{selectedLog.subject}</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box 
                                sx={{ 
                                    p: 2, 
                                    bgcolor: '#f9f9f9', 
                                    borderRadius: 1, 
                                    minHeight: 200,
                                    whiteSpace: 'pre-wrap',
                                    fontFamily: 'monospace',
                                    fontSize: '0.875rem'
                                }}
                                dangerouslySetInnerHTML={{ __html: selectedLog.content }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedLog(null)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
