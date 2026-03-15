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
    Divider
} from '@mui/material';
import { Mail, Search, Eye, RefreshCw } from 'lucide-react';

export default function EmailLogPanel() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLog, setSelectedLog] = useState<any | null>(null);

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

    const filteredLogs = logs.filter(log => 
        log.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box>
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
