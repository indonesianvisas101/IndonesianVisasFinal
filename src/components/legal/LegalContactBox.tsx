'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Mail, ShieldCheck } from 'lucide-react';

/**
 * Very basic email obfuscation to prevent simple bot scraping
 */
const ObfuscatedEmail = ({ user, domain }: { user: string; domain: string }) => {
    const [email, setEmail] = React.useState(`${user} [at] ${domain}`);
    
    React.useEffect(() => {
        // Delay conversion to reduce automated headless scraper hits
        const timer = setTimeout(() => {
            setEmail(`${user}@${domain}`);
        }, 1000);
        return () => clearTimeout(timer);
    }, [user, domain]);

    return (
        <Typography 
            component="a" 
            href={email.includes('@') ? `mailto:${email}` : '#'} 
            sx={{ 
                color: 'text.primary', 
                fontWeight: 'bold', 
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
            }}
        >
            {email}
        </Typography>
    );
};

export default function LegalContactBox() {
    return (
        <Box sx={{ py: 8, pb: 15, bgcolor: 'background.default' }}>
            <Container maxWidth="md">
                <Box 
                    sx={{ 
                        p: 4, 
                        border: '1px solid', 
                        borderColor: 'divider', 
                        borderRadius: 2,
                        bgcolor: 'rgba(0,0,0,0.01)'
                    }}
                >
                    <Box display="flex" gap={2} alignItems="center" mb={3}>
                        <ShieldCheck size={24} className="text-primary" />
                        <Typography variant="h5" fontWeight="900" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Official Communication Channels
                        </Typography>
                    </Box>
                    
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.6 }}>
                        These are the only official communication channels for formal, legal, or corporate inquiries. 
                        Communication received from other domains or unofficial channels should be treated as unauthorized.
                    </Typography>

                    <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={4}>
                        <Box>
                            <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: '900', color: 'text.secondary', display: 'block', mb: 1 }}>
                                Corporate & Legal Inquiries
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1.5}>
                                <Mail size={16} className="text-slate-400" />
                                <ObfuscatedEmail user="indonesian" domain="visas.agency" />
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: '900', color: 'text.secondary', display: 'block', mb: 1 }}>
                                General Official Contact
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1.5}>
                                <Mail size={16} className="text-slate-400" />
                                <ObfuscatedEmail user="contact" domain="indonesianvisas.agency" />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
