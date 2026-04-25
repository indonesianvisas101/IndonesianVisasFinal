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

// Parse JSON-packed address field
function parseAddress(raw: string | null | undefined) {
    const fallback = { street: "", birthPlaceDate: "", gender: "", occupation: "" };
    if (!raw) return fallback;
    try {
        const parsed = JSON.parse(raw);
        return {
            street:         parsed.street         || "",
            birthPlaceDate: parsed.birthPlaceDate || parsed.dob || "",
            gender:         parsed.gender         || "",
            occupation:     parsed.occupation     || "",
        };
    } catch {
        return { ...fallback, street: raw };
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

    const isValid   = data.status === 'VALID';
    const isRevoked = data.status === 'REVOKED';
    const isSmart   = data.visaType?.toUpperCase().includes('SMART') || data.visaType?.toUpperCase().includes('KITAS') || data.visaType?.toUpperCase().includes('ITAP');
    const isIDG     = data.visaType?.toUpperCase().includes('IDG') || data.visaType?.toUpperCase().includes('GUIDE');
    const cardMode  = isSmart ? 'SMART' : (isIDG ? 'IDG' : 'IDIV');

    const addr          = parseAddress(data.address);
    const cardAddress   = addr.street || data.address || "";
    const displayDOB    = addr.birthPlaceDate || "—";
    const displayGender = addr.gender || "—";
    const displayOccup  = addr.occupation || "—";
    const displayStreet = addr.street || "—";

    const visaActiveUrl = data.visaActiveUrl || null;

    return (
        <Box component="main" sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: { xs: 12, md: 16 }, px: 2 }}>
            <Container maxWidth="sm">
                {/* BRANDING */}
                <Box textAlign="center" mb={4}>
                    <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: '-0.5px' }}>
                        INDONESIAN<Box component="span" color="primary.main">VISAS</Box>
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold" letterSpacing={1}>
                        OFFICIAL VERIFICATION PAGE
                    </Typography>
                </Box>

                <Paper elevation={0} variant="outlined" sx={{
                    p: { xs: 3, md: 5 }, borderRadius: 4, textAlign: 'center', position: 'relative',
                    overflow: 'hidden',
                    borderColor: isValid ? 'success.light' : (isRevoked ? 'error.light' : 'warning.light'),
                    borderTopWidth: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
                }}>
                    <VerifiedUserIcon sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 300, opacity: 0.03, color: 'black' }} />

                    <Box mb={3}>
                        {isValid ? <CheckCircleIcon color="success" sx={{ fontSize: 80 }} /> :
                         isRevoked ? <CancelIcon color="error" sx={{ fontSize: 80 }} /> :
                         <ErrorIcon color="warning" sx={{ fontSize: 80 }} />}
                    </Box>

                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: isValid ? '#1b5e20' : (isRevoked ? '#c62828' : '#ed6c02') }}>
                        {data.status}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.75rem', mb: 3 }}>
                        Verification Status
                    </Typography>

                    {/* 3D CARD – with parsed address */}
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
                            autoRotate={false}
                            showDownload={false}
                        />
                    </Box>

                    {/* ACTION BUTTONS */}
                    <Box display="flex" gap={1} justifyContent="center" flexWrap="wrap" mb={4}>
                        <Button variant="outlined" size="small" onClick={() => {
                            if (navigator.share) navigator.share({ url: window.location.href });
                            else navigator.clipboard.writeText(window.location.href);
                        }} sx={{ textTransform: 'none', borderRadius: 3, fontWeight: 600 }}>
                            Share
                        </Button>
                        {visaActiveUrl && (
                            <Button variant="contained" size="small" component="a" href={visaActiveUrl} target="_blank"
                                startIcon={<OpenInNewIcon />}
                                sx={{ textTransform: 'none', borderRadius: 3, fontWeight: 600 }}>
                                View Active Visa
                            </Button>
                        )}
                    </Box>

                    <Divider sx={{ my: 3, opacity: 0.5 }} />

                    {/* DETAILS */}
                    <Stack spacing={2} textAlign="left" sx={{ p: 1 }}>
                        {[
                            { label: "Document Holder",     value: data.fullName },
                            { label: "Passport Number",     value: data.passportNumber, mono: true },
                            { label: "Tempat / Tgl. Lahir", value: displayDOB },
                            { label: "Jenis Kelamin",       value: displayGender },
                            { label: "Pekerjaan",           value: displayOccup },
                            { label: "Alamat",              value: displayStreet },
                            { label: "Visa Type",           value: data.visaType },
                            { label: "Issued Date",         value: data.issuedDate ? new Date(data.issuedDate).toLocaleDateString() : '—' },
                            { label: "Issuing Authority",   value: "Indonesian Visas", primary: true },
                        ].map((row, i) => (
                            <React.Fragment key={i}>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Typography color="text.secondary" variant="body2" sx={{ flexShrink: 0, mr: 2 }}>{row.label}</Typography>
                                    <Typography variant="body1" fontWeight="700" textAlign="right"
                                        sx={{ fontFamily: row.mono ? 'monospace' : 'inherit', letterSpacing: row.mono ? 1 : 'inherit', color: row.primary ? 'primary.main' : 'text.primary' }}>
                                        {row.value}
                                    </Typography>
                                </Box>
                                {i < 8 && <Divider sx={{ borderStyle: 'dashed', opacity: 0.4 }} />}
                            </React.Fragment>
                        ))}
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
