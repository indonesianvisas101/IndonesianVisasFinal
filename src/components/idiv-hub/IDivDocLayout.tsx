"use client";

import React from 'react';
import { Box, Container, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { ChevronRight, Home, BookOpen, Shield, Zap, Search, Users, Building, HelpCircle, HardDrive } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface IDivDocLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

const sidebarItems = [
    { 
        group: "Platform Overview", 
        items: [
            { label: "Overview", href: "/idiv", icon: Home },
            { label: "Digital Identity Platform", href: "/Digital-Visa-Identity-Platform", icon: BookOpen },
            { label: "System Architecture", href: "/how-the-visa-identity-system-works", icon: Zap },
        ] 
    },
    { 
        group: "Identity System", 
        items: [
            { label: "Sponsor ID", href: "/sponsor-id-system", icon: Users },
            { label: "Identity Card", href: "/visa-identity-card", icon: HardDrive },
            { label: "Validation Logic", href: "/issued-and-expiry-validation", icon: Shield },
            { label: "Sponsor Verification", href: "/visa-sponsor-verification", icon: Search },
        ] 
    },
    { 
        group: "Verification Technology", 
        items: [
            { label: "QR System", href: "/qr-verification-system", icon: Zap },
            { label: "Verification Page", href: "/online-verification-page", icon: Search },
            { label: "Verification Guide", href: "/how-to-verify-a-visa-sponsor", icon: BookOpen },
        ] 
    },
    { 
        group: "Practical Use Cases", 
        items: [
            { label: "Traveler Benefits", href: "/why-travelers-need-a-sponsor-id", icon: Users },
            { label: "Villa Rentals", href: "/using-sponsor-id-for-villa-rental", icon: Building },
            { label: "Vehicle Rentals", href: "/using-sponsor-id-for-vehicle-rentals", icon: Zap },
            { label: "Business Meetings", href: "/using-sponsor-id-for-business-meetings", icon: Building },
        ] 
    },
    { 
        group: "Security & Trust", 
        items: [
            { label: "Security Features", href: "/visa-identity-security", icon: Shield },
            { label: "Fraud Prevention", href: "/how-qr-validation-prevents-fraud", icon: Shield },
            { label: "Validity Rules", href: "/visa-identity-validity-rules", icon: Shield },
        ] 
    },
    { 
        group: "Platform Governance", 
        items: [
            { label: "Sponsor Governance", href: "/visa-sponsor-system-explained", icon: Building },
        ] 
    }
];

export default function IDivDocLayout({ children, title, subtitle }: IDivDocLayoutProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        // Handle root cases and specific clean URLs
        if (pathname === href) return true;
        // Also handle the internal rewrite path if needed, but since we are clean URL it should match
        return false;
    };

    return (
        <Box sx={{ bgcolor: 'white', minHeight: '100vh', pt: { xs: 8, md: 12 }, pb: 10 }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    
                    {/* Sidebar */}
                    <Box sx={{ width: { xs: '100%', md: '280px' }, flexShrink: 0 }}>
                        <Box sx={{ position: { md: 'sticky' }, top: '100px', spaceY: 6 }}>
                            {sidebarItems.map((group, idx) => (
                                <Box key={idx} sx={{ mb: 4 }}>
                                    <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: 1.5, pl: 1 }}>
                                        {group.group}
                                    </Typography>
                                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        {group.items.map((item, i) => {
                                            const active = isActive(item.href);
                                            return (
                                                <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: 1.5, 
                                                        px: 1.5, 
                                                        py: 1, 
                                                        borderRadius: 2,
                                                        bgcolor: active ? 'primary.main' : 'transparent',
                                                        color: active ? 'white' : 'text.primary',
                                                        '&:hover': {
                                                            bgcolor: active ? 'primary.main' : 'grey.100',
                                                        },
                                                        transition: 'all 0.2s'
                                                    }}>
                                                        <item.icon size={18} opacity={0.7} />
                                                        <Typography variant="body2" sx={{ fontWeight: active ? 700 : 500 }}>
                                                            {item.label}
                                                        </Typography>
                                                    </Box>
                                                </Link>
                                            );
                                        })}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* Main Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        {/* Breadcrumbs */}
                        <Breadcrumbs 
                            separator={<ChevronRight size={14} />} 
                            sx={{ mb: 4, '& .MuiBreadcrumbs-li': { fontSize: '0.85rem' } }}
                        >
                            <MuiLink component={Link} href="/" color="inherit" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Home size={14} /> Home
                            </MuiLink>
                            <MuiLink component={Link} href="/idiv" color="inherit">
                                IDIV Platform
                            </MuiLink>
                            <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                {title}
                            </Typography>
                        </Breadcrumbs>

                        <Box component="header" sx={{ mb: 8 }}>
                            <Typography variant="h3" component="h1" sx={{ fontWeight: 900, color: 'primary.main', mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
                                {title}
                            </Typography>
                            {subtitle && (
                                <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500, lineHeight: 1.6, maxWidth: '800px' }}>
                                    {subtitle}
                                </Typography>
                            )}
                        </Box>

                        <Box sx={{ 
                            '& section': { mb: 8 },
                            '& h2': { variant: 'h4', fontWeight: 800, mb: 3, mt: 6, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1.5 },
                            '& p': { mb: 3, lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' },
                            '& ul': { mb: 4, pl: 3, '& li': { mb: 1.5, color: 'text.secondary' } }
                        }}>
                            {children}
                        </Box>

                        {/* Footer Navigation */}
                        <Box sx={{ mt: 12, pt: 6, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                                Official Digital Visa Identity Platform (IDIV) Documentation
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                                © 2026 Indonesian Visas Agency
                            </Typography>
                        </Box>
                    </Box>

                </Box>
            </Container>
        </Box>
    );
}
