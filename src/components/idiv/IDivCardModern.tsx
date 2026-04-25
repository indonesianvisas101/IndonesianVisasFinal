"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ShieldCheck, Flag, Globe, Info, QrCode as QrIcon, Download, Share2, X, ExternalLink, User, Nfc, Barcode } from 'lucide-react';
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
        passport_number?: string;
        name?: string;
        birth_place_date?: string;
        gender?: string;
        nationality?: string;
        visa_type?: string;
        occupation?: string;
        expiry_date?: string;
        issue_date?: string;
        sponsor?: string;
        province?: string;
        photoUrl?: string;
        address?: string;
        order_id?: string;
        isUnlimited?: boolean;
    };
    mode?: 'IDIV' | 'IDG' | 'SMART';
    variant?: 'purple' | 'indigo' | 'gold';
    autoRotate?: boolean;
    onDownload?: () => void;
    privacyMode?: boolean;
    showActions?: boolean;
    showDownload?: boolean;
    shareUrl?: string;
}

export default function IDivCardModern({ 
    data, 
    mode = 'IDIV',
    variant = 'purple',
    autoRotate = true, 
    privacyMode = false, 
    showActions = true,
    showDownload = true,
    shareUrl
}: IDivCardProps) {
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
        if (addr.includes("MANADO")) return "SULAWESI UTARA";
        return "BALI"; // Default
    };

    const cardData = {
        id_number: data?.id_number || "99710024889100",
        passport_number: privacyMode ? "XXXXXXX" : (data?.passport_number || "A1234567"),
        formatted_id: (data?.id_number || "99710024889100").slice(0, 14).replace(/(\d{4})(\d{4})(\d{6})/, "$1-$2-$3"),
        name: data?.name || "SARAH J. WILLIAMS", 
        birth_place_date: privacyMode ? "XXXX, XX-XX-XXXX" : (data?.birth_place_date || "LONDON, 01-01-1990"),
        gender: data?.gender || "PEREMPUAN",
        occupation: data?.occupation || "INVESTOR",
        nationality: privacyMode ? "XXXXXXXX" : (data?.nationality || "UNITED KINGDOM").toUpperCase(),
        visa_type: (data?.visa_type || "VERIFIED E-VOA").toUpperCase(),
        expiry_date: privacyMode ? "XX-XX-XXXX" : (data?.expiry_date || "2024-12-01"),
        issue_date: privacyMode ? "XX-XX-XXXX" : (data?.issue_date || "2025-12-01"),
        sponsor: (data?.sponsor || "INDONESIAN VISAS AGENCY").toUpperCase(),
        province: data?.province || getProvinceFromAddress(data?.address || data?.id_number),
        photoUrl: data?.photoUrl || null,
        address: data?.address || "Jl. Sunset Road No.7, Kuta, Bali Indonesia.",
        order_id: data?.order_id || 'NOT_LINKED',
        isUnlimited: data?.isUnlimited || (data?.visa_type?.toUpperCase().includes('GCI') || data?.visa_type?.toUpperCase().includes('UNLIMITED') || !data?.expiry_date)
    };

    // Standardize IDs for display
    const displayId = privacyMode 
        ? cardData.formatted_id.slice(0, 5) + "xx-xxxx-xxxx"
        : cardData.formatted_id;
    
    // Truncate Order ID for Header Display to match "perfect" Sample
    const displayOrderId = cardData.order_id && cardData.order_id.length > 12 
        ? cardData.order_id.substring(0, 8) 
        : cardData.order_id;

    const isIDG = mode === 'IDG';
    const isSmart = mode === 'SMART';

    const colorSchemes = {
        purple: {
            header: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
            body: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
            accent: '#4c1d95',
            secondary: '#7c3aed'
        },
        indigo: {
            header: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
            body: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
            accent: '#312e81',
            secondary: '#4338ca'
        },
        gold: {
            header: 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
            body: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            accent: '#78350f',
            secondary: '#b45309',
            infinity: '#d97706'
        }
    };

    const currentColors = isIDG ? colorSchemes[variant] : {
        header: 'transparent',
        body: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
        accent: '#0369a1',
        secondary: '#64748b'
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await downloadIDivDual('idiv-front', 'idiv-back', `${isSmart ? 'SMART' : isIDG ? 'IDg' : 'IDiv'}-${cardData.name.replace(/\s+/g, '-')}-${cardData.order_id}`);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        const urlToShare = shareUrl || `${window.location.origin}/verify/${cardData.order_id}`;
        navigator.clipboard.writeText(urlToShare);
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
                    height: { xs: '215px', sm: '265px' },
                    aspectRatio: '1.58 / 1',
                    margin: '0 auto',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 10
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
                            borderRadius: '16px', 
                            overflow: 'hidden',
                            background: currentColors.body,
                            boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
                            border: '1px solid rgba(255,255,255,0.6)',
                            display: 'flex',
                            flexDirection: 'column',
                            p: { xs: 2.5, sm: 3 },
                            color: '#1e293b',
                            transform: 'translateZ(1px)' 
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
                        <Box 
                            display="flex" 
                            justifyContent="space-between" 
                            alignItems="start" 
                            mb={1} 
                            borderBottom="1px solid rgba(0,0,0,0.1)" 
                            pb={0.5} 
                            sx={{ 
                                zIndex: 2,
                                ...(isIDG ? {
                                    background: currentColors.header,
                                    mx: -3,
                                    px: 3,
                                    mt: -3,
                                    pt: 3,
                                    mb: 2,
                                    borderRadius: '16px 16px 0 0',
                                    borderBottom: 'none'
                                } : {})
                            }}
                        >
                            {/* Left Side: Flag & Province */}
                            <Box display="flex" alignItems="flex-start" gap={1}>
                                <Box sx={{ 
                                    width: 28, 
                                    height: 18, 
                                    bgcolor: '#ef4444', 
                                    position: 'relative', 
                                    border: '1px solid rgba(0,0,0,0.1)', 
                                    overflow: 'hidden', 
                                    borderRadius: '2px',
                                    mt: 0.2 // Align with top of text
                                }}>
                                    <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', bgcolor: 'white' }} />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2, flex: 1, minWidth: 0, textAlign: 'left' }}>
                                    <Typography variant="caption" fontWeight="900" sx={{ 
                                        fontSize: '0.65rem', 
                                        letterSpacing: 1.2, 
                                        lineHeight: 1, 
                                        color: isIDG ? '#fff' : '#0369a1', 
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        textAlign: 'left'
                                    }}>
                                        {isIDG ? 'INDONESIAN GUIDE' : `PROVINSI ${cardData.province.toUpperCase()}`}
                                    </Typography>
                                    <Typography variant="caption" sx={{ 
                                        fontSize: '0.55rem', 
                                        fontWeight: 600, 
                                        letterSpacing: 0.5, 
                                        color: isIDG ? 'rgba(255,255,255,0.8)' : '#64748b', 
                                        lineHeight: 1, 
                                        whiteSpace: 'nowrap', 
                                        textAlign: 'left' 
                                    }}>
                                        {isIDG ? 'OFFICIAL DIGITAL GUIDE ID' : isSmart ? 'SMART SYSTEM IDENTITY' : 'INDONESIAN VISAS DIGITAL ID'}
                                    </Typography>
                                </Box>
                            </Box>
 
                            {/* Right Side: SMART ID Only */}
                            <Box sx={{ textAlign: 'right', pt: 0.2, flexShrink: 0, pl: 1 }}>
                                <Typography sx={{ 
                                    fontSize: '0.55rem', 
                                    color: isIDG ? '#fff' : '#64748b', 
                                    fontWeight: 800, 
                                    lineHeight: 1,
                                    opacity: 0.8,
                                    letterSpacing: 0.5,
                                    whiteSpace: 'nowrap'
                                }}>
                                    REG NO: {displayOrderId}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Content Wrapper to hide on Flip */}
                        <Box sx={{ 
                            flex: 1, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'flex-start',
                            textAlign: 'left',
                            opacity: isFlipped ? 0 : 1, 
                            transition: 'opacity 0.3s ease',
                            pointerEvents: isFlipped ? 'none' : 'auto',
                            pt: 0.5
                        }}>
                            {isSmart ? (
                                <Box sx={{ width: '100%', mt: 0, px: 0.5 }}>
                                    <Box sx={{ mb: 0.5 }}>
                                        <Typography variant="h6" fontWeight="900" sx={{ fontSize: { xs: '0.9rem', sm: '1.05rem' }, letterSpacing: 1.5, color: '#0f172a', whiteSpace: 'nowrap', lineHeight: 1 }}>
                                            ID No &nbsp;&nbsp;&nbsp;&nbsp;: {displayId}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" gap={1}>
                                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            {[
                                                { label: 'Nama', value: cardData.name },
                                                { label: 'No Passport', value: cardData.passport_number },
                                                { label: 'Tempat/Tgl Lahir', value: cardData.birth_place_date },
                                                { label: 'Jenis Kelamin', value: cardData.gender },
                                                { label: 'Alamat', value: cardData.address, isAddress: true },
                                                { label: 'Pekerjaan', value: cardData.occupation },
                                                { label: 'Kewarganegaraan', value: cardData.nationality },
                                                { label: 'Jenis Visa', value: cardData.visa_type },
                                            ].map((item, idx) => (
                                                <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                    <Typography sx={{ width: '85px', fontSize: '0.5rem', fontWeight: 700, color: '#334155' }}>
                                                        {item.label}
                                                    </Typography>
                                                    <Typography sx={{ width: '10px', fontSize: '0.5rem', fontWeight: 700, color: '#334155' }}>:</Typography>
                                                    <Typography sx={{ 
                                                        flex: 1, 
                                                        fontSize: '0.55rem', 
                                                        fontWeight: 800, 
                                                        color: '#0f172a',
                                                        lineHeight: 1.1,
                                                        ...(item.isAddress ? {
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        } : {
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        })
                                                    }}>
                                                        {item.value}
                                                    </Typography>
                                                </Box>
                                            ))}

                                            {/* HORIZONTAL ISSUED / EXPIRES */}
                                            <Box display="flex" gap={3} sx={{ mt: 0.2 }}>
                                                <Box>
                                                    <Typography sx={{ fontSize: '0.45rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5, lineHeight: 1 }}>ISSUED</Typography>
                                                    <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{cardData.issue_date}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ fontSize: '0.45rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5, lineHeight: 1 }}>EXPIRES</Typography>
                                                    {cardData.isUnlimited ? (
                                                        <Box display="flex" alignItems="center" gap={0.3}>
                                                            <Typography sx={{ fontSize: '0.6rem', fontWeight: 900, color: '#d97706', lineHeight: 1.1 }}>LIFETIME ACCESS</Typography>
                                                            <Globe size={9} className="text-amber-600 animate-pulse" />
                                                        </Box>
                                                    ) : (
                                                        <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: '#ef4444', lineHeight: 1.1 }}>{cardData.expiry_date}</Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                        
                                        <Box sx={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center',
                                            width: { xs: '75px', sm: '85px' },
                                            mt: 2.5
                                        }}>
                                            <Box sx={{ 
                                                width: '100%', 
                                                height: { xs: '95px', sm: '105px' }, 
                                                bgcolor: 'rgba(255,255,255,0.7)', 
                                                borderRadius: 1, 
                                                border: '1px solid rgba(0,0,0,0.1)',
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
                                                    <User size={30} className="text-blue-200 opacity-60" />
                                                )}
                                                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '20%', bgcolor: 'rgba(3,105,161,0.15)', backdropFilter: 'blur(2px)', borderTop: '1px solid rgba(255,255,255,0.5)' }} />
                                            </Box>
                                            <Box sx={{ textAlign: 'center', mt: 1.5, width: '100%' }}>
                                                <Typography sx={{ fontSize: '0.45rem', fontWeight: 800, lineHeight: 1.1, color: '#0f172a', opacity: 0.9 }}>
                                                    Smart ID by<br/>indonesianvisas.com
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            ) : (
                                <>
                                    {/* ID No Restored to Body */}
                                    <Typography variant="h6" fontWeight="900" sx={{ 
                                        fontSize: { xs: '0.8rem', sm: '0.95rem' }, 
                                        mb: 0.5, 
                                        mt: 0.2,
                                        pl: 0.8,
                                        textAlign: 'left',
                                        letterSpacing: { xs: 0.5, sm: 1.5 }, 
                                        color: currentColors.accent, 
                                        zIndex: 2,
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {isIDG ? 'GUIDE NO' : 'ID No'} : {displayId}
                                    </Typography>

                                    {/* Details Container */}
                                    <Box display="flex" flex={1} gap={1} sx={{ zIndex: 2, minHeight: 0, width: '100%' }}>
                                        {/* Data Fields */}
                                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.6, justifyContent: 'center', pl: 0.8, textAlign: 'left', alignItems: 'flex-start', mt: -1 }}>
                                            <Box>
                                                <Typography sx={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5, lineHeight: 1 }}>NAMA</Typography>
                                                <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.8rem' }, fontWeight: 800, color: '#0f172a', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cardData.name}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5, lineHeight: 1 }}>NO PASSPORT</Typography>
                                                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cardData.passport_number}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5, lineHeight: 1 }}>KEWARGANEGARAAN</Typography>
                                                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cardData.nationality}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5, lineHeight: 1 }}>{isIDG ? 'GUIDE TYPE' : 'JENIS VISA'}</Typography>
                                                <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: currentColors.secondary, lineHeight: 1.1 }}>{isIDG ? 'VISITOR GUIDE 24/7' : cardData.visa_type}</Typography>
                                            </Box>
                                            
                                            {/* INDONESIAN ADDRESS */}
                                            <Box>
                                                <Typography sx={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5, lineHeight: 1 }}>ALAMAT</Typography>
                                                <Typography sx={{ 
                                                    fontSize: '0.55rem', 
                                                    fontWeight: 800, 
                                                    color: '#1e293b', 
                                                    lineHeight: 1.1,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {cardData.address}
                                                </Typography>
                                            </Box>

                                            <Box display="flex" gap={2.5} sx={{ minHeight: '1.2rem' }}>
                                                <Box>
                                                    <Typography sx={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5, lineHeight: 1 }}>ISSUED</Typography>
                                                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, lineHeight: 1.1 }}>{cardData.issue_date}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5, lineHeight: 1 }}>EXPIRES</Typography>
                                                    {cardData.isUnlimited ? (
                                                        <Box display="flex" alignItems="center" gap={0.3}>
                                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 900, color: '#d97706', lineHeight: 1.1 }}>LIFETIME ACCESS</Typography>
                                                            <Globe size={10} className="text-amber-600 animate-pulse" />
                                                        </Box>
                                                    ) : (
                                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#ef4444', lineHeight: 1.1 }}>{cardData.expiry_date}</Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* Photo & Beneath Text Column */}
                                        <Box sx={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center',
                                            width: { xs: '70px', sm: '90px' },
                                            gap: 0.5,
                                            mt: 0.5,
                                            position: 'relative'
                                        }}>
                                            {/* Photo/Avatar Placeholder */}
                                            <Box sx={{ 
                                                width: '100%', 
                                                height: { xs: '90px', sm: '110px' }, 
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
                                                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '20%', bgcolor: 'rgba(3,105,161,0.15)', backdropFilter: 'blur(2px)', borderTop: '1px solid rgba(255,255,255,0.5)' }} />
                                            </Box>

                                            {/* DESCRIPTIVE TEXT BENEATH IMAGE */}
                                            <Box sx={{ textAlign: 'center', width: '100%', mt: 0.5 }}>
                                                <Typography sx={{ fontSize: '0.45rem', fontWeight: 800, lineHeight: 1.1, color: currentColors.accent, opacity: 0.9 }}>
                                                    {isIDG ? 'Smart Guide ID by:' : 'Smart IDiv by:'}<br/>indonesianvisas.com
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </>
                            )}
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
                            transform: 'rotateY(180deg) translateZ(1px)',
                            color: '#1e293b'
                        }}
                    >
                        <Box sx={{ 
                            width: '100%', 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column'
                        }}>
                            <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={1.5} borderBottom="1px solid #e2e8f0" pb={1}>
                                <QrIcon size={16} className={isIDG ? '' : 'text-blue-600'} color={currentColors.accent} />
                                <Typography variant="caption" fontWeight="900" sx={{ color: currentColors.accent, letterSpacing: 1.5, fontSize: '0.65rem' }}>
                                    SMART VERIFICATION CODE
                                </Typography>
                            </Box>

                            <Box sx={{ flex: 1, display: 'flex', gap: { xs: 1, sm: 2 }, alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
                                {isSmart && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                        {/* NFC Icon with ping animation */}
                                        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1', mt: 1 }}>
                                            <Nfc size={36} strokeWidth={1.5} />
                                            <Box sx={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '2px solid rgba(3,105,161,0.4)', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                                            <style>
                                                {`
                                                    @keyframes ping {
                                                        75%, 100% { transform: scale(1.8); opacity: 0; }
                                                    }
                                                `}
                                            </style>
                                        </Box>
                                        <Typography sx={{ fontSize: '0.45rem', fontWeight: 800, color: '#64748b', mt: -0.5 }}>CONTACTLESS</Typography>
                                        
                                        {/* Barcode Mock */}
                                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Barcode size={40} strokeWidth={1} color="#1e293b" />
                                            <Typography sx={{ fontSize: '0.45rem', fontWeight: 800, letterSpacing: 1.5, fontFamily: 'monospace', color: '#1e293b', mt: -0.5 }}>
                                                {cardData.passport_number}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                                
                                {/* QR Code Section */}
                                <Box sx={{ 
                                    p: { xs: 1, sm: 1.5 }, 
                                    bgcolor: 'white', 
                                    borderRadius: 3, 
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: { xs: 0.2, sm: 1 }
                                }}>
                                    {isMounted ? (
                                        <QRCodeSVG 
                                            value={`${window.location.origin}/verify/${cardData.order_id}`} 
                                            size={typeof window !== 'undefined' && window.innerWidth < 640 ? (isSmart ? 65 : 75) : (isSmart ? 85 : 100)}
                                            level="H"
                                            includeMargin={false}
                                        />
                                    ) : (
                                        <Box sx={{ width: isSmart ? 85 : 100, height: isSmart ? 85 : 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                                    )}
                                    <Typography sx={{ fontSize: '0.5rem', fontWeight: 900, letterSpacing: 0.5, color: currentColors.accent, fontFamily: 'monospace', mt: 0.2 }}>
                                        {cardData.order_id}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
                                <Typography sx={{ fontSize: '0.45rem', fontWeight: 800, color: '#64748b', opacity: 0.6, letterSpacing: 1.5, textAlign: 'center' }}>
                                    {isIDG ? 'OFFICIAL GUIDE ID • SECURED VIA IDg SYSTEM • INDONESIANVISAS.COM' : 'OFFICIAL SPONSOR ID • SECURED VIA IDIV SYSTEM • INDONESIANVISAS.COM'}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </motion.div>
            </Box>
            
            {/* Action Buttons for Preview */}
            {showActions && (
                <Box sx={{ 
                    mt: { xs: 8, sm: 6 }, 
                    display: 'flex', 
                    gap: 1.5, 
                    justifyContent: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    position: 'relative',
                    zIndex: 20
                }}>
                    {showDownload && (
                        <Button
                            variant="contained"
                            startIcon={<Download size={18} />}
                            onClick={handleDownload}
                            sx={{ 
                                borderRadius: 4, 
                                bgcolor: isIDG ? currentColors.secondary : '#0369a1', 
                                '&:hover': { bgcolor: isIDG ? currentColors.accent : '#075985' },
                                px: 4,
                                py: 1.2,
                                fontWeight: 'bold',
                                textTransform: 'none',
                                fontSize: '0.9rem'
                            }}
                        >
                            Download {isIDG ? 'IDg' : 'IDiv'}
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        startIcon={<Share2 size={18} />}
                        onClick={handleShare}
                        sx={{ 
                            borderRadius: 4, 
                            borderColor: isIDG ? currentColors.secondary : '#0369a1', 
                            color: isIDG ? currentColors.secondary : '#0369a1',
                            '&:hover': { borderColor: isIDG ? currentColors.accent : '#075985', bgcolor: isIDG ? 'rgba(124,58,237,0.05)' : 'rgba(3,105,161,0.05)' },
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
