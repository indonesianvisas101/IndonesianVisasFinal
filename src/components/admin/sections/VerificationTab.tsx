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
    Tab,
    Divider,
    FormControlLabel,
    Switch,
    Tooltip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import QrCodeIcon from "@mui/icons-material/QrCode";
import DownloadIcon from "@mui/icons-material/Download";
import { usePathname } from "next/navigation";
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
import RefreshIcon from "@mui/icons-material/Refresh";
import { downloadIDiv, downloadIDivDual } from "@/utils/idivDownloadTools";


export default function VerificationTab({ initialUserId }: { initialUserId?: string }) {
    const [verifications, setVerifications] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]); // User List
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openQRDialog, setOpenQRDialog] = useState(false);
    const [openCardDialog, setOpenCardDialog] = useState(false);
    const [previewWithNFC, setPreviewWithNFC] = useState(false);
    const [verificationMode, setVerificationMode] = useState<'linked' | 'manual'>('manual');
    const [previewCardMode, setPreviewCardMode] = useState<'IDIV' | 'IDG' | 'SMART'>('IDIV');
    const [selectedUserId, setSelectedUserId] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const pathname = usePathname();
    const rawLocale = pathname?.split('/')[1] || 'en';
    const locale = ['admin', 'dashboard', 'verify', 'invoice', 'api', 'auth'].includes(rawLocale) ? 'en' : rawLocale;

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        passportNumber: "",
        visaType: "",
        issuedDate: new Date().toISOString().split('T')[0],
        expiresAt: "",
        address: "",
        birthPlaceDate: "",
        gender: "",
        occupation: "",
        nationality: "VERIFIED HOLDER",
        photoUrl: "",
        slug: "",
        status: "VALID",
        isIdivPurchased: false,
        idivPreviewExpiresAt: "",
        preferredMode: "IDIV",
        isAgreementRequired: false,
        agreementStatus: "NONE",
        depositAmount: 0,
        accessPin: "123456",
        invoiceId: ""
    });

    // Selected Item for QR or Edit
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [photoPreviewUrl, setPhotoPreviewUrl] = useState(""); // Signed URL for display only, never saved to DB

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

    // Auto-calculate agreement requirements
    useEffect(() => {
        if (!formData.visaType) return;

        const vt = formData.visaType.toUpperCase();
        
        // v10.11 Hardening: B1 / VOA / e-VOA are sponsorless, so no agreement is needed.
        if (vt.includes('B1') || vt.includes('VOA') || vt.includes('D1')) {
            setFormData(prev => ({ 
                ...prev, 
                isAgreementRequired: false, 
                agreementStatus: 'NONE',
                depositAmount: 0 
            }));
            return;
        }

        // Logic for KITAS / D Type / C1 (Requires Sponsor)
        if (!isEditing) {
            let req = false;
            let deposit = 0;

            if (vt.includes('C1')) {
                req = true;
                deposit = 5000;
            } else if (vt.includes('E33G')) {
                req = true;
                deposit = 7500;
            } else if (vt.includes('KITAS') || vt.startsWith('D')) {
                req = true;
                deposit = 10000;
            }

            if (req) {
                setFormData(prev => ({ 
                    ...prev, 
                    isAgreementRequired: true, 
                    agreementStatus: prev.agreementStatus === 'NONE' ? 'PENDING' : prev.agreementStatus,
                    depositAmount: deposit,
                    accessPin: prev.accessPin || Math.floor(100000 + Math.random() * 900000).toString()
                }));
            }
        }
    }, [formData.visaType, isEditing]);

    // v11.0.9 - LIVE PREVIEW SYNC: Always try to sign the photoUrl for the preview container
    useEffect(() => {
        if (!formData.photoUrl) {
            setPreviewUrl("");
            return;
        }

        // v11.1.4 - INTELLIGENT PREVIEW: Only skip signing for TRULY public links with tokens
        if (formData.photoUrl.startsWith('http')) {
            const isPublic = formData.photoUrl.includes('/public/');
            const hasToken = formData.photoUrl.includes('token=');
            const isBrokenSign = formData.photoUrl.includes('/object/sign/') && !hasToken;

            if ((isPublic || hasToken) && !isBrokenSign) {
                setPreviewUrl(formData.photoUrl);
                return;
            }
        }

        // Otherwise, ask the server to sign it (covers raw paths and authenticated links)
        const timer = setTimeout(() => {
            fetch(`/api/admin/sign-url?path=${encodeURIComponent(formData.photoUrl)}`)
                .then(r => r.json())
                .then(res => {
                    if (res.signedUrl) setPreviewUrl(res.signedUrl);
                    else setPreviewUrl(formData.photoUrl); // Fallback
                })
                .catch(() => setPreviewUrl(formData.photoUrl));
        }, 500); // Small debounce

        return () => clearTimeout(timer);
    }, [formData.photoUrl]);

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
    const handleModeChange = async (newMode: string) => {
        setPreviewCardMode(newMode as any);
        if (!selectedItem) return;

        let currentAddress = selectedItem.address || "";
        let jsonObj: any = {};

        if (currentAddress.startsWith("{")) {
            try { jsonObj = JSON.parse(currentAddress); } catch (e) { jsonObj = { street: currentAddress }; }
        } else {
            jsonObj.street = currentAddress;
        }

        jsonObj.preferredMode = newMode;
        const newAddressStr = JSON.stringify(jsonObj);

        try {
            const res = await fetch('/api/verification', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedItem.id, address: newAddressStr })
            });
            if (res.ok) {
                setVerifications(prev => prev.map(v => v.id === selectedItem.id ? { ...v, address: newAddressStr } : v));
                // Update selectedItem locally so it stays in sync
                setSelectedItem((prev: any) => ({ ...prev, address: newAddressStr }));
            }
        } catch (e) {
            console.error("Failed to update preferred mode", e);
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

            // Pack Smart ID fields into address as JSON
            let packedAddressObj: any = {
                street: formData.address,
                birthPlaceDate: formData.birthPlaceDate,
                gender: formData.gender,
                occupation: formData.occupation,
                preferredMode: formData.preferredMode || previewCardMode || "IDIV"
            };

            // If editing, preserve agreement data
            if (isEditing) {
                const existing = verifications.find(v => v.id === editId);
                if (existing && existing.address && existing.address.startsWith('{')) {
                    try {
                        const existingObj = JSON.parse(existing.address);
                        // Merge important agreement fields back in
                        if (existingObj.agreementUrl) packedAddressObj.agreementUrl = existingObj.agreementUrl;
                        if (existingObj.agreementHash) packedAddressObj.agreementHash = existingObj.agreementHash;
                        if (existingObj.agreementSignedAt) packedAddressObj.agreementSignedAt = existingObj.agreementSignedAt;
                    } catch (e) {}
                }
            }
            
            const packedAddress = JSON.stringify(packedAddressObj);

            const payload = {
                ...formData,
                address: packedAddress,
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
                alert(`${data.error || "Failed to save"}\n\nDetails: ${data.details || "Unknown error"}`);
            }
        } catch (error: any) {
            alert("Error saving verification: " + error.message);
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

    const handleViewAgreement = async (url: string) => {
        try {
            const res = await fetch(`/api/admin/sign-url?path=${encodeURIComponent(url)}`);
            const data = await res.json();
            if (data.signedUrl) {
                window.open(data.signedUrl, '_blank');
            } else {
                window.open(url, '_blank');
            }
        } catch (e) {
            window.open(url, '_blank');
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
            birthPlaceDate: "",
            gender: "",
            occupation: "",
            nationality: "VERIFIED HOLDER",
            photoUrl: "",
            slug: "",
            status: "VALID",
            isIdivPurchased: false,
            idivPreviewExpiresAt: "",
            preferredMode: "IDIV",
            isAgreementRequired: false,
            agreementStatus: "NONE",
            depositAmount: 0,
            accessPin: Math.floor(100000 + Math.random() * 900000).toString(),
            invoiceId: ""
        });
        setSelectedUserId("");
        setVerificationMode('manual');
        setIsEditing(false);
        setEditId("");
        setPhotoPreviewUrl("");
    };

    const handleEdit = (item: any) => {
        let unpackedAddress = item.address || "";
        let parsedBirth = "";
        let parsedGender = "";
        let parsedOcc = "";

        if (unpackedAddress.startsWith("{")) {
            try {
                const parsed = JSON.parse(unpackedAddress);
                const getVal = (keys: string[]) => {
                    for (const k of keys) {
                        if (parsed[k] !== undefined) return parsed[k];
                        if (parsed[k.toLowerCase()] !== undefined) return parsed[k.toLowerCase()];
                        if (parsed[k.toUpperCase()] !== undefined) return parsed[k.toUpperCase()];
                    }
                    return "";
                };
                unpackedAddress = getVal(['street', 'address', 'Alamat']);
                parsedBirth = getVal(['birthPlaceDate', 'dob', 'BIRTHPLACEDATE']);
                parsedGender = getVal(['gender', ' Jenis Kelamin']);
                parsedOcc = getVal(['occupation', 'Pekerjaan']);
                const prefMode = parsed.preferredMode || null;
                if (prefMode) setPreviewCardMode(prefMode as any);
            } catch (e) { }
        }

        setFormData({
            fullName: item.fullName || "",
            passportNumber: item.passportNumber || "",
            visaType: item.visaType || "",
            issuedDate: item.issuedDate ? new Date(item.issuedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().split('T')[0] : "",
            address: unpackedAddress,
            birthPlaceDate: parsedBirth,
            gender: parsedGender,
            occupation: parsedOcc,
            nationality: item.nationality || "VERIFIED HOLDER",
            photoUrl: item.photoUrl || "",
            slug: item.slug || "",
            status: item.status || "VALID",
            isIdivPurchased: item.isIdivPurchased || false,
            idivPreviewExpiresAt: item.idivPreviewExpiresAt ? new Date(item.idivPreviewExpiresAt).toISOString().split('T')[0] : "",
            preferredMode: (item.address && item.address.startsWith('{') ? JSON.parse(item.address).preferredMode : null) || "IDIV",
            isAgreementRequired: item.isAgreementRequired || false,
            agreementStatus: item.agreementStatus || "NONE",
            depositAmount: item.depositAmount || 0,
            accessPin: item.accessPin || "123456",
            invoiceId: item.invoiceId || ""
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
        
        // v13.0 - LIVE PREVIEW REFRESH: Sign URL for preview display only.
        // CRITICAL: Do NOT update formData.photoUrl with signed URL — only use it for display.
        // The database must always store the clean relative path, not an expiring signed URL.
        if (item.photoUrl) {
            try {
                fetch(`/api/admin/sign-url?path=${encodeURIComponent(item.photoUrl)}`)
                    .then(r => r.json())
                    .then(res => {
                        if (res.signedUrl) {
                            setPhotoPreviewUrl(res.signedUrl);
                        }
                    })
                    .catch(e => console.error("Auto-sign failed", e));
            } catch (e) {}
        }
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
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchVerifications}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => { resetForm(); setOpenDialog(true); }}
                    >
                        New Verification
                    </Button>
                </Stack>
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
                                <TableCell>AGREEMENT</TableCell>
                                <TableCell>PIN</TableCell>
                                <TableCell>STATUS</TableCell>
                                <TableCell align="right" sx={{ minWidth: 260 }}>ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center"><CircularProgress /></TableCell>
                                </TableRow>
                            ) : verifications.map((item) => (
                                <TableRow key={item.id} hover>
                                    <TableCell>
                                        <Typography fontWeight="bold">{item.fullName}</Typography>
                                        <Typography variant="caption" color="text.secondary">/{item.slug}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 180 }}>
                                        <Tooltip title={item.passportNumber}>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    overflow: 'hidden', 
                                                    textOverflow: 'ellipsis', 
                                                    whiteSpace: 'nowrap',
                                                    fontFamily: 'monospace',
                                                    fontWeight: 'bold',
                                                    color: item.passportNumber?.startsWith('http') ? 'primary.main' : 'inherit',
                                                    cursor: item.passportNumber?.startsWith('http') ? 'pointer' : 'default'
                                                }}
                                                onClick={() => {
                                                    if (item.passportNumber?.startsWith('http')) {
                                                        window.open(item.passportNumber, '_blank');
                                                    }
                                                }}
                                            >
                                                {item.passportNumber?.startsWith('http') 
                                                    ? "📄 View Document" 
                                                    : item.passportNumber}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>{item.visaType}</TableCell>
                                    <TableCell>{new Date(item.issuedDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : "-"}
                                    </TableCell>
                                    <TableCell>
                                        {item.isAgreementRequired ? (
                                            <Chip 
                                                label={item.agreementStatus || 'PENDING'} 
                                                size="small" 
                                                color={item.agreementStatus === 'SIGNED' ? 'success' : 'warning'} 
                                                variant={item.agreementStatus === 'SIGNED' ? 'filled' : 'outlined'}
                                            />
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">NOT REQ</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'primary.main' }}>
                                            {item.accessPin || '123456'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={item.status}
                                            color={item.status === 'VALID' ? 'success' : item.status === 'REVOKED' ? 'error' : 'warning'}
                                            size="small"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </TableCell>
                                    <TableCell align="right" sx={{ minWidth: 260 }}>
                                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                            {item.invoiceId && (
                                                <IconButton
                                                    color="secondary"
                                                    size="small"
                                                    title="Open User Invoice/Files"
                                                    onClick={() => window.open(`/${locale || 'en'}/invoice/${item.invoiceId}`, '_blank')}
                                                >
                                                    <ShareIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                title="Access Secure Page"
                                                aria-label="Access Secure Page"
                                                onClick={() => window.open(`/verify/secure-doc/${item.slug}`, '_blank')}
                                            >
                                                <RemoveRedEyeIcon />
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
                                            {(() => {
                                                let agreementUrl = null;
                                                if (item.address && item.address.startsWith('{')) {
                                                    try {
                                                        const p = JSON.parse(item.address);
                                                        agreementUrl = p.agreementUrl || null;
                                                    } catch (e) {}
                                                }
                                                if (!agreementUrl) return null;
                                                
                                                return (
                                                    <IconButton
                                                        color="success"
                                                        size="small"
                                                        title="View Signed Agreement"
                                                        onClick={() => handleViewAgreement(agreementUrl)}
                                                    >
                                                        <PictureAsPdfIcon fontSize="small" />
                                                    </IconButton>
                                                );
                                            })()}
                                            <IconButton
                                                color="info"
                                                size="small"
                                                title="Preview IDiv Card"
                                                aria-label="Preview IDiv Card"
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    // Pre-set preview mode from address JSON if exists
                                                    if (item.address && item.address.startsWith('{')) {
                                                        try {
                                                            const p = JSON.parse(item.address);
                                                            if (p.preferredMode) setPreviewCardMode(p.preferredMode);
                                                            else setPreviewCardMode('IDIV');
                                                        } catch (e) { setPreviewCardMode('IDIV'); }
                                                    } else {
                                                        setPreviewCardMode('IDIV');
                                                    }
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
                            label="Residential Address"
                            fullWidth
                            multiline
                            rows={2}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Birth Place & Date"
                                fullWidth
                                value={formData.birthPlaceDate}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const nextData = { ...formData, birthPlaceDate: val };
                                    
                                    // --- AUTOMATIC PIN GENERATION (DDMMYY) ---
                                    // Match format like DD-MM-YYYY or DD/MM/YYYY
                                    const dateMatch = val.match(/(\d{2})[-/](\d{2})[-/](\d{4})/);
                                    if (dateMatch) {
                                        const dd = dateMatch[1];
                                        const mm = dateMatch[2];
                                        const yy = dateMatch[3].substring(2);
                                        nextData.accessPin = `${dd}${mm}${yy}`;
                                    }
                                    
                                    setFormData(nextData);
                                }}
                                helperText="e.g. LONDON, 05-05-1985"
                            />
                            <TextField
                                label="Gender"
                                fullWidth
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                helperText="e.g. LAKI-LAKI"
                            />
                            <TextField
                                label="Occupation"
                                fullWidth
                                value={formData.occupation}
                                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                helperText="e.g. INVESTOR"
                            />
                        </Stack>
                        <TextField
                            label="Nationality / Designation"
                            fullWidth
                            value={formData.nationality}
                            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                        />

                        <Divider sx={{ my: 1 }}>Legal & Agreement (KITAS Focus)</Divider>
                        
                        <Stack direction="row" spacing={2} alignItems="center">
                            <FormControlLabel
                                control={
                                    <Switch 
                                        checked={formData.isAgreementRequired} 
                                        onChange={(e) => setFormData({ ...formData, isAgreementRequired: e.target.checked })} 
                                    />
                                }
                                label="Agreement Required"
                            />
                            <TextField
                                select
                                label="Agreement Status"
                                size="small"
                                sx={{ flex: 1 }}
                                value={formData.agreementStatus}
                                onChange={(e) => setFormData({ ...formData, agreementStatus: e.target.value })}
                            >
                                <MenuItem value="NONE">None</MenuItem>
                                <MenuItem value="PENDING">Pending</MenuItem>
                                <MenuItem value="SIGNED">Signed (Valid)</MenuItem>
                            </TextField>
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Deposit Amount (USD)"
                                type="number"
                                fullWidth
                                value={formData.depositAmount}
                                onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
                                helperText="Default based on Visa type"
                            />
                            <TextField
                                label="Access PIN (6 digits)"
                                fullWidth
                                value={formData.accessPin}
                                onChange={(e) => setFormData({ ...formData, accessPin: e.target.value.substring(0, 6) })}
                                helperText="For secure doc access"
                            />
                        </Stack>

                        <TextField
                            label="Linked Invoice ID (Optional)"
                            fullWidth
                            size="small"
                            value={formData.invoiceId}
                            onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })}
                            placeholder="Connect to user documents"
                        />

                        <Box>
                            <Typography variant="subtitle2" gutterBottom>Holder Photo</Typography>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 100,
                                        bgcolor: 'grey.100',
                                        borderRadius: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        border: '1px solid #eee'
                                    }}
                                >
                                    {previewUrl ? (
                                        previewUrl.toLowerCase().split('?')[0].endsWith('.pdf') ? (
                                            <Box sx={{ textAlign: 'center', p: 1 }}>
                                                <Typography variant="h4">📄</Typography>
                                                <Typography variant="caption" sx={{ fontSize: '10px' }}>PDF FILE</Typography>
                                            </Box>
                                        ) : (
                                            <img 
                                                src={previewUrl} 
                                                alt="Portrait" 
                                                referrerPolicy="no-referrer"
                                                crossOrigin="anonymous"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                onError={(e) => {
                                                    console.warn("Preview image failed to load:", previewUrl);
                                                }}
                                            />
                                        )
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">No Photo</Typography>
                                    )}
                                </Box>
                                <Stack spacing={1} flex={1}>
                                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                                        <TextField
                                            label="Photo URL"
                                            fullWidth
                                            size="small"
                                            value={formData.photoUrl}
                                            onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                                            placeholder="https://... / path/to/image.jpg"
                                        />
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            size="small"
                                            startIcon={<RefreshIcon />}
                                            sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
                                            onClick={async () => {
                                                setLoading(true);
                                                try {
                                                    // v11.1.7 - SERVICE-AWARE SYNC
                                                    let foundPhoto = "";
                                                    let foundPassport = "";
                                                    const targetName = formData.fullName.toLowerCase();

                                                    const isImage = (url: any) => {
                                                        if (typeof url !== 'string') return false;
                                                        const cleanUrl = url.split('?')[0].toLowerCase();
                                                        return cleanUrl.endsWith('.webp') || cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg') || cleanUrl.endsWith('.png');
                                                    };

                                                    // PRIORITY 1: Use Invoice ID if filled (Most Accurate)
                                                    // PRIORITY 2: Use User ID
                                                    // PRIORITY 3: Use Full Name
                                                    let searchParam = "";
                                                    if (formData.invoiceId) searchParam = `query=${encodeURIComponent(formData.invoiceId)}`;
                                                    else if (selectedUserId) searchParam = `userId=${selectedUserId}`;
                                                    else if (formData.fullName) searchParam = `query=${encodeURIComponent(formData.fullName)}`;
                                                    else if (formData.slug) searchParam = `query=${formData.slug.split('-').slice(0,2).join(' ')}`;
                                                    
                                                    if (!searchParam) {
                                                        alert("No identifying data to sync. Please fill Name, Invoice ID, or Link to a User.");
                                                        return;
                                                    }

                                                    const res = await fetch(`/api/applications?${searchParam}`);
                                                    const apps = await res.json();
                                                    
                                                    if (!apps || apps.length === 0) {
                                                        alert("No matching application found. Ensure the Invoice ID or Name is correct.");
                                                        return;
                                                    }

                                                    // Sort apps: latest first, but prioritize ones that have documents
                                                    const sortedApps = [...apps].sort((a, b) => {
                                                        const aHasDocs = a.documents ? 1 : 0;
                                                        const bHasDocs = b.documents ? 1 : 0;
                                                        if (aHasDocs !== bHasDocs) return bHasDocs - aHasDocs;
                                                        return new Date(b.appliedAt || 0).getTime() - new Date(a.appliedAt || 0).getTime();
                                                    });

                                                    for (const app of sortedApps) {
                                                        const travelers = Array.isArray(app.travelers) ? app.travelers : [];
                                                        let docs = app.documents;
                                                        if (typeof docs === 'string') try { docs = JSON.parse(docs); } catch (e) {}
                                                        const docArray = Array.isArray(docs) ? docs : (docs ? [docs] : []);

                                                        // Scan each traveler to find the name match
                                                        for (let i = 0; i < travelers.length; i++) {
                                                            const t = travelers[i];
                                                            const tFullName = `${t.firstName || ''} ${t.lastName || ''}`.trim().toLowerCase();
                                                            const guestName = (app.guestName || "").toLowerCase();

                                                            // Check if this traveler matches our verification record
                                                            const isMatch = tFullName.includes(targetName) || targetName.includes(tFullName) || guestName.includes(targetName);

                                                            if (isMatch) {
                                                                const tDoc = docArray[i] || docArray[0] || {};
                                                                const facePhoto = tDoc.recentPhoto || tDoc.photo || tDoc.portrait || tDoc.user_photo;
                                                                
                                                                if (facePhoto && !foundPhoto && isImage(facePhoto)) {
                                                                    foundPhoto = facePhoto;
                                                                }

                                                                const tPass = tDoc.passport || tDoc.passportNumber || tDoc.passport_scan || t.passport;
                                                                if (tPass && !foundPassport) foundPassport = tPass;
                                                            }
                                                        }

                                                        // Fallback to attribution if it's a Quick Apply and name matches
                                                        if (!foundPhoto && (app.guestName || "").toLowerCase().includes(targetName)) {
                                                            const attr = app.attribution || {};
                                                            const p = attr.recentPhoto || attr.photo || attr.photoUrl;
                                                            if (p && isImage(p)) foundPhoto = p;
                                                            if (!foundPassport) foundPassport = attr.passport || attr.passportNumber;
                                                        }

                                                        if (foundPhoto && foundPassport) break;
                                                    }

                                                    if (foundPhoto || foundPassport) {
                                                        setFormData(prev => ({ 
                                                            ...prev, 
                                                            photoUrl: (foundPhoto && typeof foundPhoto === 'string') ? foundPhoto : prev.photoUrl,
                                                            passportNumber: (foundPassport && typeof foundPassport === 'string' && !foundPassport.startsWith('http')) 
                                                                ? foundPassport 
                                                                : prev.passportNumber
                                                        }));
                                                        alert("Personal data synced successfully!");
                                                    } else {
                                                        alert("No suitable data found for this specific person.");
                                                    }
                                                } catch (e) {
                                                    alert("Sync failed: " + (e as any).message);
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                        >
                                            Sync from App
                                        </Button>
                                    </Stack>
                                    
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            size="small"
                                            startIcon={<AddIcon />}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Upload & Convert WebP
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;

                                                    // v11.2.0 - HARDENED UPLOAD: Only allow real images, block PDFs/Docs
                                                    if (!file.type.startsWith('image/')) {
                                                        alert("Only image files (JPG, PNG, WEBP) are allowed. PDFs are strictly prohibited for photo uploads.");
                                                        return;
                                                    }
                                                    
                                                    setLoading(true);
                                                    try {
                                                        // 1. Convert to WebP via Canvas
                                                        const reader = new FileReader();
                                                        reader.onload = async (event) => {
                                                            const img = new Image();
                                                            img.onload = async () => {
                                                                const canvas = document.createElement('canvas');
                                                                // Standard Portrait Aspect Ratio or Square
                                                                const maxWidth = 800;
                                                                const maxHeight = 1000;
                                                                let width = img.width;
                                                                let height = img.height;

                                                                if (width > height) {
                                                                    if (width > maxWidth) {
                                                                        height *= maxWidth / width;
                                                                        width = maxWidth;
                                                                    }
                                                                } else {
                                                                    if (height > maxHeight) {
                                                                        width *= maxHeight / height;
                                                                        height = maxHeight;
                                                                    }
                                                                }

                                                                canvas.width = width;
                                                                canvas.height = height;
                                                                const ctx = canvas.getContext('2d');
                                                                ctx?.drawImage(img, 0, 0, width, height);
                                                                
                                                                const webpData = canvas.toDataURL('image/webp', 0.8);
                                                                
                                                                // --- FIX: Replace unstable fetch(dataUrl) with manual Blob conversion ---
                                                                const base64ToBlob = (base64: string, type: string) => {
                                                                    const binStr = atob(base64.split(',')[1]);
                                                                    const len = binStr.length;
                                                                    const arr = new Uint8Array(len);
                                                                    for (let i = 0; i < len; i++) {
                                                                        arr[i] = binStr.charCodeAt(i);
                                                                    }
                                                                    return new Blob([arr], { type });
                                                                };
                                                                
                                                                const blob = base64ToBlob(webpData, 'image/webp');
                                                                const webpFile = new File([blob], `${formData.slug || 'photo'}-${Date.now()}.webp`, { type: 'image/webp' });

                                                                // 2. Upload to Supabase Storage
                                                                const fileName = `verifications/${webpFile.name}`;
                                                                const { data, error } = await supabase.storage
                                                                    .from('documents')
                                                                    .upload(fileName, webpFile);

                                                                if (error) throw error;

                                                                // v13.0 - HARDENING: Save the clean relative path, not the public URL.
                                                                // Public URLs expire. Storing the path ensures sign-on-the-fly always works.
                                                                const cleanRelativePath = `documents/${fileName}`;
                                                                setFormData(prev => ({ ...prev, photoUrl: cleanRelativePath }));
                                                                setLoading(false);
                                                                alert("Photo uploaded and converted to WebP successfully!");
                                                            };
                                                            img.src = event.target?.result as string;
                                                        };
                                                        reader.readAsDataURL(file);
                                                    } catch (err: any) {
                                                        alert("Upload failed: " + err.message);
                                                        setLoading(false);
                                                    }
                                                }}
                                            />
                                        </Button>

                                        {verificationMode === 'linked' && selectedUserId && (
                                            <TextField
                                                select
                                                label="Select from User Documents"
                                                fullWidth
                                                size="small"
                                                value={formData.photoUrl}
                                                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                                                sx={{ flex: 1 }}
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

                        <Box sx={{ p: 2, bgcolor: 'rgba(22, 163, 74, 0.05)', borderRadius: 2, border: '1px solid rgba(22, 163, 74, 0.2)', mt: 1 }}>
                            <Typography variant="subtitle2" color="success.main" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                ⚖️ Legal & Compliance
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isAgreementRequired}
                                        onChange={(e) => setFormData({ 
                                            ...formData, 
                                            isAgreementRequired: e.target.checked,
                                            agreementStatus: e.target.checked && formData.agreementStatus === 'NONE' ? 'PENDING' : formData.agreementStatus
                                        })}
                                        color="success"
                                    />
                                }
                                label={<Typography variant="body2" fontWeight="600">Sponsorship Agreement Required</Typography>}
                            />
                            
                            {formData.isAgreementRequired && (
                                <Stack spacing={2} sx={{ mt: 1 }}>
                                    <TextField
                                        label="Security Deposit (USD)"
                                        type="number"
                                        fullWidth
                                        size="small"
                                        value={formData.depositAmount}
                                        onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
                                        helperText="Security guarantee deposit for sponsorship liability."
                                    />
                                    <TextField
                                        select
                                        label="Agreement Status"
                                        fullWidth
                                        size="small"
                                        value={formData.agreementStatus}
                                        onChange={(e) => setFormData({ ...formData, agreementStatus: e.target.value })}
                                    >
                                        <MenuItem value="NONE">NONE</MenuItem>
                                        <MenuItem value="PENDING">PENDING (Action Required)</MenuItem>
                                        <MenuItem value="SIGNED">SIGNED & VERIFIED</MenuItem>
                                    </TextField>
                                </Stack>
                            )}
                        </Box>

                        <Box sx={{ p: 2, bgcolor: 'rgba(145, 85, 253, 0.05)', borderRadius: 2, border: '1px solid rgba(145, 85, 253, 0.2)', mt: 1 }}>
                            <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                                💳 IDiv Card Access Control
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isIdivPurchased}
                                        onChange={(e) => setFormData({ ...formData, isIdivPurchased: e.target.checked })}
                                        color="primary"
                                    />
                                }
                                label={<Typography variant="body2" fontWeight="600">IDiv Card Purchased (Permanent ON)</Typography>}
                            />
                            <TextField
                                label="Trial Preview Expiration"
                                type="date"
                                fullWidth
                                size="small"
                                sx={{ mt: 2 }}
                                value={formData.idivPreviewExpiresAt}
                                onChange={(e) => setFormData({ ...formData, idivPreviewExpiresAt: e.target.value })}
                                slotProps={{ inputLabel: { shrink: true } }}
                                helperText="Card view automatically turns OFF after this date if not purchased."
                            />
                        </Box>


                        {/* CUSTOMER SUBMISSION SUMMARY (Admin Only) */}
                        {isEditing && (
                            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', mt: 2 }}>
                                <Typography variant="subtitle2" color="slate.700" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    📋 Customer Submission Summary
                                </Typography>
                                <Stack spacing={1}>
                                    <Typography variant="caption" display="block">
                                        <strong>Full Name:</strong> {formData.fullName}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                        <strong>Passport:</strong> {formData.passportNumber}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                        <strong>Nationality:</strong> {formData.nationality}
                                    </Typography>
                                    {selectedUserId && (
                                        <Typography variant="caption" display="block" color="primary">
                                            <strong>Linked Account:</strong> {users.find(u => u.id === selectedUserId)?.email || "User Account"}
                                        </Typography>
                                    )}
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="caption" display="block" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                        Note: This data is pulled from the verification record. Cross-reference with the Invoicing panel for full trip attribution.
                                    </Typography>
                                </Stack>
                            </Box>
                        )}
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
                                        value={`${window.location.origin}/verify/${selectedItem.slug || selectedItem.id}`}
                                        size={256}
                                        level={"H"}
                                        ref={qrRef}
                                    />
                                </Box>
                                <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary', fontSize: '0.75rem' }}>
                                    Click QR code to download image
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                                    {selectedItem.fullName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                                    Code: {selectedItem.slug || selectedItem.id}
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
                <DialogActions sx={{ justifyContent: 'center', pb: 3, flexWrap: 'wrap', gap: 1 }}>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<RemoveRedEyeIcon />}
                        onClick={() => window.open(`/verify/${selectedItem?.slug || selectedItem?.id}`, '_blank')}
                    >
                        Open Verify Page
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<DownloadIcon />}
                        onClick={downloadQR}
                    >
                        Download QR
                    </Button>
                    <Button
                        variant="outlined"
                        color="info"
                        startIcon={<ShareIcon />}
                        onClick={() => {
                            const url = `${window.location.origin}/verify/${selectedItem?.slug || selectedItem?.id}`;
                            navigator.clipboard.writeText(url);
                            alert("Verification link copied to clipboard!");
                        }}
                    >
                        Share Link
                    </Button>
                    <Button onClick={() => setOpenQRDialog(false)} color="inherit">Close</Button>
                </DialogActions>
            </Dialog>

            {/* IDIV CARD PREVIEW DIALOG */}
            <Dialog open={openCardDialog} onClose={() => setOpenCardDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Sponsor ID Preview</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" alignItems="center" py={4}>
                        {selectedItem && (
                            <>
                                <Tabs
                                    value={previewCardMode}
                                    onChange={(e, newVal) => handleModeChange(newVal)}
                                    sx={{ mb: 3 }}
                                >
                                    <Tab label="IDiv Card" value="IDIV" />
                                    <Tab label="IDg Card" value="IDG" />
                                    <Tab label="Smart ID (KTP)" value="SMART" />
                                </Tabs>

                                {(() => {
                                    const parsedData = (() => {
                                        let data = { address: selectedItem.address || "", birthPlaceDate: "", gender: "", occupation: "" };
                                        if (selectedItem.address && selectedItem.address.startsWith("{")) {
                                            try {
                                                const parsed = JSON.parse(selectedItem.address);
                                                data.address = parsed.street || "";
                                                data.birthPlaceDate = parsed.birthPlaceDate || "";
                                                data.gender = parsed.gender || "";
                                                data.occupation = parsed.occupation || "";
                                            } catch (e) { }
                                        }
                                        return data;
                                    })();

                                    return (
                                        <IDivCardModern
                                            idPrefix="modal"
                                            mode={previewCardMode as any}
                                            variant={previewCardMode === 'IDG' ? 'purple' : 'purple'}
                                            autoRotate={false}
                                            showActions={false}
                                            hasNFC={previewWithNFC}
                                            data={{
                                                id_number: selectedItem.id,
                                                passport_number: selectedItem.passportNumber,
                                                name: selectedItem.fullName,
                                                nationality: selectedItem.nationality || "VERIFIED HOLDER",
                                                visa_type: selectedItem.visaType,
                                                birth_place_date: parsedData.birthPlaceDate,
                                                gender: parsedData.gender,
                                                occupation: parsedData.occupation,
                                                expiry_date: selectedItem.expiresAt ? new Date(selectedItem.expiresAt).toLocaleDateString() : 'N/A',
                                                issue_date: selectedItem.issuedDate ? new Date(selectedItem.issuedDate).toLocaleDateString() : 'N/A',
                                                address: parsedData.address,
                                                order_id: selectedItem.slug || "N/A",
                                                photoUrl: selectedItem.photoUrl || "",
                                                sponsor: "INDONESIAN VISAS AGENCY"
                                            }}
                                        />
                                    );
                                })()}

                                <Typography variant="caption" sx={{ mt: 3, color: 'text.secondary', textAlign: 'center' }}>
                                    Standard IDiv Digital Format (KTP Style)
                                </Typography>

                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', bgcolor: 'rgba(3,105,161,0.04)', p: 1, borderRadius: 2, border: '1px solid rgba(3,105,161,0.1)' }}>
                                    <FormControlLabel
                                        control={<Switch checked={previewWithNFC} onChange={(e) => setPreviewWithNFC(e.target.checked)} color="primary" />}
                                        label={
                                            <Typography variant="body2" fontWeight="bold" color="primary">
                                                Enable NFC Feature (Premium Variant)
                                            </Typography>
                                        }
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 1 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={isDownloading ? <CircularProgress size={16} /> : <DownloadIcon />}
                        disabled={isDownloading}
                        onClick={async () => {
                            setIsDownloading(true);
                            await downloadIDivDual('modal-idiv-front', 'modal-idiv-back', `IDiv-Dual-${selectedItem?.slug}`, 'png');
                            setIsDownloading(false);
                        }}
                    >
                        {isDownloading ? 'Generating...' : 'PNG (2-Sides)'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={isDownloading ? <CircularProgress size={16} /> : <PictureAsPdfIcon />}
                        disabled={isDownloading}
                        onClick={async () => {
                            setIsDownloading(true);
                            await downloadIDivDual('modal-idiv-front', 'modal-idiv-back', `IDiv-PDF-${selectedItem?.slug}`, 'pdf');
                            setIsDownloading(false);
                        }}
                    >
                        {isDownloading ? 'Generating...' : 'PDF (Full ID)'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="info"
                        startIcon={<ShareIcon />}
                        disabled={isDownloading}
                        onClick={() => {
                            const url = `${window.location.origin}/verify/${selectedItem?.slug}`;
                            navigator.clipboard.writeText(url);
                            alert("Verification link copied to clipboard!");
                        }}
                    >
                        Share Link
                    </Button>
                    <Button onClick={() => setOpenCardDialog(false)} disabled={isDownloading}>Close</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
