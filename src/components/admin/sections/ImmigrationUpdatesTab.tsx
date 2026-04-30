"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Switch,
    FormControlLabel,
    Stack,
    MenuItem,
    Select,
    CircularProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function ImmigrationUpdatesTab() {
    const [updates, setUpdates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingUpdate, setEditingUpdate] = useState<any | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "Immigration",
        summary: "",
        image: "",
        slug: "",
        published: false
    });

    useEffect(() => {
        fetchUpdates();
    }, []);

    const fetchUpdates = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/updates');
            const data = await res.json();
            setUpdates(data);
        } catch (error) {
            console.error("Failed to fetch updates", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenDialog = (update: any = null) => {
        if (update) {
            setEditingUpdate(update);
            setFormData({
                title: update.title,
                content: update.content,
                category: update.category,
                summary: update.summary || "",
                image: update.image || "",
                slug: update.slug,
                published: update.published
            });
        } else {
            setEditingUpdate(null);
            setFormData({
                title: "",
                content: "",
                category: "Immigration",
                summary: "",
                image: "",
                slug: "",
                published: false
            });
        }
        setOpenDialog(true);
    };

    const handleSave = async () => {
        try {
            const url = '/api/admin/updates';
            const method = editingUpdate ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingUpdate ? { ...formData, id: editingUpdate.id } : formData)
            });
            
            if (res.ok) {
                fetchUpdates();
                setOpenDialog(false);
            }
        } catch (error) {
            console.error("Failed to save update", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this update?")) return;
        try {
            const res = await fetch(`/api/admin/updates?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchUpdates();
        } catch (error) {
            console.error("Failed to delete update", error);
        }
    };

    if (isLoading) return (
        <Box display="flex" justifyContent="center" py={12}>
            <CircularProgress />
        </Box>
    );

    return (
        <Box sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" fontWeight="black" color="text.primary">
                    Immigration Updates
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => handleOpenDialog()}
                    sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 'bold' }}
                >
                    Create New Update
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Created At</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'right' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {updates.map((update) => (
                            <TableRow key={update.id} hover>
                                <TableCell sx={{ fontWeight: 'bold' }}>{update.title}</TableCell>
                                <TableCell>
                                    <Chip label={update.category} size="small" sx={{ fontWeight: 'bold' }} />
                                </TableCell>
                                <TableCell>
                                    {update.published ? (
                                        <Chip 
                                            icon={<VisibilityIcon sx={{ fontSize: '16px !important' }} />} 
                                            label="Published" 
                                            color="success" 
                                            size="small" 
                                        />
                                    ) : (
                                        <Chip 
                                            icon={<VisibilityOffIcon sx={{ fontSize: '16px !important' }} />} 
                                            label="Draft" 
                                            variant="outlined"
                                            size="small" 
                                        />
                                    )}
                                    {update.category?.includes('KNOWLEDGE') && (
                                        <Chip label="AI REF" color="info" size="small" sx={{ ml: 1, fontSize: '9px', height: 20 }} />
                                    )}
                                </TableCell>
                                <TableCell color="text.secondary">
                                    {new Date(update.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <IconButton size="small" color="primary" onClick={() => handleOpenDialog(update)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(update.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 'black' }}>
                    {editingUpdate ? 'Edit Update' : 'New Immigration Update'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            fullWidth
                            label="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Select
                                    fullWidth
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as string })}
                                >
                                    <MenuItem value="Immigration">Immigration</MenuItem>
                                    <MenuItem value="Policy">Policy</MenuItem>
                                    <MenuItem value="Travel">Travel</MenuItem>
                                    <MenuItem value="News">General News</MenuItem>
                                </Select>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Custom Slug (Optional)"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            fullWidth
                            label="Summary"
                            multiline
                            rows={2}
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Content (Markdown supported)"
                            multiline
                            rows={10}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                        <Box>
                            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                                Featured Image (Auto-converted to WebP)
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center">
                                {formData.image && (
                                    <Box 
                                        component="img" 
                                        src={formData.image} 
                                        sx={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 1, border: '1px solid divider' }} 
                                    />
                                )}
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={isLoading ? <CircularProgress size={20} /> : <AddIcon />}
                                    disabled={isLoading}
                                >
                                    {formData.image ? 'Change Image' : 'Upload Image'}
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            setIsLoading(true);
                                            try {
                                                // 1. Convert to WebP via Canvas
                                                const bitmap = await createImageBitmap(file);
                                                const canvas = document.createElement('canvas');
                                                // Max width 1200px for blog images
                                                const scale = Math.min(1, 1200 / bitmap.width);
                                                canvas.width = bitmap.width * scale;
                                                canvas.height = bitmap.height * scale;
                                                
                                                const ctx = canvas.getContext('2d');
                                                ctx?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
                                                
                                                const webpBlob = await new Promise<Blob | null>(resolve => 
                                                    canvas.toBlob(resolve, 'image/webp', 0.8)
                                                );

                                                if (!webpBlob) throw new Error("Conversion failed");

                                                // 2. Upload to API
                                                const uploadFormData = new FormData();
                                                uploadFormData.append('file', webpBlob, `update-${Date.now()}.webp`);

                                                const res = await fetch('/api/admin/upload', {
                                                    method: 'POST',
                                                    body: uploadFormData
                                                });

                                                const data = await res.json();
                                                if (data.url) {
                                                    setFormData({ ...formData, image: data.url });
                                                }
                                            } catch (err) {
                                                console.error("Upload error:", err);
                                                alert("Failed to process image.");
                                            } finally {
                                                setIsLoading(false);
                                            }
                                        }}
                                    />
                                </Button>
                                {formData.image && (
                                    <Button size="small" color="error" onClick={() => setFormData({ ...formData, image: '' })}>
                                        Remove
                                    </Button>
                                )}
                            </Stack>
                        </Box>
                        <FormControlLabel
                            control={
                                <Switch 
                                    checked={formData.category?.includes('KNOWLEDGE')} 
                                    onChange={(e) => {
                                        const isKnowledge = e.target.checked;
                                        const baseCat = formData.category.replace('KNOWLEDGE:', '').replace(':KNOWLEDGE', '');
                                        setFormData({ ...formData, category: isKnowledge ? `KNOWLEDGE:${baseCat}` : baseCat });
                                    }} 
                                    color="info"
                                />
                            }
                            label={<Typography variant="body2" fontWeight="bold">Promote to AI Knowledge Reference</Typography>}
                        />
                        <FormControlLabel
                            control={
                                <Switch 
                                    checked={formData.published} 
                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })} 
                                />
                            }
                            label="Publish immediately"
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} disabled={!formData.title || !formData.content}>
                        Save Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
