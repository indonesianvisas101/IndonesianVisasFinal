'use client';

import React from 'react';
import { Box, Container, Typography, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function LegalDirectoryList() {
    const params = useParams();
    const locale = params?.locale || 'en';

    const POLICIES = [
        { name: "Privacy Policy", href: `/${locale}/privacy-policy` },
        { name: "Terms of Service", href: `/${locale}/terms-and-conditions` },
        { name: "Refund & Cancellation Policy", href: `/${locale}/refund` },
        { name: "Affiliate Network Agreement", href: `/${locale}/affiliate` },
    ];

    return (
        <Box sx={{ py: 8, bgcolor: 'background.default' }}>
            <Container maxWidth="md">
                <Typography variant="h5" fontWeight="900" sx={{ mb: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Directory of Policies
                </Typography>
                
                <List sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', p: 0 }}>
                    {POLICIES.map((policy, idx) => (
                        <ListItem 
                            key={idx} 
                            disablePadding 
                            divider={idx < POLICIES.length - 1}
                        >
                            <ListItemButton component={Link} href={policy.href} sx={{ py: 2.5 }}>
                                <ListItemIcon>
                                    <FileText size={20} className="text-slate-400" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={policy.name} 
                                    primaryTypographyProps={{ 
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem'
                                    }} 
                                />
                                <ArrowRight size={18} className="text-slate-300" />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Container>
        </Box>
    );
}
