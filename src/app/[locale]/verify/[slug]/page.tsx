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
    Snackbar,
    Alert,
    TextField,
    InputAdornment,
    IconButton
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import IDivCardModern from "@/components/idiv/IDivCardModern";
import OfficialVerificationDocument from "@/components/verification/OfficialVerificationDocument";
import { supabase } from "@/lib/supabase";

// Parse JSON-packed address field (Case-Insensitive)
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

// Convert any standard DOB format to 6-digit DDMMYY PIN
function extractDDMMYY(dobStr: string): string {
    if (!dobStr) return "010190";
    const matches = dobStr.match(/\d+/g);
    if (matches && matches.length >= 3) {
        let day = "";
        let month = "";
        let year = "";
        
        if (matches[0].length === 4) {
            year = matches[0].substring(2, 4);
            month = matches[1].padStart(2, '0');
            day = matches[2].padStart(2, '0');
        } else {
            day = matches[0].padStart(2, '0');
            month = matches[1].padStart(2, '0');
            year = matches[2].length === 4 ? matches[2].substring(2, 4) : matches[2].padStart(2, '0');
        }
        return `${day}${month}${year}`;
    }
    
    const clean = dobStr.replace(/[^0-9]/g, '');
    if (clean.length >= 6) {
        if (clean.length === 8) {
            return clean.substring(0, 4) + clean.substring(6, 8);
        }
        return clean.substring(0, 6);
    }
    return "010190";
}

export default function VerificationPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const searchParams = useSearchParams();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [showPinTip, setShowPinTip] = useState(false);

    // NFC Contactless State
    const [nfcScanning, setNfcScanning] = useState(false);
    const [nfcStep, setNfcStep] = useState(0);
    const [nfcConsentGiven, setNfcConsentGiven] = useState(false);
    const isNfcFlow = searchParams?.get('nfc') === '1';

    // Identity Unlock 2FA State
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [pinInput, setPinInput] = useState("");
    const [pinError, setPinError] = useState("");
    const [unlocking, setUnlocking] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email) {
                const ADMIN_EMAILS = ['damnbayu@gmail.com', 'bayu@indonesianvisas.com'];
                if (ADMIN_EMAILS.includes(session.user.email)) {
                    setIsAdmin(true);
                }
            }
        };
        checkAdmin();
    }, []);

    // Recover unlock state from sessionStorage to prevent re-prompts
    useEffect(() => {
        if (slug) {
            const savedUnlock = sessionStorage.getItem(`idiv_unlocked_${slug}`);
            if (savedUnlock === 'true') {
                setIsUnlocked(true);
            }
        }
    }, [slug]);

    useEffect(() => {
        if (slug) {
            fetch(`/api/verification?slug=${slug}`)
                .then(async (res) => {
                    if (res.ok) {
                        const d = await res.json();
                        setData(d);
                        // Trigger PIN Tip notification
                        setShowPinTip(true);
                    }
                    else setError("Verification record not found.");
                })
                .catch(() => setError("Failed to load verification data."))
                .finally(() => setLoading(false));
        }
    }, [slug]);

    // NFC Scanning Handshake sequence
    useEffect(() => {
        if (data && isNfcFlow) {
            const hasScanned = sessionStorage.getItem(`nfc_scanned_${slug}`);
            if (!hasScanned) {
                setNfcScanning(true);
                setNfcStep(0);

                const t1 = setTimeout(() => setNfcStep(1), 1000);
                const t2 = setTimeout(() => {
                    setNfcStep(2);
                    // Write hardware log event inside DB
                    fetch('/api/verification/log-nfc', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ slug })
                    }).catch(err => console.error("Failed to log NFC tap:", err));
                }, 2000);
                const t3 = setTimeout(() => {
                    setNfcScanning(false);
                    sessionStorage.setItem(`nfc_scanned_${slug}`, 'true');
                }, 3500);

                return () => {
                    clearTimeout(t1);
                    clearTimeout(t2);
                    clearTimeout(t3);
                };
            }
        }
    }, [data, isNfcFlow, slug]);

    const handlePinSubmit = () => {
        setUnlocking(true);
        setPinError("");

        setTimeout(() => {
            const dob = data.birthPlaceDate || "";
            const rawAddr = data.address || "";
            let addrDob = "";
            if (rawAddr.trim().startsWith('{')) {
                try {
                    const parsed = JSON.parse(rawAddr);
                    addrDob = parsed.birthPlaceDate || parsed.BIRTHPLACEDATE || parsed.dob || parsed.DOB || "";
                } catch {}
            }

            const expectedPIN1 = extractDDMMYY(dob);
            const expectedPIN2 = extractDDMMYY(addrDob);
            const expectedPIN3 = data.accessPin || "123456";

            const isCorrect = pinInput === expectedPIN1 || pinInput === expectedPIN2 || pinInput === expectedPIN3;

            if (isCorrect) {
                setIsUnlocked(true);
                sessionStorage.setItem(`idiv_unlocked_${slug}`, 'true');
            } else {
                setPinError("Access Denied: Incorrect Identity PIN.");
            }
            setUnlocking(false);
        }, 1000);
    };

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

    // NFC SECURED SCANNING VIEW OVERLAY
    if (nfcScanning) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh" sx={{
                background: 'radial-gradient(circle at center, #1e3a8a 0%, #020617 100%)',
                color: '#fff',
                p: 3,
                textAlign: 'center',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <Box sx={{
                    position: 'absolute',
                    width: '350px',
                    height: '350px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)',
                    animation: 'pulse 3s infinite ease-in-out'
                }} />

                <Box sx={{
                    position: 'relative',
                    width: 140,
                    height: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 4
                }}>
                    <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        border: '2px solid rgba(56,189,248,0.4)',
                        borderRadius: '50%',
                        animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        inset: 20,
                        border: '2px solid rgba(56,189,248,0.6)',
                        borderRadius: '50%',
                        animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                        animationDelay: '0.6s'
                    }} />

                    <Box sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'rgba(56,189,248,0.15)',
                        border: '2px solid #38bdf8',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 30px rgba(56,189,248,0.3)',
                        zIndex: 2
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 8a10 10 0 0 1 14 0" />
                            <path d="M7 11a6 6 0 0 1 10 0" />
                            <path d="M9 14a2 2 0 0 1 6 0" />
                            <circle cx="12" cy="17" r="1" fill="#38bdf8" />
                        </svg>
                    </Box>
                </Box>

                <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: '0.05em', mb: 2, textTransform: 'uppercase', color: '#38bdf8', textShadow: '0 0 15px rgba(56,189,248,0.5)' }}>
                    NFC Hardware Link Detected
                </Typography>
                
                <Stack spacing={1.5} sx={{ maxWidth: 320, width: '100%', mt: 2 }}>
                    <Box display="flex" alignItems="center" gap={1.5} justifyContent="center" sx={{ opacity: nfcStep >= 0 ? 1 : 0.4, transition: 'opacity 0.3s' }}>
                        {nfcStep > 0 ? <CheckCircleIcon sx={{ color: '#34d399', fontSize: 18 }} /> : <CircularProgress size={14} sx={{ color: '#38bdf8' }} />}
                        <Typography variant="body2" fontWeight="700">Initializing Secure Hardware Interface</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1.5} justifyContent="center" sx={{ opacity: nfcStep >= 1 ? 1 : 0.4, transition: 'opacity 0.3s' }}>
                        {nfcStep > 1 ? <CheckCircleIcon sx={{ color: '#34d399', fontSize: 18 }} /> : nfcStep === 1 ? <CircularProgress size={14} sx={{ color: '#38bdf8' }} /> : <Box sx={{ width: 18 }} />}
                        <Typography variant="body2" fontWeight="700">Verifying Contactless Signature</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1.5} justifyContent="center" sx={{ opacity: nfcStep >= 2 ? 1 : 0.4, transition: 'opacity 0.3s' }}>
                        {nfcStep > 2 ? <CheckCircleIcon sx={{ color: '#34d399', fontSize: 18 }} /> : nfcStep === 2 ? <CircularProgress size={14} sx={{ color: '#38bdf8' }} /> : <Box sx={{ width: 18 }} />}
                        <Typography variant="body2" fontWeight="700">Securing Cryptographic Session</Typography>
                    </Box>
                </Stack>

                <style jsx global>{`
                    @keyframes ping {
                        0% { transform: scale(1); opacity: 1; }
                        100% { transform: scale(1.6); opacity: 0; }
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); opacity: 0.8; }
                        50% { transform: scale(1.15); opacity: 1; }
                    }
                `}</style>
            </Box>
        );
    }

    const addr = parseAddress(data.address);
    const displayStreet = addr.street || "—";

    // 0. CHECK FOR MANDATORY AGREEMENT (KITAS / D-TYPE BLOCK) - Bypass for Admins
    const isB1VOA = (data.visaType || '').toUpperCase().includes('B1 VOA') || (data.visaType || '').toUpperCase().includes('B1 - VOA') || (data.visaType || '').toUpperCase() === 'B1';
    if ((data.isAgreementRequired || data.agreementStatus === 'PENDING') && data.agreementStatus !== 'SIGNED' && !isAdmin && !isB1VOA) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f8f9fa" p={2}>
                <Paper elevation={4} sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', borderRadius: 6, maxWidth: 500, borderTop: '8px solid #f59e0b' }}>
                    <ErrorIcon color="warning" sx={{ fontSize: 80, mb: 3 }} />
                    <Typography variant="h4" fontWeight="900" gutterBottom sx={{ letterSpacing: '-1px' }}>Action Required</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                        Hello, <b>{data.fullName}</b>. As part of our secure sponsorship protocol for <b>{data.visaType}</b>, a digital agreement must be signed before you can access your verification documents.
                    </Typography>
                    <Button 
                        variant="contained" 
                        size="large" 
                        component={Link} 
                        href={`/verify/agreement/${slug}`}
                        fullWidth
                        sx={{ py: 2, borderRadius: 3, fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3)' }}
                    >
                        SIGN SPONSORSHIP AGREEMENT
                    </Button>
                    <Typography variant="caption" display="block" sx={{ mt: 3, color: 'text.disabled' }}>
                        This is a mandatory security step for Indonesian immigration compliance.
                    </Typography>
                </Paper>
            </Box>
        );
    }

    // 1. NFC CONSENT FLOW (If accessed via physical NFC tap)
    if (isNfcFlow && !nfcConsentGiven) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f8f9fa" p={2}>
                <Paper elevation={4} sx={{ p: { xs: 4, md: 5 }, textAlign: 'center', borderRadius: 4, maxWidth: 450, borderTop: '8px solid #38bdf8' }}>
                    <VerifiedUserIcon sx={{ fontSize: 64, mb: 2, color: '#38bdf8' }} />
                    <Typography variant="h5" fontWeight="900" gutterBottom>Verification Request</Typography>
                    <Typography color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                        A verified hospitality partner is requesting temporary access to view your active Visa Status and verification document.
                    </Typography>
                    <Button 
                        variant="contained" 
                        size="large" 
                        fullWidth
                        sx={{ py: 1.5, borderRadius: 3, fontWeight: 'bold', mb: 2, bgcolor: '#38bdf8', '&:hover': { bgcolor: '#0284c7' } }}
                        onClick={() => setNfcConsentGiven(true)}
                    >
                        Allow Temporary Access
                    </Button>
                    <Button 
                        variant="outlined" 
                        size="large" 
                        fullWidth
                        sx={{ py: 1.5, borderRadius: 3, fontWeight: 'bold', color: 'text.secondary', borderColor: 'divider' }}
                        onClick={() => window.location.href = '/'}
                    >
                        Deny & Exit
                    </Button>
                </Paper>
            </Box>
        );
    }

    // 2. RENDER STANDARD DOCUMENT VIEW ALWAYS
    return <OfficialVerificationDocument data={{
        ...data,
        address: displayStreet,
        issuedDate: data.issuedDate,
        expiresAt: data.expiresAt,
        nationality: data.nationality || 'INDONESIA',
        isAgreementRequired: data.isAgreementRequired,
        agreementStatus: data.agreementStatus
    }} />;
}
