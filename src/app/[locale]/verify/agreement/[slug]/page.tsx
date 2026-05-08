"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    Box, 
    Container, 
    Paper, 
    Typography, 
    Checkbox, 
    FormControlLabel, 
    Button, 
    Alert, 
    CircularProgress,
    Stack,
    Divider,
    IconButton,
    Grid
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LegalLetterhead from '@/components/legal/LegalLetterhead';

// Simple Signature Component using Canvas
const SignaturePad = ({ onSave, clearRef }: { onSave: (data: string) => void, clearRef: any }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
    }, []);

    const startDrawing = (e: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0)) - rect.top;
        
        const ctx = canvas.getContext('2d');
        ctx?.beginPath();
        ctx?.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e: any) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0)) - rect.top;
        
        const ctx = canvas.getContext('2d');
        ctx?.lineTo(x, y);
        ctx?.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            onSave(canvas.toDataURL());
        }
    };

    const clear = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
            onSave('');
        }
    };

    if (clearRef) clearRef.current = clear;

    return (
        <Box sx={{ border: '2px solid #000', borderRadius: 0, bgcolor: '#fff', position: 'relative' }}>
            <canvas
                ref={canvasRef}
                width={600}
                height={150}
                style={{ width: '100%', height: '150px', cursor: 'crosshair', touchAction: 'none' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
            <Button size="small" onClick={clear} sx={{ position: 'absolute', top: 5, right: 5, color: 'text.secondary', textTransform: 'none' }}>Clear Signature</Button>
        </Box>
    );
};

export default function AgreementPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    
    const [verification, setVerification] = useState<any>(null);
    const [agreementText, setAgreementText] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    
    // Checklist state
    const [checks, setChecks] = useState({
        validData: false,
        compliance: false,
        laws: false,
        reporting: false,
        security: false,
        fullRead: false
    });
    
    const [signature, setSignature] = useState('');
    const clearSignatureRef = useRef<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get verification data
                const vRes = await fetch(`/api/verification?slug=${slug}`);
                const vData = await vRes.json();
                if (!vRes.ok) throw new Error(vData.error || 'Verification not found');
                setVerification(vData);

                // 2. Get agreement text
                const aRes = await fetch('/api/legal/agreement-text');
                const aData = await aRes.json();
                setAgreementText(aData.content);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    const isComplete = Object.values(checks).every(v => v) && signature.length > 500; // Basic check for signature data

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');
        
        try {
            const res = await fetch(`/api/verification/agreement`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug,
                    signature,
                    checks,
                    ip: 'DETECTED_ON_SERVER'
                })
            });
            
            if (res.ok) {
                setSuccess(true);
            } else {
                const result = await res.json();
                setError(result.error || 'Failed to submit agreement');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" py={20}><CircularProgress /></Box>;
    if (error && !verification) return <Container maxWidth="sm" sx={{ py: 10 }}><Alert severity="error">{error}</Alert></Container>;

    if (success) {
        return (
            <Container maxWidth="sm" sx={{ py: 12 }}>
                <Paper elevation={6} sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
                    <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                    <Typography variant="h4" fontWeight="900" gutterBottom>Agreement Signed</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Thank you, {verification.fullName}. Your sponsorship agreement has been successfully signed and logged.
                    </Typography>
                    <Button variant="contained" onClick={() => router.push(`/verify/${slug}`)}>
                        Go to Certificate
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper 
                elevation={6} 
                sx={{ 
                    p: { xs: 4, md: 10 }, 
                    borderRadius: 0, 
                    border: '1px solid #E5E7EB',
                    bgcolor: '#fff',
                    position: 'relative'
                }}
            >
                <LegalLetterhead 
                    perihal={`Pernyataan Jaminan dan Tanggung Jawab - A.n. ${verification.fullName?.toUpperCase()}`}
                />

                <Box sx={{ mb: 4, fontFamily: '"Times New Roman", serif', fontSize: '1.1rem' }}>
                    <Typography sx={{ mb: 2 }}>Kami yang bertanda tangan di bawah ini:</Typography>
                    
                    <Box sx={{ ml: { xs: 2, md: 4 }, mb: 4 }}>
                        <Grid container spacing={1}>
                            <Grid size={{ xs: 3 }}><Typography>Nama</Typography></Grid>
                            <Grid size={{ xs: 0.5 }}><Typography>:</Typography></Grid>
                            <Grid size={{ xs: 8.5 }}><Typography fontWeight="bold">PT. INDONESIAN VISAS AGENCY</Typography></Grid>
                            
                            <Grid size={{ xs: 3 }}><Typography>Alamat</Typography></Grid>
                            <Grid size={{ xs: 0.5 }}><Typography>:</Typography></Grid>
                            <Grid size={{ xs: 8.5 }}><Typography>Jl. Tibung Sari, No.11C Padangsambian Kaja, Denpasar Barat, 80117</Typography></Grid>
                            
                            <Grid size={{ xs: 3 }}><Typography>Jabatan</Typography></Grid>
                            <Grid size={{ xs: 0.5 }}><Typography>:</Typography></Grid>
                            <Grid size={{ xs: 8.5 }}><Typography>Sponsor / Penjamin</Typography></Grid>
                        </Grid>
                    </Box>
                    
                    <Typography sx={{ mb: 2 }}>Selanjutnya disebut sebagai <b>PIHAK PERTAMA (Sponsor)</b>.</Typography>
                    
                    <Box sx={{ ml: { xs: 2, md: 4 }, mt: 4, mb: 4 }}>
                        <Grid container spacing={1}>
                            <Grid size={{ xs: 3 }}><Typography>Nama</Typography></Grid>
                            <Grid size={{ xs: 0.5 }}><Typography>:</Typography></Grid>
                            <Grid size={{ xs: 8.5 }}><Typography fontWeight="bold">{verification.fullName?.toUpperCase()}</Typography></Grid>
                            
                            <Grid size={{ xs: 3 }}><Typography>Paspor</Typography></Grid>
                            <Grid size={{ xs: 0.5 }}><Typography>:</Typography></Grid>
                            <Grid size={{ xs: 8.5 }}><Typography>{verification.passportNumber || '-'}</Typography></Grid>
                            
                            <Grid size={{ xs: 3 }}><Typography>Kebangsaan</Typography></Grid>
                            <Grid size={{ xs: 0.5 }}><Typography>:</Typography></Grid>
                            <Grid size={{ xs: 8.5 }}><Typography>{verification.nationality || '-'}</Typography></Grid>
                        </Grid>
                    </Box>
                    
                    <Typography sx={{ mb: 4 }}>Selanjutnya disebut sebagai <b>PIHAK KEDUA (Pemohon)</b>.</Typography>

                    <Typography sx={{ mb: 4, textAlign: 'justify', lineHeight: 1.8 }}>
                        Kedua belah pihak dengan ini sepakat untuk mengadakan Perjanjian Jaminan dan Tanggung Jawab atas pengurusan Izin Tinggal di Wilayah Republik Indonesia dengan ketentuan-ketentuan sebagai berikut:
                    </Typography>
                </Box>

                <Box 
                    sx={{ 
                        fontFamily: '"Times New Roman", serif',
                        textAlign: 'justify',
                        '& h1, h2, h3': { color: '#000', mt: 3, mb: 1, fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center', textDecoration: 'underline' },
                        '& p': { mb: 2, lineHeight: 1.8, fontSize: '1.1rem', color: '#000', textIndent: '2rem' },
                        '& ul, ol': { mb: 2, pl: 6, '& li': { mb: 1, lineHeight: 1.6 } }
                    }}
                >
                    <ReactMarkdown>{agreementText}</ReactMarkdown>
                </Box>

                <Divider sx={{ my: 6, borderColor: '#000' }} />

                {/* SIGNATURE SECTION */}
                <Grid container spacing={4} sx={{ fontFamily: '"Times New Roman", serif' }}>
                    <Grid size={{ xs: 6 }}>
                        {/* Empty left side or witness section if needed */}
                    </Grid>
                    <Grid size={{ xs: 6 }} sx={{ textAlign: 'center', position: 'relative' }}>
                        <Typography sx={{ mb: 10, fontSize: '1.1rem' }}>
                            Denpasar, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            <br />
                            <b>Yang Menyatakan / Applicant,</b>
                        </Typography>
                        
                        <Box sx={{ position: 'relative', mx: 'auto', width: 'fit-content' }}>
                            <SignaturePad onSave={setSignature} clearRef={clearSignatureRef} />
                            
                            {/* COMPANY STAMP PLACEHOLDER (Formal Touch) */}
                            <Box sx={{ 
                                position: 'absolute', 
                                top: -20, 
                                left: -40, 
                                opacity: 0.15, 
                                pointerEvents: 'none',
                                zIndex: 1
                            }}>
                                <img src="/Stempel.png" alt="Stamp" style={{ width: 120, height: 120, transform: 'rotate(-10deg)' }} />
                            </Box>
                        </Box>
                        
                        <Typography sx={{ mt: 2, fontWeight: 'bold', textDecoration: 'underline', fontSize: '1.1rem' }}>
                            ( {verification.fullName?.toUpperCase()} )
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                            Digital Signature captured via IV-Agreement-Protocol
                        </Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 8 }}>
                    <Typography variant="h6" fontWeight="800" gutterBottom sx={{ color: 'primary.main' }}>Pernyataan Kepatuhan (Compliance Checklist)</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Mohon konfirmasi poin-poin berikut sebelum mengirimkan dokumen.
                    </Typography>

                    <Stack spacing={1} sx={{ mb: 6 }}>
                        <FormControlLabel
                            control={<Checkbox checked={checks.validData} onChange={e => setChecks({...checks, validData: e.target.checked})} />}
                            label="Saya menyatakan bahwa semua data yang diberikan adalah benar dan sah."
                        />
                        <FormControlLabel
                            control={<Checkbox checked={checks.compliance} onChange={e => setChecks({...checks, compliance: e.target.checked})} />}
                            label="Saya mengerti konsekuensi hukum jika memberikan informasi palsu."
                        />
                        <FormControlLabel
                            control={<Checkbox checked={checks.laws} onChange={e => setChecks({...checks, laws: e.target.checked})} />}
                            label="Saya bersedia mematuhi seluruh hukum keimigrasian di Indonesia."
                        />
                        <FormControlLabel
                            control={<Checkbox checked={checks.reporting} onChange={e => setChecks({...checks, reporting: e.target.checked})} />}
                            label="Saya akan melaporkan perubahan alamat atau dokumen kepada pihak Sponsor."
                        />
                        <FormControlLabel
                            control={<Checkbox checked={checks.security} onChange={e => setChecks({...checks, security: e.target.checked})} />}
                            label="Saya menyetujui kebijakan Jaminan Keamanan (Security Guarantee)."
                        />
                        <FormControlLabel
                            control={<Checkbox checked={checks.fullRead} onChange={e => setChecks({...checks, fullRead: e.target.checked})} />}
                            label="Saya telah membaca dan menyetujui seluruh isi surat perjanjian ini."
                        />
                    </Stack>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={!isComplete || submitting}
                    onClick={handleSubmit}
                    sx={{ py: 2, fontWeight: 'bold', fontSize: '1.1rem', borderRadius: 0, boxShadow: 'none', border: '1px solid #000', bgcolor: '#000', '&:hover': { bgcolor: '#333' } }}
                >
                    {submitting ? <CircularProgress size={24} color="inherit" /> : 'SUBMIT & SIGN AGREEMENT'}
                </Button>

                <Typography variant="caption" sx={{ mt: 4, textAlign: 'center', display: 'block', color: 'text.disabled' }}>
                    IP: {verification.ipAddress || 'Log Recorded'} • Timestamp: {new Date().toISOString()}
                </Typography>
            </Paper>
        </Container>
    );
}
