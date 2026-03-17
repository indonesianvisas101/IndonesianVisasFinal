"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ShieldCheck, Flag, Globe, Info, QrCode as QrIcon, Download, Share2, X, ExternalLink, User } from 'lucide-react';
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
        alert("Verification link copied to clipboard!");
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Card Animation Wrapper */}
            <Box 
                sx={{ 
                    perspective: '1200px', 
                    width: '100%',
                    maxWidth: { xs: '340px', sm: '420px' },
                    margin: '0 auto',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 10,
                    // Force Aspect Ratio
                    '&::before': {
                        content: '""',
                        display: 'block',
                        pt: '63.29%', // 1 / 1.58
                    },
                    '& > *': {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                    }
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
                            borderRadius: '16px', // Rounded corners for premium feel
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
                            boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
                            border: '1px solid rgba(255,255,255,0.6)',
                            display: 'flex',
                            flexDirection: 'column',
                            p: { xs: 2, sm: 2.5 },
                            color: '#1e293b',
                            transform: 'translateZ(1px)' // Force layer separation
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
                            <Typography variant="h6" fontWeight="900" sx={{ 
                                fontSize: { xs: '0.75rem', sm: '0.9rem' }, 
                                mb: 0, 
                                letterSpacing: { xs: 0.5, sm: 1 }, 
                                color: '#0369a1', 
                                zIndex: 2,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                ID No : {displayId}
                            </Typography>
                            <Typography sx={{ 
                                fontSize: '0.55rem', 
                                color: '#64748b', 
                                fontWeight: 800, 
                                mb: 0.5, 
                                letterSpacing: 0.5, 
                                zIndex: 2,
                                opacity: 0.8,
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                SMART ID: {cardData.order_id || 'NOT_LINKED'}
                            </Typography>
 
                            {/* Details Container */}
                            <Box display="flex" flex={1} gap={1} sx={{ zIndex: 2, minHeight: 0 }}>
                                {/* Data Fields - Stable Layout */}
                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: { xs: 0.5, sm: 0.8 } }}>
                                    <Box>
                                        <Typography sx={{ fontSize: '0.5rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5 }}>NAMA</Typography>
                                        <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.8rem' }, fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{cardData.name}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '0.5rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5 }}>KEWARGANEGARAAN</Typography>
                                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, lineHeight: 1 }}>{cardData.nationality}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '0.5rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5 }}>JENIS VISA</Typography>
                                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369a1', lineHeight: 1 }}>{cardData.visa_type}</Typography>
                                    </Box>
                                    <Box display="flex" gap={2}>
                                        <Box>
                                            <Typography sx={{ fontSize: '0.5rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5 }}>ISSUED</Typography>
                                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700 }}>{cardData.issue_date}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: '0.5rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5 }}>EXPIRES</Typography>
                                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#ef4444' }}>{cardData.expiry_date}</Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                 {/* Photo & Beneath Text Column */}
                                 <Box sx={{ 
                                     display: 'flex', 
                                     flexDirection: 'column', 
                                     alignItems: 'center',
                                     width: { xs: '65px', sm: '85px' },
                                     gap: 0.2,
                                     mt: 0.5,
                                     position: 'relative'
                                 }}>
                                     {/* Photo/Avatar Placeholder */}
                                     <Box sx={{ 
                                         width: '100%', 
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
                                     }}>
                                         {cardData.photoUrl ? (
                                             <Box 
                                                 component="img" 
                                                 src={cardData.photoUrl} 
                                                 sx={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                 onError={(e) => {
                                                     (e.target as HTMLImageElement).src = "https://indonesianvisas.com/default-avatar.png";
                                                 }}
                                             />
                                         ) : (
                                             <User size={40} className="text-blue-200 opacity-60" />
                                         )}
                                         <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '24%', bgcolor: 'rgba(3,105,161,0.15)', backdropFilter: 'blur(2px)', borderTop: '1px solid rgba(255,255,255,0.5)' }} />
                                     </Box>

                                     {/* DESCRIPTIVE TEXT BENEATH IMAGE */}
                                     <Box sx={{ textAlign: 'center', width: '100%', mt: 1, ml: -0.2 }}>
                                         <Typography sx={{ fontSize: '0.4rem', fontWeight: 800, lineHeight: 1.1, color: '#0369a1', opacity: 0.9 }}>
                                             Smart IDiv by:<br/>indonesianvisas.com
                                         </Typography>
                                     </Box>
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
                            borderRadius: '16px', 
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                            boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
                            border: '1px solid rgba(0,0,0,0.08)',
                            display: 'flex',
                            flexDirection: 'column',
                            p: { xs: 2.5, sm: 3 },
                            // For browser display, it needs to be rotated
                            transform: 'rotateY(180deg) translateZ(1px)',
                            // BUT critical for html-to-image/capture: when we grab ID "idiv-back", 
                            // we want the content to NOT be mirrored.
                            // We use a CSS class to reset transform during capture if needed, 
                            // but usually html-to-image captures the element as is.
                            // If we capture it while it's rotateY(180), it's mirrored.
                            // Better Hack: wrap the INNER content in another box that doesn't rotate, 
                            // or just ensure the capture doesn't include the parent's mirror.
                            '&.capture-mode': {
                                transform: 'none',
                                position: 'relative',
                            },
                            color: '#1e293b'
                        }}
                    >
                        <Box sx={{ 
                            width: '100%', 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            // If the parent is rotateY(180), this child will be mirrored.
                            // We need to un-mirror it for the USER UI, but NOT for capture.
                            // Actually, the standard way is to have a hidden un-mirrored version for capture.
                        }}>
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
                                            value={`${window.location.origin}/verify/${cardData.order_id}`} 
                                            size={isMounted && window.innerWidth < 640 ? 80 : 100}
                                            level="H"
                                            includeMargin={false}
                                        />
                                    )}
                                    {/* QR Code fallback UI removed - redundant here */}
                                    <Typography sx={{ fontSize: '0.55rem', fontWeight: 900, letterSpacing: 1, color: '#0369a1', fontFamily: 'monospace', mt: 0.5 }}>
                                        {cardData.order_id}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
                                <Typography sx={{ fontSize: '0.45rem', fontWeight: 800, color: '#64748b', opacity: 0.6, letterSpacing: 1.5, textAlign: 'center' }}>
                                    OFFICIAL SPONSOR ID • SECURED VIA IDIV SYSTEM • INDONESIANVISAS.COM
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </motion.div>
            </Box>
            
            {/* Action Buttons for Preview */}
            {showActions && (
                <Box sx={{ 
                    mt: { xs: 8, sm: 6 }, // Increased margin since it flows naturally now
                    display: 'flex', 
                    gap: 1.5, 
                    justifyContent: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    position: 'relative',
                    zIndex: 20
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
                            px: 4, py: 1.2, fontWeight: 'bold', textTransform: 'none', fontSize: '0.9rem'
                        }}
                    >
                        Share
                    </Button>
                </Box>
            )}
        </Box>
    );
}
