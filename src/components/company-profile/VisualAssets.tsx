'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Image from 'next/image';

export default function VisualAssets() {
    const IMAGES = [
        {
            src: "/images/Team.webp",
            alt: "Operational Team in Action",
            colSpan: { xs: 12, md: 8 },
            rowSpan: 2
        },
        {
            src: "/images/hq-denpasar.webp",
            alt: "Global Headquarters (Denpasar, Bali)",
            colSpan: { xs: 12, md: 4 },
            rowSpan: 1
        },
        {
            src: "/images/csr-documentation.webp",
            alt: "Corporate CSR Documentation",
            colSpan: { xs: 12, md: 4 },
            rowSpan: 1
        }
    ];

    return (
        <Box sx={{ py: { xs: 12, md: 20 }, bgcolor: 'background.default' }}>
            <Container maxWidth="lg">
                <Box textAlign="center" mb={8}>
                    <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 'bold', letterSpacing: 2 }}>
                        Global Operations
                    </Typography>
                    <Typography variant="h3" component="h2" fontWeight="900" sx={{ mt: 1 }}>
                        Excellence in Action
                    </Typography>
                </Box>

                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={3}>
                    {IMAGES.map((img, idx) => (
                        <Box key={idx} sx={{ gridColumn: { xs: `span ${img.colSpan.xs}`, md: `span ${img.colSpan.md}` }, height: img.rowSpan === 2 ? { xs: 300, md: 624 } : 300 }}>
                            <Box 
                                sx={{ 
                                    position: 'relative', 
                                    width: '100%', 
                                    height: '100%', 
                                    borderRadius: 4, 
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                }}
                            >
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    onError={(e) => {
                                        // Placeholder for missing assets
                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22600%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%232c3e50%22%2F%3E%3C%2Fsvg%3E';
                                    }}
                                />
                                <Box 
                                    sx={{ 
                                        position: 'absolute', 
                                        bottom: 0, 
                                        width: '100%', 
                                        p: 3, 
                                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                        color: 'white'
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight="bold">{img.alt}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
