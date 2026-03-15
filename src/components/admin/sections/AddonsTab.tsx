
"use client";

import React, { useState, useEffect } from 'react';
import { 
    Box, Card, Typography, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Button, IconButton, Dialog, DialogTitle, 
    DialogContent, DialogActions, TextField, Stack, Chip, CircularProgress,
    MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';

export default function AddonsTab() {
    const [addons, setAddons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingAddon, setEditingAddon] = useState<any>(null);

    useEffect(() => {
        fetchAddons();
    }, []);

    const fetchAddons = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/addons');
            if (res.ok) {
                const data = await res.json();
                setAddons(data);
            }
        } catch (e) {
            console.error("Failed to fetch addons", e);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (addon: any = null) => {
        setEditingAddon(addon || {
            name: '',
            sku: '',
            description: '',
            shortDesc: '',
            price: 0,
            category: 'General',
            isActive: true
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingAddon(null);
    };

    const handleSave = async () => {
        try {
            const method = editingAddon.id ? 'PUT' : 'POST';
            const res = await fetch('/api/addons', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingAddon)
            });

            if (res.ok) {
                fetchAddons();
                handleClose();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to save addon");
            }
        } catch (e) {
            console.error("Save error", e);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this addon?")) return;
        try {
            const res = await fetch(`/api/addons?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchAddons();
        } catch (e) {
            console.error("Delete error", e);
        }
    };

    return (
        <Stack spacing={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h4" fontWeight="bold">Commercial Add-ons</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage extra products like IDiv, Express, and VIP services.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchAddons}>Refresh</Button>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ bgcolor: '#1a1a1a', color: 'white' }}>
                        Add Product
                    </Button>
                </Stack>
            </Box>

            <TableContainer component={Card}>
                <Table>
                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                        <TableRow>
                            <TableCell>SKU</TableCell>
                            <TableCell>PRODUCT NAME</TableCell>
                            <TableCell>CATEGORY</TableCell>
                            <TableCell>PRICE</TableCell>
                            <TableCell>STATUS</TableCell>
                            <TableCell align="right">ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={6} align="center" sx={{ py: 10 }}><CircularProgress /></TableCell></TableRow>
                        ) : addons.map((addon) => (
                            <TableRow key={addon.id} hover>
                                <TableCell><Typography variant="body2" fontWeight="bold">{addon.sku}</Typography></TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold">{addon.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{addon.shortDesc}</Typography>
                                </TableCell>
                                <TableCell><Chip label={addon.category} size="small" /></TableCell>
                                <TableCell><Typography variant="body2" fontWeight="bold">IDR {Number(addon.price).toLocaleString()}</Typography></TableCell>
                                <TableCell>
                                    <Chip 
                                        label={addon.isActive ? 'Active' : 'Inactive'} 
                                        color={addon.isActive ? 'success' : 'default'} 
                                        size="small" 
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => handleOpen(addon)}><EditIcon fontSize="small" /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(addon.id)}><DeleteIcon fontSize="small" /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingAddon?.id ? 'Edit Addon' : 'New Addon'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField 
                            label="SKU (Unique ID)" fullWidth 
                            value={editingAddon?.sku || ''} 
                            onChange={(e) => setEditingAddon({...editingAddon, sku: e.target.value})} 
                        />
                        <TextField 
                            label="Product Name" fullWidth 
                            value={editingAddon?.name || ''} 
                            onChange={(e) => setEditingAddon({...editingAddon, name: e.target.value})} 
                        />
                        <TextField 
                            label="Short Description" fullWidth 
                            value={editingAddon?.shortDesc || ''} 
                            onChange={(e) => setEditingAddon({...editingAddon, shortDesc: e.target.value})} 
                        />
                        <TextField 
                            label="Full Description" fullWidth multiline rows={3}
                            value={editingAddon?.description || ''} 
                            onChange={(e) => setEditingAddon({...editingAddon, description: e.target.value})} 
                        />
                        <Stack direction="row" spacing={2}>
                            <TextField 
                                label="Price (IDR)" type="number" fullWidth 
                                value={editingAddon?.price || 0} 
                                onChange={(e) => setEditingAddon({...editingAddon, price: Number(e.target.value)})} 
                            />
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={editingAddon?.category || 'General'}
                                    label="Category"
                                    onChange={(e) => setEditingAddon({...editingAddon, category: e.target.value})}
                                >
                                    <MenuItem value="Identity">Identity</MenuItem>
                                    <MenuItem value="Service">Service</MenuItem>
                                    <MenuItem value="Safety">Safety</MenuItem>
                                    <MenuItem value="Logistics">Logistics</MenuItem>
                                    <MenuItem value="General">General</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} sx={{ bgcolor: '#1a1a1a', color: 'white' }}>Save Product</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
