"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
    Box,
    Typography,
    Container,
    Paper,
    Divider,
    Chip,
    Grid,
    Button,
    Card,
    Stack,
    CircularProgress,
    alpha
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Link from "next/link";
import { useParams } from "next/navigation";
import IDivCardModern from "@/components/idiv/IDivCardModern";

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
                    if (res.ok) {
                        const json = await res.json();
                        setData(json);
                    } else {
                        setError("Verification record not found.");
                    }
                })
                .catch(() => setError("Failed to load verification data."))
                .finally(() => setLoading(false));
        }
    }, [slug]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f8f9fa">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !data) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f8f9fa" p={2}>
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, maxWidth: 500 }}>
                    <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
                    <Typography variant="h5" fontWeight="bold" gutterBottom>Verification Failed</Typography>
                    <Typography color="text.secondary">{error}</Typography>
                    <Button variant="contained" sx={{ mt: 3 }} component={Link} href="/">Go Home</Button>
                </Paper>
            </Box>
        );
    }

    const isValid = data.status === 'VALID';
    const isRevoked = data.status === 'REVOKED';

    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                bgcolor: '#f5f5f5',
                py: { xs: 12, md: 16 }, // Increased padding for header clearance
                px: 2,
            }}
        >
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

                <Paper
                    elevation={0}
                    variant="outlined"
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 4,
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        borderColor: isValid ? 'success.light' : (isRevoked ? 'error.light' : 'warning.light'),
                        borderTopWidth: 8,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
                    }}
                >
                    {/* WATERMARK */}
                    <VerifiedUserIcon
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: 300,
                            opacity: 0.03,
                            color: 'black'
                        }}
                    />

                    {/* STATUS ICON */}
                    <Box mb={3}>
                        {isValid ? (
                            <CheckCircleIcon color="success" sx={{ fontSize: 80 }} />
                        ) : isRevoked ? (
                            <CancelIcon color="error" sx={{ fontSize: 80 }} />
                        ) : (
                            <ErrorIcon color="warning" sx={{ fontSize: 80 }} />
                        )}
                    </Box>

                    {/* STATUS TEXT */}
                    {/* STATUS TEXT - Hierarchy 1 */}
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: isValid ? '#1b5e20' : (isRevoked ? '#c62828' : '#ed6c02') }}>
                        {data.status}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.75rem', mb: 3 }}>
                        Verification Status
                    </Typography>

                    {/* IDIV CARD PREVIEW */}
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                        <IDivCardModern 
                            data={{
                                id_number: data.id,
                                name: data.fullName,
                                nationality: data.nationality,
                                visa_type: data.visaType,
                                expiry_date: new Date(data.expiresAt).toLocaleDateString(),
                                issue_date: new Date(data.issuedDate).toLocaleDateString(),
                                address: data.address,
                                photoUrl: data.photoUrl,
                                order_id: data.id 
                            }}
                            privacyMode={false} 
                            autoRotate={false}
                        />
                    </Box>

                    {/* Apply Similar Visa Button - Hierarchy 4 (Supportive) */}
                    <Button
                        variant="contained"
                        size="small"
                        component={Link}
                        href="/services"
                        sx={{
                            mb: 4,
                            px: 3,
                            py: 0.5,
                            textTransform: 'none',
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                            color: 'primary.main',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15),
                                boxShadow: 'none',
                            }
                        }}
                    >
                        Apply Similar Visa
                    </Button>

                    <Divider sx={{ my: 3, opacity: 0.5 }} />

                    {/* DETAILS */}
                    {/* DETAILS - Hierarchy 2 & 3 */}
                    <Stack spacing={2.5} textAlign="left" sx={{ p: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography color="text.secondary" variant="body2">Document Holder</Typography>
                            <Typography variant="body1" fontWeight="700" color="text.primary">{data.fullName}</Typography>
                        </Box>
                        <Divider sx={{ borderStyle: 'dashed', opacity: 0.4 }} />

                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography color="text.secondary" variant="body2">Passport Number</Typography>
                            <Typography variant="body1" fontWeight="700" sx={{ fontFamily: 'monospace', letterSpacing: 1 }}>{data.passportNumber}</Typography>
                        </Box>
                        <Divider sx={{ borderStyle: 'dashed', opacity: 0.4 }} />

                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography color="text.secondary" variant="body2">Visa Type</Typography>
                            <Typography variant="body1" fontWeight="600">{data.visaType}</Typography>
                        </Box>

                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography color="text.secondary" variant="body2">Issued Date</Typography>
                            <Typography variant="body1" fontWeight="600">{new Date(data.issuedDate).toLocaleDateString()}</Typography>
                        </Box>

                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography color="text.secondary" variant="body2">Issuing Authority</Typography>
                            <Typography variant="body1" fontWeight="600" color="primary.main">Indonesian Visas</Typography>
                        </Box>
                    </Stack>

                    <Divider sx={{ mt: 4, mb: 3 }} />

                    <Box>
                        <Button
                            variant="outlined"
                            startIcon={<WhatsAppIcon />}
                            component="a"
                            href="https://wa.me/6285727041992"
                            target="_blank"
                            fullWidth
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                color: 'text.secondary',
                                borderColor: 'rgba(0,0,0,0.2)',
                                py: 1.2,
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    color: 'primary.main',
                                    bgcolor: 'transparent'
                                }
                            }}
                        >
                            Contact Indonesian Visas
                        </Button>
                    </Box>
                </Paper>

                {/* FOOTER & LEGAL */}
                <Box mt={5} textAlign="center" pb={4}>
                    <Typography variant="body2" sx={{ mb: 4 }}>
                        <Link href="/" style={{ textDecoration: 'none', color: '#666', fontWeight: 600 }}>
                            Back to IndonesianVisas.com
                        </Link>
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
