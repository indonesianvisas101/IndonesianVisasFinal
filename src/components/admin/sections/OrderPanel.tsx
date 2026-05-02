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
import DocumentViewer from "../DocumentViewer";
import { COUNTRY_DATA } from "@/constants/countries";
import { formatNavLink } from "@/utils/seo";

export default function OrderPanel() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [viewingDoc, setViewingDoc] = useState<{ url: string, name: string } | null>(null);
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || 'en';

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
        if (filter === "all") return matchesSearch;
        if (filter === "pending") return matchesSearch && (order.status === "Pending" || order.status === "Apply to Agent" || order.status === "Draft");
        if (filter === "paid") return matchesSearch && ["Paid", "Active", "Review by Agent", "On Going", "Preparing for submission", "Submited", "Process by Immigration", "Approved"].includes(order.status);
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
                            const isPaid = ["Paid", "Active", "Review by Agent", "On Going", "Preparing for submission", "Submited", "Process by Immigration", "Approved"].includes(order.status);
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
                                            color={isPaid ? 'success' : order.status === 'Reject' || order.status === 'Rejected' ? 'error' : 'warning'}
                                            size="small"
                                        />
                                        {(() => {
                                            const countryInfo = COUNTRY_DATA.find(c => c.name === order.country);
                                            if (countryInfo?.isSpecial) {
                                                return (
                                                    <Box sx={{ mt: 0.5 }}>
                                                        <Chip label="CALLING VISA" size="small" sx={{ bgcolor: '#ef4444', color: 'white', fontWeight: 'bold', fontSize: '10px', height: 20 }} />
                                                    </Box>
                                                );
                                            }
                                            if (countryInfo?.isUnregistered) {
                                                return (
                                                    <Box sx={{ mt: 0.5 }}>
                                                        <Chip label="UNREGISTERED" size="small" sx={{ bgcolor: '#f97316', color: 'white', fontWeight: 'bold', fontSize: '10px', height: 20 }} />
                                                    </Box>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </TableCell>
                                    <TableCell>
                                        {order.documents && (() => {
                                            try {
                                                const docs = typeof order.documents === 'string' ? JSON.parse(order.documents) : order.documents;
                                                if (!Array.isArray(docs)) return null;
                                                return (
                                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                        {docs.flatMap((docSet: any, travelerIndex: number) => {
                                                            if (typeof docSet === 'string') {
                                                                return [(
                                                                    <IconButton key={travelerIndex} size="small" color="primary" onClick={() => setViewingDoc({ url: docSet, name: `Document ${travelerIndex + 1}` })} title={`Document ${travelerIndex + 1}`}>
                                                                        <OpenInNewIcon sx={{ fontSize: 16 }} />
                                                                    </IconButton>
                                                                )];
                                                            }
                                                            return Object.entries(docSet).flatMap(([key, urlValue]) => {
                                                                const urls = Array.isArray(urlValue) ? urlValue : [urlValue];
                                                                return urls.map((url: any, idx: number) => {
                                                                    if (typeof url !== 'string') return null;
                                                                    let name = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).trim();
                                                                    if (name.includes('Additional')) name = name.replace('Additional', 'Additional Doc');
                                                                    const finalName = `T${travelerIndex + 1} - ${urls.length > 1 ? `${name} ${idx + 1}` : name}`;
                                                                    return (
                                                                        <IconButton key={`${travelerIndex}-${key}-${idx}`} size="small" color="primary" onClick={() => setViewingDoc({ url, name: finalName })} title={finalName}>
                                                                            <OpenInNewIcon sx={{ fontSize: 16 }} />
                                                                        </IconButton>
                                                                    );
                                                                });
                                                            });
                                                        })}
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
                                                color="info"
                                                title="Order Details"
                                                onClick={() => router.push(formatNavLink(locale, `/admin?tab=invoicing&id=${order.id}`))}
                                            >
                                                <SearchIcon />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                color="primary"
                                                title="View Invoice"
                                                onClick={() => router.push(formatNavLink(locale, `/invoice/${order.slug || order.id}`))}
                                            >
                                                <ReceiptIcon />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                color="secondary"
                                                title="Manage Order"
                                                onClick={() => router.push(formatNavLink(locale, `/admin?tab=invoicing&id=${order.id}`))}
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

            {viewingDoc && (
                <DocumentViewer 
                    open={!!viewingDoc} 
                    onClose={() => setViewingDoc(null)} 
                    documentUrl={viewingDoc.url} 
                    documentName={viewingDoc.name} 
                />
            )}
        </Stack>
    );
}
