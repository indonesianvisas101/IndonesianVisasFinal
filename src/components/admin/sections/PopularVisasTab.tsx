"use client";

import React from "react";
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
    Typography,
    Stack,
    Chip
} from "@mui/material";
import { VisaType } from "@/constants/visas";
import { formatCurrency } from "@/lib/utils";

interface PopularVisasTabProps {
    visas: VisaType[];
    popularVisaIds: string[];
    handleTogglePopular: (id: string) => Promise<void>;
}

export default function PopularVisasTab({ visas, popularVisaIds, handleTogglePopular }: PopularVisasTabProps) {
    const popularVisas = visas.filter(v => popularVisaIds.includes(v.id));

    return (
        <Stack spacing={4} sx={{ animation: 'fadeIn 0.5s ease' }}>
            <Box>
                <Typography variant="h4" fontWeight="bold">Most Popular Visas</Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage the top priority visas displayed on the homepage.
                </Typography>
            </Box>

            <Card>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="popular visas table">
                        <TableHead sx={{ bgcolor: 'background.default' }}>
                            <TableRow>
                                <TableCell>PRODUCT NAME</TableCell>
                                <TableCell>ID VISA</TableCell>
                                <TableCell>PRICES (IDR)</TableCell>
                                <TableCell>FEES (IDR)</TableCell>
                                <TableCell>VALIDITY</TableCell>
                                <TableCell align="right">ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {popularVisas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body2" sx={{ py: 4, color: 'text.secondary' }}>
                                            No popular visas selected. Add them from the Visa Database.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                popularVisas.map((row) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight="bold">{row.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{row.category}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.id}
                                                size="small"
                                                color="primary"
                                                variant="filled"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {typeof row.price === 'object' && row.price !== null ? (
                                                <Stack spacing={0.5}>
                                                    {Object.entries(row.price).map(([key, val]) => (
                                                        <Typography key={key} variant="caption" display="block" fontFamily="monospace" color="text.secondary">
                                                            <Box component="span" sx={{ opacity: 0.7 }}>{key}:</Box> {String(val)}
                                                        </Typography>
                                                    ))}
                                                </Stack>
                                            ) : (
                                                <Typography variant="body2" fontFamily="monospace" fontWeight="bold">
                                                    {String(row.price)}
                                                </Typography>
                                            )}
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
                                                    {typeof row.fee === 'number' ? formatCurrency(row.fee) : row.fee}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>{row.validity}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="error"
                                                onClick={() => handleTogglePopular(row.id)}
                                            >
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Stack>
    );
}
