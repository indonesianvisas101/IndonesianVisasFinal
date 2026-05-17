"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ShieldCheck, Flag, Globe, Info, QrCode as QrIcon, Download, Share2, X, ExternalLink, User, Nfc } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { downloadIDivDual } from '@/utils/idivDownloadTools';
import { generateIDNumber, formatIDNumber } from '@/utils/idNumberGenerator';
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
    idPrefix?: string;
    hasNFC?: boolean;
    isSample?: boolean;
}

export default function IDivCardModern({
    data,
    mode = 'IDIV',
    variant = 'purple',
    autoRotate = true,
    privacyMode = false,
    showActions = true,
    showDownload = true,
    shareUrl,
    idPrefix = '',
    hasNFC = false,
    isSample = false
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

    const parseAddress = (raw: string | null | undefined) => {
        const fb = { street: "", birthPlaceDate: "", gender: "", occupation: "" };
        if (!raw) return fb;
        if (!raw.trim().startsWith('{')) return { ...fb, street: raw };
        try {
            const p = JSON.parse(raw);
            const getVal = (keys: string[]) => {
                for (const k of keys) {
                    if (p[k] !== undefined) return p[k];
                    const kLower = k.toLowerCase();
                    const kUpper = k.toUpperCase();
                    if (p[kLower] !== undefined) return p[kLower];
                    if (p[kUpper] !== undefined) return p[kUpper];
                }
                return "";
            };
            return {
                street: getVal(['street', 'STREET', 'address', 'Alamat']),
                birthPlaceDate: getVal(['birthPlaceDate', 'BIRTHPLACEDATE', 'dob', 'DOB']),
                gender: getVal(['gender', 'GENDER', 'Jenis Kelamin']),
                occupation: getVal(['occupation', 'OCCUPATION', 'Pekerjaan']),
            };
        } catch { return { ...fb, street: raw }; }
    };

    const addrData = parseAddress(data?.address);
    const isJsonAddress = data?.address?.trim().startsWith('{');

    // Sanitization: Ensure Passport Number doesn't show URLs
    const rawPassport = data?.passport_number || "";
    const sanitizedPassport = (rawPassport.startsWith('http') || !rawPassport) ? "Nihil" : rawPassport;

    // v12.1 — Generate structured 16-digit ID from nationality + issue date + DOB
    // Only generate if existing id_number looks like a UUID (contains '-') or is absent
    const rawIdNumber = data?.id_number || "";
    const isUUID = rawIdNumber.includes('-') || rawIdNumber.length > 16 || !/^\d+$/.test(rawIdNumber);
    const computedIdNumber = isUUID
        ? generateIDNumber(
            data?.nationality || "Unknown",
            data?.issue_date || "",
            addrData.birthPlaceDate || data?.birth_place_date || "",
            undefined,
            "01",
            // Seed: order_id + name ensures same ID every render for same person
            (data?.order_id || "") + (data?.name || "")
          )
        : rawIdNumber;

    const cardData = {
        id_number: computedIdNumber,
        passport_number: privacyMode ? "• • • • • • •" : sanitizedPassport,
        formatted_id: formatIDNumber(computedIdNumber),
        name: privacyMode ? "SECURED HOLDER" : (data?.name || "SARAH J. WILLIAMS"),
        birth_place_date: privacyMode ? "XXXX, XX-XX-XXXX" : (addrData.birthPlaceDate || data?.birth_place_date || "LONDON, 01-01-1990"),
        gender: privacyMode ? "XXXXXX" : (addrData.gender || data?.gender || "PEREMPUAN"),
        occupation: privacyMode ? "XXXXXX" : (addrData.occupation || data?.occupation || "INVESTOR"),
        nationality: privacyMode ? "XXXXXXXX" : (data?.nationality || "UNITED KINGDOM").toUpperCase(),
        visa_type: (data?.visa_type || "VERIFIED E-VOA").toUpperCase(),
        expiry_date: privacyMode ? "XX-XX-XXXX" : (data?.expiry_date || "2024-12-01"),
        issue_date: privacyMode ? "XX-XX-XXXX" : (data?.issue_date || "2025-12-01"),
        sponsor: (data?.sponsor || "INDONESIAN VISAS AGENCY").toUpperCase(),
        province: data?.province || getProvinceFromAddress(addrData.street || data?.address || data?.id_number),
        photoUrl: privacyMode ? null : (data?.photoUrl || null),
        address: privacyMode ? "••••••••••••••••••••••••" : (isJsonAddress ? (addrData.street || "") : (data?.address || "Jl. Sunset Road No.7, Kuta, Bali Indonesia.")),
        order_id: data?.order_id || 'NOT_LINKED',
        isUnlimited: data?.isUnlimited || (data?.visa_type?.toUpperCase().includes('GCI') || data?.visa_type?.toUpperCase().includes('UNLIMITED') || !data?.expiry_date)
    };

    // Standardize IDs for display
    const displayId = privacyMode
        ? cardData.formatted_id.slice(0, 7) + "xx-xxxxxxxx"
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
        await downloadIDivDual(
            idPrefix ? `${idPrefix}-idiv-front` : 'idiv-front', 
            idPrefix ? `${idPrefix}-idiv-back` : 'idiv-back', 
            `${isSmart ? 'SMART' : isIDG ? 'IDg' : 'IDiv'}-${cardData.name.replace(/\s+/g, '-')}-${cardData.order_id}`
        );
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        const urlToShare = shareUrl || `${window.location.origin}/verify/${cardData.order_id}`;
        navigator.clipboard.writeText(urlToShare);
        alert("Verification link copied to clipboard!");
    };

    // Native card dimensions (Reduced by 20% for a more elegant look)
    const CARD_W = isSmart ? 400 : 384;
    const CARD_H = Math.round(CARD_W / 1.50);

    // ResizeObserver: compute scale so card always fits its container
    const wrapperRef = useRef<HTMLDivElement>(null);
    // Start with window-based estimate to avoid flash at full size on mobile
    const [cardScale, setCardScale] = useState(() => {
        if (typeof window === 'undefined') return 1;
        return Math.min(1, window.innerWidth / CARD_W);
    });

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const obs = new ResizeObserver(([entry]) => {
            const w = entry.contentRect.width;
            setCardScale(Math.min(1, w / CARD_W));
        });
        obs.observe(el);
        return () => obs.disconnect();
    }, [CARD_W]);

    if (!isMounted) return (
        <Box sx={{ width: '100%', maxWidth: `${CARD_W}px`, margin: '0 auto', height: `${CARD_H}px`, bgcolor: 'transparent' }} />
    );

    return (
        <Box sx={{ width: '100%' }} suppressHydrationWarning>
            {/* Outer container — measures available width */}
            <Box
                ref={wrapperRef}
                sx={{
                    width: '100%',
                    maxWidth: `${CARD_W}px`,
                    margin: '0 auto',
                    height: `${Math.round(CARD_H * cardScale)}px`,
                    position: 'relative',
                    perspective: '1200px',
                    cursor: 'pointer',
                    zIndex: 10,
                }}
                onClick={() => setIsFlipped(!isFlipped)}
                suppressHydrationWarning
            >
                {/* Inner box at native size, scaled via JS-computed transform */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: `${CARD_W}px`,
                        height: `${CARD_H}px`,
                        transformOrigin: 'top left',
                    }}
                    style={{ transform: `scale(${cardScale})` }}
                    suppressHydrationWarning
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
                            width: `${CARD_W}px`,
                            height: `${CARD_H}px`,
                            position: 'relative',
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        {/* FRONT SIDE */}
                        <Box
                            id={idPrefix ? `${idPrefix}-idiv-front` : 'idiv-front'}
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                zIndex: 1,
                                width: `${CARD_W}px`,
                                height: `${CARD_H}px`,
                                backfaceVisibility: 'hidden',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                background: currentColors.body,
                                boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
                                border: '1px solid rgba(255,255,255,0.6)',
                                display: 'flex',
                                flexDirection: 'column',
                                p: 3,
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
                                opacity: 0.04,
                                width: '160px',
                                height: '160px',
                                zIndex: 0,
                                pointerEvents: 'none'
                            }}>
                                <Box component="img" src="/Favicon.webp" crossOrigin="anonymous" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
                                        REG NO: {displayOrderId.toUpperCase()}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Content Wrapper */}
                            <Box sx={{
                                position: 'relative',
                                zIndex: 10,
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                textAlign: 'left',
                                opacity: isFlipped ? 0 : 1,
                                transition: 'opacity 0.3s ease',
                                pointerEvents: isFlipped ? 'none' : 'auto',
                                pt: 0.5,
                                minHeight: 0
                            }}>
                                {isSmart ? (
                                    <Box sx={{ width: '100%', mt: 0, px: 0.5 }}>
                                        <Box sx={{ mb: 0.8 }} suppressHydrationWarning>
                                            <Typography variant="h6" fontWeight="900" sx={{ fontSize: '0.95rem', letterSpacing: 1.2, color: '#0f172a', whiteSpace: 'nowrap', lineHeight: 1 }} suppressHydrationWarning>
                                                ID No <Box component="span" sx={{ ml: 3 }}>: {displayId}</Box>
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
                                                        <Typography sx={{ width: '80px', fontSize: '0.5rem', fontWeight: 700, color: '#334155' }}>
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
                                                width: '88px',
                                                mt: 1.5
                                            }}>
                                                <Box sx={{
                                                    width: '100%',
                                                    height: '110px',
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
                                                            crossOrigin="anonymous"
                                                            sx={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                objectPosition: 'center top'
                                                            }}
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
                                                        Smart ID by<br />indonesianvisas.com
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                ) : (
                                    <>
                                        {/* ID No Restored to Body */}
                                        <Typography variant="h6" fontWeight="900" sx={{
                                            fontSize: '0.8rem',
                                            mb: 0.4,
                                            mt: 0.1,
                                            pl: 0.8,
                                            textAlign: 'left',
                                            letterSpacing: 1.0,
                                            color: currentColors.accent,
                                            zIndex: 2,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }} suppressHydrationWarning>
                                            {isIDG ? 'GUIDE NO' : 'ID No'} : {displayId}
                                        </Typography>

                                        {/* Details Container */}
                                        <Box display="flex" flex={1} gap={1} sx={{ zIndex: 2, minHeight: 0, width: '100%', px: 0.5 }}>
                                            {/* Data Fields */}
                                            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.8, justifyContent: 'center', pl: 0.5, textAlign: 'left', alignItems: 'flex-start' }}>
                                                <Box sx={{ width: '100%', minWidth: 0 }}>
                                                    <Typography sx={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5, lineHeight: 1 }}>NAMA</Typography>
                                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cardData.name}</Typography>
                                                </Box>
                                                <Box sx={{ width: '100%', minWidth: 0 }}>
                                                    <Typography sx={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5, lineHeight: 1 }}>NO PASSPORT</Typography>
                                                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cardData.passport_number}</Typography>
                                                </Box>
                                                <Box sx={{ width: '100%', minWidth: 0 }}>
                                                    <Typography sx={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5, lineHeight: 1 }}>KEWARGANEGARAAN</Typography>
                                                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cardData.nationality}</Typography>
                                                </Box>
                                                <Box sx={{ width: '100%', minWidth: 0 }}>
                                                    <Typography sx={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5, lineHeight: 1 }}>{isIDG ? 'GUIDE TYPE' : 'JENIS VISA'}</Typography>
                                                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: currentColors.secondary, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{isIDG ? 'VISITOR GUIDE 24/7' : cardData.visa_type}</Typography>
                                                </Box>

                                                {/* INDONESIAN ADDRESS */}
                                                <Box>
                                                    <Typography sx={{ fontSize: '0.5rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5, lineHeight: 1 }}>ALAMAT</Typography>
                                                    <Typography sx={{
                                                        fontSize: '0.5rem',
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

                                                <Box display="flex" gap={2} sx={{ minHeight: '1rem', mt: 0.6 }}>
                                                    <Box>
                                                        <Typography sx={{ fontSize: '0.45rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5, lineHeight: 1 }}>ISSUED</Typography>
                                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, lineHeight: 1 }}>{cardData.issue_date}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography sx={{ fontSize: '0.45rem', color: '#64748b', fontWeight: 700, letterSpacing: 0.5, lineHeight: 1 }}>EXPIRES</Typography>
                                                        {cardData.isUnlimited ? (
                                                            <Box display="flex" alignItems="center" gap={0.3}>
                                                                <Typography sx={{ fontSize: '0.7rem', fontWeight: 900, color: '#d97706', lineHeight: 1 }}>LIFETIME ACCESS</Typography>
                                                                <Globe size={8} className="text-amber-600 animate-pulse" />
                                                            </Box>
                                                        ) : (
                                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#ef4444', lineHeight: 1 }}>{cardData.expiry_date}</Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>

                                            {/* Photo & Beneath Text Column */}
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                width: '72px',
                                                gap: 0.4,
                                                mt: 0.4,
                                                position: 'relative'
                                            }}>
                                                {/* Photo/Avatar Placeholder */}
                                                <Box sx={{
                                                    width: '100%',
                                                    height: '88px',
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
                                                            crossOrigin="anonymous"
                                                            sx={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                objectPosition: 'center top'
                                                            }}
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                                const parent = (e.target as HTMLElement).parentElement;
                                                                if (parent) parent.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>';
                                                            }}
                                                        />
                                                    ) : (
                                                        <User size={32} style={{ color: '#94a3b8', opacity: 1 }} />
                                                    )}
                                                </Box>

                                                {/* DESCRIPTIVE TEXT BENEATH IMAGE */}
                                                <Box sx={{ textAlign: 'center', width: '100%', mt: 0.5 }}>
                                                    <Typography sx={{ fontSize: '0.45rem', fontWeight: 800, lineHeight: 1.1, color: currentColors.accent, opacity: 0.9 }}>
                                                        {isIDG ? 'Smart IDg by:' : 'Smart IDiv by:'}<br />indonesianvisas.com
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </>
                                )}
                            </Box>

                            {/* SAMPLE Watermark Overlay (Front) */}
                            {isSample && (
                                <Box sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    pointerEvents: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 100,
                                    bgcolor: 'rgba(255,255,255,0.05)'
                                }}>
                                    <Typography sx={{
                                        color: 'rgba(239, 68, 68, 0.45)',
                                        fontSize: '4.5rem',
                                        fontWeight: 900,
                                        transform: 'rotate(-30deg)',
                                        letterSpacing: '10px',
                                        textShadow: '1px 1px 0px rgba(255,255,255,0.8), -1px -1px 0px rgba(255,255,255,0.8)',
                                        border: '6px solid rgba(239, 68, 68, 0.35)',
                                        padding: '10px 30px',
                                        borderRadius: '20px'
                                    }}>
                                        SAMPLE
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {/* BACK SIDE — Redesigned */}
                        <Box
                            id={idPrefix ? `${idPrefix}-idiv-back` : 'idiv-back'}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: `${CARD_W}px`,
                                height: `${CARD_H}px`,
                                backfaceVisibility: 'hidden',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                background: 'linear-gradient(150deg, #ffffff 0%, #f0f6ff 60%, #e8f4fd 100%)',
                                boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
                                border: '1px solid rgba(0,0,0,0.07)',
                                transform: 'rotateY(180deg) translateZ(1px)',
                                color: '#1e293b',
                            }}
                        >
                            {/* ── LAYER 1: Bali / Indonesia Outline Map ── */}
                            <Box
                                component="svg"
                                viewBox="0 0 520 220"
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0.12,
                                    pointerEvents: 'none',
                                    zIndex: 0,
                                }}
                                preserveAspectRatio="xMidYMid meet"
                            >
                                {/* Bali island outline (left-center, main focus) */}
                                <path d="M 60 95 Q 75 75 100 70 Q 125 65 148 72 Q 168 78 175 92 Q 180 106 172 120 Q 160 138 140 142 Q 118 147 95 138 Q 72 128 62 112 Q 57 103 60 95 Z" fill="none" stroke="#0369a1" strokeWidth="1.8" />
                                {/* Lombok (small, right of Bali) */}
                                <path d="M 190 98 Q 200 88 215 90 Q 228 93 232 104 Q 235 115 226 123 Q 214 130 200 126 Q 188 120 187 108 Q 187 103 190 98 Z" fill="none" stroke="#0369a1" strokeWidth="1.2" />
                                {/* Java outline (elongated, below) */}
                                <path d="M 30 145 Q 60 132 100 130 Q 150 128 200 135 Q 240 140 280 138 Q 320 135 350 143 Q 320 158 280 160 Q 230 163 180 158 Q 130 155 80 160 Q 50 162 30 155 Z" fill="none" stroke="#0369a1" strokeWidth="1.4" />
                                {/* Flores/NTT islands */}
                                <path d="M 248 148 Q 265 143 290 145 Q 315 147 330 155 Q 315 162 290 160 Q 265 158 248 154 Z" fill="none" stroke="#0369a1" strokeWidth="1" />
                                {/* Kalimantan (large, upper right) */}
                                <path d="M 310 45 Q 340 30 375 32 Q 408 35 428 52 Q 448 70 450 95 Q 452 120 438 138 Q 420 155 395 158 Q 368 160 346 148 Q 322 135 312 112 Q 302 88 310 65 Q 310 55 310 45 Z" fill="none" stroke="#0369a1" strokeWidth="1.5" />
                                {/* Papua outline */}
                                <path d="M 430 68 Q 455 55 480 60 Q 505 65 515 82 Q 520 98 512 115 Q 500 130 478 135 Q 455 138 440 125 Q 425 110 428 90 Q 428 78 430 68 Z" fill="none" stroke="#0369a1" strokeWidth="1.3" />
                                {/* Sulawesi simplified */}
                                <path d="M 360 60 Q 375 50 385 62 Q 390 75 382 88 Q 395 82 408 88 Q 420 95 418 108 Q 415 120 402 126 Q 388 132 375 122 Q 365 128 358 118 Q 348 105 355 88 Q 358 74 360 60 Z" fill="none" stroke="#0369a1" strokeWidth="1.2" />
                            </Box>

                            {/* ── LAYER 2: Bali Pura / Temple Illustration (right side) ── */}
                            <Box
                                component="svg"
                                viewBox="0 0 120 150"
                                sx={{
                                    position: 'absolute',
                                    right: '-8px',
                                    bottom: '22px',
                                    width: '110px',
                                    height: '110px',
                                    opacity: 0.09,
                                    pointerEvents: 'none',
                                    zIndex: 0,
                                }}
                            >
                                {/* Simplified Bali Pura (pagoda style) silhouette */}
                                {/* Base platform */}
                                <rect x="20" y="130" width="80" height="8" fill="#1e3a5f" rx="1"/>
                                <rect x="28" y="122" width="64" height="10" fill="#1e3a5f" rx="1"/>
                                {/* Main body levels */}
                                <rect x="36" y="110" width="48" height="14" fill="#1e3a5f" rx="1"/>
                                <rect x="40" y="100" width="40" height="12" fill="#1e3a5f" rx="1"/>
                                <rect x="44" y="91" width="32" height="11" fill="#1e3a5f" rx="1"/>
                                {/* Tiered roofs */}
                                <polygon points="35,91 60,78 85,91" fill="#1e3a5f"/>
                                <polygon points="38,80 60,68 82,80" fill="#1e3a5f"/>
                                <polygon points="42,70 60,57 78,70" fill="#1e3a5f"/>
                                <polygon points="46,58 60,46 74,58" fill="#1e3a5f"/>
                                <polygon points="50,47 60,35 70,47" fill="#1e3a5f"/>
                                {/* Spire */}
                                <polygon points="56,35 60,10 64,35" fill="#1e3a5f"/>
                                <rect x="57" y="8" width="6" height="4" fill="#1e3a5f" rx="1"/>
                                {/* Palm trees on sides */}
                                <line x1="15" y1="130" x2="15" y2="95" stroke="#1e3a5f" strokeWidth="2"/>
                                <ellipse cx="15" cy="92" rx="9" ry="7" fill="#1e3a5f" transform="rotate(-10 15 92)"/>
                                <line x1="105" y1="130" x2="105" y2="98" stroke="#1e3a5f" strokeWidth="2"/>
                                <ellipse cx="105" cy="95" rx="8" ry="6" fill="#1e3a5f" transform="rotate(12 105 95)"/>
                            </Box>

                            {/* ── LAYER 3: Airplane + Dashed Flight Path ── */}
                            <Box
                                component="svg"
                                viewBox={`0 0 ${CARD_W} ${CARD_H}`}
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '100%',
                                    height: '100%',
                                    pointerEvents: 'none',
                                    zIndex: 1,
                                    overflow: 'visible',
                                }}
                            >
                                {/* Dashed curved flight path - More artistic curve */}
                                <path
                                    d={`M 35 45 Q ${CARD_W * 0.2} ${CARD_H * 0.8} ${CARD_W * 0.8} ${CARD_H * 0.7}`}
                                    fill="none"
                                    stroke="#0369a1"
                                    strokeWidth="1.8"
                                    strokeDasharray="6,5"
                                    opacity="0.25"
                                />
                                {/* Endpoint dot */}
                                <circle cx={CARD_W * 0.8} cy={CARD_H * 0.7} r="4" fill="#0369a1" opacity="0.4" />
                                
                                {/* Realistic Airplane Icon (Top Left Start) */}
                                <g transform="translate(20, 25) rotate(-35) scale(0.9)" opacity="0.9">
                                    <path 
                                        d="M21.3,10.1l-8.5-0.3L7.7,0.4C7.5,0.1,7.2,0,6.8,0H5.1c-0.3,0-0.5,0.2-0.5,0.5l1.9,9.2l-4.1-0.1L0.8,7.3 C0.7,7.1,0.5,7,0.3,7H0L1,10.3L0,13.7h0.3c0.2,0,0.4-0.1,0.5-0.3l1.6-2.3l4.1-0.1L4.6,20.2c0,0.3,0.2,0.5,0.5,0.5h1.7 c0.4,0,0.7-0.1,0.9-0.4l5.1-9.4l8.5-0.3c0.9,0,1.7-0.7,1.7-1.6C23,10.8,22.2,10.1,21.3,10.1z" 
                                        fill="#0369a1" 
                                    />
                                </g>
                            </Box>

                            {/* ── CONTENT LAYER ── */}
                            <Box sx={{
                                position: 'relative',
                                zIndex: 2,
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                p: 2.5,
                            }}>

                                {/* Header Row */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1.5 }}>
                                    <QrIcon size={14} color="#0369a1" opacity={0.8} />
                                    <Typography sx={{
                                        fontSize: '0.62rem',
                                        fontWeight: 900,
                                        letterSpacing: '0.18em',
                                        color: '#0369a1',
                                        textTransform: 'uppercase',
                                    }}>
                                        Secure Document Access
                                    </Typography>
                                    <QrIcon size={14} color="#0369a1" opacity={0.8} />
                                </Box>

                                {/* Separator */}
                                <Box sx={{ height: '1px', bgcolor: '#cbd5e1', opacity: 0.5, mb: 1.5 }} />

                                {/* QR Code & NFC Section — centered, clean card */}
                                <Box sx={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 5,
                                    mt: 1
                                }}>
                                    {/* NFC & Mini Barcode for all cards */}
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 0.5,
                                    }}>
                                        {/* Premium Contactless NFC Icon */}
                                        {hasNFC && (
                                            <>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    flexDirection: 'column', 
                                                    alignItems: 'center',
                                                    bgcolor: 'rgba(3,105,161,0.06)',
                                                    borderRadius: '50%',
                                                    p: 1.0,
                                                    border: `1px solid ${isIDG ? 'rgba(124,58,237,0.2)' : 'rgba(3,105,161,0.2)'}`,
                                                    position: 'relative'
                                                }}>
                                                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={isIDG ? currentColors.secondary : '#0369a1'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        {/* Contactless waves */}
                                                        <path d="M5 8a10 10 0 0 1 14 0" opacity="0.4" />
                                                        <path d="M7 11a6 6 0 0 1 10 0" opacity="0.7" />
                                                        <path d="M9 14a2 2 0 0 1 6 0" />
                                                        <circle cx="12" cy="17" r="1.5" fill={isIDG ? currentColors.secondary : '#0369a1'} />
                                                    </svg>
                                                </Box>
                                                
                                                <Typography sx={{ 
                                                    fontSize: '0.36rem', 
                                                    fontWeight: 900, 
                                                    color: isIDG ? currentColors.secondary : '#0369a1', 
                                                    letterSpacing: '0.12em',
                                                    textTransform: 'uppercase',
                                                    mt: 0.2
                                                }}>
                                                    NFC SECURED
                                                </Typography>
                                            </>
                                        )}

                                        {/* Mini Barcode Visual */}
                                        <Box sx={{ mt: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', gap: '2px', height: '14px', alignItems: 'flex-end' }}>
                                                {[2, 4, 1, 3, 2, 4, 2, 1, 3, 4].map((h, i) => (
                                                    <Box key={i} sx={{ width: '1.5px', height: `${h * 3.5}px`, bgcolor: isIDG ? currentColors.secondary : '#0369a1', opacity: 0.8 }} />
                                                ))}
                                            </Box>
                                            <Typography sx={{ fontSize: '0.3rem', fontWeight: 800, color: '#64748b', mt: 0.2, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                                                {cardData.order_id.substring(0, 8)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        bgcolor: '#ffffff',
                                        borderRadius: '8px',
                                        p: 1,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                        border: '1px solid #cbd5e1',
                                    }}>
                                        {isMounted ? (
                                            <QRCodeSVG
                                                value={`${typeof window !== 'undefined' ? window.location.origin : 'https://indonesianvisas.com'}/verify/${cardData.order_id}`}
                                                size={85}
                                                level="H"
                                                includeMargin={false}
                                            />
                                        ) : (
                                            <Box sx={{ width: 85, height: 85 }} />
                                        )}
                                        {/* Order ID below QR */}
                                        <Typography sx={{
                                            fontSize: '0.45rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.05em',
                                            color: '#64748b',
                                            fontFamily: 'monospace',
                                            mt: 0.2,
                                        }}>
                                            {cardData.order_id.substring(0, 8)}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Footer */}
                                <Box sx={{ pt: 1, borderTop: '1px solid rgba(203,213,225,0.6)', mt: 'auto', mb: 0.5 }}>
                                    <Typography sx={{
                                        fontSize: '0.42rem',
                                        fontWeight: 800,
                                        color: '#64748b',
                                        letterSpacing: '0.12em',
                                        textAlign: 'center',
                                        textTransform: 'uppercase',
                                        lineHeight: 1.3,
                                    }}>
                                        {isIDG
                                            ? 'Official Guide ID • Secured via IDIV System'
                                            : 'Official Sponsor ID • Secured via IDIV System'}
                                        <Box component="span" sx={{ display: 'block', mt: 0.2, color: '#94a3b8', fontSize: '0.38rem' }}>
                                            indonesianvisas.com
                                        </Box>
                                    </Typography>
                                </Box>
                            </Box>

                            {/* SAMPLE Watermark Overlay (Back) */}
                            {isSample && (
                                <Box sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    pointerEvents: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 100,
                                    bgcolor: 'rgba(255,255,255,0.05)'
                                }}>
                                    <Typography sx={{
                                        color: 'rgba(239, 68, 68, 0.45)',
                                        fontSize: '4.5rem',
                                        fontWeight: 900,
                                        transform: 'rotate(-30deg)',
                                        letterSpacing: '10px',
                                        textShadow: '1px 1px 0px rgba(255,255,255,0.8), -1px -1px 0px rgba(255,255,255,0.8)',
                                        border: '6px solid rgba(239, 68, 68, 0.35)',
                                        padding: '10px 30px',
                                        borderRadius: '20px'
                                    }}>
                                        SAMPLE
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </motion.div>
                </Box>
            </Box>

            {/* Action Buttons for Preview */}
                {showActions && (
                    <Box sx={{
                        mt: 3,
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
