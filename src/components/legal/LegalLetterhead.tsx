
import React from 'react';
import { Box, Typography, Divider, Grid } from '@mui/material';
import Image from 'next/image';

interface LegalLetterheadProps {
    nomor?: string;
    lampiran?: string;
    perihal?: string;
    date?: string;
}

export default function LegalLetterhead({ 
    nomor = "21 /MYVISA/A/III/2026", 
    lampiran = "1 Eks", 
    perihal = "Pernyataan Jaminan dan Tanggung Jawab (Sponsorship Agreement)",
    date
}: LegalLetterheadProps) {
    const displayDate = date || new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <Box sx={{ mb: 6 }}>
            {/* LOGO & COMPANY INFO */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ mr: 3 }}>
                    <Image 
                        src="/Favicon.webp" 
                        alt="Logo" 
                        width={100} 
                        height={100} 
                        style={{ filter: 'grayscale(1) contrast(1.2)' }}
                    />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography 
                        variant="h4" 
                        fontWeight="900" 
                        sx={{ 
                            fontSize: '2rem', 
                            letterSpacing: -0.5, 
                            color: '#000',
                            fontFamily: '"Times New Roman", serif',
                            textTransform: 'uppercase'
                        }}
                    >
                        PT. INDONESIAN VISAS AGENCY
                    </Typography>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            fontFamily: '"Times New Roman", serif', 
                            fontSize: '0.9rem',
                            borderTop: '1px solid #000',
                            pt: 0.5,
                            mt: 0.5
                        }}
                    >
                        Telp/WA : 0851 1123 7007 / indonesian@visas.agency
                    </Typography>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            fontFamily: '"Times New Roman", serif', 
                            fontSize: '0.9rem'
                        }}
                    >
                        Jl. Tibung Sari, No.11C Padangsambian Kaja, Denpasar Barat, 80117
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ borderColor: '#000', borderBottomWidth: 3, mb: 4 }} />

            {/* FORMAL HEADER DETAILS */}
            <Grid container sx={{ fontFamily: '"Times New Roman", serif', fontSize: '1rem', mb: 4 }}>
                <Grid size={8}>
                    <Box sx={{ display: 'flex', mb: 0.5 }}>
                        <Typography sx={{ width: 100 }}>Nomor</Typography>
                        <Typography sx={{ mr: 2 }}>:</Typography>
                        <Typography fontWeight="bold">{nomor}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 0.5 }}>
                        <Typography sx={{ width: 100 }}>Lampiran</Typography>
                        <Typography sx={{ mr: 2 }}>:</Typography>
                        <Typography>{lampiran}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                        <Typography sx={{ width: 100 }}>Perihal</Typography>
                        <Typography sx={{ mr: 2 }}>:</Typography>
                        <Typography fontWeight="bold">{perihal}</Typography>
                    </Box>
                </Grid>
                <Grid size={4} sx={{ textAlign: 'right' }}>
                    <Typography>Denpasar, {displayDate}</Typography>
                </Grid>
            </Grid>

            <Box sx={{ fontFamily: '"Times New Roman", serif', mt: 4 }}>
                <Typography sx={{ mb: 0.5 }}>Kepada Yth.</Typography>
                <Typography fontWeight="bold">Kepala Kantor Imigrasi Kelas I Khusus TPI Denpasar</Typography>
                <Typography>Di</Typography>
                <Typography sx={{ ml: 4 }}>Tempat</Typography>
            </Box>

            <Box sx={{ fontFamily: '"Times New Roman", serif', mt: 4 }}>
                <Typography>Dengan Hormat,</Typography>
            </Box>
        </Box>
    );
}
