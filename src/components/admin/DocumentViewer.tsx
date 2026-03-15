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
    const isImage = documentType?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(documentUrl);
    const isPdf = documentType === 'application/pdf' || documentUrl.toLowerCase().endsWith('.pdf');

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="lg" 
            fullWidth
            PaperProps={{
                sx: { height: '90vh', bgcolor: '#1a1a1a', color: 'white' }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    {isImage ? <ImageIcon size={20} /> : <FileText size={20} />}
                    <Typography variant="subtitle1" fontWeight="bold">{documentName}</Typography>
                </Stack>
                <Box>
                    <IconButton 
                        color="inherit" 
                        href={documentUrl} 
                        target="_blank" 
                        sx={{ mr: 1 }}
                        title="Open in new tab"
                    >
                        <ExternalLink size={20} />
                    </IconButton>
                    <IconButton color="inherit" onClick={onClose}>
                        <X size={20} />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#262626' }}>
                {loading && (
                    <Box sx={{ position: 'absolute', zIndex: 1 }}>
                        <CircularProgress color="primary" />
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
                    <iframe 
                        src={`${documentUrl}#toolbar=0`} 
                        title={documentName}
                        width="100%" 
                        height="100%" 
                        style={{ border: 'none' }}
                        onLoad={() => setLoading(false)}
                    />
                )}

                {!isImage && !isPdf && (
                    <Box textAlign="center" p={4}>
                        <FileText size={64} style={{ opacity: 0.3, marginBottom: 16 }} />
                        <Typography variant="h6">Preview not available for this file type</Typography>
                        <Button 
                            variant="contained" 
                            href={documentUrl} 
                            download 
                            startIcon={<Download size={18} />}
                            sx={{ mt: 2 }}
                        >
                            Download to View
                        </Button>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2, bgcolor: '#1a1a1a' }}>
                <Button onClick={onClose} color="inherit">Close</Button>
                <Button 
                    variant="contained" 
                    href={documentUrl} 
                    download 
                    startIcon={<Download size={18} />}
                >
                    Download
                </Button>
            </DialogActions>
        </Dialog>
    );
}
