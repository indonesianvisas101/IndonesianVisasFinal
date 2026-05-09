"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Stack,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    InputAdornment,
    Avatar,
    Grid,
    Switch,
    FormControlLabel,
    Divider,
    Paper
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { VisaType, POPULAR_VISA_IDS } from "@/constants/visas";
import { VISA_DETAILS } from "@/constants/visaDetails";
import { formatCurrency } from "@/lib/utils";

interface VisasTabProps {
    visas: VisaType[];
    setVisas: React.Dispatch<React.SetStateAction<VisaType[]>>;
    popularVisaIds: string[];
    handleTogglePopular: (id: string) => Promise<void>;
}

export default function VisasTab({ visas, setVisas, popularVisaIds, handleTogglePopular }: VisasTabProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [editingVisa, setEditingVisa] = useState<VisaType | null>(null);
    const [isMultiPricing, setIsMultiPricing] = useState(false);
    const [pricingRows, setPricingRows] = useState<{ label: string; price: string; fee: number }[]>([
        { label: 'Standard', price: '', fee: 0 }
    ]);

    const [detailsForm, setDetailsForm] = useState({
        intro: '',
        descriptionTitle: '',
        descriptionText: '',
        allowedTitle: '',
        allowedText: '',
        sponsorTitle: '',
        sponsorText: '',
        periodTitle: '',
        periodText: '',
        provisionsTitle: '',
        provisionsText: '',
        specialTitle: '',
        specialText: '',
        processingTitle: '',
        processingText: '',
        requirementsTitle: '',
        requirementsNote: '',
        pricingTitle: '',
        pricingNote: '',
        ctaTitle: '',
        ctaSubtitle: ''
    });

    useEffect(() => {
        if (editingVisa) {
            const dbDetails = editingVisa.details;
            const sourceInfo = (dbDetails && Object.keys(dbDetails).length > 0)
                ? dbDetails
                : (VISA_DETAILS[editingVisa.id] || {});

            setDetailsForm({
                intro: sourceInfo.intro || '',
                descriptionTitle: sourceInfo.description?.title || 'What is this Visa?',
                descriptionText: sourceInfo.description?.text || '',
                allowedTitle: sourceInfo.allowed?.title || 'What You Can Do',
                allowedText: sourceInfo.allowed?.text || '',
                sponsorTitle: sourceInfo.sponsor?.title || 'Sponsor Requirements',
                sponsorText: sourceInfo.sponsor?.text || '',
                periodTitle: sourceInfo.period?.title || 'Period of Stay',
                periodText: sourceInfo.period?.text || '',
                provisionsTitle: sourceInfo.provisions?.title || 'Other Provisions',
                provisionsText: sourceInfo.provisions?.text || '',
                specialTitle: sourceInfo.special?.title || 'Special Note',
                specialText: sourceInfo.special?.text || '',
                processingTitle: sourceInfo.processing?.title || 'Processing Time & Procedure',
                processingText: sourceInfo.processing?.text || '',
                requirementsTitle: sourceInfo.requirements?.title || 'Submission Requirements',
                requirementsNote: sourceInfo.requirements?.note || '',
                pricingTitle: sourceInfo.pricing?.title || 'Visa Fees',
                pricingNote: sourceInfo.pricing?.note || '',
                ctaTitle: sourceInfo.cta?.title || 'Apply Now',
                ctaSubtitle: sourceInfo.cta?.subtitle || 'Contact us to get started'
            });

            const rawPrice = editingVisa.price;
            const rawFee = editingVisa.fee;
            let rows: { label: string; price: string; fee: number }[] = [];
            let isMulti = false;

            if (typeof rawPrice === 'object' && rawPrice !== null) {
                isMulti = true;
                Object.entries(rawPrice).forEach(([key, val]) => {
                    let feeVal = 0;
                    if (typeof rawFee === 'object' && rawFee !== null) {
                        feeVal = (rawFee as any)[key] || 0;
                    } else {
                        feeVal = Number(rawFee) || 0;
                    }
                    rows.push({ label: key, price: String(val), fee: feeVal });
                });
            } else {
                rows.push({
                    label: 'Standard',
                    price: String(rawPrice || ''),
                    fee: Number(rawFee) || 0
                });
            }
            if (rows.length === 0) rows.push({ label: 'Standard', price: '', fee: 0 });

            setPricingRows(rows);
            setIsMultiPricing(isMulti);
        }
    }, [editingVisa]);

    const handleSaveVisa = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingVisa) return;

        let finalPrice: any = '';
        let finalFee: any = 0;

        if (isMultiPricing) {
            const priceObj: Record<string, string> = {};
            const feeObj: Record<string, number> = {};
            pricingRows.forEach(row => {
                if (row.label.trim()) {
                    priceObj[row.label] = row.price.trim();
                    feeObj[row.label] = Number(String(row.fee).replace(/[^0-9.]/g, '')) || 0;
                }
            });
            finalPrice = priceObj;
            finalFee = feeObj;
        } else {
            const row = pricingRows[0] || { price: '', fee: 0 };
            finalPrice = row.price.trim();
            finalFee = Number(String(row.fee).replace(/[^0-9.]/g, '')) || 0;
        }

        const richDetails = {
            ...editingVisa.details,
            intro: detailsForm.intro,
            description: { title: detailsForm.descriptionTitle, text: detailsForm.descriptionText },
            allowed: { title: detailsForm.allowedTitle, text: detailsForm.allowedText },
            sponsor: { title: detailsForm.sponsorTitle, text: detailsForm.sponsorText },
            period: { title: detailsForm.periodTitle, text: detailsForm.periodText },
            provisions: { title: detailsForm.provisionsTitle, text: detailsForm.provisionsText },
            special: { title: detailsForm.specialTitle, text: detailsForm.specialText },
            processing: { title: detailsForm.processingTitle, text: detailsForm.processingText },
            requirements: {
                title: detailsForm.requirementsTitle,
                items: editingVisa.requirements || [],
                note: detailsForm.requirementsNote
            },
            pricing: {
                title: detailsForm.pricingTitle,
                note: detailsForm.pricingNote,
                options: []
            },
            cta: { title: detailsForm.ctaTitle, subtitle: detailsForm.ctaSubtitle }
        };

        try {
            const response = await fetch('/api/visas', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...editingVisa,
                    price: finalPrice,
                    fee: finalFee,
                    details: richDetails
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.details || data.error || 'Failed to update visa');

            setVisas(prev => prev.map(v => v.id === data.id ? data : v));
            alert('Visa updated successfully');
            setEditingVisa(null);
        } catch (err: any) {
            console.error("Error saving visa", err);
            alert(`Failed to save visa: ${err.message}`);
        }
    };

    const filteredVisas = visas.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Stack spacing={4} sx={{ animation: 'fadeIn 0.5s ease' }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" flexWrap="wrap" gap={2}>
                <div>
                    <Typography variant="h4" fontWeight="bold">Visa Database</Typography>
                    <Typography variant="body1" color="text.secondary">Manage {visas.length} active visa products.</Typography>
                </div>
                <Stack direction="row" spacing={2}>
                    <TextField
                        size="small"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                            sx: { bgcolor: 'background.paper', borderRadius: 2 }
                        }}
                    />
                    <Button variant="contained" startIcon={<AddIcon />}>Add Product</Button>
                </Stack>
            </Box>

            <Card>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: 'background.default' }}>
                            <TableRow>
                                <TableCell>PRODUCT NAME</TableCell>
                                <TableCell>ID VISA</TableCell>
                                <TableCell>PRICES (IDR)</TableCell>
                                <TableCell>FEES (IDR)</TableCell>
                                <TableCell>VALIDITY</TableCell>
                                <TableCell>REQUIREMENTS</TableCell>
                                <TableCell align="center">STATUS</TableCell>
                                <TableCell align="right">ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredVisas.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">{row.name}</Typography>
                                        <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200, display: 'block' }}>{row.category}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={row.id} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }} />
                                    </TableCell>
                                    <TableCell>
                                        {typeof row.price === 'object' && row.price !== null ? (
                                            <Stack spacing={0.5}>
                                                {Object.entries(row.price).map(([key, val]) => (
                                                    <Typography key={key} variant="caption" display="block" fontFamily="monospace">
                                                        <Box component="span" sx={{ opacity: 0.7 }}>{key}:</Box> {String(val)}
                                                    </Typography>
                                                ))}
                                            </Stack>
                                        ) : (!row.price || row.price === 'IDR 0' || row.price === '0' ? (
                                            <Chip label="Contact Us" size="small" variant="outlined" />
                                        ) : (
                                            <Typography variant="body2" fontFamily="monospace" fontWeight="bold">{String(row.price)}</Typography>
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        {typeof row.fee === 'object' && row.fee !== null ? (
                                            <Stack spacing={0.5}>
                                                {Object.entries(row.fee).map(([key, val]) => (
                                                    <Typography key={key} variant="caption" display="block" fontFamily="monospace" color="text.secondary">
                                                        <Box component="span" sx={{ opacity: 0.7 }}>{key}:</Box> {formatCurrency(Number(val))}
                                                    </Typography>
                                                ))}
                                            </Stack>
                                        ) : (
                                            <Typography variant="body2" fontFamily="monospace" color="text.secondary">
                                                {typeof row.fee === 'number' ? formatCurrency(row.fee) : String(row.fee || '-')}
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>{row.validity}</TableCell>
                                    <TableCell>
                                        <Typography variant="caption" color="text.secondary">
                                            {row.requirements ? `${row.requirements.length} Items` : '0 Items'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'success.light', color: 'success.main', mx: 'auto' }}>
                                            <CheckIcon sx={{ fontSize: 14 }} />
                                        </Avatar>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => handleTogglePopular(row.id)} color={popularVisaIds.includes(row.id) ? "secondary" : "default"}>
                                            <TrendingUpIcon fontSize="small" sx={{ opacity: popularVisaIds.includes(row.id) ? 1 : 0.4 }} />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => setEditingVisa(row)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* EDIT VISA DIALOG */}
            <Dialog open={!!editingVisa} onClose={() => setEditingVisa(null)} fullWidth maxWidth="md">
                <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Visa Product: {editingVisa?.name}</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} pt={1}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField label="Visa Name" fullWidth value={editingVisa?.name || ''} 
                                    onChange={(e) => setEditingVisa(prev => prev ? { ...prev, name: e.target.value } : null)} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField label="Category" fullWidth value={editingVisa?.category || ''}
                                    onChange={(e) => setEditingVisa(prev => prev ? { ...prev, category: e.target.value } : null)} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField label="Validity" fullWidth value={editingVisa?.validity || ''}
                                    onChange={(e) => setEditingVisa(prev => prev ? { ...prev, validity: e.target.value } : null)} />
                            </Grid>
                        </Grid>

                        <Divider><Chip label="PRICING & FEES" size="small" /></Divider>
                        
                        <FormControlLabel
                            control={<Switch checked={isMultiPricing} onChange={(e) => setIsMultiPricing(e.target.checked)} />}
                            label="Enable Multi-Tier Pricing (e.g. 30 Days, 60 Days)"
                        />

                        {pricingRows.map((row, idx) => (
                            <Box key={idx} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <TextField label="Label (e.g. 30 Days)" fullWidth size="small" value={row.label}
                                            disabled={!isMultiPricing && idx === 0}
                                            onChange={(e) => {
                                                const next = [...pricingRows];
                                                next[idx].label = e.target.value;
                                                setPricingRows(next);
                                            }} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <TextField label="Display Price (IDR)" fullWidth size="small" value={row.price}
                                            onChange={(e) => {
                                                const next = [...pricingRows];
                                                next[idx].price = e.target.value;
                                                setPricingRows(next);
                                            }} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 3 }}>
                                        <TextField label="System Fee (Numeric)" fullWidth size="small" type="number" value={row.fee}
                                            onChange={(e) => {
                                                const next = [...pricingRows];
                                                next[idx].fee = Number(e.target.value);
                                                setPricingRows(next);
                                            }} />
                                    </Grid>
                                    {isMultiPricing && (
                                        <Grid size={{ xs: 12, sm: 1 }}>
                                            <IconButton color="error" onClick={() => setPricingRows(prev => prev.filter((_, i) => i !== idx))}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        ))}
                        {isMultiPricing && (
                            <Button startIcon={<AddCircleIcon />} onClick={() => setPricingRows(prev => [...prev, { label: '', price: '', fee: 0 }])}>
                                Add Pricing Tier
                            </Button>
                        )}

                        <Divider><Chip label="RICH CONTENT (MASTER EDITOR)" size="small" /></Divider>
                        
                        <TextField label="Intro Text" fullWidth multiline rows={2} value={detailsForm.intro}
                            onChange={(e) => setDetailsForm({ ...detailsForm, intro: e.target.value })} />

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Description Section</Typography>
                                    <TextField label="Title" fullWidth size="small" sx={{ mb: 1 }} value={detailsForm.descriptionTitle}
                                        onChange={(e) => setDetailsForm({ ...detailsForm, descriptionTitle: e.target.value })} />
                                    <TextField label="Text" fullWidth multiline rows={3} size="small" value={detailsForm.descriptionText}
                                        onChange={(e) => setDetailsForm({ ...detailsForm, descriptionText: e.target.value })} />
                                </Paper>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Activities (Allowed)</Typography>
                                    <TextField label="Title" fullWidth size="small" sx={{ mb: 1 }} value={detailsForm.allowedTitle}
                                        onChange={(e) => setDetailsForm({ ...detailsForm, allowedTitle: e.target.value })} />
                                    <TextField label="Text" fullWidth multiline rows={3} size="small" value={detailsForm.allowedText}
                                        onChange={(e) => setDetailsForm({ ...detailsForm, allowedText: e.target.value })} />
                                </Paper>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Sponsor Section</Typography>
                                    <TextField label="Title" fullWidth size="small" sx={{ mb: 1 }} value={detailsForm.sponsorTitle}
                                        onChange={(e) => setDetailsForm({ ...detailsForm, sponsorTitle: e.target.value })} />
                                    <TextField label="Text" fullWidth multiline rows={3} size="small" value={detailsForm.sponsorText}
                                        onChange={(e) => setDetailsForm({ ...detailsForm, sponsorText: e.target.value })} />
                                </Paper>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Period of Stay</Typography>
                                    <TextField label="Title" fullWidth size="small" sx={{ mb: 1 }} value={detailsForm.periodTitle}
                                        onChange={(e) => setDetailsForm({ ...detailsForm, periodTitle: e.target.value })} />
                                    <TextField label="Text" fullWidth multiline rows={3} size="small" value={detailsForm.periodText}
                                        onChange={(e) => setDetailsForm({ ...detailsForm, periodText: e.target.value })} />
                                </Paper>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Provisions</Typography>
                                    <TextField label="Title" fullWidth size="small" sx={{ mb: 1 }} value={detailsForm.provisionsTitle}
                                        onChange={(e) => setDetailsForm({ ...detailsForm, provisionsTitle: e.target.value })} />
                                    <TextField label="Text" fullWidth multiline rows={3} size="small" value={detailsForm.provisionsText}
                                        onChange={(e) => setDetailsForm({ ...detailsForm, provisionsText: e.target.value })} />
                                </Paper>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Processing & Procedure</Typography>
                                    <TextField label="Title" fullWidth size="small" sx={{ mb: 1 }} value={detailsForm.processingTitle}
                                        onChange={(e) => setDetailsForm({ ...detailsForm, processingTitle: e.target.value })} />
                                    <TextField label="Text" fullWidth multiline rows={3} size="small" value={detailsForm.processingText}
                                        onChange={(e) => setDetailsForm({ ...detailsForm, processingText: e.target.value })} />
                                </Paper>
                            </Grid>
                        </Grid>

                        <Divider><Chip label="REQUIREMENTS & CTA" size="small" /></Divider>
                        <TextField label="Requirements Note" fullWidth value={detailsForm.requirementsNote}
                            onChange={(e) => setDetailsForm({ ...detailsForm, requirementsNote: e.target.value })} />
                        <TextField label="Requirements (One per line)" fullWidth multiline rows={4} 
                            value={editingVisa?.requirements ? editingVisa.requirements.join('\n') : ''}
                            onChange={(e) => setEditingVisa(prev => prev ? { ...prev, requirements: e.target.value.split('\n') } : null)} />

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField label="CTA Title" fullWidth value={detailsForm.ctaTitle}
                                    onChange={(e) => setDetailsForm({ ...detailsForm, ctaTitle: e.target.value })} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField label="CTA Subtitle" fullWidth value={detailsForm.ctaSubtitle}
                                    onChange={(e) => setDetailsForm({ ...detailsForm, ctaSubtitle: e.target.value })} />
                            </Grid>
                        </Grid>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingVisa(null)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveVisa}>Save Visa</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
