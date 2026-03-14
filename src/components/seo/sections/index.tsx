'use client';

import React from 'react';
import { Box, Typography, Container, Button, Stack, Accordion, AccordionSummary, AccordionDetails, Grid, Paper } from '@mui/material';
import { ExpandMore, CheckCircle, ArrowRight } from '@mui/icons-material';
import { SeoSection } from '@/data/seo/types';

export const HeroSection = ({ section }: { section: SeoSection }) => (
    <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container maxWidth="md">
            <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
                {section.title}
            </Typography>
            {section.subtitle && (
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                    {section.subtitle}
                </Typography>
            )}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                {section.primaryButton && (
                    <Button variant="contained" color="secondary" size="large" href={section.primaryButton.href}>
                        {section.primaryButton.label}
                    </Button>
                )}
                {section.secondaryButton && (
                    <Button variant="outlined" color="inherit" size="large" href={section.secondaryButton.href}>
                        {section.secondaryButton.label}
                    </Button>
                )}
            </Stack>
        </Container>
    </Box>
);

export const ContentSection = ({ section }: { section: SeoSection }) => (
    <Container maxWidth="md" sx={{ py: 6 }}>
        {section.title && <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">{section.title}</Typography>}
        {section.subtitle && <Typography variant="h6" color="text.secondary" paragraph>{section.subtitle}</Typography>}
        {section.content && (
            <Box sx={{ typography: 'body1', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: section.content }} />
        )}
    </Container>
);

export const FaqSection = ({ section }: { section: SeoSection }) => (
    <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="md">
            {section.title && <Typography variant="h3" component="h2" align="center" gutterBottom fontWeight="bold">{section.title}</Typography>}
            {section.subtitle && <Typography variant="h6" align="center" color="text.secondary" paragraph>{section.subtitle}</Typography>}
            <Box sx={{ mt: 4 }}>
                {section.items?.map((faq, idx) => (
                    <Accordion key={idx} elevation={0} sx={{ mb: 1, '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography fontWeight="medium">{faq.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography color="text.secondary">{faq.answer}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Container>
    </Box>
);

export const FeaturesSection = ({ section }: { section: SeoSection }) => (
    <Container maxWidth="lg" sx={{ py: 8 }}>
        {section.title && <Typography variant="h3" component="h2" align="center" gutterBottom fontWeight="bold">{section.title}</Typography>}
        {section.subtitle && <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>{section.subtitle}</Typography>}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {section.items?.map((item, idx) => (
                <Box key={idx}>
                    <Paper elevation={0} sx={{ p: 4, height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <CheckCircle color="primary" sx={{ fontSize: 40, mb: 2 }} />
                        <Typography variant="h6" gutterBottom fontWeight="bold">{item.title}</Typography>
                        <Typography color="text.secondary">{item.description}</Typography>
                    </Paper>
                </Box>
            ))}
        </Box>
    </Container>
);

export const ProcessSection = ({ section }: { section: SeoSection }) => (
    <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="md">
            {section.title && <Typography variant="h3" component="h2" align="center" gutterBottom fontWeight="bold">{section.title}</Typography>}
            <Stack spacing={4} sx={{ mt: 6 }}>
                {section.items?.map((item, idx) => (
                    <Paper key={idx} sx={{ p: 4, display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                        <Box sx={{ 
                            width: 48, height: 48, borderRadius: '50%', bgcolor: 'primary.main', 
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, fontWeight: 'bold', fontSize: 20
                        }}>
                            {idx + 1}
                        </Box>
                        <Box>
                            <Typography variant="h5" gutterBottom fontWeight="bold">{item.title}</Typography>
                            <Typography color="text.secondary">{item.description}</Typography>
                        </Box>
                    </Paper>
                ))}
            </Stack>
        </Container>
    </Box>
);

export const CtaSection = ({ section }: { section: SeoSection }) => (
    <Box sx={{ bgcolor: 'grey.900', color: 'common.white', py: 10, textAlign: 'center' }}>
        <Container maxWidth="sm">
            {section.title && <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">{section.title}</Typography>}
            {section.subtitle && <Typography variant="h6" sx={{ mb: 4, color: 'grey.400' }}>{section.subtitle}</Typography>}
            {section.primaryButton && (
                <Button variant="contained" color="primary" size="large" href={section.primaryButton.href} sx={{ px: 4, py: 1.5 }}>
                    {section.primaryButton.label}
                </Button>
            )}
        </Container>
    </Box>
);
