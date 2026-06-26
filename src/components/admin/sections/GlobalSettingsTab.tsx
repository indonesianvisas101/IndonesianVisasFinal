
"use client";

import React, { useState, useEffect } from 'react';
import { 
    Box, Card, Typography, Button, TextField, Stack, Switch, FormControlLabel,
    Divider, CircularProgress, Alert, IconButton
} from '@mui/material';
import { 
    Save as SaveIcon, 
    Refresh as RefreshIcon, 
    NotificationsActive as NotificationIcon,
    Email as EmailIcon,
    Add as AddIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

export default function GlobalSettingsTab() {
    const [settings, setSettings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [popupConfig, setPopupConfig] = useState<any>({
        title: '',
        description: '',
        isActive: false,
        trimTime: 3000,
        stayTime: 10000
    });
    const [popupEnabled, setPopupEnabled] = useState(false);

    // Master Email settings state
    const [forwardEmails, setForwardEmails] = useState<string[]>([]);
    const [newEmail, setNewEmail] = useState('');
    const [emailsEnabled, setEmailsEnabled] = useState(false);
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/settings');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
                
                const popup = data.find((s: any) => s.key === 'GLOBAL_INFO_POPUP');
                if (popup) {
                    setPopupConfig(JSON.parse(popup.value));
                    setPopupEnabled(popup.isEnabled);
                }

                const forwardSetting = data.find((s: any) => s.key === 'MASTER_FORWARD_EMAILS');
                if (forwardSetting) {
                    setEmailsEnabled(forwardSetting.isEnabled);
                    try {
                        const parsed = JSON.parse(forwardSetting.value);
                        if (Array.isArray(parsed)) {
                            setForwardEmails(parsed);
                        }
                    } catch (e) {
                        setForwardEmails(forwardSetting.value ? forwardSetting.value.split(',') : []);
                    }
                }
            }
        } catch (e) {
            console.error("Failed to fetch settings", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSavePopup = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: 'GLOBAL_INFO_POPUP',
                    value: JSON.stringify(popupConfig),
                    isEnabled: popupEnabled
                })
            });
            if (res.ok) alert("Settings saved successfully!");
        } catch (e) {
            console.error("Save error", e);
        } finally {
            setSaving(false);
        }
    };

    const handleAddEmail = () => {
        setEmailError('');
        const trimmed = newEmail.trim().toLowerCase();
        if (!trimmed) return;

        // Basic email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        if (forwardEmails.includes(trimmed)) {
            setEmailError('This email is already in the list.');
            return;
        }

        if (forwardEmails.length >= 10) {
            setEmailError('You can add a maximum of 10 forwarding emails.');
            return;
        }

        setForwardEmails([...forwardEmails, trimmed]);
        setNewEmail('');
    };

    const handleRemoveEmail = (email: string) => {
        setForwardEmails(forwardEmails.filter(e => e !== email));
    };

    const handleSaveEmails = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: 'MASTER_FORWARD_EMAILS',
                    value: JSON.stringify(forwardEmails),
                    isEnabled: emailsEnabled
                })
            });
            if (res.ok) {
                alert("Master email settings saved successfully!");
            } else {
                throw new Error("Failed to save settings");
            }
        } catch (e) {
            console.error("Save error", e);
            alert("Failed to save master email settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>;

    return (
        <Stack spacing={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h4" fontWeight="bold">Global System Settings</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Control global features, notifications, and emergency site controls.
                    </Typography>
                </Box>
                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchSettings}>Refresh</Button>
            </Box>

            <Card sx={{ p: 4, borderRadius: 4 }}>
                <Stack spacing={3}>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <NotificationIcon color="primary" />
                        <Typography variant="h6" fontWeight="bold">Global Info Popup</Typography>
                    </Box>
                    <Divider />
                    
                    <FormControlLabel
                        control={
                            <Switch 
                                checked={popupEnabled} 
                                onChange={(e) => setPopupEnabled(e.target.checked)} 
                                color="primary"
                            />
                        }
                        label={<Typography fontWeight="bold">Enable Worldwide Alert System</Typography>}
                    />
                    
                    <Stack spacing={2} sx={{ opacity: popupEnabled ? 1 : 0.5 }}>
                        <TextField 
                            label="Popup Title" fullWidth 
                            value={popupConfig.title} 
                            disabled={!popupEnabled}
                            onChange={(e) => setPopupConfig({...popupConfig, title: e.target.value})}
                        />
                        <TextField 
                            label="Alert Message / Description" fullWidth multiline rows={4}
                            value={popupConfig.description} 
                            disabled={!popupEnabled}
                            onChange={(e) => setPopupConfig({...popupConfig, description: e.target.value})}
                            placeholder="Enter the message you want every visitor to see..."
                        />
                        <FormControlLabel
                            control={
                                <Switch 
                                    checked={popupConfig.isActive} 
                                    onChange={(e) => setPopupConfig({...popupConfig, isActive: e.target.checked})} 
                                    color="secondary"
                                    disabled={!popupEnabled}
                                />
                            }
                            label="Live Status (Active for all sessions)"
                        />

                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" color="text.secondary" fontWeight="bold">Popup Timing Controls (Milliseconds)</Typography>
                        
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField 
                                label="Trim Time (Delay before show)" 
                                type="number"
                                fullWidth 
                                value={popupConfig.trimTime || 3000} 
                                disabled={!popupEnabled}
                                onChange={(e) => setPopupConfig({...popupConfig, trimTime: parseInt(e.target.value) || 0})}
                                helperText="e.g., 3000 = 3 seconds delay"
                            />
                            <TextField 
                                label="Stay Time (Visibility duration)" 
                                type="number"
                                fullWidth 
                                value={popupConfig.stayTime || 10000} 
                                disabled={!popupEnabled}
                                onChange={(e) => setPopupConfig({...popupConfig, stayTime: parseInt(e.target.value) || 0})}
                                helperText="e.g., 10000 = 10 seconds duration"
                            />
                        </Stack>
                    </Stack>
                    
                    <Box mt={2}>
                        <Button 
                            variant="contained" 
                            startIcon={<SaveIcon />} 
                            onClick={handleSavePopup}
                            disabled={saving}
                            sx={{ bgcolor: '#1a1a1a', color: 'white', px: 4, py: 1.5, borderRadius: 3 }}
                        >
                            {saving ? 'Saving...' : 'Save Configuration'}
                        </Button>
                    </Box>
                </Stack>
            </Card>

            <Card sx={{ p: 4, borderRadius: 4 }}>
                <Stack spacing={3}>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <EmailIcon color="primary" />
                        <Typography variant="h6" fontWeight="bold">Email Master forwarding</Typography>
                    </Box>
                    <Divider />

                    <FormControlLabel
                        control={
                            <Switch 
                                checked={emailsEnabled} 
                                onChange={(e) => setEmailsEnabled(e.target.checked)} 
                                color="primary"
                            />
                        }
                        label={<Typography fontWeight="bold">Enable Order & Complaint Forwarding</Typography>}
                    />

                    <Stack spacing={2} sx={{ opacity: emailsEnabled ? 1 : 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                            All incoming orders and customer complaints will be automatically forwarded to the emails configured below (Max 10 emails).
                        </Typography>

                        <Stack direction="row" spacing={1} alignItems="flex-start">
                            <TextField
                                label="Forwarding Email Address"
                                size="small"
                                fullWidth
                                disabled={!emailsEnabled}
                                value={newEmail}
                                onChange={(e) => {
                                    setNewEmail(e.target.value);
                                    if (emailError) setEmailError('');
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddEmail();
                                    }
                                }}
                                error={!!emailError}
                                helperText={emailError}
                                placeholder="example@domain.com"
                            />
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                disabled={!emailsEnabled || !newEmail}
                                onClick={handleAddEmail}
                                sx={{ py: 1, px: 3, height: '40px', borderRadius: 2 }}
                            >
                                Add
                            </Button>
                        </Stack>

                        {forwardEmails.length > 0 && (
                            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2, bgcolor: 'action.hover' }}>
                                <Typography variant="subtitle2" fontWeight="bold" mb={1} color="text.secondary">
                                    Configured Recipients ({forwardEmails.length}/10):
                                </Typography>
                                <Stack spacing={1}>
                                    {forwardEmails.map((email) => (
                                        <Box 
                                            key={email} 
                                            display="flex" 
                                            justifyContent="space-between" 
                                            alignItems="center" 
                                            sx={{ 
                                                p: 1.5, 
                                                bgcolor: 'background.paper', 
                                                borderRadius: 2, 
                                                border: '1px solid', 
                                                borderColor: 'divider' 
                                            }}
                                        >
                                            <Typography variant="body2" fontWeight="bold">{email}</Typography>
                                            <IconButton 
                                                size="small" 
                                                color="error" 
                                                disabled={!emailsEnabled}
                                                onClick={() => handleRemoveEmail(email)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        )}
                    </Stack>

                    <Box mt={2}>
                        <Button 
                            variant="contained" 
                            startIcon={<SaveIcon />} 
                            onClick={handleSaveEmails}
                            disabled={saving}
                            sx={{ bgcolor: '#1a1a1a', color: 'white', px: 4, py: 1.5, borderRadius: 3 }}
                        >
                            {saving ? 'Saving...' : 'Save Email Configuration'}
                        </Button>
                    </Box>
                </Stack>
            </Card>

            <Alert severity="info" sx={{ borderRadius: 3 }}>
                The Global Info Popup and Master Email List configurations are applied site-wide.
            </Alert>
        </Stack>
    );
}
