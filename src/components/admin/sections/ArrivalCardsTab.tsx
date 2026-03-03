"use client";

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, IconButton, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, Grid, CircularProgress, Alert
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function ArrivalCardsTab() {
    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCard, setSelectedCard] = useState<any | null>(null);
    const [updating, setUpdating] = useState(false);

    const fetchCards = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/arrival-cards');
            if (!res.ok) throw new Error("Failed to fetch arrival cards");
            const data = await res.json();
            setCards(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/arrival-cards/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error("Update failed");

            // Re-fetch or update locally
            setCards(cards.map(c => c.id === id ? { ...c, status: newStatus } : c));
            if (selectedCard && selectedCard.id === id) {
                setSelectedCard({ ...selectedCard, status: newStatus });
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setUpdating(false);
        }
    };

    const StatusChip = ({ status }: { status: string }) => {
        const colorMap: any = {
            'PENDING': 'warning',
            'APPROVED': 'success',
            'REJECTED': 'error'
        };
        return <Chip label={status} color={colorMap[status] || 'default'} size="small" />;
    };

    if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">Arrival Cards (e-CD)</Typography>
                <Button variant="outlined" onClick={fetchCards} startIcon={<CircularProgress size={16} sx={{ visibility: loading ? 'visible' : 'hidden' }} />}>
                    Refresh List
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date Submitted</TableCell>
                            <TableCell>Passenger Name</TableCell>
                            <TableCell>Passport #</TableCell>
                            <TableCell>Arrival Date</TableCell>
                            <TableCell>Flight</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cards.length === 0 ? (
                            <TableRow><TableCell colSpan={7} align="center">No Arrival Cards submitted yet.</TableCell></TableRow>
                        ) : (
                            cards.map((card) => (
                                <TableRow key={card.id}>
                                    <TableCell>{new Date(card.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{card.fullName}</TableCell>
                                    <TableCell>{card.passportNumber}</TableCell>
                                    <TableCell>{new Date(card.arrivalDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{card.flightNumber || 'N/A'}</TableCell>
                                    <TableCell><StatusChip status={card.status} /></TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" onClick={() => setSelectedCard(card)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* View Details Modal */}
            <Dialog open={!!selectedCard} onClose={() => setSelectedCard(null)} maxWidth="md" fullWidth>
                {selectedCard && (
                    <>
                        <DialogTitle>
                            <Typography variant="h6" fontWeight="bold">Arrival Card Details</Typography>
                            <Typography variant="body2" color="text.secondary">ID: {selectedCard.id}</Typography>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2" color="primary" gutterBottom>Personal Information</Typography>
                                    <Table size="small">
                                        <TableBody>
                                            <TableRow><TableCell><strong>Name:</strong></TableCell><TableCell>{selectedCard.formData?.fullName}</TableCell></TableRow>
                                            <TableRow><TableCell><strong>Nationality:</strong></TableCell><TableCell>{selectedCard.formData?.nationality}</TableCell></TableRow>
                                            <TableRow><TableCell><strong>Passport:</strong></TableCell><TableCell>{selectedCard.formData?.passportNumber}</TableCell></TableRow>
                                            <TableRow><TableCell><strong>DOB:</strong></TableCell><TableCell>{selectedCard.formData?.dob}</TableCell></TableRow>
                                            <TableRow><TableCell><strong>Email:</strong></TableCell><TableCell>{selectedCard.formData?.email}</TableCell></TableRow>
                                            <TableRow><TableCell><strong>Phone:</strong></TableCell><TableCell>{selectedCard.formData?.phoneCode} {selectedCard.formData?.phoneNumber}</TableCell></TableRow>
                                        </TableBody>
                                    </Table>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2" color="primary" gutterBottom>Travel & Address</Typography>
                                    <Table size="small">
                                        <TableBody>
                                            <TableRow><TableCell><strong>Arrival:</strong></TableCell><TableCell>{selectedCard.formData?.arrivalDate}</TableCell></TableRow>
                                            <TableRow><TableCell><strong>Departure:</strong></TableCell><TableCell>{selectedCard.formData?.departureDate}</TableCell></TableRow>
                                            <TableRow><TableCell><strong>Transport:</strong></TableCell><TableCell>{selectedCard.formData?.transportType} ({selectedCard.formData?.arrivalPort})</TableCell></TableRow>
                                            <TableRow><TableCell><strong>Flight #:</strong></TableCell><TableCell>{selectedCard.formData?.flightNumber}</TableCell></TableRow>
                                            <TableRow><TableCell><strong>Accommodation:</strong></TableCell><TableCell>{selectedCard.formData?.accommodationType}</TableCell></TableRow>
                                            <TableRow><TableCell><strong>Address/Hotel:</strong></TableCell><TableCell>{selectedCard.formData?.hotelName || selectedCard.formData?.address}</TableCell></TableRow>
                                        </TableBody>
                                    </Table>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="subtitle2" color="primary" gutterBottom>Uploaded Documents</Typography>
                                    {selectedCard.documentUrl ? (
                                        <Button
                                            variant="contained"
                                            color="info"
                                            startIcon={<DownloadIcon />}
                                            href={selectedCard.documentUrl}
                                            target="_blank"
                                        >
                                            View Attached Document
                                        </Button>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">No documents attached.</Typography>
                                    )}
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                            <Box display="flex" gap={1}>
                                <Button
                                    variant="outlined"
                                    color="success"
                                    startIcon={<CheckCircleIcon />}
                                    disabled={updating || selectedCard.status === 'APPROVED'}
                                    onClick={() => handleStatusUpdate(selectedCard.id, 'APPROVED')}
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<CancelIcon />}
                                    disabled={updating || selectedCard.status === 'REJECTED'}
                                    onClick={() => handleStatusUpdate(selectedCard.id, 'REJECTED')}
                                >
                                    Reject
                                </Button>
                            </Box>
                            <Button onClick={() => setSelectedCard(null)} variant="outlined">Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}
