"use client";

import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Paper,
    CircularProgress,
    Pagination,
    Stack
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';

export default function AuditLogTab() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchLogs = async (pageNum = 1) => {
        setLoading(true);
        try {
            const offset = (pageNum - 1) * 50;
            const res = await fetch(`/api/admin/logs?limit=50&offset=${offset}`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data.data);
                setTotalPages(data.totalPages);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(page);
    }, [page]);

    return (
        <Stack spacing={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h5" fontWeight="bold">Audit Logs</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Track system events and admin actions.
                    </Typography>
                </Box>
                <IconButton onClick={() => fetchLogs(page)}>
                    <RefreshIcon />
                </IconButton>
            </Box>

            <Card>
                <TableContainer component={Paper} elevation={0}>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: 'background.default' }}>
                            <TableRow>
                                <TableCell>Time</TableCell>
                                <TableCell>Action</TableCell>
                                <TableCell>Target</TableCell>
                                <TableCell>Details</TableCell>
                                <TableCell>Admin ID</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                        No logs found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id} hover>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                            <Typography variant="caption" fontFamily="monospace">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={log.action}
                                                size="small"
                                                color={log.action.includes('DELETE') ? 'error' : log.action.includes('UPDATE') ? 'warning' : 'default'}
                                                variant="outlined"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{log.entityType}: {log.entityId}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                                                {JSON.stringify(log.metadata || {}).substring(0, 50)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" color="text.secondary">
                                                {log.adminId}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, p) => setPage(p)}
                        color="primary"
                    />
                </Box>
            </Card>
        </Stack>
    );
}
