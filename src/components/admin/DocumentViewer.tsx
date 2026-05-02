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
import { X, Download, ExternalLink, FileText, Image as ImageIcon } from 'lucide-react';

interface DocumentViewerProps {
    open: boolean;
    onClose: () => void;
    documentUrl: string;
    documentName: string;
    documentType?: string;
}

export default function DocumentViewer({ open, onClose, documentUrl, documentName, documentType }: DocumentViewerProps) {
    const [loading, setLoading] = useState(true);
    const urlWithoutParams = documentUrl.split('?')[0].toLowerCase();
    const isImage = documentType?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(urlWithoutParams);
    const isPdf = documentType === 'application/pdf' || urlWithoutParams.endsWith('.pdf');

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
                {loading && (
                    <Box sx={{ position: 'absolute', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <CircularProgress color="primary" thickness={6} />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>SECURE LOADING...</Typography>
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
                            href={documentUrl} 
                            download 
                            startIcon={<Download size={18} />}
                            sx={{ mt: 2, borderRadius: '12px', fontWeight: 'bold' }}
                        >
                            Download to View
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
                        href={documentUrl} 
                        download 
                        startIcon={<Download size={18} />}
                        sx={{ borderRadius: '12px', fontWeight: 'bold' }}
                    >
                        Download Original
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}
