"use client";

import React from 'react';
import { Box, Typography, Card, Divider } from '@mui/material';
import { CheckCircle, ShieldCheck, Users, Info } from 'lucide-react';
import { useApplication } from '@/components/application/ApplicationContext';

export default function IDIVCard({ name = "John Doe", visaType = "B211A Visitor Visa", expiry = "2026-10-15" }) {
    return (
        <Card sx={{ 
            width: 380, 
            height: 240, 
            borderRadius: 6, 
            position: 'relative', 
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #FF0000 0%, #FFFFFF 50%, #FF0000 100%)', // Indonesian Flag Colors
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.3)'
        }}>
            {/* Hologram Effect */}
            <Box sx={{ 
                position: 'absolute', inset: 0, 
                background: 'linear-gradient(45deg, transparent 20%, rgba(255,255,255,0.1) 50%, transparent 80%)',
                zIndex: 2, pointerEvents: 'none'
            }} />

            <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                        <Typography variant="caption" fontWeight="900" sx={{ color: '#888', letterSpacing: 2 }}>ID INDONESIAN VISAS</Typography>
                        <Typography variant="h6" fontWeight="900" sx={{ color: '#000', lineHeight: 1 }}>IDIV CARD</Typography>
                    </Box>
                    <ShieldCheck size={32} color="#D32F2F" />
                </Box>

                <Box mt="auto">
                    <Typography variant="caption" sx={{ color: '#666' }}>HOLDER NAME</Typography>
                    <Typography variant="body1" fontWeight="bold" sx={{ color: '#000', mb: 1.5 }}>{name.toUpperCase()}</Typography>
                    
                    <Box display="flex" gap={3}>
                        <Box>
                            <Typography variant="caption" sx={{ color: '#666' }}>VISA STATUS</Typography>
                            <Typography variant="caption" display="block" fontWeight="bold" sx={{ color: '#D32F2F' }}>VERIFIED {visaType}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ color: '#666' }}>EXPIRES</Typography>
                            <Typography variant="caption" display="block" fontWeight="bold" sx={{ color: '#000' }}>{expiry}</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ position: 'absolute', bottom: 12, right: 12, opacity: 0.1 }}>
                    <Users size={60} />
                </Box>
            </Box>
        </Card>
    );
}
