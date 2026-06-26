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
    Divider,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Tooltip,
    MenuItem,
    ListItemIcon
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

interface UsersTabProps {
    usersList: any[];
    setUsersList: React.Dispatch<React.SetStateAction<any[]>>;
    addDocument: (userId: string, doc: any) => void;
}

export default function UsersTab({ usersList, setUsersList, addDocument }: UsersTabProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [docName, setDocName] = useState("");
    const [docUrl, setDocUrl] = useState("");

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            const res = await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingUser)
            });

            if (res.ok) {
                const updated = await res.json();
                setUsersList(prev => prev.map(u => u.id === updated.id ? updated : u));
                setEditingUser(null);
                alert("User updated successfully!");
            } else {
                const errData = await res.json();
                alert(`Failed to update user: ${errData.details || errData.error || 'Unknown error'}`);
            }
        } catch (e) {
            console.error("Error saving user", e);
            alert("Error saving user.");
        }
    };

    const handleDeleteApplication = async (appId: string) => {
        if (!confirm("Are you sure you want to delete this visa history record?")) return;
        try {
            const res = await fetch(`/api/applications?id=${appId}`, { method: 'DELETE' });
            if (res.ok) {
                setEditingUser((prev: any) => prev ? {
                    ...prev,
                    applications: prev.applications.filter((a: any) => a.id !== appId)
                } : null);
                alert("Record deleted.");
            }
        } catch (e) {
            console.error("Delete App Error", e);
        }
    };

    const handleDeleteDocument = async (docId: string) => {
        if (!confirm("Are you sure you want to delete this document?")) return;
        try {
            const res = await fetch(`/api/documents?id=${docId}`, { method: 'DELETE' });
            if (res.ok) {
                setEditingUser((prev: any) => prev ? {
                    ...prev,
                    documents: prev.documents.filter((d: any) => d.id !== docId)
                } : null);
                alert("Document deleted.");
            }
        } catch (e) {
            console.error("Delete Doc Error", e);
        }
    };

    const handleAddLink = async () => {
        if (!editingUser || !docName || !docUrl) {
            alert("Please enter both Document Name and URL.");
            return;
        }

        try {
            const res = await fetch('/api/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: editingUser.id,
                    name: docName,
                    type: "application/link",
                    size: "Link",
                    url: docUrl
                })
            });

            if (res.ok) {
                const newDoc = await res.json();
                addDocument(editingUser.id, newDoc);
                alert(`Link "${docName}" added successfully!`);
                setDocName("");
                setDocUrl("");
            }
        } catch (e) {
            console.error("Link add error", e);
        }
    };

    const filteredUsers = usersList.filter(u =>
        (u.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (u.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    return (
        <Stack spacing={4}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" flexWrap="wrap" gap={2}>
                <div>
                    <Typography variant="h4" fontWeight="bold">User Management</Typography>
                    <Typography variant="body1" color="text.secondary">Total registered members: {usersList.length}</Typography>
                </div>
                <TextField
                    size="small"
                    placeholder="Search Users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                        sx: { bgcolor: 'background.paper', borderRadius: 2 }
                    }}
                />
            </Box>

            <Card>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: 'background.default' }}>
                            <TableRow>
                                <TableCell>USER</TableCell>
                                <TableCell>ROLE</TableCell>
                                <TableCell>VERIFIED</TableCell>
                                <TableCell>JOINED</TableCell>
                                <TableCell align="right">ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                {user.name ? user.name[0].toUpperCase() : <PersonIcon />}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">{user.name || "Anonymous"}</Typography>
                                                <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={user.role || 'user'} size="small" 
                                            color={user.role === 'admin' ? 'secondary' : (user.role === 'worker' ? 'primary' : 'default')} />
                                    </TableCell>
                                    <TableCell>
                                        {user.isVerified ? <VerifiedUserIcon color="success" fontSize="small" /> : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{new Date(user.createdAt).toLocaleDateString()}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button size="small" startIcon={<EditIcon />} onClick={() => setEditingUser(user)}>
                                            Manage
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* EDIT USER DIALOG */}
            <Dialog open={!!editingUser} onClose={() => setEditingUser(null)} fullWidth maxWidth="md">
                <DialogTitle sx={{ fontWeight: 'bold' }}>Manage User: {editingUser?.name || editingUser?.email}</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={4} pt={1}>
                        {/* PROFILE SECTION */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">Basic Profile</Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField label="Full Name" fullWidth value={editingUser?.name || ''}
                                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField label="Role" select fullWidth value={editingUser?.role || 'user'}
                                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
                                        <MenuItem value="user">User</MenuItem>
                                        <MenuItem value="worker">Worker / Staff</MenuItem>
                                        <MenuItem value="admin">Administrator</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>
                            <Button variant="contained" sx={{ mt: 2 }} onClick={handleSaveUser}>Update Profile</Button>
                        </Box>

                        <Divider />

                        {/* DOCUMENTS SECTION */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">Document Storage (e-Visa / Passport)</Typography>
                            <Paper sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', mb: 2 }}>
                                <Typography variant="caption" display="block" gutterBottom fontWeight="bold">Link New Document/Asset</Typography>
                                <Stack direction="row" spacing={2}>
                                    <TextField label="Doc Name" size="small" value={docName} onChange={(e) => setDocName(e.target.value)} />
                                    <TextField label="URL" size="small" fullWidth value={docUrl} onChange={(e) => setDocUrl(e.target.value)} />
                                    <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={handleAddLink}>Add Link</Button>
                                </Stack>
                            </Paper>
                            
                            <List>
                                {editingUser?.documents?.map((doc: any) => (
                                    <ListItem key={doc.id} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1, border: '1px solid #f1f5f9' }}>
                                        <ListItemIcon>
                                            {doc.type === 'application/link' ? <LinkIcon color="primary" /> : <DescriptionIcon />}
                                        </ListItemIcon>
                                        <ListItemText primary={doc.name} secondary={`${doc.type} • ${doc.size}`} />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" onClick={() => handleDeleteDocument(doc.id)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>

                        <Divider />

                        {/* VISA HISTORY SECTION */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">Visa Application History</Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                                        <TableRow>
                                            <TableCell>Visa Type</TableCell>
                                            <TableCell>Applied At</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="right">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {editingUser?.applications?.map((app: any) => (
                                            <TableRow key={app.id}>
                                                <TableCell sx={{ fontWeight: 'bold' }}>{app.visaName}</TableCell>
                                                <TableCell>{new Date(app.appliedAt).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Chip label={app.status} size="small" color="primary" variant="outlined" />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton size="small" color="error" onClick={() => handleDeleteApplication(app.id)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingUser(null)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
