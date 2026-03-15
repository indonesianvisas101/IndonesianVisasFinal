
"use client";

import React, { useState, useEffect } from 'react';
import { 
    Box, Card, Typography, Button, TextField, Stack, Switch, FormControlLabel,
    Divider, CircularProgress, Alert
} from '@mui/material';
import { Save as SaveIcon, Refresh as RefreshIcon, NotificationsActive as NotificationIcon } from '@mui/icons-material';

export default function GlobalSettingsTab() {
    const [settings, setSettings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [popupConfig, setPopupConfig] = useState<any>({
        title: '',
        description: '',
        isActive: false
    });
    const [popupEnabled, setPopupEnabled] = useState(false);

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

            <Alert severity="info" sx={{ borderRadius: 3 }}>
                The Global Info Popup will appear with a 4-second delay for all users and auto-close after 10 seconds.
            </Alert>
        </Stack>
    );
}
