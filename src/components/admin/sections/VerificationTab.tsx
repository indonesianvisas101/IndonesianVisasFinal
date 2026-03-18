"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Stack,
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
    IconButton,
    MenuItem,
    Alert,
    CircularProgress,
    Tabs,
    Tab
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import QrCodeIcon from "@mui/icons-material/QrCode";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { QRCodeCanvas } from "qrcode.react";
import { generateStatementPDF } from "@/utils/pdfGenerator";
import { supabase } from "@/lib/supabase";
import IDivCardModern from "@/components/idiv/IDivCardModern";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ShareIcon from "@mui/icons-material/Share";
import { downloadIDiv, downloadIDivDual } from "@/utils/idivDownloadTools";


export default function VerificationTab({ initialUserId }: { initialUserId?: string }) {
    const [verifications, setVerifications] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]); // User List
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openQRDialog, setOpenQRDialog] = useState(false);
    const [openCardDialog, setOpenCardDialog] = useState(false);
    const [verificationMode, setVerificationMode] = useState<'linked' | 'manual'>('manual');
    const [previewCardMode, setPreviewCardMode] = useState<'IDIV' | 'IDG'>('IDIV');
    const [selectedUserId, setSelectedUserId] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        passportNumber: "",
        visaType: "",
        issuedDate: new Date().toISOString().split('T')[0],
        expiresAt: "",
        address: "",
        nationality: "VERIFIED HOLDER",
        photoUrl: "",
        slug: "",
        status: "VALID"
    });

    // Selected Item for QR or Edit
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState("");

    // Initial Fetch & Auto-Open from Props
    useEffect(() => {
        fetchVerifications();
        fetchUsers();
    }, []);

    // Handle initialUserId change (e.g. from parent tab switch)
    useEffect(() => {
        if (initialUserId) {
            setVerificationMode('linked');
            setSelectedUserId(initialUserId);
            // We need to wait for users to load to pre-fill name, but setting ID is enough for now
            // The user select dropdown will show the correct user if users are loaded
            setOpenDialog(true);
        }
    }, [initialUserId]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) setUsers(await res.json());
        } catch (e) { console.error("Failed to users", e); }
    };

    const fetchVerifications = async () => {
        setLoading(true);
        try {
            // Optional: Get token if available, but don't block
            let token = "";
            try {
                const { data } = await supabase.auth.getSession();
                token = data.session?.access_token || "";
            } catch (e) { console.warn("Session fetch warning", e); }

            console.log("Fetching verifications...");
            const res = await fetch('/api/verification', {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            if (res.ok) {
                const data = await res.json();
                console.log("Verifications loaded:", data);
                if (Array.isArray(data)) {
                    setVerifications(data);
                } else {
                    console.error("Verifications data is not an array:", data);
                    setVerifications([]);
                }
            } else {
                console.error("Verification fetch failed status:", res.status);
            }
        } catch (error) {
            console.error("Failed to fetch verifications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        // Validation for Linking
        if (verificationMode === 'linked' && !selectedUserId) {
            alert("Please select a user to link this verification to.");
            return;
        }

        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const payload = {
                ...formData,
                ...(isEditing && { id: editId }),
                userId: verificationMode === 'linked' ? selectedUserId : null
            };

            // API uses POST for both create and update — update is determined by presence of `id` in body
            const res = await fetch('/api/verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (res.ok) {
                if (isEditing) {
                    setVerifications(verifications.map(v => v.id === editId ? { ...v, ...data } : v));
                    fetchVerifications();
                } else {
                    setVerifications([data, ...verifications]);
                }
                setOpenDialog(false);
                resetForm();
            } else {
                alert(data.error || "Failed to save");
            }
        } catch (error) {
            alert("Error saving verification");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch('/api/verification', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (res.ok) {
                setVerifications(verifications.map(v => v.id === id ? { ...v, status: newStatus } : v));
            }
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to DELETE this verification permanently? This cannot be undone.")) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch(`/api/verification?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setVerifications(verifications.filter(v => v.id !== id));
            } else {
                alert("Failed to delete record.");
            }
        } catch (error) {
            alert("Error deleting record.");
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: "",
            passportNumber: "",
            visaType: "",
            issuedDate: new Date().toISOString().split('T')[0],
            expiresAt: "",
            address: "",
            nationality: "VERIFIED HOLDER",
            photoUrl: "",
            slug: "",
            status: "VALID"
        });
        setSelectedUserId("");
        setVerificationMode('manual');
        setIsEditing(false);
        setEditId("");
    };

    const handleEdit = (item: any) => {
        setFormData({
            fullName: item.fullName || "",
            passportNumber: item.passportNumber || "",
            visaType: item.visaType || "",
            issuedDate: item.issuedDate ? new Date(item.issuedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().split('T')[0] : "",
            address: item.address || "",
            nationality: item.nationality || "VERIFIED HOLDER",
            photoUrl: item.photoUrl || "",
            slug: item.slug || "",
            status: item.status || "VALID"
        });
        setEditId(item.id);
        setIsEditing(true);
        if (item.userId) {
            setVerificationMode('linked');
            setSelectedUserId(item.userId);
        } else {
            setVerificationMode('manual');
        }
        setOpenDialog(true);
    };

    const handleUserSelect = (userId: string) => {
        setSelectedUserId(userId);
        const user = users.find(u => u.id === userId);
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.name || "",
                address: user.address || "",
                // In a real app, passport might be in user.verification or user profile
            }));
        }
    };

    // Auto-generate Slug
    useEffect(() => {
        if (formData.fullName && formData.passportNumber) {
            const namePart = formData.fullName.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const passPart = formData.passportNumber.slice(-4);
            setFormData(prev => ({ ...prev, slug: `${namePart}-${passPart}` }));
        }
    }, [formData.fullName, formData.passportNumber]);

    // QR Download Logic
    const qrRef = useRef<HTMLCanvasElement>(null);
    const downloadQR = () => {
        if (!qrRef.current) return;
        const canvas = qrRef.current;
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = `QR-${selectedItem?.slug}.png`;
        a.click();
    };

    return (
        <Stack spacing={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                    <Typography variant="h4" fontWeight="bold">Verification System</Typography>
                    <Typography variant="body1" color="text.secondary">Manage visa verification records and QR codes.</Typography>
                </div>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => { resetForm(); setOpenDialog(true); }}
                >
                    New Verification
                </Button>
            </Box>

            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>FULL NAME</TableCell>
                                <TableCell>PASSPORT</TableCell>
                                <TableCell>VISA TYPE</TableCell>
                                <TableCell>ISSUED</TableCell>
                                <TableCell>EXPIRES</TableCell>
                                <TableCell>STATUS</TableCell>
                                <TableCell align="right">ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center"><CircularProgress /></TableCell>
                                </TableRow>
                            ) : verifications.map((item) => (
                                <TableRow key={item.id} hover>
                                    <TableCell>
                                        <Typography fontWeight="bold">{item.fullName}</Typography>
                                        <Typography variant="caption" color="text.secondary">/{item.slug}</Typography>
                                    </TableCell>
                                    <TableCell>{item.passportNumber}</TableCell>
                                    <TableCell>{item.visaType}</TableCell>
                                    <TableCell>{new Date(item.issuedDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={item.status}
                                            color={item.status === 'VALID' ? 'success' : item.status === 'REVOKED' ? 'error' : 'warning'}
                                            size="small"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                title="Generate Statement Letter"
                                                aria-label="Generate Statement Letter PDF"
                                                onClick={() => generateStatementPDF(item)}
                                            >
                                                <PictureAsPdfIcon />
                                            </IconButton>
                                            <IconButton
                                                color="info"
                                                size="small"
                                                title="View QR"
                                                aria-label="View QR Code"
                                                onClick={() => { setSelectedItem(item); setOpenQRDialog(true); }}
                                            >
                                                <QrCodeIcon />
                                            </IconButton>
                                            <IconButton
                                                color="info"
                                                size="small"
                                                title="Preview IDiv Card"
                                                aria-label="Preview IDiv Card"
                                                onClick={() => { 
                                                    setSelectedItem(item); 
                                                    setPreviewCardMode(item.visaType?.toUpperCase().includes('IDG') || item.visaType?.toUpperCase().includes('GUIDE') ? 'IDG' : 'IDIV');
                                                    setOpenCardDialog(true); 
                                                }}
                                            >
                                                <RemoveRedEyeIcon />
                                            </IconButton>
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                title="Edit Data"
                                                aria-label="Edit Verification Data"
                                                onClick={() => handleEdit(item)}
                                            >
                                                <EditIcon />
                                            </IconButton>

                                            {/* Quick Status Toggle */}
                                            {item.status === 'VALID' ? (
                                                <IconButton
                                                    color="warning"
                                                    size="small"
                                                    title="Revoke (Mark Invalid)"
                                                    aria-label="Revoke Verification"
                                                    onClick={() => handleUpdateStatus(item.id, 'REVOKED')}
                                                >
                                                    <CancelIcon />
                                                </IconButton>
                                            ) : (
                                                <IconButton
                                                    color="success"
                                                    size="small"
                                                    title="Activate (Mark Valid)"
                                                    aria-label="Activate Verification"
                                                    onClick={() => handleUpdateStatus(item.id, 'VALID')}
                                                >
                                                    <CheckCircleIcon />
                                                </IconButton>
                                            )}

                                            {/* DELETE BUTTON */}
                                            <IconButton
                                                color="error"
                                                size="small"
                                                title="Delete Permanently"
                                                aria-label="Delete Verification"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* CREATE DIALOG */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? "Edit Verification Record" : "Create New Verification"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
                            <Button
                                variant={verificationMode === 'manual' ? 'contained' : 'outlined'}
                                onClick={() => setVerificationMode('manual')}
                            >
                                Manual Entry
                            </Button>
                            <Button
                                variant={verificationMode === 'linked' ? 'contained' : 'outlined'}
                                onClick={() => setVerificationMode('linked')}
                            >
                                Link to User
                            </Button>
                        </Stack>

                        {verificationMode === 'linked' && (
                            <TextField
                                select
                                label="Select User"
                                fullWidth
                                value={selectedUserId}
                                onChange={(e) => handleUserSelect(e.target.value)}
                            >
                                {users.map((u) => (
                                    <MenuItem key={u.id} value={u.id}>
                                        {u.name} ({u.email})
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}

                        <TextField
                            label="Full Name"
                            fullWidth
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                        <TextField
                            label="Passport Number"
                            fullWidth
                            value={formData.passportNumber}
                            onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                        />
                        <TextField
                            label="Visa Type"
                            fullWidth
                            value={formData.visaType}
                            onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                            helperText="e.g. B211A, C1, D1"
                        />
                        <TextField
                            label="Issued Date"
                            type="date"
                            fullWidth
                            value={formData.issuedDate}
                            onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Expires At (Optional)"
                            type="date"
                            fullWidth
                            value={formData.expiresAt}
                            onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Residential Address (for IDiv Header)"
                            fullWidth
                            multiline
                            rows={2}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            helperText="Used to derive Province (e.g. Bali, Jakarta, etc.)"
                        />
                        <TextField
                            label="Nationality / Designation"
                            fullWidth
                            value={formData.nationality}
                            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                        />
                        
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>Holder Photo</Typography>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box 
                                    sx={{ 
                                        width: 80, 
                                        height: 80, 
                                        bgcolor: 'grey.100', 
                                        borderRadius: 1, 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        border: '1px solid #eee'
                                    }}
                                >
                                    {formData.photoUrl ? (
                                        <img src={formData.photoUrl} alt="Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Typography variant="caption">No Photo</Typography>
                                    )}
                                </Box>
                                <Stack spacing={1} flex={1}>
                                    <TextField
                                        label="Photo URL"
                                        fullWidth
                                        size="small"
                                        value={formData.photoUrl}
                                        onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                                        placeholder="https://... / path/to/image.jpg"
                                    />
                                    {verificationMode === 'linked' && selectedUserId && (
                                        <TextField
                                            select
                                            label="Select from User Documents"
                                            fullWidth
                                            size="small"
                                            value={formData.photoUrl}
                                            onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                                        >
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            {(users.find(u => u.id === selectedUserId)?.documents || [])
                                                .filter((d: any) => d.type?.includes('image'))
                                                .map((doc: any) => (
                                                    <MenuItem key={doc.id} value={doc.url}>
                                                        {doc.name}
                                                    </MenuItem>
                                                ))
                                            }
                                        </TextField>
                                    )}
                                </Stack>
                            </Stack>
                        </Box>
                        <TextField
                            label="Slug (Auto-generated)"
                            fullWidth
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            helperText="This will be part of the public URL"
                        />

                        <TextField
                            select
                            label="Verification Status"
                            fullWidth
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <MenuItem value="VALID">VERIFIED (VALID)</MenuItem>
                            <MenuItem value="REVOKED">NOT VERIFIED (REVOKED)</MenuItem>
                            <MenuItem value="PENDING">PENDING</MenuItem>
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate} disabled={!formData.fullName || !formData.passportNumber}>
                        {isEditing ? "Update Record" : "Create Record"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* QR CODE DIALOG */}
            <Dialog open={openQRDialog} onClose={() => setOpenQRDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Verification QR Code</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" alignItems="center" py={4}>
                        {selectedItem && (
                            <>
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: 'white',
                                        borderRadius: 2,
                                        border: '1px solid #eee',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                        }
                                    }}
                                    onClick={downloadQR}
                                    title="Click to download QR Code"
                                >
                                    <QRCodeCanvas
                                        value={`${window.location.origin}/verify/${selectedItem.slug}`}
                                        size={256}
                                        level={"H"}
                                        ref={qrRef}
                                    />
                                </Box>
                                <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary', fontSize: '0.75rem' }}>
                                    Click QR code to download
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                                    {selectedItem.fullName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                                    {selectedItem.slug}
                                </Typography>
                                <Chip
                                    label={selectedItem.status}
                                    color={selectedItem.status === 'VALID' ? 'success' : 'error'}
                                    sx={{ mt: 2 }}
                                />
                                {selectedItem.expiresAt && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                        Expires: {new Date(selectedItem.expiresAt).toLocaleDateString()}
                                    </Typography>
                                )}
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={downloadQR}
                    >
                        Download Image
                    </Button>
                    <Button onClick={() => setOpenQRDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            
            {/* IDIV CARD PREVIEW DIALOG */}
            <Dialog open={openCardDialog} onClose={() => setOpenCardDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>IDiv Card Preview</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" alignItems="center" py={4}>
                        {selectedItem && (
                            <>
                                <Tabs 
                                    value={previewCardMode} 
                                    onChange={(e, newVal) => setPreviewCardMode(newVal)}
                                    sx={{ mb: 3 }}
                                >
                                    <Tab label="IDiv Card" value="IDIV" />
                                    <Tab label="IDg Card" value="IDG" />
                                </Tabs>

                                <IDivCardModern 
                                    mode={previewCardMode}
                                    variant={previewCardMode === 'IDG' ? 'purple' : 'purple'}
                                    data={{
                                        id_number: selectedItem.id,
                                        name: selectedItem.fullName,
                                        nationality: selectedItem.nationality || "VERIFIED HOLDER",
                                        visa_type: selectedItem.visaType,
                                        expiry_date: selectedItem.expiresAt ? new Date(selectedItem.expiresAt).toLocaleDateString() : 'N/A',
                                        issue_date: selectedItem.issuedDate ? new Date(selectedItem.issuedDate).toLocaleDateString() : 'N/A',
                                        address: selectedItem.address || "",
                                        order_id: selectedItem.slug || "N/A",
                                        photoUrl: selectedItem.photoUrl,
                                        sponsor: "INDONESIAN VISAS AGENCY"
                                    }} 
                                />
                                
                                <Typography variant="caption" sx={{ mt: 3, color: 'text.secondary', textAlign: 'center' }}>
                                    Standard IDiv Digital Format (KTP Style)
                                </Typography>
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 1 }}>
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        startIcon={<DownloadIcon />}
                        onClick={() => downloadIDivDual('idiv-front', 'idiv-back', `IDiv-Dual-${selectedItem?.slug}`, 'png')}
                    >
                        PNG (2-Sides)
                    </Button>
                    <Button 
                        variant="outlined" 
                        color="error" 
                        startIcon={<PictureAsPdfIcon />}
                        onClick={() => downloadIDivDual('idiv-front', 'idiv-back', `IDiv-PDF-${selectedItem?.slug}`, 'pdf')}
                    >
                        PDF (Full ID)
                    </Button>
                    <Button 
                        variant="outlined" 
                        color="info" 
                        startIcon={<ShareIcon />}
                        onClick={() => {
                            const url = `${window.location.origin}/verify/${selectedItem?.slug}`;
                            navigator.clipboard.writeText(url);
                            alert("Verification link copied to clipboard!");
                        }}
                    >
                        Share Link
                    </Button>
                    <Button onClick={() => setOpenCardDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
