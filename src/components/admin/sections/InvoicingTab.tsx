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
    IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import Link from "next/link";
import { VISA_DATABASE } from "@/constants/visas";
import { supabase } from "@/lib/supabase";

export default function InvoicingTab() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [verifications, setVerifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false); // New Edit Dialog

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
        status: "Pending", // Default
        appliedAt: "", // For backdating
        // New
        paymentReference: "",
        adminNotes: ""
    });

    // Edit State
    const [editingInvoice, setEditingInvoice] = useState<any>(null);
    const [editFormData, setEditFormData] = useState({
        status: "",
        paymentStatus: "",
        paymentReference: "",
        adminNotes: ""
    });

    useEffect(() => {
        fetchInvoices();
        fetchUsers();
        fetchVerifications();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await fetch('/api/applications'); // Fetch All
            if (res.ok) setInvoices(await res.json());
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
                appliedAt: formData.appliedAt || null
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
                    ...editFormData
                })
            });

            if (res.ok) {
                setInvoices(invoices.map(inv =>
                    inv.id === editingInvoice.id
                        ? { ...inv, ...editFormData, status: editFormData.status }
                        : inv
                ));
                setOpenEditDialog(false);
                setEditingInvoice(null);
                alert("Invoice updated successfully");
            } else {
                alert("Failed to update invoice");
            }
        } catch (e) {
            alert("Error updating invoice");
        }
    };

    const handleEditClick = (inv: any) => {
        setEditingInvoice(inv);
        setEditFormData({
            status: inv.status || "Pending",
            paymentStatus: inv.status === 'Paid' || inv.status === 'Active' ? 'PAID' : 'UNPAID', // Heuristic
            paymentReference: inv.paymentReference || '',
            adminNotes: inv.adminNotes || ''
        });
        setOpenEditDialog(true);
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
            status: "Pending",
            appliedAt: "",
            paymentReference: "",
            adminNotes: ""
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
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => { resetForm(); setOpenDialog(true); }}
                >
                    Create Invoice
                </Button>
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
                                const isPaid = inv.status === 'Paid' || inv.status === 'Active';
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
                                            {inv.customAmount && (
                                                <Typography variant="caption" color="primary">Custom: {inv.customAmount}</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={inv.status}
                                                color={isPaid ? 'success' : inv.status === 'Rejected' ? 'error' : 'warning'}
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
                                                href={`/invoice/${inv.id}`}
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
                            label="Description (Optional)"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField
                                label="Payment Method (Optional)"
                                fullWidth
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                            />

                            <TextField
                                select
                                label="Initial Status"
                                fullWidth
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Paid">Paid</MenuItem>
                                <MenuItem value="Active">Active</MenuItem>
                            </TextField>
                        </Stack>

                        <TextField
                            label="Admin Payment Reference (Optional)"
                            fullWidth
                            value={formData.paymentReference}
                            onChange={(e) => setFormData({ ...formData, paymentReference: e.target.value })}
                        />

                        <TextField
                            label="Admin Notes (Internal)"
                            fullWidth
                            multiline
                            rows={2}
                            value={formData.adminNotes}
                            onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
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
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Approved">Approved</MenuItem>
                            <MenuItem value="Active">Active (Complete)</MenuItem>
                            <MenuItem value="Rejected">Rejected</MenuItem>
                            <MenuItem value="Expired">Expired</MenuItem>
                            <MenuItem value="Paid">Paid</MenuItem>
                        </TextField>

                        <TextField
                            select
                            label="Payment Status (Invoice)"
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
                            label="Payment Reference"
                            fullWidth
                            placeholder="e.g. TRF-123456789"
                            value={editFormData.paymentReference}
                            onChange={(e) => setEditFormData({ ...editFormData, paymentReference: e.target.value })}
                            helperText="External Transaction ID or Bank Reference"
                        />

                        <TextField
                            label="Admin Internal Notes"
                            fullWidth
                            multiline
                            rows={3}
                            value={editFormData.adminNotes}
                            onChange={(e) => setEditFormData({ ...editFormData, adminNotes: e.target.value })}
                        />

                        {/* RENDER ATTACHED DOCUMENTS */}
                        {editingInvoice && editingInvoice.documents && Object.keys(editingInvoice.documents).length > 0 && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                                    Attached Documents
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {Object.entries(editingInvoice.documents).map(([key, url]) => (
                                        <Chip
                                            key={key}
                                            label={key.replace(/([A-Z])/g, ' $1').trim()} // Turns "passportPhoto" into "passport Photo"
                                            component="a"
                                            href={url as string}
                                            target="_blank"
                                            clickable
                                            color="info"
                                            variant="outlined"
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpdate}>Update Invoice</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
