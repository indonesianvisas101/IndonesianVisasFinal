"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Container,
    Paper,
    Divider,
    Button,
    Stack,
    CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Link from "next/link";
import { useParams } from "next/navigation";
import IDivCardModern from "@/components/idiv/IDivCardModern";
import OfficialVerificationDocument from "@/components/verification/OfficialVerificationDocument";

// Parse JSON-packed address field (Case-Insensitive)
function parseAddress(raw: string | null | undefined) {
    const fb = { street: "", birthPlaceDate: "", gender: "", occupation: "" };
    if (!raw) return fb;
    if (!raw.trim().startsWith('{')) return { ...fb, street: raw };
    try {
        const p = JSON.parse(raw);
        const getVal = (keys: string[]) => {
            for (const k of keys) {
                if (p[k] !== undefined) return p[k];
                const kLower = k.toLowerCase();
                const kUpper = k.toUpperCase();
                if (p[kLower] !== undefined) return p[kLower];
                if (p[kUpper] !== undefined) return p[kUpper];
            }
            return "";
        };
        return {
            street:         getVal(['street', 'STREET', 'address', 'Alamat']),
            birthPlaceDate: getVal(['birthPlaceDate', 'BIRTHPLACEDATE', 'dob', 'DOB']),
            gender:         getVal(['gender', 'GENDER', 'Jenis Kelamin']),
            occupation:     getVal(['occupation', 'OCCUPATION', 'Pekerjaan']),
        };
    } catch {
        return { ...fb, street: raw };
    }
}

export default function VerificationPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (slug) {
            fetch(`/api/verification?slug=${slug}`)
                .then(async (res) => {
                    if (res.ok) setData(await res.json());
                    else setError("Verification record not found.");
                })
                .catch(() => setError("Failed to load verification data."))
                .finally(() => setLoading(false));
        }
    }, [slug]);

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f8f9fa">
            <CircularProgress />
        </Box>
    );

    if (error || !data) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f8f9fa" p={2}>
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, maxWidth: 500 }}>
                <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom>Verification Failed</Typography>
                <Typography color="text.secondary">{error}</Typography>
                <Button variant="contained" sx={{ mt: 3 }} component={Link} href="/">Go Home</Button>
            </Paper>
        </Box>
    );

    // LOGIC SWITCHER: Premium Card vs Standard Document
    const now = new Date();
    const previewActive = data.idivPreviewExpiresAt ? (new Date(data.idivPreviewExpiresAt) > now) : false;
    const isPaid = data.invoice?.status === 'PAID';
    
    // Show Premium Card only if (Purchased & Paid) OR (Still in 24h Preview)
    const showPremiumCard = (data.isIdivPurchased && isPaid) || previewActive;

    const addr          = parseAddress(data.address);
    const isJsonAddress = data.address?.trim().startsWith('{');
    const cardAddress   = isJsonAddress ? (addr.street || "") : (data.address || "");
    const displayDOB    = addr.birthPlaceDate || "—";
    const displayGender = addr.gender || "—";
    const displayOccup  = addr.occupation || "—";
    const displayStreet = addr.street || "—";

    const isSmart   = data.visaType?.toUpperCase().includes('SMART') || data.visaType?.toUpperCase().includes('KITAS') || data.visaType?.toUpperCase().includes('ITAP');
    const isIDG     = data.visaType?.toUpperCase().includes('IDG') || data.visaType?.toUpperCase().includes('GUIDE');
    const cardMode  = isSmart ? 'SMART' : (isIDG ? 'IDG' : 'IDIV');

    // 1. RENDER STANDARD DOCUMENT VIEW (If not premium or trial expired)
    if (!showPremiumCard) {
        return <OfficialVerificationDocument data={{
            ...data,
            address: displayStreet,
            issuedDate: data.issuedDate,
            expiresAt: data.expiresAt,
            nationality: data.nationality || 'INDONESIA'
        }} />;
    }

    // 2. RENDER PREMIUM CARD VIEW
    return (
        <Box component="main" sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: { xs: 8, md: 12 }, px: 2 }}>
            <Container maxWidth="sm">
                <Box textAlign="center" mb={4}>
                    <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: '-0.5px' }}>
                        INDONESIAN<Box component="span" color="primary.main">VISAS</Box>
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold" letterSpacing={1}>
                        PREMIUM IDIV VERIFICATION
                    </Typography>
                </Box>

                <Paper elevation={0} variant="outlined" sx={{
                    p: { xs: 1.5, md: 5 }, borderRadius: 4, textAlign: 'center', position: 'relative',
                    overflow: 'hidden',
                    borderTopWidth: 8, borderColor: 'primary.main', boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
                }}>
                    <VerifiedUserIcon sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 300, opacity: 0.03, color: 'black' }} />
                    
                    {previewActive && !isPaid && (
                        <Box sx={{ mb: 3, p: 1, bgcolor: 'warning.light', borderRadius: 2 }}>
                            <Typography variant="caption" fontWeight="bold">PREVIEW MODE: Expires in 24 hours</Typography>
                        </Box>
                    )}

                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                        <IDivCardModern
                            mode={cardMode}
                            variant="purple"
                            data={{
                                id_number:        data.id,
                                name:             data.fullName,
                                passport_number:  data.passportNumber,
                                nationality:      data.nationality,
                                visa_type:        data.visaType,
                                expiry_date:      data.expiresAt ? new Date(data.expiresAt).toLocaleDateString() : 'N/A',
                                issue_date:       data.issuedDate ? new Date(data.issuedDate).toLocaleDateString() : 'N/A',
                                address:          cardAddress,
                                birth_place_date: displayDOB,
                                gender:           displayGender,
                                occupation:       displayOccup,
                                photoUrl:         data.photoUrl,
                                order_id:         data.slug || data.id
                            }}
                            privacyMode={false}
                            autoRotate={true}
                            showDownload={isPaid}
                        />
                    </Box>

                    {/* DETAILS REPEAT FOR ACCESSIBILITY */}
                    <Stack spacing={2} textAlign="left" sx={{ mt: 4 }}>
                        <Box display="flex" justifyContent="space-between">
                            <Typography color="text.secondary" variant="body2">Status</Typography>
                            <Typography variant="body2" fontWeight="bold" color="success.main">VERIFIED & ACTIVE</Typography>
                        </Box>
                        <Divider />
                        <Box display="flex" justifyContent="space-between">
                            <Typography color="text.secondary" variant="body2">Passport</Typography>
                            <Typography variant="body2" fontWeight="bold">{data.passportNumber}</Typography>
                        </Box>
                    </Stack>

                    <Divider sx={{ mt: 4, mb: 3 }} />

                    <Button variant="outlined" startIcon={<WhatsAppIcon />} component="a"
                        href="https://wa.me/6285727041992" target="_blank" fullWidth
                        sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary', borderColor: 'rgba(0,0,0,0.2)', py: 1.2,
                            '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: 'transparent' } }}>
                        Contact Indonesian Visas
                    </Button>
                </Paper>

                <Box mt={5} textAlign="center" pb={4}>
                    <Typography variant="body2" sx={{ mb: 4 }}>
                        <Link href="/" style={{ textDecoration: 'none', color: '#666', fontWeight: 600 }}>Back to IndonesianVisas.com</Link>
                    </Typography>
                    <Typography variant="caption" display="block" color="text.disabled" sx={{ lineHeight: 1.6, maxWidth: 420, mx: 'auto', fontSize: '0.7rem' }}>
                        For verification purposes only.<br />
                        This page does not replace official immigration decisions by the Directorate General of Immigration of Indonesia.
                        <br /><br />
                        Indonesian Visas provides administrative assistance.<br />
                        Final immigration approval remains the authority of the Indonesian government.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
