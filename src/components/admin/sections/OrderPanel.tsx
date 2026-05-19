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
    Badge,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider
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
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PublicIcon from "@mui/icons-material/Public";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

export default function OrderPanel() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [viewingDoc, setViewingDoc] = useState<{ url: string, name: string } | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [verifying, setVerifying] = useState(false);
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
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
            (order.guestName || "").toLowerCase().includes(query) ||
            (order.guestEmail || "").toLowerCase().includes(query) ||
            (order.id || "").toLowerCase().includes(query) ||
            (order.slug || "").toLowerCase().includes(query);

        const isPaid = ["Paid", "Active", "Review by Agent", "On Going", "Preparing for submission", "Submited", "Process by Immigration", "Approved"].includes(order.status);
        
        let matchesStatus = true;
        if (filter === 'pending') matchesStatus = !isPaid && !["Reject", "Rejected"].includes(order.status);
        if (filter === 'paid') matchesStatus = isPaid;

        return matchesSearch && matchesStatus;
    });

    const handleQuickVerify = async (order: any) => {
        if (!confirm(`Create official verification record for ${order.guestName}?`)) return;
        
        setVerifying(true);
        try {
            // 1. Prepare data
            const travelerData = Array.isArray(order.travelers) ? order.travelers[0] : {};
            const payload = {
                fullName: order.guestName,
                passportNumber: travelerData.passportNumber || "",
                visaType: order.visaName || "Visa",
                issuedDate: new Date().toISOString().split('T')[0],
                status: "VALID",
                invoiceId: order.slug || order.id,
                nationality: order.country || "VERIFIED HOLDER",
                isAgreementRequired: ["C1", "KITAS", "E33G"].some(v => (order.visaName || "").includes(v)),
                agreementStatus: "PENDING"
            };

            // 2. Submit to Verification API
            const res = await fetch('/api/verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Verification record created successfully!");
                setSelectedOrder(null);
            } else {
                const err = await res.json();
                alert("Failed to verify: " + (err.error || "Unknown error"));
            }
        } catch (e) {
            console.error(e);
            alert("Error connecting to verification service.");
        } finally {
            setVerifying(false);
        }
    };

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
                                        <Typography 
                                            variant="body2" 
                                            fontWeight="bold" 
                                            sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                                            onClick={() => setSelectedOrder(order)}
                                        >
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
                                                let docs = typeof order.documents === 'string' ? JSON.parse(order.documents) : order.documents;
                                                if (!Array.isArray(docs)) {
                                                    if (typeof docs === 'object' && docs !== null) docs = [docs];
                                                    else return null;
                                                }
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
                                                onClick={() => router.push(formatNavLink(locale || 'en', `/${locale || 'en'}/invoice/${order.slug || order.id}`))}
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

            {/* UNIFIED ORDER POPUP */}
            <Dialog 
                open={!!selectedOrder} 
                onClose={() => setSelectedOrder(null)}
                maxWidth="md"
                fullWidth
            >
                {selectedOrder && (
                    <>
                        <DialogTitle sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">Order Detail</Typography>
                                    <Typography variant="caption" color="text.secondary">ID: #{selectedOrder.id}</Typography>
                                </Box>
                                <Chip label={selectedOrder.status} color="success" />
                            </Stack>
                        </DialogTitle>
                        <DialogContent sx={{ py: 3 }}>
                            <Grid container spacing={4}>
                                {/* LEFT COL: Summary */}
                                <Grid size={{ xs: 12, md: 7 }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
                                        CUSTOMER SUMMARY
                                    </Typography>
                                    <List dense>
                                        <ListItem>
                                            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                                            <ListItemText primary="Full Name" secondary={selectedOrder.guestName} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><EmailIcon fontSize="small" /></ListItemIcon>
                                            <ListItemText primary="Email Address" secondary={selectedOrder.guestEmail} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><PublicIcon fontSize="small" /></ListItemIcon>
                                            <ListItemText primary="Origin Country" secondary={selectedOrder.country || "N/A"} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><AssignmentIcon fontSize="small" /></ListItemIcon>
                                            <ListItemText primary="Visa Type" secondary={selectedOrder.visaName} />
                                        </ListItem>
                                    </List>
                                    
                                    <Divider sx={{ my: 2 }} />
                                    
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
                                        ORDER DATA
                                    </Typography>
                                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                        <Grid container spacing={2}>
                                            <Grid size={6}>
                                                <Typography variant="caption" color="text.secondary">Applied Date</Typography>
                                                <Typography variant="body2">{new Date(selectedOrder.appliedAt || selectedOrder.created_at).toLocaleString()}</Typography>
                                            </Grid>
                                            <Grid size={6}>
                                                <Typography variant="caption" color="text.secondary">Amount Paid</Typography>
                                                <Typography variant="body2" fontWeight="bold">{selectedOrder.customAmount || "Standard Price"}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>

                                {/* RIGHT COL: Documents */}
                                <Grid size={{ xs: 12, md: 5 }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
                                        UPLOADED DOCUMENTS
                                    </Typography>
                                    <Stack spacing={1}>
                                        {(() => {
                                            try {
                                                let docs = typeof selectedOrder.documents === 'string' ? JSON.parse(selectedOrder.documents) : selectedOrder.documents;
                                                if (!Array.isArray(docs)) {
                                                    if (typeof docs === 'object' && docs !== null) docs = [docs];
                                                    else return <Typography variant="caption">No documents found.</Typography>;
                                                }
                                                
                                                return docs.flatMap((docSet: any, tIdx: number) => 
                                                    Object.entries(docSet).map(([key, url]: any) => (
                                                        <Button
                                                            key={`${tIdx}-${key}`}
                                                            href={`/${locale || 'en'}/invoice/${selectedOrder.id}`}
                                                            variant="outlined"
                                                            fullWidth
                                                            size="small"
                                                            startIcon={<OpenInNewIcon />}
                                                            onClick={() => setViewingDoc({ url, name: `${key} (T${tIdx+1})` })}
                                                            sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                                                        >
                                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                                        </Button>
                                                    ))
                                                );
                                            } catch (e) {
                                                return <Typography variant="caption" color="error">Error parsing docs</Typography>;
                                            }
                                        })()}
                                    </Stack>

                                    <Box sx={{ mt: 4, p: 2, border: '1px dashed #ccc', borderRadius: 2 }}>
                                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                            ACTIONS
                                        </Typography>
                                        <Stack spacing={1}>
                                            <Button 
                                                variant="contained" 
                                                fullWidth 
                                                startIcon={<VerifiedUserIcon />}
                                                color="primary"
                                                disabled={verifying}
                                                onClick={() => handleQuickVerify(selectedOrder)}
                                            >
                                                {verifying ? 'Verifying...' : 'Quick Verify User'}
                                            </Button>
                                            <Button 
                                                variant="outlined" 
                                                fullWidth
                                                onClick={() => router.push(`/${locale || 'en'}/invoice/${selectedOrder.slug || selectedOrder.id}`)}
                                            >
                                                View Live Invoice
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ borderTop: '1px solid #eee', p: 2 }}>
                            <Button onClick={() => setSelectedOrder(null)}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Stack>
    );
}
