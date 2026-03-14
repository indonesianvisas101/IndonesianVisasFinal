'use client';

import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { ShieldCheck, Building2, FileText, CheckCircle2 } from 'lucide-react';

export default function ComplianceGrid() {
    const COMPLIANCE_DATA = [
        {
            icon: <Building2 className="text-primary" size={28} />,
            title: "Legal Entity",
            value: "PT Indonesian Visas Agency™"
        },
        {
            icon: <FileText className="text-primary" size={28} />,
            title: "Business Registration (NIB)",
            value: "0402260034806"
        },
        {
            icon: <FileText className="text-primary" size={28} />,
            title: "Tax ID (NPWP)",
            value: "1000000008117681"
        },
        {
            icon: <ShieldCheck className="text-primary" size={28} />,
            title: "Registered Certificate (SKT)",
            value: "S-04449/SKT-WP-CT/KPP.1701/2026"
        },
        {
            icon: <ShieldCheck className="text-primary" size={28} />,
            title: "Ministry of Law (AHU)",
            value: "AHU-00065.AH.02.01.TAHUN 2020"
        },
        {
            icon: <CheckCircle2 className="text-primary" size={28} />,
            title: "Immigration Sponsor Status",
            value: "Recorded 2010, 2014, 2023, 2024, 2026"
        }
    ];

    return (
        <Box sx={{ py: { xs: 12, md: 20 }, bgcolor: 'background.default' }}>
            <Container maxWidth="lg">
                <Box textAlign="center" mb={10}>
                    <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom textTransform="uppercase" letterSpacing={2}>
                        Uncompromising Legal Compliance
                    </Typography>
                    <Typography variant="h3" component="h2" fontWeight="900" gutterBottom>
                        Absolute Governance & Trust
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', mt: 3 }}>
                        For corporate partners and B2B clients, we operate with 100% transparency. Our credentials are open, verified, and officially registered with the Republic of Indonesia.
                    </Typography>
                </Box>

                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={3}>
                    {COMPLIANCE_DATA.map((item, idx) => (
                        <Box key={idx} sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
                            <Paper 
                                elevation={0} 
                                sx={{ 
                                    p: 4, 
                                    border: '1px solid', 
                                    borderColor: 'divider', 
                                    borderRadius: 3,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    bgcolor: 'background.paper'
                                }}
                            >
                                <Box display="flex" alignItems="center" gap={2} mb={2}>
                                    <Box sx={{ p: 1.5, bgcolor: 'primary.main', color: 'white', borderRadius: 2, '& > svg': { color: 'white' } }}>
                                        {item.icon}
                                    </Box>
                                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" textTransform="uppercase">
                                        {item.title}
                                    </Typography>
                                </Box>
                                <Typography variant="h6" fontWeight="bold" sx={{ wordBreak: 'break-word' }}>
                                    {item.value}
                                </Typography>
                            </Paper>
                        </Box>
                    ))}
                </Box>

                <Box mt={6} textAlign="center">
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', maxWidth: '600px', mx: 'auto' }}>
                        * The trademark INDONESIAN VISAS® is currently undergoing final registration at the Directorate General of Intellectual Property (DJKI) transitioning from (™) to (®).
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
