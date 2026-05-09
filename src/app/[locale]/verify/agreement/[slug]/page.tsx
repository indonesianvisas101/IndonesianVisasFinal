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
import { ShieldCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LegalLetterhead from '@/components/legal/LegalLetterhead';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PersonIcon from '@mui/icons-material/Person';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { generateAgreementPDF, getAgreementPDFBase64 } from '@/utils/agreementPdfGenerator';

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
    const [agreementHash, setAgreementHash] = useState('');
    
    // Checklist state
    const [checks, setChecks] = useState({
        trueInfo: false,
        falseConsequences: false,
        complyLaws: false,
        prohibitedActivities: false,
        reportChanges: false,
        sponsorRole: false,
        govtAuthority: false,
        depositPolicy: false,
        readAgreed: false
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
    
    const addr = (() => {
        if (!verification?.address) return "-";
        if (verification.address.startsWith('{')) {
            try {
                const p = JSON.parse(verification.address);
                return p.street || p.address || verification.address;
            } catch { return verification.address; }
        }
        return verification.address;
    })();

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');
        
        try {
            // 1. Generate the PDF base64 for archiving
            const pdfBase64 = await getAgreementPDFBase64({
                fullName: verification.fullName,
                passportNumber: verification.passportNumber,
                nationality: verification.nationality || 'Not Specified',
                address: addr,
                phoneNumber: verification.phoneNumber || '-',
                email: verification.email || '-',
                agreementText: agreementText,
                signatureBase64: signature,
                auditHash: 'PENDING_FINAL_HASH', // The server will re-calculate but we embed the placeholder
                signedAt: new Date().toISOString(),
                ipAddress: 'DETECTED_ON_SERVER',
                slug: slug
            });

            // 2. Submit signature and PDF to API
            const res = await fetch(`/api/verification/agreement`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug,
                    signature,
                    checks,
                    ip: 'DETECTED_ON_SERVER',
                    pdfBase64: pdfBase64
                })
            });
            
            const result = await res.json();
            if (res.ok) {
                setAgreementHash(result.hash || '');
                setSuccess(true);
            } else {
                setError(result.error || 'Failed to submit agreement');
            }
        } catch (err) {
            console.error("Submission Error:", err);
            setError('Connection error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" py={20}><CircularProgress /></Box>;
    if (error && !verification) return <Container maxWidth="sm" sx={{ py: 10 }}><Alert severity="error">{error}</Alert></Container>;

    if (success) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
                <Paper elevation={6} sx={{ p: 6, textAlign: 'center', borderRadius: 4, maxWidth: 500, borderTop: '8px solid #16A34A' }}>
                    <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                    <Typography variant="h4" fontWeight="900" gutterBottom sx={{ letterSpacing: '-1px' }}>Agreement Signed</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                        Thank you, <b>{verification.fullName}</b>. Your sponsorship agreement has been successfully signed, logged, and stored in our secure legal database.
                    </Typography>

                    {agreementHash && (
                        <Box sx={{ mb: 4, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                            <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                                Digital Fingerprint (SHA-256)
                            </Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', color: 'primary.main', fontSize: '0.75rem', lineHeight: 1.2 }}>
                                {agreementHash}
                            </Typography>
                        </Box>
                    )}

                        <Stack spacing={2}>
                            <Button 
                                variant="contained" 
                                size="large"
                                onClick={() => router.push(`/verify/${slug}`)}
                                fullWidth
                                sx={{ py: 2, borderRadius: 3, fontWeight: 'bold' }}
                            >
                                View Verification Certificate
                            </Button>

                            <Button 
                                variant="outlined" 
                                size="large"
                                startIcon={<FileDownloadIcon />}
                                onClick={async () => {
                                    try {
                                        await generateAgreementPDF({
                                            fullName: verification.fullName,
                                            passportNumber: verification.passportNumber,
                                            nationality: verification.nationality || 'Not Specified',
                                            address: addr,
                                            phoneNumber: verification.phoneNumber || '-',
                                            email: verification.email || '-',
                                            agreementText: agreementText,
                                            signatureBase64: signature,
                                            auditHash: agreementHash,
                                            signedAt: new Date().toISOString(),
                                            ipAddress: verification.ipAddress || 'Recorded',
                                            slug: slug
                                        });
                                    } catch (err) {
                                        console.error("PDF Export Error", err);
                                        alert("Failed to generate PDF. Please try again.");
                                    }
                                }}
                                fullWidth
                                sx={{ py: 1.5, borderRadius: 3, fontWeight: 'bold', border: '2px solid' }}
                            >
                                Download Official PDF
                            </Button>
                        </Stack>
                </Paper>
            </Box>
        );
    }


    return (
        <Box sx={{ bgcolor: '#F3F4F6', minHeight: '100vh', py: { xs: 4, md: 8 } }}>
            <Container maxWidth="md">
                <Paper 
                    elevation={6} 
                    sx={{ 
                        p: { xs: 4, md: 8 }, 
                        borderRadius: 0, 
                        border: '1px solid #E5E7EB',
                        bgcolor: '#fff',
                        position: 'relative',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
                    }}
                >
                    {/* WATERMARK LOGO */}
                    <Box sx={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.03, pointerEvents: 'none', width: '70%', zIndex: 0 }}>
                        <img src="/Favicon.webp" alt="Watermark" style={{ width: '100%', height: 'auto' }} />
                    </Box>

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <LegalLetterhead />

                        <Box sx={{ textAlign: 'center', mb: 6, mt: 4 }}>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    fontWeight: '900', 
                                    textDecoration: 'underline', 
                                    color: '#000', 
                                    letterSpacing: 0.5,
                                    fontFamily: '"Times New Roman", serif',
                                    mb: 0.5
                                }}
                            >
                                SPONSORSHIP AND RESPONSIBILITY AGREEMENT
                            </Typography>
                            <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                    fontWeight: 'bold', 
                                    color: '#000', 
                                    fontFamily: '"Times New Roman", serif',
                                    fontStyle: 'italic'
                                }}
                            >
                                PERJANJIAN SPONSORSHIP DAN TANGGUNG JAWAB
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography sx={{ fontFamily: '"Times New Roman", serif', fontSize: '1.05rem', color: '#000' }}>
                                Yang bertanda tangan dibawah ini :
                            </Typography>
                            <Typography sx={{ fontFamily: '"Times New Roman", serif', fontSize: '1.05rem', color: '#000', fontStyle: 'italic' }}>
                                The undersigned :
                            </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 6, fontFamily: '"Times New Roman", serif' }}>
                            {/* PIHAK PERTAMA */}
                            <Box sx={{ mb: 5 }}>
                                <Typography variant="subtitle1" fontWeight="900" sx={{ mb: 1, color: '#000' }}>
                                    PIHAK PERTAMA
                                </Typography>
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#000' }}>PT Indonesian Visas Agency</Typography>
                                    <Typography variant="body2" sx={{ color: '#000' }}>Website: <a href="https://indonesianvisas.com" target="_blank" style={{ color: 'blue', textDecoration: 'underline' }}>indonesianvisas.com</a></Typography>
                                    <Typography variant="body2" sx={{ color: '#000' }}>NIB: 0402260034806</Typography>
                                    <Typography variant="body2" sx={{ color: '#000' }}>AHU: AHU-00065.AH.02.01.TAHUN 2020</Typography>
                                    <Typography variant="body2" sx={{ color: '#000' }}>NPWP: 1000000008117681</Typography>
                                    <Typography variant="body2" sx={{ color: '#000' }}>SKT / Registered Certificate: S-04449/SKT-WP-CT/KPP.1701/2026</Typography>
                                    
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant="body2" sx={{ color: '#000' }}>
                                            Bertindak sebagai Sponsor resmi Visa/KITAS sesuai ketentuan hukum dan peraturan keimigrasian Republik Indonesia.
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#000', fontStyle: 'italic' }}>
                                            Acting as the official Visa/KITAS Sponsor in accordance with the laws and immigration regulations of the Republic of Indonesia.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* PIHAK KEDUA */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="subtitle1" fontWeight="900" sx={{ mb: 1, color: '#000' }}>
                                    PIHAK KEDUA / CLIENT
                                </Typography>
                                <Box sx={{ ml: 2 }}>
                                    <Grid container spacing={0.5}>
                                        <Grid size={4}><Typography variant="body2">Nama Lengkap / Full Name</Typography></Grid>
                                        <Grid size={1}><Typography variant="body2" sx={{ textAlign: 'center' }}>:</Typography></Grid>
                                        <Grid size={7}><Typography variant="body2" fontWeight="bold">{verification.fullName?.toUpperCase()}</Typography></Grid>
                                        
                                        <Grid size={4}><Typography variant="body2">Nomor Paspor / Passport Number</Typography></Grid>
                                        <Grid size={1}><Typography variant="body2" sx={{ textAlign: 'center' }}>:</Typography></Grid>
                                        <Grid size={7}><Typography variant="body2" fontWeight="bold">{verification.passportNumber}</Typography></Grid>
                                        
                                        <Grid size={4}><Typography variant="body2">Kewarganegaraan / Nationality</Typography></Grid>
                                        <Grid size={1}><Typography variant="body2" sx={{ textAlign: 'center' }}>:</Typography></Grid>
                                        <Grid size={7}><Typography variant="body2">{verification.nationality || '-'}</Typography></Grid>
                                        
                                        <Grid size={4}><Typography variant="body2">Alamat / Address</Typography></Grid>
                                        <Grid size={1}><Typography variant="body2" sx={{ textAlign: 'center' }}>:</Typography></Grid>
                                        <Grid size={7}><Typography variant="body2">{addr}</Typography></Grid>
                                        
                                        <Grid size={4}><Typography variant="body2">Nomor Telepon / Phone Number</Typography></Grid>
                                        <Grid size={1}><Typography variant="body2" sx={{ textAlign: 'center' }}>:</Typography></Grid>
                                        <Grid size={7}><Typography variant="body2">{verification.phoneNumber || '-'}</Typography></Grid>
                                        
                                        <Grid size={4}><Typography variant="body2">Email</Typography></Grid>
                                        <Grid size={1}><Typography variant="body2" sx={{ textAlign: 'center' }}>:</Typography></Grid>
                                        <Grid size={7}><Typography variant="body2">{verification.email || '-'}</Typography></Grid>
                                    </Grid>
                                    
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" sx={{ color: '#000' }}>
                                            Selanjutnya disebut sebagai “Pihak Kedua” atau “Client”.
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#000', fontStyle: 'italic' }}>
                                            Hereinafter referred to as the “Second Party” or “Client”.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        
                        <Box sx={{ mb: 4 }}>
                            <Typography sx={{ textAlign: 'justify', lineHeight: 1.6, fontSize: '1.05rem', color: '#000' }}>
                                Kedua belah pihak dengan ini sepakat untuk mengadakan <b>Perjanjian Jaminan dan Tanggung Jawab</b> atas pengurusan Izin Tinggal di Wilayah Republik Indonesia dengan ketentuan-ketentuan sebagai berikut:
                            </Typography>
                            <Typography sx={{ textAlign: 'justify', lineHeight: 1.6, fontSize: '1.05rem', color: '#000', fontStyle: 'italic', mt: 1 }}>
                                The two parties hereby agree to enter into this <b>Sponsorship and Responsibility Agreement</b> for the processing of Residence Permits in the territory of the Republic of Indonesia with the following terms and conditions:
                            </Typography>
                        </Box>

                        <Box 
                            sx={{ 
                                fontFamily: '"Times New Roman", serif',
                                textAlign: 'justify',
                                '& h1, h2, h3': { color: '#000', mt: 4, mb: 2, fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' },
                                '& p': { mb: 2, lineHeight: 1.8, fontSize: '1.1rem', color: '#111' },
                                '& ul, ol': { mb: 3, pl: 4, '& li': { mb: 1, lineHeight: 1.6, listStylePosition: 'outside' } },
                                border: '1px solid #f0f0f0',
                                p: 4,
                                bgcolor: '#fafafa',
                                borderRadius: 2
                            }}
                        >
                            <ReactMarkdown>{agreementText}</ReactMarkdown>
                        </Box>
                        
                        <Box sx={{ mt: 8, p: 4, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 4, boxShadow: '0 4px 12px rgba(22, 101, 52, 0.05)' }}>
                            <Typography variant="h6" fontWeight="900" gutterBottom sx={{ color: '#166534', display: 'flex', alignItems: 'center', gap: 1.5, letterSpacing: -0.5 }}>
                                <CheckCircleOutlineIcon sx={{ fontSize: 28 }} /> IMPORTANT ACKNOWLEDGEMENT
                            </Typography>
                            <Typography variant="body2" color="#166534" sx={{ mb: 3, fontWeight: '700', opacity: 0.9 }}>
                                Before submitting your Visa/KITAS application, please confirm the following legal obligations:
                            </Typography>

                            <Stack spacing={0.75}>
                                <FormControlLabel
                                    control={<Checkbox size="small" checked={checks.trueInfo} onChange={e => setChecks({...checks, trueInfo: e.target.checked})} sx={{ color: '#166534', '&.Mui-checked': { color: '#166534' } }} />}
                                    label={<Typography variant="body2" sx={{ color: '#064e3b', lineHeight: 1.4 }}>I confirm that all documents and information provided are true and valid. / <i>Saya menyatakan bahwa semua dokumen dan informasi yang diberikan adalah benar dan sah.</i></Typography>}
                                />
                                <FormControlLabel
                                    control={<Checkbox size="small" checked={checks.falseConsequences} onChange={e => setChecks({...checks, falseConsequences: e.target.checked})} sx={{ color: '#166534', '&.Mui-checked': { color: '#166534' } }} />}
                                    label={<Typography variant="body2" sx={{ color: '#064e3b', lineHeight: 1.4 }}>I understand that providing false information may result in visa rejection, deportation, blacklist, or legal consequences. / <i>Saya memahami bahwa memberikan informasi palsu dapat mengakibatkan penolakan visa, deportasi, blacklist, atau konsekuensi hukum.</i></Typography>}
                                />
                                <FormControlLabel
                                    control={<Checkbox size="small" checked={checks.complyLaws} onChange={e => setChecks({...checks, complyLaws: e.target.checked})} sx={{ color: '#166534', '&.Mui-checked': { color: '#166534' } }} />}
                                    label={<Typography variant="body2" sx={{ color: '#064e3b', lineHeight: 1.4 }}>I understand that I must comply with Indonesian immigration laws and regulations. / <i>Saya memahami bahwa saya harus mematuhi hukum dan peraturan keimigrasian Indonesia.</i></Typography>}
                                />
                                <FormControlLabel
                                    control={<Checkbox size="small" checked={checks.prohibitedActivities} onChange={e => setChecks({...checks, prohibitedActivities: e.target.checked})} sx={{ color: '#166534', '&.Mui-checked': { color: '#166534' } }} />}
                                    label={<Typography variant="body2" sx={{ color: '#064e3b', lineHeight: 1.4 }}>I understand that overstay, illegal work, visa misuse, or criminal activities are strictly prohibited. / <i>Saya memahami bahwa overstay, bekerja secara ilegal, penyalahgunaan visa, atau aktivitas kriminal sangat dilarang.</i></Typography>}
                                />
                                <FormControlLabel
                                    control={<Checkbox size="small" checked={checks.reportChanges} onChange={e => setChecks({...checks, reportChanges: e.target.checked})} sx={{ color: '#166534', '&.Mui-checked': { color: '#166534' } }} />}
                                    label={<Typography variant="body2" sx={{ color: '#064e3b', lineHeight: 1.4 }}>I agree to report any change of address, passport, phone number, or immigration-related information to the Sponsor. / <i>Saya setuju untuk melaporkan setiap perubahan alamat, paspor, nomor telepon, atau informasi terkait keimigrasian kepada Sponsor.</i></Typography>}
                                />
                                <FormControlLabel
                                    control={<Checkbox size="small" checked={checks.sponsorRole} onChange={e => setChecks({...checks, sponsorRole: e.target.checked})} sx={{ color: '#166534', '&.Mui-checked': { color: '#166534' } }} />}
                                    label={<Typography variant="body2" sx={{ color: '#064e3b', lineHeight: 1.4 }}>I understand that PT Indonesian Visas Agency acts solely as my Visa/KITAS sponsor and is not responsible for my personal actions or violations of Indonesian law. / <i>Saya memahami bahwa PT Indonesian Visas Agency hanya bertindak sebagai sponsor Visa/KITAS saya dan tidak bertanggung jawab atas tindakan pribadi saya atau pelanggaran hukum Indonesia.</i></Typography>}
                                />
                                <FormControlLabel
                                    control={<Checkbox size="small" checked={checks.govtAuthority} onChange={e => setChecks({...checks, govtAuthority: e.target.checked})} sx={{ color: '#166534', '&.Mui-checked': { color: '#166534' } }} />}
                                    label={<Typography variant="body2" sx={{ color: '#064e3b', lineHeight: 1.4 }}>I understand that immigration approval decisions are under the authority of the Government of Indonesia. / <i>Saya memahami bahwa keputusan persetujuan imigrasi berada di bawah otoritas Pemerintah Indonesia.</i></Typography>}
                                />
                                <FormControlLabel
                                    control={<Checkbox size="small" checked={checks.depositPolicy} onChange={e => setChecks({...checks, depositPolicy: e.target.checked})} sx={{ color: '#166534', '&.Mui-checked': { color: '#166534' } }} />}
                                    label={<Typography variant="body2" sx={{ color: '#064e3b', lineHeight: 1.4 }}>I understand and agree to the Security Guarantee / Deposit policy applicable to my Visa/KITAS sponsorship. / <i>Saya memahami dan menyetujui kebijakan Jaminan Keamanan / Deposit yang berlaku untuk sponsorship Visa/KITAS saya.</i></Typography>}
                                />
                                <FormControlLabel
                                    control={<Checkbox size="small" checked={checks.readAgreed} onChange={e => setChecks({...checks, readAgreed: e.target.checked})} sx={{ color: '#166534', '&.Mui-checked': { color: '#166534' } }} />}
                                    label={<Typography variant="body2" sx={{ color: '#064e3b', lineHeight: 1.4, fontWeight: 'bold' }}>I confirm that I have read and agreed to the Sponsorship and Responsibility Agreement. / <i>Saya mengkonfirmasi bahwa saya telah membaca dan menyetujui Perjanjian Jaminan dan Tanggung Jawab.</i></Typography>}
                                />
                            </Stack>
                        </Box>

                        {error && <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>{error}</Alert>}

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={!isComplete || submitting}
                            onClick={handleSubmit}
                            sx={{ 
                                mt: 4, 
                                py: 2.5, 
                                fontWeight: '900', 
                                fontSize: '1.2rem', 
                                borderRadius: 3, 
                                bgcolor: '#111827', 
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                '&:hover': { bgcolor: '#000', transform: 'translateY(-2px)' },
                                '&:disabled': { bgcolor: '#9ca3af' },
                                transition: 'all 0.3s'
                            }}
                        >
                            {submitting ? <CircularProgress size={24} color="inherit" /> : 'SIGN & SUBMIT AGREEMENT'}
                        </Button>

                        <Box sx={{ mt: 10, pt: 4, borderTop: '1px solid #eee', textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1.5 }}>
                                <ShieldCheck size={14} color="#9ca3af" />
                                <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Immutable Legal Audit Trail
                                </Typography>
                            </Box>
                            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5, fontFamily: 'monospace' }}>
                                NODE_ID: INDO_VISAS_SECURE_V4 • IP: {verification.ipAddress || 'AUTHENTICATED'} • UTC: {new Date().toISOString()}
                            </Typography>
                            <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                                This document is digitally signed and cryptographically hashed to ensure non-repudiation and data integrity.
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 8, borderColor: '#000', borderBottomWidth: 2 }} />

                        {/* SIGNATURE SECTION */}
                        <Grid container spacing={4} sx={{ fontFamily: '"Times New Roman", serif' }}>
                            <Grid size={6}>
                                <Box sx={{ textAlign: 'center', pt: 1 }}>
                                    <Typography variant="body2" sx={{ mb: 10, fontStyle: 'italic' }}>Authorized Signatory for / <i>Penandatangan yang Sah untuk</i><br />PT. INDONESIAN VISAS AGENCY</Typography>
                                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                        <img src="/signature.png" alt="Sponsor Signature" style={{ width: 140, height: 'auto', opacity: 0.8 }} />
                                        <Box sx={{ position: 'absolute', top: -30, left: -20, opacity: 0.25 }}>
                                            <img src="/Stempel.png" alt="Stamp" style={{ width: 140, transform: 'rotate(-15deg)' }} />
                                        </Box>
                                    </Box>
                                    <Typography sx={{ mt: 2, fontWeight: 'bold', textDecoration: 'underline' }}>ADMINISTRATIVE OFFICE / <i>KANTOR ADMINISTRASI</i></Typography>
                                </Box>
                            </Grid>
                            <Grid size={6} sx={{ textAlign: 'center' }}>
                                <Typography sx={{ mb: 1, fontSize: '1rem' }}>
                                    Denpasar, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </Typography>
                                <Typography sx={{ mb: 6, fontWeight: 'bold' }}>PIHAK KEDUA / SECOND PARTY (CLIENT),</Typography>
                                
                                <Box sx={{ mb: 2, border: '1px dashed #ccc', bgcolor: '#fff', p: 1 }}>
                                    <SignaturePad onSave={setSignature} clearRef={clearSignatureRef} />
                                </Box>
                                
                                <Typography sx={{ mt: 2, fontWeight: 'bold', textDecoration: 'underline', fontSize: '1.1rem' }}>
                                    ( {verification.fullName?.toUpperCase()} )
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Digitally signed via IndonesianVisas Secure Protocol
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
