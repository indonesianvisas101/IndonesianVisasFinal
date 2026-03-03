"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    Typography,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    TextField,
    CircularProgress,
    MenuItem,
    Switch,
    FormControlLabel
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BusinessIcon from "@mui/icons-material/Business";

interface CompanyService {
    id: string;
    category: string;
    name: string;
    price: string;
    description: string;
    features: string[]; // parsed JSON
    isActive: boolean;
}

export default function CompanyServicesTab() {
    const [services, setServices] = useState<CompanyService[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        id: "",
        category: "Foreign-Owned Company (PT PMA)",
        name: "",
        price: "",
        description: "",
        featuresStr: "", // Joined by newlines for editing
        isActive: true
    });

    const CATEGORIES = [
        "Foreign-Owned Company (PT PMA)",
        "Local Limited Liability Company (PT)",
        "Limited Partnership (CV)",
        "Sole Shareholder Company (PT Perorangan)",
        "Foundation (Yayasan)",
        "Company Formation", // General
        "Legal Services",
        "Compliance Services",
        "Business Services",
        "Certification Services"
    ];

    // Initial Fetch
    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/company-services?isAdmin=true');
            if (res.ok) {
                const data = await res.json();
                setServices(data);
            }
        } catch (error) {
            console.error("Failed to fetch services", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (item: CompanyService, newVal: boolean) => {
        // Optimistic update
        setServices(prev => prev.map(s => s.id === item.id ? { ...s, isActive: newVal } : s));
        try {
            await fetch('/api/company-services', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...item, isActive: newVal })
            });
        } catch (e) {
            console.error("Toggle failed", e);
            fetchServices(); // revert on error
        }
    };

    const handleMove = async (item: CompanyService, direction: number) => {
        const index = services.findIndex(s => s.id === item.id);
        if (index < 0) return;
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= services.length) return;

        // Swap order in local state for speed
        const newServices = [...services];
        const targetItem = newServices[targetIndex];

        // Swap their sortOrder values (assuming sortOrder is present, else use index)
        const itemOrder = (item as any).sortOrder || index;
        const targetOrder = (targetItem as any).sortOrder || targetIndex;

        // Actually we should just swap the items in the array and re-assign sortOrder based on new index
        // But to persist, we need to update both items in DB.

        // Simplest: Swap sortOrder values then PUT update both.

        await fetch('/api/company-services', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, sortOrder: targetOrder })
        });

        await fetch('/api/company-services', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...targetItem, sortOrder: itemOrder })
        });

        fetchServices();
    };

    const handleOpenCreate = () => {
        setFormData({
            id: "",
            category: CATEGORIES[0],
            name: "",
            price: "",
            description: "",
            featuresStr: "",
            isActive: true
        });
        setOpenDialog(true);
    };

    const handleOpenEdit = (item: CompanyService) => {
        setFormData({
            id: item.id,
            category: item.category,
            name: item.name,
            price: item.price,
            description: item.description,
            featuresStr: item.features.join('\n'),
            isActive: item.isActive
        });
        setOpenDialog(true);
    };

    const handleSave = async () => {
        const payload = {
            ...formData,
            features: formData.featuresStr.split('\n').filter(s => s.trim() !== '')
        };

        const method = formData.id ? 'PUT' : 'POST';

        try {
            const res = await fetch('/api/company-services', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                fetchServices(); // Refresh list
                setOpenDialog(false);
            } else {
                alert("Failed to save service");
            }
        } catch (error) {
            console.error("Error saving service", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return;

        try {
            const res = await fetch(`/api/company-services?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setServices(prev => prev.filter(s => s.id !== id));
            }
        } catch (error) {
            alert("Failed to delete service");
        }
    };

    const formatPrice = (price: string) => {
        if (!price || price === 'NaN') return 'Rp 0';
        const num = Number(price);
        if (isNaN(num)) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
    };

    return (
        <Stack spacing={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                    <Typography variant="h4" fontWeight="bold">Company Formation Services</Typography>
                    <Typography variant="body1" color="text.secondary">Manage packages and prices for company services.</Typography>
                </div>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreate}
                >
                    Add Service
                </Button>
            </Box>

            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ORDER</TableCell>
                                <TableCell>CATEGORY</TableCell>
                                <TableCell>PACKAGE NAME</TableCell>
                                <TableCell>PRICE</TableCell>
                                <TableCell>STATUS</TableCell>
                                <TableCell align="right">ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center"><CircularProgress /></TableCell>
                                </TableRow>
                            ) : services.map((item, index) => (
                                <TableRow key={item.id} hover>
                                    <TableCell>
                                        <Stack direction="row" spacing={0}>
                                            <IconButton size="small" onClick={() => handleMove(item, -1)} disabled={index === 0}>
                                                <Typography variant="caption">▲</Typography>
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleMove(item, 1)} disabled={index === services.length - 1}>
                                                <Typography variant="caption">▼</Typography>
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">{item.category}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography fontWeight="bold">{item.name}</Typography>
                                    </TableCell>
                                    <TableCell>{formatPrice(item.price)}</TableCell>
                                    <TableCell>
                                        <Switch
                                            size="small"
                                            checked={item.isActive}
                                            onChange={(e) => handleToggleActive(item, e.target.checked)}
                                        />
                                        <Typography variant="caption" sx={{ ml: 1 }}>{item.isActive ? 'Active' : 'Inactive'}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" onClick={() => handleOpenEdit(item)} aria-label="Edit Service">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(item.id)} aria-label="Delete Service">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{formData.id ? "Edit Service" : "New Service"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            select
                            label="Category"
                            fullWidth
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            {CATEGORIES.map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Service Name (e.g. PT PMA)"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        <TextField
                            label="Price (IDR)"
                            type="number"
                            fullWidth
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            multiline
                            rows={2}
                            fullWidth
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <TextField
                            label="Features (One per line)"
                            multiline
                            rows={4}
                            fullWidth
                            value={formData.featuresStr}
                            onChange={(e) => setFormData({ ...formData, featuresStr: e.target.value })}
                            helperText="Enter each feature on a new line."
                        />
                        <FormControlLabel
                            control={<Switch checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />}
                            label="Is Active"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Stack >
    );
}
