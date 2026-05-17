"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Container, Paper, CircularProgress, Button } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LockIcon from "@mui/icons-material/Lock";
import Link from "next/link";
import IDivCardModern from "@/components/idiv/IDivCardModern";

function parseAddress(raw: string | null | undefined) {
    const fb = { street: "", birthPlaceDate: "", gender: "", occupation: "", preferredMode: null as string | null };
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
            preferredMode:  p.preferredMode || null
        };
    } catch {
        return { ...fb, street: raw, preferredMode: null };
    }
}

export default function CardPreviewClient({ slug }: { slug: string }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(15);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (slug) {
            fetch(`/api/verification?slug=${slug}`)
                .then(async (res) => {
                    if (res.ok) {
                        const d = await res.json();
                        setData(d);
                    }
                    else setError("Verification record not found.");
                })
                .catch(() => setError("Failed to load verification data."))
                .finally(() => setLoading(false));
        }
    }, [slug]);

    useEffect(() => {
        if (data && !error && !isExpired) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsExpired(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [data, error, isExpired]);

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f8f9fa">
            <CircularProgress />
        </Box>
    );

    if (error || !data) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f8f9fa" p={2}>
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, maxWidth: 500 }}>
                <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom>Preview Unavailable</Typography>
                <Typography color="text.secondary">{error}</Typography>
                <Button variant="contained" sx={{ mt: 3 }} component={Link} href="/">Go Home</Button>
            </Paper>
        </Box>
    );

    const addr = parseAddress(data.address);
    const isJsonAddress = data.address?.trim().startsWith('{');
    const cardAddress = isJsonAddress ? (addr.street || "") : (data.address || "");
    const displayDOB = addr.birthPlaceDate || "—";
    const displayGender = addr.gender || "—";
    const displayOccup = addr.occupation || "—";
    
    const isSmart = data.visaType?.toUpperCase().includes('SMART') || data.visaType?.toUpperCase().includes('KITAS') || data.visaType?.toUpperCase().includes('ITAP');
    const isIDG = data.visaType?.toUpperCase().includes('IDG') || data.visaType?.toUpperCase().includes('GUIDE');
    
    let cardMode: 'IDIV' | 'IDG' | 'SMART' = isSmart ? 'SMART' : (isIDG ? 'IDG' : 'IDIV');
    if (isJsonAddress && addr.preferredMode) {
        cardMode = addr.preferredMode as any;
    }

    return (
        <Box component="main" sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: { xs: 8, md: 12 }, px: 2 }}>
            <Container maxWidth="sm">
                <Box textAlign="center" mb={4}>
                    <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: '-0.5px' }}>
                        INDONESIAN<Box component="span" color="primary.main">VISAS</Box>
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold" letterSpacing={1}>
                        PREMIUM IDIV PREVIEW
                    </Typography>
                </Box>

                <Paper elevation={0} variant="outlined" sx={{
                    p: { xs: 2.5, md: 5 }, borderRadius: 4, textAlign: 'center', position: 'relative',
                    overflow: 'hidden', maxWidth: 500, mx: 'auto',
                    borderTopWidth: 8, borderColor: 'primary.main', boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
                }}>
                    <VerifiedUserIcon sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 300, opacity: 0.03, color: 'black' }} />
                    
                    <Box sx={{ mb: 3, p: 1, bgcolor: 'warning.light', borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" fontWeight="bold" color="warning.dark">
                            {!isExpired ? `SAMPLE PREVIEW: Expires in ${timeLeft} seconds` : 'PREVIEW EXPIRED'}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', position: 'relative' }}>
                        <Box sx={{ 
                            filter: isExpired ? 'blur(12px) grayscale(100%)' : 'none',
                            transition: 'filter 0.5s ease'
                        }}>
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
                                autoRotate={!isExpired}
                                showDownload={false}
                                showActions={false}
                                isSample={true}
                            />
                        </Box>
                        
                        {isExpired && (
                            <Box sx={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10,
                                p: 3,
                                textAlign: 'center'
                            }}>
                                <LockIcon sx={{ fontSize: 48, color: '#334155', mb: 2 }} />
                                <Typography variant="h6" fontWeight="bold" color="#0f172a">Preview Time Ended</Typography>
                                <Typography variant="body2" color="#475569" sx={{ mt: 1, mb: 3 }}>
                                    Your 15-second secure preview has expired. To access your permanent Premium Sponsor ID, upgrade your application.
                                </Typography>
                                <Button variant="contained" component={Link} href="/idiv-search" sx={{ borderRadius: 8, fontWeight: 'bold' }}>
                                    Upgrade to Premium ID
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
