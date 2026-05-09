import React from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

export default function LegalLetterhead() {
    return (
        <Box sx={{ mb: 4 }}>
            {/* OFFICIAL HEADER LAYOUT BASED ON SCREENSHOT */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative',
                pb: 1.5
            }}>
                {/* Logo on the left */}
                <Box sx={{ position: 'absolute', left: 0 }}>
                    <Image 
                        src="/Favicon.webp" 
                        alt="PT Indonesian Visas Agency Logo" 
                        width={80} 
                        height={80} 
                        style={{ filter: 'grayscale(1) contrast(1.1)' }}
                    />
                </Box>
                
                {/* Center Content */}
                <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontFamily: '"Times New Roman", serif',
                            fontWeight: '900',
                            fontSize: { xs: '1.1rem', md: '1.35rem' },
                            color: '#000',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            lineHeight: 1.1,
                            mb: 0.1
                        }}
                    >
                        PT. INDONESIAN VISAS AGENCY
                    </Typography>
                    
                    <Typography 
                        sx={{ 
                            fontFamily: '"Times New Roman", serif',
                            fontSize: '0.7rem',
                            fontWeight: '500',
                            color: '#000',
                            lineHeight: 1.2
                        }}
                    >
                        Telp/wa : 0851 1123 7007 | Email: indonesian@visas.agency
                    </Typography>
                    
                    <Typography 
                        sx={{ 
                            fontFamily: '"Times New Roman", serif',
                            fontSize: '0.7rem',
                            fontWeight: '500',
                            color: '#000',
                            lineHeight: 1.2
                        }}
                    >
                        Jl. Tibung Sari, No.11C Padangsambian Kaja, Denpasar Barat, 80117
                    </Typography>
                </Box>
            </Box>
            
            {/* Thick Border as seen in screenshot */}
            <Box sx={{ borderBottom: '3px solid #000', width: '100%', mt: 0.5 }} />
        </Box>
    );
}
