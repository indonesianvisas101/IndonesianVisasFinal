"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Stack,
    MenuItem,
    ToggleButton,
    ToggleButtonGroup,
    CircularProgress,
    IconButton,
    Grid
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import RefreshIcon from "@mui/icons-material/Refresh";
import Link from "next/link";
import { VISA_DATABASE } from "@/constants/visas";
import { supabase } from "@/lib/supabase";
import { useSearchParams, usePathname } from "next/navigation";
import DocumentViewer from "../DocumentViewer";
import { uploadCompressedFile } from "@/utils/ivce";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CampaignIcon from "@mui/icons-material/Campaign";
import { InputAdornment } from "@mui/material";

export default function InvoicingTab() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [verifications, setVerifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [viewingDoc, setViewingDoc] = useState<{ url: string, name: string } | null>(null);
    const [syncCandidates, setSyncCandidates] = useState<any[]>([]); // Fuzzy match candidates
    const [openSyncDialog, setOpenSyncDialog] = useState(false);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const rawLocale = pathname?.split('/')[1] || 'en';
    const locale = ['admin', 'dashboard', 'verify', 'invoice', 'api', 'auth'].includes(rawLocale) ? 'en' : rawLocale;
    const targetId = searchParams.get('id');

    // Form State
    const [invoiceMode, setInvoiceMode] = useState<'guest' | 'user'>('guest');
    const [formData, setFormData] = useState({
        userId: "",
        guestName: "",
        guestEmail: "",
        guestAddress: "",
        visaId: "",
        visaName: "",
        customAmount: "",
        paymentMethod: "",
        description: "",
        verificationId: "",
        status: "Apply to Agent", // Default
        appliedAt: "", // For backdating
        // New
        paymentReference: "",
        adminNotes: "", // In Create mode, this is "Invoice Description (Public)"
        internalNotes: "", // Internal
        registrationNumber: "",
        visaLink: "",
        paymentLink: "",
        secondOrderStatus: "UNPAID",
        arrivalCardLink: "",
        arrivalCardQr: ""
    });

    // Edit State
    const [editingInvoice, setEditingInvoice] = useState<any>(null);
    const [editFormData, setEditFormData] = useState({
        status: "",
        paymentStatus: "",
        paymentReference: "",
        adminNotes: "", // This maps to "Invoice Description (Public)" in UI but saved as adminNotes in DB
        internalNotes: "", // New: Saved in attribution.internalNotes
        guestName: "",
        guestEmail: "",
        visaName: "",
        customAmount: "",
        discountPct: "0", // Discount percentage (0-100)
        userId: "",
        description: "", // We'll keep this for the "Public Description" field mapping
        registrationNumber: "", // New
        visaLink: "", // New
        paymentLink: "", // New
        secondOrderStatus: "UNPAID", // New (v8.71)
        arrivalCardLink: "", // New
        arrivalCardQr: "", // New
        attribution: {} as any,
        verificationAddress: "",
        paymentMethod: ""
    });

    useEffect(() => {
        fetchInvoices();
        fetchUsers();
        fetchVerifications();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await fetch('/api/applications'); // Fetch All
            if (res.ok) {
                const data = await res.json();
                setInvoices(data);
                
                // Deep Linking: Auto-open if ID is in URL
                if (targetId) {
                    const targetInv = data.find((inv: any) => inv.id === targetId);
                    if (targetInv) {
                        handleEditClick(targetInv);
                    }
                }
            }
        } catch (e) { console.error("Failed to fetch invoices", e); }
        finally { setLoading(false); }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) setUsers(await res.json());
        } catch (e) { console.error("Failed to fetch users", e); }
    };

    const fetchVerifications = async () => {
        try {
            const res = await fetch('/api/verification');
            if (res.ok) setVerifications(await res.json());
        } catch (e) { console.error("Failed to fetch verifications", e); }
    };

    const handleCreate = async () => {
        // Validate
        if (!formData.visaId) { alert("Please select a Visa Product or Custom Service"); return; }
        if (invoiceMode === 'guest' && !formData.guestName) { alert("Guest Name is required"); return; }
        if (invoiceMode === 'user' && !formData.userId) { alert("Please select a User"); return; }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const payload = {
                ...formData,
                userId: invoiceMode === 'user' ? formData.userId : "",
                guestName: invoiceMode === 'guest' ? formData.guestName : null,
                guestEmail: invoiceMode === 'guest' ? formData.guestEmail : null,
                guestAddress: invoiceMode === 'guest' ? formData.guestAddress : null,
                appliedAt: formData.appliedAt || null,
                attribution: {
                    registrationNumber: formData.registrationNumber,
                    visaLink: formData.visaLink,
                    paymentLink: formData.paymentLink,
                    secondOrderStatus: formData.secondOrderStatus,
                    arrivalCardLink: formData.arrivalCardLink,
                    arrivalCardQr: formData.arrivalCardQr,
                    internalNotes: formData.internalNotes
                },
                adminNotes: formData.adminNotes // Maps to DB adminNotes (Public Description)
            };

            const res = await fetch('/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const newInvoice = await res.json();
                // Manually populate user/guest for UI update if response is raw
                const displayInvoice = {
                    ...newInvoice,
                    user: invoiceMode === 'user' ? users.find(u => u.id === formData.userId) : null
                };
                setInvoices([displayInvoice, ...invoices]);
                setOpenDialog(false);
                resetForm();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to create invoice");
            }
        } catch (error) {
            alert("Error creating invoice");
        }
    };

    const handleUpdate = async () => {
        if (!editingInvoice) return;
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch('/api/applications', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: editingInvoice.id,
                    ...editFormData,
                    discountPct: parseFloat(editFormData.discountPct) || 0
                })
            });

            if (res.ok) {
                // Also Sync Address to Verification if linked
                if (editingInvoice.verificationId && editFormData.verificationAddress) {
                    // v10.9.5 Hardening: Preserve existing JSON structure in address if present
                    let finalAddress = editFormData.verificationAddress;
                    const existingAddr = editingInvoice.verification?.address;
                    if (existingAddr && existingAddr.startsWith('{')) {
                        try {
                            const parsed = JSON.parse(existingAddr);
                            parsed.street = editFormData.verificationAddress; // Only update street
                            finalAddress = JSON.stringify(parsed);
                        } catch (e) { /* Fallback to plain string if parse fails */ }
                    }

                    await fetch('/api/verification', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            id: editingInvoice.verificationId,
                            address: finalAddress
                        })
                    });
                }

                await fetchInvoices();
                setOpenEditDialog(false);
                setEditingInvoice(null);
            } else {
                alert("Failed to update invoice");
            }
        } catch (e) {
            alert("Error updating invoice");
        } finally {
            setLoading(false);
        }
    };

    const handleManualEmail = async (type: 'APPLICATION_RECEIVED' | 'PAYMENT_CONFIRMED' | 'INVOICE_SETTLED' | 'VISA_APPROVED' | 'PAYMENT_REMINDER') => {
        if (!editingInvoice) return;
        
        const confirmMsg = `Send ${type.replace(/_/g, ' ')} email to ${editFormData.guestEmail}?`;
        if (!window.confirm(confirmMsg)) return;

        setLoading(true);
        try {
            const res = await fetch('/api/admin/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    email: editFormData.guestEmail,
                    data: {
                        applicantName: editFormData.guestName,
                        orderId: editingInvoice.slug || editingInvoice.id,
                        visaType: editFormData.visaName,
                        invoiceUrl: `${window.location.origin}/${locale || 'en'}/invoice/${editingInvoice.slug || editingInvoice.id}`,
                        paymentUrl: `${window.location.origin}/${locale || 'en'}/invoice/${editingInvoice.slug || editingInvoice.id}`,
                        amount: editFormData.customAmount ? `IDR ${Number(editFormData.customAmount).toLocaleString('id-ID')}` : 'See Invoice',
                        downloadUrl: editFormData.visaLink,
                        isPayPal: editingInvoice.paymentMethod?.toLowerCase().includes('paypal'),
                        hasIdiv: !!editFormData.attribution?.upsells?.idiv_paid || !!editFormData.attribution?.upsells?.idiv_ordered,
                        hasArrivalCard: !!editFormData.attribution?.upsells?.ac_paid || !!editFormData.attribution?.upsells?.ac_ordered,
                        // Visa Approved extras
                        acOrdered: !!editFormData.attribution?.upsells?.ac_ordered && !editFormData.attribution?.upsells?.ac_paid,
                        idivOrdered: !!editFormData.attribution?.upsells?.idiv_ordered && !editFormData.attribution?.upsells?.idiv_paid,
                        paymentLink: editFormData.paymentLink || editFormData.attribution?.paymentLink || '',
                        isSigned: editingInvoice.verification?.agreementStatus === 'SIGNED',
                        verificationSlug: editingInvoice.verification?.slug
                    }
                })
            });

            if (res.ok) {
                alert("✅ Email sent successfully!");
            } else {
                const err = await res.json();
                alert(`❌ Failed to send: ${err.error}`);
            }
        } catch (e) {
            alert("❌ Error sending email");
        } finally {
            setLoading(false);
        }
    };

    const handleSyncArrivalCard = async () => {
        const email = editFormData.guestEmail;
        const name  = editFormData.guestName;

        if (!email && !name) {
            alert("Please provide a guest email or name first to sync.");
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (email) params.set('email', email);
            if (name)  params.set('name', name);

            const res = await fetch(`/api/admin/arrival-cards?${params.toString()}`);
            if (!res.ok) throw new Error('API error');

            const body = await res.json();
            const { mode, results } = body;

            if (!results || results.length === 0) {
                alert(`❌ No Arrival Cards found for "${name || email}". Try adjusting the name/email.`);
                return;
            }

            if (mode === 'exact') {
                // Exact email match — attach immediately (previous behaviour)
                const latest = results[0];
                applyArrivalCardSync(latest);
                alert(`✅ Exact Match! Arrival Card synced for ${email}.`);
            } else {
                // Fuzzy match — show confirmation dialog
                setSyncCandidates(results);
                setOpenSyncDialog(true);
            }
        } catch (e) {
            console.error("Sync failed", e);
            alert("Sync failed. Check terminal logs.");
        } finally {
            setLoading(false);
        }
    };

    const applyArrivalCardSync = (card: any) => {
        setEditFormData(prev => ({
            ...prev,
            arrivalCardLink: card.documentUrl || prev.arrivalCardLink,
            arrivalCardQr: card.id || prev.arrivalCardQr,
            attribution: {
                ...prev.attribution,
                arrivalCardLink: card.documentUrl || prev.arrivalCardLink,
                arrivalCardQr: card.id || prev.arrivalCardQr,
                upsells: {
                    ...prev.attribution?.upsells,
                    ac_ordered: true
                }
            }
        }));
        setOpenSyncDialog(false);
    };

    const handleFileUpload = async (field: 'visaLink' | 'arrivalCardLink' | 'arrivalCardQr', file: File) => {
        setLoading(true);
        try {
            const url = await uploadCompressedFile(file);
            
            setEditFormData(prev => {
                const newAttribution = { ...prev.attribution, [field]: url };
                
                // v8.86 - AUTO-PAID LOGIC
                if (field === 'arrivalCardLink') {
                    newAttribution.upsells = { ...newAttribution.upsells, ac_paid: true, ac_ordered: false };
                }
                if (field === 'arrivalCardQr') {
                    newAttribution.upsells = { ...newAttribution.upsells, idiv_paid: true, idiv_ordered: false };
                }

                return {
                    ...prev,
                    [field]: url,
                    attribution: newAttribution
                };
            });
            
            alert(`✅ File uploaded and compressed successfully!`);
        } catch (e: any) {
            alert(`❌ Upload failed: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = async (inv: any) => {
        setLoading(true);
        try {
            // v8.13 - Fetch Full Detail for Document Readiness Sync
            const res = await fetch(`/api/applications?id=${inv.id}`);
            const fullData = res.ok ? await res.json() : inv;
            
            const linkedInvoice = fullData.invoice || fullData;
            setEditingInvoice(fullData);
            setEditFormData({
                status: fullData.status || "Apply to Agent",
                paymentStatus: ["Paid", "Active", "Review by Agent", "On Going", "Preparing for submission", "Submited", "Process by Immigration", "Approved", "PAID"].includes(fullData.status) || linkedInvoice.status === 'PAID' ? 'PAID' : 'UNPAID',
                paymentReference: linkedInvoice.paymentReference || '',
                adminNotes: linkedInvoice.adminNotes || '', // Public Description
                internalNotes: fullData.attribution?.internalNotes || '',
                guestName: fullData.guestName || fullData.user?.name || '',
                guestEmail: fullData.guestEmail || fullData.user?.email || '',
                visaName: fullData.visaName || fullData.visaId || '',
                customAmount: fullData.customAmount || linkedInvoice.amount || '',
                userId: fullData.userId || fullData.user_id || '',
                description: linkedInvoice.adminNotes || fullData.adminNotes || '', // Sync with adminNotes
                registrationNumber: fullData.attribution?.registrationNumber || '',
                visaLink: fullData.visaLink || fullData.attribution?.visaLink || '',
                paymentLink: fullData.attribution?.paymentLink || '',
                secondOrderStatus: fullData.attribution?.secondOrderStatus || 'UNPAID',
                arrivalCardLink: fullData.arrivalCardLink || fullData.attribution?.arrivalCardLink || '',
                arrivalCardQr: fullData.arrivalCardQr || fullData.attribution?.arrivalCardQr || '',
                attribution: fullData.attribution || {}, // PRESERVE ALL (including upsells)
                paymentMethod: fullData.paymentMethod || linkedInvoice.paymentMethod || '',
                discountPct: String(fullData.attribution?.discountPct || '0'),
                verificationAddress: (() => {
                    const addr = fullData.verification?.address || '';
                    if (addr.startsWith('{')) {
                        try {
                            const parsed = JSON.parse(addr);
                            return parsed.street || parsed.address || addr;
                        } catch (e) { return addr; }
                    }
                    return addr;
                })()
            });
            setOpenEditDialog(true);
        } catch (e) {
            console.error("Edit fetch failed", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this invoice?")) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch(`/api/applications?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setInvoices(invoices.filter(i => i.id !== id));
            }
        } catch (e) {
            alert("Failed to delete");
        }
    };

    const resetForm = () => {
        setFormData({
            userId: "",
            guestName: "",
            guestEmail: "",
            guestAddress: "",
            visaId: "",
            visaName: "",
            customAmount: "",
            paymentMethod: "",
            description: "",
            verificationId: "",
            status: "Apply to Agent",
            appliedAt: "",
            paymentReference: "",
            adminNotes: "",
            internalNotes: "",
            registrationNumber: "",
            visaLink: "",
            paymentLink: "",
            secondOrderStatus: "UNPAID",
            arrivalCardLink: "",
            arrivalCardQr: ""
        });
        setInvoiceMode('guest');
    };

    const handleVisaSelect = (visaId: string) => {
        const visa = VISA_DATABASE.find(v => v.id === visaId);
        setFormData(prev => ({
            ...prev,
            visaId,
            visaName: visa ? visa.id + " - " + visa.name : ""
        }));
    };

    return (
        <Stack spacing={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                    <Typography variant="h4" fontWeight="bold">Invoicing Panel</Typography>
                    <Typography variant="body1" color="text.secondary">Create and manage invoices for both registered and guest users.</Typography>
                </div>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchInvoices}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => { resetForm(); setOpenDialog(true); }}
                    >
                        Create Invoice
                    </Button>
                </Stack>
            </Box>

            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>INVOICE #</TableCell>
                                <TableCell>CUSTOMER</TableCell>
                                <TableCell>SERVICE</TableCell>
                                <TableCell>STATUS</TableCell>
                                <TableCell>DATE</TableCell>
                                <TableCell align="right">ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={6} align="center"><CircularProgress /></TableCell></TableRow>
                            ) : invoices.map((inv) => {
                                const customerName = inv.user?.name || inv.guestName || "Guest Customer";
                                const customerEmail = inv.user?.email || inv.guestEmail || "-";
                                const isPaid = ["Paid", "Active", "Review by Agent", "On Going", "Preparing for submission", "Submited", "Process by Immigration", "Approved"].includes(inv.status);
                                return (
                                    <TableRow key={inv.id} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontFamily="monospace">
                                                {inv.id.substring(0, 8)}...
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography fontWeight="bold">{customerName}</Typography>
                                            <Typography variant="caption" color="text.secondary">{customerEmail}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{inv.visaName || inv.visaId}</Typography>
                                            <Stack direction="row" spacing={0.5} mt={0.5} alignItems="center" flexWrap="wrap">
                                                {inv.paymentMethod && (
                                                    <Chip 
                                                        label={inv.paymentMethod} 
                                                        size="small" 
                                                        sx={{ 
                                                            height: 16, 
                                                            fontSize: '0.6rem', 
                                                            fontWeight: 'bold', 
                                                            bgcolor: inv.paymentMethod === 'Inquiry' ? 'warning.light' : 'action.selected',
                                                            color: inv.paymentMethod === 'Inquiry' ? 'warning.contrastText' : 'text.primary'
                                                        }}
                                                    />
                                                )}
                                                {inv.customAmount && (
                                                    <Typography variant="caption" color="primary" sx={{ mr: 1 }}>Custom: {inv.customAmount}</Typography>
                                                )}
                                                {inv.documentReadiness?.idiv?.ordered && (
                                                    <Chip 
                                                        label="IDiv" 
                                                        size="small" 
                                                        variant="outlined"
                                                        color={inv.documentReadiness.idiv.paid ? "secondary" : "default"}
                                                        sx={{ height: 16, fontSize: '0.6rem', fontWeight: 'bold' }}
                                                    />
                                                )}
                                                {inv.documentReadiness?.arrivalCard?.ordered && (
                                                    <Chip 
                                                        label="AC" 
                                                        size="small" 
                                                        variant="outlined"
                                                        color={inv.documentReadiness.arrivalCard.paid ? "info" : "default"}
                                                        sx={{ height: 16, fontSize: '0.6rem', fontWeight: 'bold' }}
                                                    />
                                                )}
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={inv.status}
                                            color={isPaid ? 'success' : inv.status === 'Reject' || inv.status === 'Rejected' ? 'error' : 'warning'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(inv.appliedAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={() => handleEditClick(inv)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                href={`/${locale || 'en'}/invoice/${inv.id}`}
                                                target="_blank"
                                            >
                                                <LocalPrintshopIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => handleDelete(inv.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* CREATE DIALOG */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <ToggleButtonGroup
                            value={invoiceMode}
                            exclusive
                            onChange={(_, val) => val && setInvoiceMode(val)}
                            fullWidth
                            color="primary"
                        >
                            <ToggleButton value="guest">Guest Customer</ToggleButton>
                            <ToggleButton value="user">Registered User</ToggleButton>
                        </ToggleButtonGroup>

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            {invoiceMode === 'guest' ? (
                                <>
                                    <TextField
                                        label="Guest Name"
                                        fullWidth
                                        value={formData.guestName}
                                        onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                                    />
                                    <TextField
                                        label="Guest Email (Optional)"
                                        fullWidth
                                        value={formData.guestEmail}
                                        onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                                    />
                                </>
                            ) : (
                                <TextField
                                    select
                                    label="Select User"
                                    fullWidth
                                    value={formData.userId}
                                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                >
                                    {users.map(u => (
                                        <MenuItem key={u.id} value={u.id}>
                                            {u.name || u.email}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        </Stack>

                        {invoiceMode === 'guest' && (
                            <TextField
                                label="Guest Address (Optional)"
                                fullWidth
                                multiline
                                rows={2}
                                value={formData.guestAddress}
                                onChange={(e) => setFormData({ ...formData, guestAddress: e.target.value })}
                            />
                        )}

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField
                                select
                                label="Select Service / Product"
                                fullWidth
                                value={formData.visaId}
                                onChange={(e) => handleVisaSelect(e.target.value)}
                            >
                                <MenuItem value="custom">-- Create Custom Invoice --</MenuItem>
                                {VISA_DATABASE.map(v => (
                                    <MenuItem key={v.id} value={v.id}>
                                        {v.id} - {v.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="Custom Amount / Price"
                                fullWidth
                                value={formData.customAmount}
                                onChange={(e) => setFormData({ ...formData, customAmount: e.target.value })}
                                placeholder="e.g. IDR 5,000,000"
                                helperText="Leave empty to use standard price"
                            />
                        </Stack>

                        {formData.visaId === 'custom' && (
                            <TextField
                                label="Service / Product Name"
                                fullWidth
                                required
                                value={formData.visaName}
                                onChange={(e) => setFormData({ ...formData, visaName: e.target.value })}
                                placeholder="e.g. Web Design, Company Formation, etc."
                            />
                        )}

                        <TextField
                            label="Invoice Description (Public)"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.adminNotes}
                            onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                            helperText="This appears as 'Admin Notes' in the public invoice and PDF."
                        />

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField
                                label="Immigration Reg No."
                                fullWidth
                                value={formData.registrationNumber}
                                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                            />
                            <TextField
                                label="Visa Download Link"
                                fullWidth
                                value={formData.visaLink}
                                onChange={(e) => setFormData({ ...formData, visaLink: e.target.value })}
                            />
                        </Stack>

                        <TextField
                            label="Manual Payment Link (Optional)"
                            fullWidth
                            value={formData.paymentLink}
                            onChange={(e) => setFormData({ ...formData, paymentLink: e.target.value })}
                            placeholder="https://buy.stripe.com/..."
                            helperText="If provided, a 'PAY NOW MANUALLY' button will appear on the invoice."
                        />

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField
                                label="Arrival Card Link"
                                fullWidth
                                value={formData.arrivalCardLink}
                                onChange={(e) => setFormData({ ...formData, arrivalCardLink: e.target.value })}
                                placeholder="https://..."
                            />
                            <TextField
                                label="Arrival Card QR/Code"
                                fullWidth
                                value={formData.arrivalCardQr}
                                onChange={(e) => setFormData({ ...formData, arrivalCardQr: e.target.value })}
                                placeholder="QR Code ID or String"
                            />
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField
                                label="Payment Method (Optional)"
                                fullWidth
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                            />

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField
                                select
                                label="Initial Status"
                                fullWidth
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <MenuItem value="Apply to Agent">Apply to Agent</MenuItem>
                                <MenuItem value="Draft">Draft</MenuItem>
                                <MenuItem value="Review by Agent">Review by Agent</MenuItem>
                                <MenuItem value="On Going">On Going</MenuItem>
                                <MenuItem value="Preparing for submission">Preparing for submission</MenuItem>
                                <MenuItem value="Submited">Submited</MenuItem>
                                <MenuItem value="Process by Immigration">Process by Immigration</MenuItem>
                                <MenuItem value="Approved">Approved</MenuItem>
                                <MenuItem value="Reject">Reject</MenuItem>
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Expired">Expired</MenuItem>
                            </TextField>

                            <TextField
                                select
                                label="Additional Order Status"
                                fullWidth
                                value={formData.secondOrderStatus}
                                onChange={(e) => setFormData({ ...formData, secondOrderStatus: e.target.value })}
                            >
                                <MenuItem value="UNPAID">Unpaid (Total 2)</MenuItem>
                                <MenuItem value="PAID">Paid (Total 2)</MenuItem>
                            </TextField>
                        </Stack>
                        </Stack>

                        <TextField
                            label="Admin Payment Reference (Optional)"
                            fullWidth
                            value={formData.paymentReference}
                            onChange={(e) => setFormData({ ...formData, paymentReference: e.target.value })}
                        />

                        <TextField
                            label="Admin Internal Notes (Private)"
                            fullWidth
                            multiline
                            rows={2}
                            value={formData.internalNotes}
                            onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                            helperText="Internal use only. Not shown to customer."
                        />

                        <TextField
                            label="Issued Date (Backdate Invoice)"
                            type="datetime-local"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.appliedAt}
                            onChange={(e) => setFormData({ ...formData, appliedAt: e.target.value })}
                        />

                        <TextField
                            select
                            label="Link Verification (Optional)"
                            fullWidth
                            value={formData.verificationId}
                            onChange={(e) => setFormData({ ...formData, verificationId: e.target.value })}
                            helperText="If selected, a Verification QR Code will be added to the invoice."
                        >
                            <MenuItem value="">-- None --</MenuItem>
                            {verifications.map(v => (
                                <MenuItem key={v.id} value={v.id}>
                                    {v.passportNumber} - {v.fullName}
                                </MenuItem>
                            ))}
                        </TextField>

                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate}>Create Invoice</Button>
                </DialogActions>
            </Dialog>

            {/* EDIT DIALOG */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Update Invoice Details</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            select
                            label="Application Status"
                            fullWidth
                            value={editFormData.status}
                            onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                        >
                            <MenuItem value="Apply to Agent">Apply to Agent</MenuItem>
                            <MenuItem value="Draft">Draft</MenuItem>
                            <MenuItem value="Review by Agent">Review by Agent</MenuItem>
                            <MenuItem value="On Going">On Going</MenuItem>
                            <MenuItem value="Preparing for submission">Preparing for submission</MenuItem>
                            <MenuItem value="Submited">Submited</MenuItem>
                            <MenuItem value="Process by Immigration">Process by Immigration</MenuItem>
                            <MenuItem value="Approved">Approved</MenuItem>
                            <MenuItem value="Reject">Reject</MenuItem>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Expired">Expired</MenuItem>
                        </TextField>

                        <TextField
                            label="Customer Name"
                            fullWidth
                            value={editFormData.guestName}
                            onChange={(e) => setEditFormData({ ...editFormData, guestName: e.target.value })}
                        />

                        <TextField
                            label="Customer Email"
                            fullWidth
                            value={editFormData.guestEmail}
                            onChange={(e) => setEditFormData({ ...editFormData, guestEmail: e.target.value })}
                        />

                        <TextField
                            label="Service / Product Name"
                            fullWidth
                            value={editFormData.visaName}
                            onChange={(e) => setEditFormData({ ...editFormData, visaName: e.target.value })}
                        />

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                label="Invoice Amount (IDR)"
                                fullWidth
                                placeholder="e.g. 5000000"
                                value={editFormData.customAmount}
                                onChange={(e) => setEditFormData({ ...editFormData, customAmount: e.target.value })}
                            />
                            <TextField
                                label="Discount (%)"
                                placeholder="0"
                                type="number"
                                sx={{ minWidth: 130 }}
                                inputProps={{ min: 0, max: 100, step: 1 }}
                                value={editFormData.discountPct}
                                onChange={(e) => {
                                    const val = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                                    setEditFormData({ ...editFormData, discountPct: String(val) });
                                }}
                                helperText={
                                    parseFloat(editFormData.discountPct) > 0 && editFormData.customAmount
                                        ? `- IDR ${Math.round(parseFloat(editFormData.customAmount.replace(/\./g, '').replace(/[^0-9.-]/g, '')) * parseFloat(editFormData.discountPct) / 100).toLocaleString('id-ID')}`
                                        : "0 = no discount"
                                }
                                FormHelperTextProps={{ sx: { color: parseFloat(editFormData.discountPct) > 0 ? 'success.main' : 'text.secondary', fontWeight: 600 } }}
                            />
                        </Stack>

                        <TextField
                            label="Invoice Description (Public)"
                            fullWidth
                            multiline
                            rows={3}
                            value={editFormData.adminNotes}
                            onChange={(e) => setEditFormData({ ...editFormData, adminNotes: e.target.value })}
                            helperText="This appears as 'Admin Notes' in the public invoice and PDF."
                        />

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField
                                label="Immigration Reg No."
                                fullWidth
                                value={editFormData.registrationNumber}
                                onChange={(e) => setEditFormData({ 
                                    ...editFormData, 
                                    registrationNumber: e.target.value,
                                    attribution: { ...editFormData.attribution, registrationNumber: e.target.value }
                                })}
                            />
                            <TextField
                                label="Visa Download Link"
                                fullWidth
                                value={editFormData.visaLink}
                                onChange={(e) => setEditFormData({ 
                                    ...editFormData, 
                                    visaLink: e.target.value,
                                    attribution: { ...editFormData.attribution, visaLink: e.target.value }
                                })}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton component="label" color="primary">
                                                    <CloudUploadIcon />
                                                    <input 
                                                        type="file" 
                                                        hidden 
                                                        onChange={(e) => e.target.files?.[0] && handleFileUpload('visaLink', e.target.files[0])} 
                                                    />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />
                        </Stack>

                        <TextField
                            label="Manual Payment Link (v8.60)"
                            fullWidth
                            value={editFormData.paymentLink}
                            onChange={(e) => setEditFormData({ 
                                ...editFormData, 
                                paymentLink: e.target.value,
                                attribution: { ...editFormData.attribution, paymentLink: e.target.value }
                            })}
                            placeholder="https://..."
                            helperText="Paste custom payment link here. Links to invoice CTA."
                        />

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField
                                label="Arrival Card Link"
                                fullWidth
                                value={editFormData.arrivalCardLink}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setEditFormData(prev => ({ 
                                        ...prev, 
                                        arrivalCardLink: val,
                                        attribution: { 
                                            ...prev.attribution, 
                                            arrivalCardLink: val,
                                            upsells: val ? { ...prev.attribution.upsells, ac_paid: true, ac_ordered: false } : prev.attribution.upsells
                                        }
                                    }));
                                }}
                                placeholder="https://..."
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton component="label" color="success">
                                                    <CloudUploadIcon />
                                                    <input 
                                                        type="file" 
                                                        hidden 
                                                        onChange={(e) => e.target.files?.[0] && handleFileUpload('arrivalCardLink', e.target.files[0])} 
                                                    />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />
                            <TextField
                                label="Sponsor ID / IDiv Link"
                                fullWidth
                                value={editFormData.arrivalCardQr}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setEditFormData(prev => ({ 
                                        ...prev, 
                                        arrivalCardQr: val,
                                        attribution: { 
                                            ...prev.attribution, 
                                            arrivalCardQr: val,
                                            upsells: val ? { ...prev.attribution.upsells, idiv_paid: true, idiv_ordered: false } : prev.attribution.upsells
                                        }
                                    }));
                                }}
                                placeholder="Paste Link or Upload"
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton component="label" color="info">
                                                    <CloudUploadIcon />
                                                    <input 
                                                        type="file" 
                                                        hidden 
                                                        onChange={(e) => e.target.files?.[0] && handleFileUpload('arrivalCardQr', e.target.files[0])} 
                                                    />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />
                        </Stack>

                        <Box sx={{ bgcolor: 'rgba(2,132,199,0.05)', p: 2, borderRadius: 3, border: '1px solid rgba(2,132,199,0.2)' }}>
                            <Typography variant="subtitle2" fontWeight="800" color="info.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <RefreshIcon sx={{ fontSize: 16 }} />
                                Document Readiness Sync (v8.14)
                            </Typography>
                            <Grid container spacing={1}>
                                <Grid size={{ xs: 6 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Chip 
                                            label="AC Ordered" 
                                            size="small" 
                                            clickable
                                            color={editFormData.attribution?.upsells?.ac_ordered ? 'success' : 'default'} 
                                            variant={editFormData.attribution?.upsells?.ac_ordered ? 'filled' : 'outlined'}
                                            onClick={() => {
                                                const current = editFormData.attribution?.upsells || {};
                                                const newState = !current.ac_ordered;
                                                setEditFormData({
                                                    ...editFormData,
                                                    attribution: {
                                                        ...editFormData.attribution,
                                                        upsells: { 
                                                            ...current, 
                                                            ac_ordered: newState,
                                                            ac_paid: newState ? false : current.ac_paid // Turn off Paid if Ordered is turned on
                                                        }
                                                    }
                                                });
                                            }}
                                        />
                                        <Chip 
                                            label="AC Paid" 
                                            size="small" 
                                            clickable
                                            color={editFormData.attribution?.upsells?.ac_paid ? 'success' : 'default'} 
                                            variant={editFormData.attribution?.upsells?.ac_paid ? 'filled' : 'outlined'}
                                            onClick={() => {
                                                const current = editFormData.attribution?.upsells || {};
                                                const newState = !current.ac_paid;
                                                setEditFormData({
                                                    ...editFormData,
                                                    attribution: {
                                                        ...editFormData.attribution,
                                                        upsells: { 
                                                            ...current, 
                                                            ac_paid: newState,
                                                            ac_ordered: newState ? false : current.ac_ordered // Turn off Ordered if Paid is turned on
                                                        }
                                                    }
                                                });
                                            }}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Chip 
                                            label="IDiv Ordered" 
                                            size="small" 
                                            clickable
                                            color={editFormData.attribution?.upsells?.idiv_ordered ? 'success' : 'default'} 
                                            variant={editFormData.attribution?.upsells?.idiv_ordered ? 'filled' : 'outlined'}
                                            onClick={() => {
                                                const current = editFormData.attribution?.upsells || {};
                                                const newState = !current.idiv_ordered;
                                                setEditFormData({
                                                    ...editFormData,
                                                    attribution: {
                                                        ...editFormData.attribution,
                                                        upsells: { 
                                                            ...current, 
                                                            idiv_ordered: newState,
                                                            idiv_paid: newState ? false : current.idiv_paid // Turn off Paid if Ordered is turned on
                                                        }
                                                    }
                                                });
                                            }}
                                        />
                                        <Chip 
                                            label="IDiv Paid" 
                                            size="small" 
                                            clickable
                                            color={editFormData.attribution?.upsells?.idiv_paid ? 'success' : 'default'} 
                                            variant={editFormData.attribution?.upsells?.idiv_paid ? 'filled' : 'outlined'}
                                            onClick={() => {
                                                const current = editFormData.attribution?.upsells || {};
                                                const newState = !current.idiv_paid;
                                                setEditFormData({
                                                    ...editFormData,
                                                    attribution: {
                                                        ...editFormData.attribution,
                                                        upsells: { 
                                                            ...current, 
                                                            idiv_paid: newState,
                                                            idiv_ordered: newState ? false : current.idiv_ordered // Turn off Ordered if Paid is turned on
                                                        }
                                                    }
                                                });
                                            }}
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                            <Box display="flex" justifyContent="flex-end" mt={2}>
                                <Button 
                                    size="small" 
                                    variant="contained" 
                                    color="info"
                                    startIcon={<RefreshIcon />}
                                    onClick={() => handleEditClick(editingInvoice)}
                                    sx={{ 
                                        borderRadius: 3, 
                                        textTransform: 'none',
                                        fontWeight: 800,
                                        boxShadow: '0 4px 12px rgba(2,132,199,0.2)',
                                        '&:hover': { bgcolor: '#0284c7' }
                                    }}
                                >
                                    Auto-Detect & Sync
                                </Button>
                            </Box>
                        </Box>

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField
                                select
                                label="Payment Status (Total 1)"
                                fullWidth
                                value={editFormData.paymentStatus}
                                onChange={(e) => setEditFormData({ ...editFormData, paymentStatus: e.target.value })}
                            >
                                <MenuItem value="UNPAID">Unpaid</MenuItem>
                                <MenuItem value="PENDING">Pending</MenuItem>
                                <MenuItem value="PAID">Paid</MenuItem>
                                <MenuItem value="FAILED">Failed</MenuItem>
                                <MenuItem value="REFUNDED">Refunded</MenuItem>
                            </TextField>

                            <TextField
                                select
                                label="Additional Status (Total 2)"
                                fullWidth
                                value={editFormData.secondOrderStatus}
                                onChange={(e) => setEditFormData({ 
                                    ...editFormData, 
                                    secondOrderStatus: e.target.value,
                                    attribution: { ...editFormData.attribution, secondOrderStatus: e.target.value }
                                })}
                            >
                                <MenuItem value="UNPAID">Unpaid (Additional)</MenuItem>
                                <MenuItem value="PAID">Paid (Additional)</MenuItem>
                            </TextField>
                        </Stack>

                        <TextField
                            select
                            label="Payment Method"
                            fullWidth
                            value={editFormData.paymentMethod || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, paymentMethod: e.target.value })}
                        >
                            <MenuItem value="PayPal">PayPal</MenuItem>
                            <MenuItem value="DOKU">Doku</MenuItem>
                            <MenuItem value="Manual">Wise / Stripe / Revolut (Manual)</MenuItem>
                            <MenuItem value="Inquiry">Submit Inquiry</MenuItem>
                        </TextField>

                        <TextField
                            label="Payment Reference"
                            fullWidth
                            placeholder="e.g. TRF-123456789"
                            value={editFormData.paymentReference}
                            onChange={(e) => setEditFormData({ ...editFormData, paymentReference: e.target.value })}
                            helperText="External Transaction ID or Bank Reference"
                        />

                        <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 2, border: '1px dashed primary.main' }}>
                            <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
                                Bill To / Submission Attribution
                            </Typography>
                            <Stack spacing={2}>
                                <TextField
                                    label="Phone Number"
                                    fullWidth
                                    size="small"
                                    value={editFormData.attribution?.phone || ""}
                                    onChange={(e) => setEditFormData({ 
                                        ...editFormData, 
                                        attribution: { ...editFormData.attribution, phone: e.target.value } 
                                    })}
                                />
                                <TextField
                                    label="Country / Origin"
                                    fullWidth
                                    size="small"
                                    value={editFormData.attribution?.country || ""}
                                    onChange={(e) => setEditFormData({ 
                                        ...editFormData, 
                                        attribution: { ...editFormData.attribution, country: e.target.value } 
                                    })}
                                />
                                <TextField
                                    label="Indonesian Address (IDiv Card)"
                                    fullWidth
                                    size="small"
                                    multiline
                                    rows={2}
                                    value={editFormData.verificationAddress}
                                    onChange={(e) => setEditFormData({ ...editFormData, verificationAddress: e.target.value })}
                                />
                            </Stack>
                        </Box>

                        <TextField
                            label="Admin Internal Notes (Private)"
                            fullWidth
                            multiline
                            rows={2}
                            value={editFormData.internalNotes}
                            onChange={(e) => setEditFormData({ 
                                ...editFormData, 
                                internalNotes: e.target.value,
                                attribution: { ...editFormData.attribution, internalNotes: e.target.value }
                            })}
                            helperText="This is for internal use only and will NOT be shown to the customer."
                        />

                        {/* COMMUNICATION & EMAIL CONTROLS (v10.15) */}
                        <Box sx={{ p: 2.5, bgcolor: 'rgba(124, 58, 237, 0.05)', borderRadius: 3, border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                            <Typography variant="subtitle2" fontWeight="800" color="secondary.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <CampaignIcon sx={{ fontSize: 18 }} />
                                Communication & Email Controls
                            </Typography>
                            
                            <Grid container spacing={1.5}>
                                <Grid size={{ xs: 6 }}>
                                    <Button 
                                        fullWidth 
                                        size="small" 
                                        variant="outlined" 
                                        color="secondary" 
                                        onClick={() => handleManualEmail('APPLICATION_RECEIVED')}
                                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                                    >
                                        Resend Application Confirmation
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Button 
                                        fullWidth 
                                        size="small" 
                                        variant="contained" 
                                        color="success" 
                                        onClick={() => handleManualEmail('PAYMENT_CONFIRMED')}
                                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}
                                    >
                                        Send Payment Confirmed
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Button 
                                        fullWidth 
                                        size="small" 
                                        variant="contained" 
                                        color="info" 
                                        onClick={() => handleManualEmail('INVOICE_SETTLED')}
                                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}
                                    >
                                        Send Invoice Settled
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Button 
                                        fullWidth 
                                        size="small" 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => handleManualEmail('VISA_APPROVED')}
                                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, boxShadow: 'none', bgcolor: '#2563eb' }}
                                    >
                                        Send Visa Approved!
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Button 
                                        fullWidth 
                                        size="small" 
                                        variant="contained" 
                                        onClick={() => handleManualEmail('PAYMENT_REMINDER')}
                                        sx={{ 
                                            borderRadius: 2, 
                                            textTransform: 'none', 
                                            fontWeight: 700, 
                                            boxShadow: 'none',
                                            bgcolor: '#ea580c',
                                            '&:hover': { bgcolor: '#c2410c' }
                                        }}
                                    >
                                        💳 Request Payment — Send Invoice Link to Customer
                                    </Button>
                                </Grid>
                            </Grid>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5, fontStyle: 'italic' }}>
                                * Manual triggers will be logged in the Audit Trail and Email Logs.
                            </Typography>
                        </Box>

                        <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 2, border: '1px dashed primary.main' }}>
                            <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
                                Link / Re-assign to Registered User
                            </Typography>
                            <TextField
                                select
                                label="Registered User"
                                fullWidth
                                size="small"
                                value={editFormData.userId}
                                onChange={(e) => setEditFormData({ ...editFormData, userId: e.target.value })}
                                helperText="Transfer this application to their dashboard"
                            >
                                <MenuItem value="">-- Unlink (Keep as Guest) --</MenuItem>
                                {users.map(u => (
                                    <MenuItem key={u.id} value={u.id}>
                                        {u.name || u.email} ({u.email})
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        {/* RENDER ATTACHED DOCUMENTS */}
                        {editingInvoice && editingInvoice.documents && Object.keys(editingInvoice.documents).length > 0 && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: '#f0f9ff', borderRadius: 2, border: '1px solid #bae6fd' }}>
                                <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                                    Step 3: Uploaded Documents
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {(() => {
                                        let docsToRender = editingInvoice.documents;
                                        if (typeof docsToRender === 'string') {
                                            try { docsToRender = JSON.parse(docsToRender); } catch (e) { docsToRender = {}; }
                                        }
                                        if (Array.isArray(docsToRender)) {
                                            // Merge array of objects into single object to reuse existing logic
                                            docsToRender = docsToRender.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                                        }
                                        
                                        return Object.entries(docsToRender || {}).flatMap(([key, urlValue]) => {
                                            if (!urlValue) return [];
                                            const urls = Array.isArray(urlValue) ? urlValue : [urlValue];
                                            return urls.map((url, index) => {
                                            // Better formatting for labels (e.g. additional_1 -> Additional Doc 1)
                                            let name = key.replace(/([A-Z])/g, ' $1')
                                                         .replace(/_/g, ' ')
                                                         .replace(/\b\w/g, l => l.toUpperCase())
                                                         .trim();
                                            if (name.includes('Additional')) name = name.replace('Additional', 'Additional Doc');
                                            
                                            // Append index if it's an array with multiple items
                                            const finalName = urls.length > 1 ? `${name} ${index + 1}` : name;
                                            
                                            return (
                                                <Chip
                                                    key={`${key}-${index}`}
                                                    label={finalName}
                                                    onClick={() => setViewingDoc({ url: url as string, name: finalName })}
                                                    clickable
                                                    color="info"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            );
                                         });
                                        });
                                    })()}
                                </Stack>
                            </Box>
                        )}

                        {/* STEP 1 & 2 SUBMISSION DETAILS */}
                        {editingInvoice && (editingInvoice.attribution || editingInvoice.verificationId) && (() => {
                            const verification = editingInvoice.verification || verifications.find(v => v.id === editingInvoice.verificationId);
                            return (
                                <Box sx={{ mt: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                    <Typography variant="subtitle2" color="slate.700" fontWeight="bold" gutterBottom>
                                        Step 1 & 2: Submission Details
                                    </Typography>
                                    <Stack spacing={1}>
                                        {editingInvoice.attribution && (
                                            <>
                                                <Typography variant="caption" display="block">
                                                    <strong>Origin Country:</strong> {editingInvoice.attribution.country || "Not specified"}
                                                </Typography>
                                                <Typography variant="caption" display="block">
                                                    <strong>Price Tier / Duration:</strong> {editingInvoice.attribution.priceTier || "Standard"}
                                                </Typography>
                                                <Typography variant="caption" display="block">
                                                    <strong>Arrival Date:</strong> {editingInvoice.attribution.arrivalDate || "Not specified"}
                                                </Typography>
                                                <Typography variant="caption" display="block">
                                                    <strong>Phone:</strong> {editingInvoice.attribution.phone || "Not specified"}
                                                </Typography>
                                                <Typography variant="caption" display="block">
                                                    <strong>Date of Birth:</strong> {editingInvoice.attribution.dob || "Not specified"}
                                                </Typography>
                                            </>
                                        )}
                                        {verification && (
                                            <>
                                                <Typography variant="caption" display="block">
                                                    <strong>Passport:</strong> {verification.passportNumber}
                                                </Typography>
                                                <Typography variant="caption" display="block">
                                                    <strong>Nationality:</strong> {verification.nationality || "N/A"}
                                                </Typography>
                                                <Typography variant="caption" display="block">
                                                    <strong>Address:</strong> {verification.address || "N/A"}
                                                </Typography>
                                            </>
                                        )}
                                    </Stack>
                                </Box>
                            );
                        })()}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpdate}>Update Invoice</Button>
                </DialogActions>
            </Dialog>

            {viewingDoc && (
                <DocumentViewer 
                    open={!!viewingDoc} 
                    onClose={() => setViewingDoc(null)} 
                    documentUrl={viewingDoc.url} 
                    documentName={viewingDoc.name} 
                />
            )}

            {/* FUZZY ARRIVAL CARD SYNC DIALOG */}
            <Dialog open={openSyncDialog} onClose={() => setOpenSyncDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                    🔍 Fuzzy Match Results
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 400 }}>
                        — Exact email not found. Select the best match below.
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        {syncCandidates.map((card, idx) => {
                            const cardName = card._matchedName || card.formData?.fullName || card.formData?.name || 'Unknown';
                            const cardEmail = card.formData?.email || card.user?.email || '—';
                            const score: number = card._fuzzyScore || 0;
                            const scoreColor = score >= 90 ? '#059669' : score >= 80 ? '#d97706' : '#dc2626';

                            return (
                                <Box
                                    key={card.id || idx}
                                    sx={{
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: score >= 90 ? 'success.main' : score >= 80 ? 'warning.main' : 'error.light',
                                        borderRadius: 2,
                                        bgcolor: score >= 90 ? 'rgba(5,150,105,0.05)' : 'rgba(0,0,0,0.02)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: 2
                                    }}
                                >
                                    <Box>
                                        <Typography fontWeight={800} fontSize="0.95rem">{cardName}</Typography>
                                        <Typography variant="caption" color="text.secondary">{cardEmail}</Typography>
                                        <Box sx={{ mt: 0.5 }}>
                                            <Chip
                                                label={`${score}% Match`}
                                                size="small"
                                                sx={{ bgcolor: scoreColor, color: '#fff', fontWeight: 800, fontSize: '0.7rem' }}
                                            />
                                            {card.paymentStatus && (
                                                <Chip
                                                    label={card.paymentStatus}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ ml: 1, fontSize: '0.7rem' }}
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => applyArrivalCardSync(card)}
                                        sx={{ minWidth: 100, fontWeight: 700, borderRadius: 2, textTransform: 'none' }}
                                    >
                                        Attach ✓
                                    </Button>
                                </Box>
                            );
                        })}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSyncDialog(false)} color="inherit">Cancel</Button>
                </DialogActions>
            </Dialog>

        </Stack>
    );
}
