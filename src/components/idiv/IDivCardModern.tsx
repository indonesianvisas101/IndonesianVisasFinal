"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { ShieldCheck, Flag, Globe, Info, QrCode as QrIcon, Download, Share2, X, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { downloadIDivDual } from '@/utils/idivDownloadTools';
import { Button } from '@mui/material';

const floatTransition = {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut" as any,
    repeatType: "reverse" as const,
};

interface IDivCardProps {
    data?: {
        id_number?: string;
        name?: string;
        nationality?: string;
        visa_type?: string;
        expiry_date?: string;
        issue_date?: string;
        sponsor?: string;
        province?: string;
        photoUrl?: string;
        address?: string;
        order_id?: string;
    };
    autoRotate?: boolean;
    onDownload?: () => void;
    privacyMode?: boolean;
    showActions?: boolean;
}

export default function IDivCardModern({ data, autoRotate = true, privacyMode = false, showActions = true }: IDivCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isMounted, setIsMounted] = useState(false);


    useEffect(() => {
        setIsMounted(true);
    }, []);

    const getProvinceFromAddress = (address?: string) => {
        if (!address) return "BALI";
        const addr = address.toUpperCase();
        if (addr.includes("JAKARTA")) return "DKI JAKARTA";
        if (addr.includes("BALI")) return "BALI";
        if (addr.includes("LOMBOK")) return "NTB";
        if (addr.includes("SURABAYA")) return "JAWA TIMUR";
        if (addr.includes("BANDUNG")) return "JAWA BARAT";
        return "BALI"; // Default
    };

    const maskText = (text: string) => {
        if (!privacyMode) return text;
        if (text.length <= 4) return "xxx";
        return text.slice(0, 4) + "x".repeat(Math.min(text.length - 4, 8));
    };

    const cardData = {
        id_number: data?.id_number || "99710024889100",
        formatted_id: (data?.id_number || "99710024889100").slice(0, 14).replace(/(\d{4})(\d{4})(\d{6})/, "$1-$2-$3"),
        name: data?.name || "SARAH J. WILLIAMS", // User path: "Just Show The Name and Order ID"
        nationality: privacyMode ? "XXXXXXXX" : (data?.nationality || "UNITED KINGDOM").toUpperCase(),
        visa_type: (data?.visa_type || "VERIFIED E-VOA").toUpperCase(),
        expiry_date: privacyMode ? "XX-XX-XXXX" : (data?.expiry_date || "2025-12-01"),
        issue_date: privacyMode ? "XX-XX-XXXX" : (data?.issue_date || "2024-12-01"),
        sponsor: (data?.sponsor || "INDONESIAN VISAS AGENCY").toUpperCase(),
        province: data?.province || getProvinceFromAddress(data?.address),
        photoUrl: privacyMode ? null : (data?.photoUrl || null),
        order_id: data?.order_id || 'NOT_LINKED'
    };

    const displayId = privacyMode 
        ? cardData.formatted_id.slice(0, 5) + "xx-xxxx-xxxx"
        : cardData.formatted_id;

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await downloadIDivDual('idiv-front', 'idiv-back', `IDiv-${cardData.name.replace(/\s+/g, '-')}-${cardData.order_id}`);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        const shareUrl = `${window.location.origin}/id-indonesian-visas?id=${cardData.order_id}`;
        navigator.clipboard.writeText(shareUrl);
        alert("Verification link copied to clipboard! (Masked for privacy)");
    };

    return (
        <Box 
            sx={{ 
                perspective: '1200px', 
                width: { xs: '320px', sm: '420px' }, 
                height: { xs: '200px', sm: '260px' },
                margin: '0 auto',
                cursor: 'pointer'
            }}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                id="idiv-card-container" 
                initial={false}
                animate={{ 
                    rotateY: isFlipped ? 180 : 0,
                    ...(autoRotate && !isFlipped ? { 
                        rotateY: [0, 8, 0, -8, 0],
                        rotateX: [0, 3, 0, -3, 0]
                    } : {})
                }}
                transition={isFlipped ? { duration: 0.6 } : floatTransition}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* FRONT SIDE */}
                <Box
                    id="idiv-front"
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        borderRadius: 0, 
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
                        border: '1px solid rgba(255,255,255,0.6)',
                        display: 'flex',
                        flexDirection: 'column',
                        p: { xs: 2, sm: 2.5 },
                        color: '#1e293b'
                    }}
                >
                    {/* Gloss Overlay */}
                    <Box sx={{ 
                        position: 'absolute', 
                        top: '-50%', 
                        left: '-50%', 
                        width: '200%', 
                        height: '200%', 
                        background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                        pointerEvents: 'none',
                        zIndex: 1
                    }} />

                    {/* Watermark Logo */}
                    <Box sx={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)', 
                        opacity: 0.05, 
                        width: '120px', 
                        height: '120px',
                        zIndex: 1,
                        pointerEvents: 'none'
                    }}>
                         <Box component="img" src="/Favicon.webp" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </Box>

                    {/* Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={1} borderBottom="1px solid rgba(0,0,0,0.1)" pb={0.5} sx={{ zIndex: 2 }}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <Box sx={{ width: 28, height: 18, bgcolor: '#ef4444', position: 'relative', border: '1px solid rgba(0,0,0,0.1)', overflow: 'hidden', borderRadius: '2px' }}>
                                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', bgcolor: 'white' }} />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
                                <Typography variant="caption" fontWeight="900" sx={{ fontSize: '0.65rem', letterSpacing: 1.2, lineHeight: 1, color: '#0369a1', display: 'block' }}>
                                    PROVINSI {cardData.province.toUpperCase()}
                                </Typography>
                                <Typography variant="caption" sx={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: 0.5, color: '#64748b', lineHeight: 1 }}>
                                    INDONESIAN VISAS DIGITAL ID
                                </Typography>
                            </Box>
                        </Box>
                        {/* Removed redundant Logo from Header */}
                    </Box>

                    {/* Content Wrapper to hide on Flip */}
                    <Box sx={{ 
                        flex: 1, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        opacity: isFlipped ? 0 : 1, 
                        transition: 'opacity 0.3s ease',
                        pointerEvents: isFlipped ? 'none' : 'auto'
                    }}>
                        {/* ID Number */}
                        <Typography variant="h6" fontWeight="900" sx={{ fontSize: { xs: '0.85rem', sm: '1.05rem' }, mb: 0.25, letterSpacing: 1.2, color: '#0369a1', zIndex: 2 }}>
                            ID No : {displayId}
                        </Typography>
                        <Typography sx={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 800, mb: 0.75, letterSpacing: 0.8, zIndex: 2 }}>
                            SMART ID: {cardData.order_id || 'NOT_LINKED'}
                        </Typography>

                        {/* Details Container */}
                        <Box display="flex" flex={1} gap={2} sx={{ zIndex: 2, minHeight: 0 }}>
                            {/* Data Fields */}
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography sx={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5 }}>NAMA</Typography>
                                    <Typography sx={{ fontSize: { xs: '0.7rem', sm: '0.85rem' }, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{cardData.name}</Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5 }}>KEWARGANEGARAAN</Typography>
                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1.1 }}>{cardData.nationality}</Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5 }}>JENIS VISA</Typography>
                                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#0369a1', lineHeight: 1.1 }}>{cardData.visa_type}</Typography>
                                </Box>
                                <Box display="flex" gap={2}>
                                    <Box>
                                        <Typography sx={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5 }}>ISSUED</Typography>
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700 }}>{cardData.issue_date}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5 }}>EXPIRES</Typography>
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#ef4444' }}>{cardData.expiry_date}</Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Photo/Avatar Placeholder */}
                            <Box sx={{ 
                                width: { xs: '65px', sm: '85px' }, 
                                height: { xs: '85px', sm: '105px' }, 
                                bgcolor: 'rgba(255,255,255,0.7)', 
                                borderRadius: 1.5, 
                                border: '1px solid rgba(0,0,0,0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                                mt: 0.5
                            }}>
                                {cardData.photoUrl ? (
                                    <Box 
                                        component="img" 
                                        src={cardData.photoUrl} 
                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    />
                                ) : (
                                    <Globe size={40} className="text-blue-200 opacity-60" />
                                )}
                                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '24%', bgcolor: 'rgba(3,105,161,0.15)', backdropFilter: 'blur(2px)', borderTop: '1px solid rgba(255,255,255,0.5)' }} />
                            </Box>

                            {/* DESCRIPTIVE TEXT BENEATH IMAGE */}
                            <Box sx={{ position: 'absolute', right: { xs: '10px', sm: '15px' }, bottom: { xs: '5px', sm: '10px' }, width: { xs: '65px', sm: '85px' }, textAlign: 'center' }}>
                                 <Typography sx={{ fontSize: '0.42rem', fontWeight: 700, lineHeight: 1.1, color: '#0369a1', opacity: 0.8 }}>
                                     Official Smart IDiv by:<br/>indonesianvisas.com
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* BACK SIDE */}
                <Box
                    id="idiv-back"
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        borderRadius: 0, 
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
                        border: '1px solid rgba(0,0,0,0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        p: { xs: 2.5, sm: 3 },
                        transform: 'rotateY(180deg)',
                        color: '#1e293b'
                    }}
                >
                    <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={1.5} borderBottom="1px solid #e2e8f0" pb={1}>
                        <QrIcon size={16} className="text-blue-600" />
                        <Typography variant="caption" fontWeight="900" sx={{ color: '#0369a1', letterSpacing: 1.5, fontSize: '0.65rem' }}>
                            SMART VERIFICATION CODE
                        </Typography>
                    </Box>

                    <Box sx={{ flex: 1, display: 'flex', gap: { xs: 2, sm: 3 }, alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
                        {/* QR Code Section */}
                        <Box sx={{ 
                            p: 1.5, 
                            bgcolor: 'white', 
                            borderRadius: 3, 
                            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            {isMounted && (
                                <QRCodeSVG 
                                    value={`https://indonesianvisas.com/en/verify/${cardData.order_id}`} // Updated to point to verify
                                    size={100}
                                    level="H"
                                    includeMargin={false}
                                    className="sm:w-[120px] sm:h-[120px]"
                                />
                            )}
                            <Typography sx={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: 1, color: '#0369a1', fontFamily: 'monospace' }}>
                                {cardData.order_id}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
                        <Typography sx={{ fontSize: '0.5rem', fontWeight: 800, color: '#64748b', opacity: 0.6, letterSpacing: 2 }}>
                            AUTHENTICITY SECURED VIA IDIV SYSTEM
                        </Typography>
                    </Box>
                </Box>
            </motion.div>

            {/* Action Buttons for Preview */}
            {showActions && (
                <Box sx={{ 
                    mt: 3, 
                    display: 'flex', 
                    gap: 1.5, 
                    justifyContent: 'center',
                    flexDirection: { xs: 'column', sm: 'row' }
                }}>
                    <Button
                        variant="contained"
                        startIcon={<Download size={18} />}
                        onClick={handleDownload}
                        sx={{ 
                            borderRadius: 4, 
                            bgcolor: '#0369a1', 
                            '&:hover': { bgcolor: '#075985' },
                            px: 4,
                            py: 1.2,
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '0.9rem'
                        }}
                    >
                        Download
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Share2 size={18} />}
                        onClick={handleShare}
                        sx={{ 
                            borderRadius: 4, 
                            borderColor: '#0369a1', 
                            color: '#0369a1',
                            '&:hover': { borderColor: '#075985', bgcolor: 'rgba(3,105,161,0.05)' },
                            px: 4,
                            py: 1.2,
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '0.9rem'
                        }}
                    >
                        Share
                    </Button>
                </Box>
            )}
        </Box>
    );
}
