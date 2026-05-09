"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { 
    Box, 
    Container, 
    Paper, 
    Typography, 
    TextField, 
    Button, 
    Alert, 
    CircularProgress,
    Stack,
    Divider,
    IconButton
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Image from 'next/image';
import { supabase } from "@/lib/supabase";

export default function SecureDocViewer() {
    const params = useParams();
    const slug = params.slug as string;
    
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    React.useEffect(() => {
        const checkAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email) {
                // Admin check from lib/auth-helpers
                const ADMIN_EMAILS = ['damnbayu@gmail.com'];
                if (ADMIN_EMAILS.includes(session.user.email)) {
                    setIsAdmin(true);
                    fetchAdminDocs();
                }
            }
        };
        checkAdmin();
    }, []);

    const fetchAdminDocs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/verification/secure-doc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, isAdminBypass: true })
            });
            const result = await res.json();
            if (res.ok) setData(result);
            else setError(result.error);
        } catch (e) {
            setError('Failed to auto-fetch as Admin');
        }
        setLoading(false);
    };

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await fetch('/api/verification/secure-doc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, pin })
            });
            
            const result = await res.json();
            
            if (res.ok) {
                setData(result);
            } else {
                setError(result.error || 'Failed to unlock documents');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (data) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                    <Stack spacing={3}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography variant="h4" fontWeight="900" color="primary">SECURE DOCUMENTS</Typography>
                                <Typography variant="subtitle1" color="text.secondary">Verification Holder: {data.fullName}</Typography>
                            </Box>
                            <Box sx={{ bgcolor: 'success.lighter', px: 2, py: 1, borderRadius: 2 }}>
                                <Typography variant="caption" color="success.main" fontWeight="bold">ACCESS GRANTED</Typography>
                            </Box>
                        </Box>
                        
                        <Divider />

                        <Typography variant="h6" fontWeight="700">Available Documents</Typography>
                        
                        <Stack spacing={2}>
                            {data.documents.length > 0 ? data.documents.map((doc: any, index: number) => (
                                <Paper 
                                    key={index} 
                                    variant="outlined" 
                                    sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#F9FAFB' }}
                                >
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Box 
                                            sx={{ 
                                                width: 40, height: 40, borderRadius: 1, 
                                                bgcolor: 'primary.lighter', color: 'primary.main',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            <VisibilityIcon sx={{ fontSize: 20 }} />
                                        </Box>
                                        <Box>
                                            <Typography fontWeight="700">{doc.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{doc.type}</Typography>
                                        </Box>
                                    </Box>
                                    <Stack direction="row" spacing={1}>
                                        <Button 
                                            size="small" 
                                            variant={doc.status === 'SIGNED' || !doc.isInternal ? "contained" : "outlined"} 
                                            color={doc.status === 'SIGNED' ? "success" : "primary"}
                                            startIcon={doc.isInternal && doc.status !== 'SIGNED' ? <VisibilityIcon /> : <DownloadIcon />}
                                            onClick={() => window.open(doc.url, '_blank')}
                                        >
                                            {doc.isInternal ? (doc.status === 'SIGNED' ? 'View Agreement' : 'Review & Sign') : 'View / Download'}
                                        </Button>
                                    </Stack>

                                </Paper>
                            )) : (
                                <Alert severity="info" sx={{ borderRadius: 2 }}>
                                    No secure documents found for this record. 
                                    Admin: Please ensure a photo is uploaded or a valid user/application is linked in the Verification dashboard.
                                </Alert>
                            )}
                        </Stack>

                        {data.documents.some((d: any) => d.name === 'Passport' || d.type.includes('image')) && (
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="subtitle2" gutterBottom>Visual Preview</Typography>
                                <Box sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', border: '1px solid #eee' }}>
                                    {data.documents.filter((d: any) => d.type.includes('image')).map((img: any, i: number) => (
                                        <img key={i} src={img.url} alt={img.name} style={{ width: '100%', display: 'block' }} />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Button variant="text" color="inherit" onClick={() => setData(null)}>
                                Lock Access Again
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 12 }}>
            <Paper elevation={6} sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', borderRadius: 4 }}>
                <Box 
                    sx={{ 
                        width: 80, height: 80, borderRadius: '50%', 
                        bgcolor: 'primary.lighter', color: 'primary.main',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mx: 'auto', mb: 4
                    }}
                >
                    <LockOutlinedIcon sx={{ fontSize: 40 }} />
                </Box>
                
                <Typography variant="h4" fontWeight="900" gutterBottom>Secure Access</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    This document is protected. Please enter the 6-digit PIN provided by Indonesian Visas Agency to view.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 4, textAlign: 'left' }}>{error}</Alert>}

                <form onSubmit={handleUnlock}>
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="6-Digit PIN"
                            variant="outlined"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').substring(0, 6))}
                            inputProps={{ 
                                style: { textAlign: 'center', letterSpacing: '10px', fontSize: '24px', fontWeight: 'bold' },
                                inputMode: 'numeric',
                                pattern: '[0-9]*'
                            }}
                            placeholder="••••••"
                            autoFocus
                        />
                        <Button 
                            fullWidth 
                            size="large" 
                            variant="contained" 
                            type="submit" 
                            disabled={loading || pin.length < 6}
                            sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'UNLOCK DOCUMENTS'}
                        </Button>
                    </Stack>
                </form>

                <Typography variant="caption" display="block" sx={{ mt: 4, color: 'text.disabled' }}>
                    Access is logged for security purposes.
                </Typography>
            </Paper>
        </Container>
    );
}
