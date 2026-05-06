"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton,
    CircularProgress,
    Stack
} from '@mui/material';
import { X, Download, ExternalLink, FileText, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { Snackbar, Alert } from '@mui/material';

interface DocumentViewerProps {
    open: boolean;
    onClose: () => void;
    documentUrl: string;
    documentName: string;
    documentType?: string;
}

export default function DocumentViewer({ open, onClose, documentUrl, documentName, documentType }: DocumentViewerProps) {
    const [loading, setLoading] = useState(true);
    const [converting, setConverting] = useState(false);
    const [notification, setNotification] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });
    
    // Support signed URLs by stripping parameters for extension check
    const cleanUrl = documentUrl.split('?')[0].split('#')[0].toLowerCase();
    const isImage = documentType?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(cleanUrl);
    const isPdf = documentType === 'application/pdf' || cleanUrl.endsWith('.pdf');

    const handleDownload = async () => {
        if (!documentUrl) return;
        
        // Only convert if it's an image (excluding PDF)
        const isConvertible = isImage && !isPdf;
        
        if (isConvertible) {
            setConverting(true);
            
            // 10-Second Timeout Logic
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort();
                setConverting(false);
                setNotification({ open: true, message: "Download Timeout (Slow connection)", severity: 'error' });
            }, 10000); // 10 Seconds limit

            try {
                // Use POST to avoid URL length issues
                const response = await fetch('/api/admin/convert', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: documentUrl, name: documentName }),
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: "Unknown server error" }));
                    throw new Error(errorData.error || `API Error (${response.status})`);
                }

                // Get the blob and trigger download
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                
                // Set the filename correctly
                const baseName = documentName.replace(/\.[^/.]+$/, "") || "document";
                link.download = `${baseName}.jpg`;
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(downloadUrl);

                setNotification({ open: true, message: "JPG Downloaded successfully", severity: 'success' });
            } catch (error: any) {
                if (error.name === 'AbortError') return; // Handled by timeout
                
                console.error("Conversion API failed:", error);
                setNotification({ open: true, message: "Failed to convert. Downloading original...", severity: 'error' });
                
                // Fallback to original download
                const link = document.createElement('a');
                link.href = documentUrl;
                link.download = documentName;
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } finally {
                setConverting(false);
            }
        } else {
            // Normal download for PDF
            const link = document.createElement('a');
            link.href = documentUrl;
            link.download = documentName;
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="lg" 
            fullWidth
            PaperProps={{
                sx: { height: '90vh', bgcolor: '#1a1a1a', color: 'white', borderRadius: '24px' }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    {isImage ? <ImageIcon size={20} className="text-primary" /> : <FileText size={20} className="text-red-500" />}
                    <Typography variant="subtitle1" fontWeight="black">{documentName}</Typography>
                </Stack>
                <Box>
                    <IconButton 
                        color="inherit" 
                        href={documentUrl} 
                        target="_blank" 
                        sx={{ mr: 1, opacity: 0.6, '&:hover': { opacity: 1 } }}
                        title="Open in new tab"
                    >
                        <ExternalLink size={20} />
                    </IconButton>
                    <IconButton color="inherit" onClick={onClose} sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}>
                        <X size={20} />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#000' }}>
                {(loading || converting) && (
                    <Box sx={{ position: 'absolute', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <CircularProgress color="primary" thickness={6} />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>
                            {converting ? "CONVERTING TO JPG..." : "SECURE LOADING..."}
                        </Typography>
                    </Box>
                )}
                
                {isImage && (
                    <img 
                        src={documentUrl} 
                        alt={documentName} 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        onLoad={() => setLoading(false)}
                        onError={() => setLoading(false)}
                    />
                )}

                {isPdf && (
                    <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
                        <iframe 
                            src={`https://docs.google.com/viewer?url=${encodeURIComponent(documentUrl)}&embedded=true`}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            onLoad={() => setLoading(false)}
                            title="PDF Viewer"
                        />
                    </Box>
                )}

                {!isImage && !isPdf && (
                    <Box textAlign="center" p={4}>
                        <FileText size={64} style={{ opacity: 0.3, marginBottom: 16 }} color="white" />
                        <Typography variant="h6">Preview not available</Typography>
                        <Button 
                            variant="contained" 
                            onClick={handleDownload}
                            disabled={converting}
                            startIcon={converting ? <CircularProgress size={18} color="inherit" /> : <Download size={18} />}
                            sx={{ mt: 2, borderRadius: '12px', fontWeight: 'bold' }}
                        >
                            {converting ? "Processing..." : "Download Original"}
                        </Button>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2, bgcolor: '#1a1a1a', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ ml: 2, opacity: 0.4 }}>
                    Official Indonesian Visas Document Repository
                </Typography>
                <Box>
                    <Button onClick={onClose} color="inherit" sx={{ mr: 1 }}>Close</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleDownload}
                        disabled={converting}
                        startIcon={converting ? <CircularProgress size={18} color="inherit" /> : <Download size={18} />}
                        sx={{ borderRadius: '12px', fontWeight: 'bold' }}
                    >
                        {converting ? "Converting..." : "Download JPG"}
                    </Button>
                </Box>
            </DialogActions>

            <Snackbar 
                open={notification.open} 
                autoHideDuration={4000} 
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    severity={notification.severity} 
                    icon={notification.severity === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    sx={{ borderRadius: '12px', fontWeight: 'bold' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Dialog>
    );
}
