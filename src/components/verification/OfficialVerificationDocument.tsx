
"use client";

import React from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    Divider, 
    Grid, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableRow,
    Chip
} from '@mui/material';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck } from 'lucide-react';

interface OfficialVerificationDocumentProps {
    data: {
        fullName: string;
        passportNumber: string;
        visaType: string;
        issuedDate: string | Date;
        expiresAt: string | Date;
        nationality: string;
        photoUrl?: string;
        status: string;
        slug: string;
        address?: string;
    };
}

export default function OfficialVerificationDocument({ data }: OfficialVerificationDocumentProps) {
    const formattedIssuedDate = new Date(data.issuedDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    
    const formattedExpiryDate = data.expiresAt ? new Date(data.expiresAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }) : 'N/A';

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: { xs: 2, md: 4 }, bgcolor: '#F3F4F6', minHeight: '100vh' }}>
            <Paper 
                elevation={3} 
                sx={{ 
                    width: '100%', 
                    maxWidth: '800px', 
                    p: { xs: 4, md: 8 }, 
                    borderRadius: 0,
                    position: 'relative',
                    border: '1px solid #E5E7EB',
                    bgcolor: '#FFFFFF',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
            >
                {/* WATERMARK LOGO */}
                <Box sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    opacity: 0.03, 
                    pointerEvents: 'none',
                    width: '60%'
                }}>
                    <img src="/Favicon.webp" alt="Watermark" style={{ width: '100%', height: 'auto' }} />
                </Box>

                {/* HEADER SECTION */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Image src="/Favicon.webp" alt="Indonesian Visas" width={64} height={64} />
                        <Box>
                            <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: -0.5, color: '#111827' }}>
                                INDONESIAN VISAS AGENCY
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                                Official Immigration & Document Services
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Chip 
                            label={data.status === 'VALID' ? 'VERIFIED' : data.status} 
                            color={data.status === 'VALID' ? 'success' : 'error'}
                            icon={<ShieldCheck size={18} />}
                            sx={{ fontWeight: 800, px: 1 }}
                        />
                    </Box>
                </Box>

                <Divider sx={{ mb: 6, borderBottomWidth: 2, borderColor: '#111827' }} />

                {/* DOCUMENT TITLE */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h4" fontWeight="800" sx={{ mb: 1, color: '#111827' }}>
                        CERTIFICATE OF VERIFICATION
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 500 }}>
                        Document Reference: IV-VERIF-{data.slug.toUpperCase()}
                    </Typography>
                </Box>

                {/* MAIN CONTENT GRID */}
                <Grid container spacing={6}>
                    {/* LEFT SIDE: PHOTO & QR */}
                    <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: 'center' }}>
                        <Box sx={{ 
                            width: 180, 
                            height: 230, 
                            mx: 'auto', 
                            bgcolor: '#F9FAFB', 
                            border: '4px solid #F3F4F6',
                            overflow: 'hidden',
                            mb: 4,
                            position: 'relative'
                        }}>
                            {data.photoUrl ? (
                                <img src={data.photoUrl} alt="Applicant" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#E5E7EB' }}>
                                    <Typography variant="caption" color="text.secondary">No Photo Available</Typography>
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ p: 2, bgcolor: '#FFFFFF', border: '1px dashed #D1D5DB', borderRadius: 2, display: 'inline-block' }}>
                            <QRCodeSVG 
                                value={`https://indonesianvisas.com/verify/${data.slug}`} 
                                size={100}
                                level="H"
                            />
                            <Typography variant="caption" display="block" sx={{ mt: 1, fontWeight: 700, fontSize: '0.6rem' }}>
                                SCAN TO VALIDATE
                            </Typography>
                        </Box>
                    </Grid>

                    {/* RIGHT SIDE: DATA TABLE */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <TableContainer>
                            <Table size="small">
                                <TableBody>
                                    {[
                                        { label: 'FULL NAME', value: data.fullName },
                                        { label: 'PASSPORT NUMBER', value: data.passportNumber },
                                        { label: 'NATIONALITY', value: data.nationality },
                                        { label: 'VISA TYPE', value: data.visaType },
                                        { label: 'ISSUED DATE', value: formattedIssuedDate },
                                        { label: 'EXPIRY DATE', value: formattedExpiryDate },
                                        { label: 'RESIDENTIAL ADDRESS', value: data.address || '-' }
                                    ].map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ py: 2, pl: 0, fontWeight: 700, color: '#6B7280', borderBottom: '1px solid #F3F4F6', fontSize: '0.75rem', width: '40%' }}>
                                                {row.label}
                                            </TableCell>
                                            <TableCell sx={{ py: 2, pr: 0, fontWeight: 800, color: '#111827', borderBottom: '1px solid #F3F4F6', fontSize: '0.9rem' }}>
                                                {row.value?.toUpperCase()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>

                {/* FOOTER SECTION */}
                <Box sx={{ mt: 10, pt: 4, borderTop: '1px solid #E5E7EB', textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 2 }}>
                        This is a computer-generated document. No signature is required. The authenticity of this document can be verified by scanning the QR code above or visiting indonesianvisas.com/verify.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, mt: 4 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" fontWeight="900" display="block">SYSTEM CAPTURED</Typography>
                            <Typography variant="caption" color="text.secondary">Digital Validation ID</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" fontWeight="900" display="block">B-VISA PROTOCOL</Typography>
                            <Typography variant="caption" color="text.secondary">Immigration Standard</Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}
