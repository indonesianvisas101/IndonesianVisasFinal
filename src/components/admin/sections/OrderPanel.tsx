"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Typography,
    Stack,
    CircularProgress,
    IconButton,
    TextField,
    InputAdornment,
    Button,
    Badge
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { formatCurrency } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";

export default function OrderPanel() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const params = useParams();
    const router = useRouter();
    const locale = params?.locale || 'en';

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/applications');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (e) {
            console.error("Failed to fetch orders", e);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            (order.guestName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.guestEmail || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.visaName || "").toLowerCase().includes(searchQuery.toLowerCase());
        
        if (filter === "all") return matchesSearch;
        if (filter === "pending") return matchesSearch && order.status === "Pending";
        if (filter === "paid") return matchesSearch && ["Paid", "Active", "Review by Agent", "On Going", "Preparing for submission", "Submited", "Approved"].includes(order.status);
        return matchesSearch;
    });

    return (
        <Stack spacing={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                    <Typography variant="h4" fontWeight="bold">Incoming Orders</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Monitor and manage all visa applications and customer orders.
                    </Typography>
                </div>
                <Button 
                    variant="outlined" 
                    startIcon={<RefreshIcon />} 
                    onClick={fetchOrders}
                    disabled={loading}
                >
                    Refresh
                </Button>
            </Box>

            <Card sx={{ p: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
                    <TextField
                        placeholder="Search by name, email, or order ID..."
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 400 }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Stack direction="row" spacing={1}>
                        <Button 
                            variant={filter === 'all' ? 'contained' : 'outlined'} 
                            size="small" 
                            onClick={() => setFilter('all')}
                        >
                            All
                        </Button>
                        <Button 
                            variant={filter === 'pending' ? 'contained' : 'outlined'} 
                            size="small" 
                            color="warning"
                            onClick={() => setFilter('pending')}
                        >
                            Pending
                        </Button>
                        <Button 
                            variant={filter === 'paid' ? 'contained' : 'outlined'} 
                            size="small" 
                            color="success" 
                            onClick={() => setFilter('paid')}
                        >
                            Paid
                        </Button>
                    </Stack>
                </Stack>
            </Card>

            <TableContainer component={Card}>
                <Table>
                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                        <TableRow>
                            <TableCell>ORDER INFO</TableCell>
                            <TableCell>CUSTOMER</TableCell>
                            <TableCell>SERVICE</TableCell>
                            <TableCell>AMOUNT</TableCell>
                            <TableCell>STATUS</TableCell>
                            <TableCell>DOCUMENTS</TableCell>
                            <TableCell align="right">ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                    <CircularProgress />
                                    <Typography sx={{ mt: 2 }}>Loading orders...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                    <Typography color="text.secondary">No orders found.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredOrders.map((order) => {
                            const isPaid = ["Paid", "Active", "Review by Agent", "On Going", "Preparing for submission", "Submited", "Approved"].includes(order.status);
                            const date = new Date(order.appliedAt || order.created_at).toLocaleDateString();
                            
                            return (
                                <TableRow key={order.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">
                                            #{order.slug || order.id.substring(0, 8)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {date}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">
                                            {order.guestName || "Guest"}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {order.guestEmail || "-"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={order.visaName || "Visa"} 
                                            size="small" 
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">
                                            {order.customAmount ? order.customAmount : "Standard"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.status}
                                            color={isPaid ? 'success' : order.status === 'Rejected' ? 'error' : 'warning'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {order.documents && (() => {
                                            try {
                                                const docs = typeof order.documents === 'string' ? JSON.parse(order.documents) : order.documents;
                                                if (!Array.isArray(docs)) return null;
                                                return (
                                                    <Stack direction="row" spacing={1}>
                                                        {docs.map((doc: any, i: number) => (
                                                            <IconButton 
                                                                key={i} 
                                                                size="small" 
                                                                color="info" 
                                                                href={doc.url || doc} 
                                                                target="_blank"
                                                                title={doc.name || `Doc ${i+1}`}
                                                            >
                                                                <OpenInNewIcon sx={{ fontSize: 16 }} />
                                                            </IconButton>
                                                        ))}
                                                    </Stack>
                                                );
                                            } catch (e) {
                                                console.error("Failed to parse documents for order", order.id, e);
                                                return <Typography variant="caption" color="error">Parse Error</Typography>;
                                            }
                                        })()}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <IconButton 
                                                size="small" 
                                                color="primary"
                                                title="View Invoice"
                                                onClick={() => router.push(`/${locale}/invoice/${order.slug || order.id}`)}
                                            >
                                                <ReceiptIcon />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                color="secondary"
                                                title="Manage Order"
                                                onClick={() => router.push(`/${locale}/admin?tab=invoicing&id=${order.id}`)}
                                            >
                                                <OpenInNewIcon />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
}
