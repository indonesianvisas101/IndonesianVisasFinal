"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Stack,
    Avatar,
    IconButton,
    Button,
    Divider,
    TextField,
    Tooltip,
} from "@mui/material";
import {
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    AccessTime as AccessTimeIcon,
    AttachMoney as AttachMoneyIcon,
    MoreVert as MoreVertIcon,
    NotificationsActive as NotificationsActiveIcon,
    Campaign as CampaignIcon,
    Speed as SpeedIcon,
    Refresh as RefreshIcon,
    Description as DescriptionIcon,
    CloudUpload as CloudUploadIcon,
    Dashboard as DashboardIcon,
    Business as BusinessIcon,
    VerifiedUser as VerifiedUserIcon,
    Receipt as ReceiptIcon,
    Login as LoginIcon,
    AddCircle as AddCircleIcon,
    Lock as LockIcon,
    BarChart as AnalyticsIcon,
    Message as MessageIcon
} from "@mui/icons-material";
import RevenueChart from "./RevenueChart";
import { useApplication } from "@/components/application/ApplicationContext";
import { sendAdminAlert } from "@/app/actions/sendAdminAlert";

interface DashboardTabProps {
    user: any;
    stats: any[];
    allNotifications: any[];
    latestNotification: any;
    setShowNotificationsModal: (show: boolean) => void;
    setAllNotifications: React.Dispatch<React.SetStateAction<any[]>>;
    setLatestNotification: React.Dispatch<React.SetStateAction<any>>;
    checkingHealth: boolean;
    setCheckingHealth: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DashboardTab({
    user,
    stats,
    allNotifications,
    latestNotification,
    setShowNotificationsModal,
    setAllNotifications,
    setLatestNotification,
    checkingHealth,
    setCheckingHealth
}: DashboardTabProps) {
    const { updateAnnouncement } = useApplication();
    
    // States
    const [healthStatus, setHealthStatus] = useState<Record<string, boolean>>({});
    const [broadcastData, setBroadcastData] = useState({
        text: "",
        imageUrl: "",
        link: ""
    });

    // --- LOGIC: BROADCAST ---
    const handleBroadcast = () => {
        if (!broadcastData.text) {
            alert("Please enter announcement text.");
            return;
        }
        updateAnnouncement(broadcastData);
        alert("Announcement broadcasted to all users!");
        setBroadcastData({ text: "", imageUrl: "", link: "" });
    };

    // --- LOGIC: HEALTH CHECK ---
    const checkHealth = async (service: string = 'all') => {
        setCheckingHealth(true);

        const checks: Record<string, () => Promise<boolean>> = {
            database: async () => simpleFetch('/api/health'),
            supabase: async () => simpleFetch('/api/storage'),
            admin: async () => simpleFetch('/api/admin/stats'),
            public: async () => simpleFetch('/api/public'),
            openai: async () => simpleFetch('/api/chat'),
            google_maps: async () => simpleFetch('/api/google-maps'),
            internal_chat: async () => simpleFetch('/api/internal-chat'),
            login: async () => simpleFetch('/api/auth/session'),
            register: async () => simpleFetch('/api/users'),
            forgot_password: async () => simpleFetch('/api/forgot-password'),
            users: async () => simpleFetch('/api/users?limit=1'),
            visas: async () => simpleFetch('/api/visas?limit=1'),
            company: async () => simpleFetch('/api/company-services'),
            verification: async () => simpleFetch('/api/verification?check=true'),
            invoicing: async () => simpleFetch('/api/invoices?limit=1'),
            applications: async () => simpleFetch('/api/applications?limit=1'),
            documents: async () => simpleFetch('/api/documents'),
            notifications: async () => simpleFetch('/api/notifications'),
            upload: async () => simpleFetch('/api/upload'),
            reporting: async () => simpleFetch('/api/admin/reports')
        };

        const simpleFetch = async (url: string) => {
            try {
                const res = await fetch(url, { method: 'HEAD' });
                if (res.status === 405 || res.ok) return true;
                const res2 = await fetch(url);
                return res2.ok || (res2.status < 500);
            } catch { return false; }
        };

        const runCheck = async (key: string) => {
            if (checks[key]) {
                let result = await checks[key]();
                if (!result) {
                    await new Promise(r => setTimeout(r, 2000));
                    result = await checks[key]();
                }
                setHealthStatus((prev: any) => ({ ...prev, [key]: result }));
                if (!result && service !== 'all') {
                    const title = `System Alert: ${key.toUpperCase()} Critical Failure`;
                    setAllNotifications(prev => {
                        if (prev.find(n => n.title === title)) return prev;
                        return [{
                            id: `alert-${Date.now()}`,
                            title: title,
                            message: `Auto-recovery failed for ${key}. Admin has been notified.`,
                            type: 'error',
                            read: false,
                            createdAt: new Date().toISOString()
                        }, ...prev];
                    });
                    sendAdminAlert(title, `Service '${key}' is offline and auto-recovery failed.`);
                }
            }
        };

        if (service === 'all') {
            await Promise.all(Object.keys(checks).map(async (key) => {
                await new Promise(r => setTimeout(r, Math.random() * 500));
                return runCheck(key);
            }));
        } else {
            await runCheck(service);
        }
        setCheckingHealth(false);
    };

    useEffect(() => {
        checkHealth('all');
    }, []);

    return (
        <Stack spacing={3} sx={{ animation: 'fadeIn 0.5s ease' }}>
            {/* ROW 1: Welcome & Statistics */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Information Center</Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                {Array.isArray(allNotifications) && allNotifications.length > 0
                                    ? `You have ${allNotifications.length} active notifications.`
                                    : "No new notifications. System is running smoothly."}
                            </Typography>
                            {latestNotification && (
                                <Box sx={{ mb: 2, p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                    <Typography variant="subtitle2" fontWeight="bold" color="primary">Latest: {latestNotification.title}</Typography>
                                    <Typography variant="caption" color="text.secondary" noWrap display="block">{latestNotification.message}</Typography>
                                </Box>
                            )}
                            <Button variant="contained" size="small" fullWidth onClick={() => setShowNotificationsModal(true)} startIcon={<NotificationsActiveIcon />}>
                                View All Notifications
                            </Button>
                            <Box sx={{ position: 'absolute', right: 10, bottom: 10, opacity: 0.1 }}>
                                <NotificationsActiveIcon sx={{ fontSize: 100, color: 'primary.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Grid container spacing={3}>
                        {stats.map((stat, idx) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Avatar variant="rounded" sx={{ bgcolor: stat.bg, color: stat.color }}>{stat.icon}</Avatar>
                                            <IconButton size="small"><MoreVertIcon fontSize="small" /></IconButton>
                                        </Stack>
                                        <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5 }}>{stat.value}</Typography>
                                        <Typography variant="body2" color="text.secondary">{stat.title}</Typography>
                                        <Typography variant="caption" color={stat.isPositive ? "success.main" : "error.main"} fontWeight="bold">{stat.change}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>

            {/* ROW 1.5: SYSTEM HEALTH PANEL */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardHeader
                            title="Smart System Health Panel"
                            subheader="Real-time control & connection status of all system APIs"
                            action={
                                <Button startIcon={<SpeedIcon />} size="small" onClick={() => checkHealth('all')} disabled={checkingHealth} variant="contained" color="primary">
                                    {checkingHealth ? "Running Diagnostics..." : "Run Global Diagnostics"}
                                </Button>
                            }
                        />
                        <Divider />
                        <CardContent sx={{ maxHeight: 600, overflowY: 'auto' }}>
                            {[
                                { title: "Core Infrastructure", items: [
                                    { key: 'database', label: 'Primary Database', icon: <DescriptionIcon /> },
                                    { key: 'supabase', label: 'Supabase Storage', icon: <CloudUploadIcon /> },
                                    { key: 'admin', label: 'Admin API', icon: <DashboardIcon /> },
                                    { key: 'public', label: 'Public API', icon: <PeopleIcon /> },
                                ]},
                                { title: "External Integration", items: [
                                    { key: 'openai', label: 'OpenAI API', icon: <Box component="span" sx={{ fontSize: 20 }}>🤖</Box> },
                                    { key: 'google_maps', label: 'Google Maps', icon: <Box component="span" sx={{ fontSize: 20 }}>🗺️</Box> },
                                    { key: 'internal_chat', label: 'Internal Chat', icon: <MessageIcon /> },
                                ]},
                                { title: "Authentication", items: [
                                    { key: 'login', label: 'System Login', icon: <LoginIcon /> },
                                    { key: 'register', label: 'Register', icon: <AddCircleIcon /> },
                                    { key: 'forgot_password', label: 'Forgot Password', icon: <LockIcon /> },
                                ]},
                                { title: "Feature APIs", items: [
                                    { key: 'users', label: 'User Database', icon: <PeopleIcon /> },
                                    { key: 'visas', label: 'Visa Database', icon: <DescriptionIcon /> },
                                    { key: 'company', label: 'Company Services', icon: <BusinessIcon /> },
                                    { key: 'verification', label: 'Verification', icon: <VerifiedUserIcon /> },
                                    { key: 'invoicing', label: 'Invoicing', icon: <ReceiptIcon /> },
                                    { key: 'applications', label: 'Applications', icon: <AssignmentIcon /> },
                                    { key: 'documents', label: 'Documents', icon: <DescriptionIcon /> },
                                    { key: 'notifications', label: 'Notifications', icon: <NotificationsActiveIcon /> },
                                    { key: 'upload', label: 'Upload System', icon: <CloudUploadIcon /> },
                                ]},
                                { title: "Production Intelligence", items: [
                                    { key: 'reporting', label: 'Dynamic Reporting', icon: <AnalyticsIcon /> },
                                ]}
                            ].map((group, gIdx) => (
                                <Box key={gIdx} sx={{ mb: 3 }}>
                                    <Typography variant="overline" color="text.secondary" fontWeight="bold" sx={{ display: 'block', mb: 1 }}>{group.title}</Typography>
                                    <Grid container spacing={2}>
                                        {group.items.map((service) => (
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={service.key}>
                                                <Box sx={{
                                                    p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5,
                                                    bgcolor: healthStatus?.[service.key] ? 'success.lighter' : healthStatus?.[service.key] === false ? 'error.lighter' : 'background.paper',
                                                    position: 'relative', overflow: 'hidden', transition: 'all 0.2s', '&:hover': { boxShadow: 2 }
                                                }}>
                                                    <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, bgcolor: healthStatus?.[service.key] ? 'success.main' : healthStatus?.[service.key] === false ? 'error.main' : 'grey.300' }} />
                                                    <Box display="flex" alignItems="center" gap={1.5}>
                                                        <Avatar sx={{
                                                            bgcolor: healthStatus?.[service.key] ? 'success.light' : healthStatus?.[service.key] === false ? 'error.light' : 'action.disabledBackground',
                                                            color: healthStatus?.[service.key] ? 'success.main' : healthStatus?.[service.key] === false ? 'error.main' : 'text.disabled',
                                                            width: 32, height: 32
                                                        }}>{service.icon}</Avatar>
                                                        <Box>
                                                            <Typography variant="caption" fontWeight="bold" display="block" sx={{ lineHeight: 1.1 }}>{service.label}</Typography>
                                                            <Typography variant="caption" sx={{ fontSize: '0.65rem' }} color="text.secondary">
                                                                {healthStatus?.[service.key] ? 'Online' : healthStatus?.[service.key] === false ? 'Offline' : 'Pending'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Tooltip title={`Trigger ${service.label} Check`}>
                                                        <IconButton size="small" onClick={() => checkHealth(service.key)} disabled={checkingHealth} sx={{ width: 28, height: 28, border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'primary.lighter', color: 'primary.main', borderColor: 'primary.main' } }}>
                                                            <RefreshIcon sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* ROW 2: Broadcast Panel */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
                        <CardHeader title="Broadcast Announcement" avatar={<Avatar sx={{ bgcolor: 'error.main' }}><CampaignIcon /></Avatar>} />
                        <CardContent>
                            <Stack spacing={2}>
                                <Typography variant="body2" color="text.secondary">Send a message to all user dashboards immediately.</Typography>
                                <TextField label="Message" multiline rows={3} fullWidth size="small" value={broadcastData.text} onChange={(e) => setBroadcastData({ ...broadcastData, text: e.target.value })} />
                                <TextField label="Image URL (Optional)" fullWidth size="small" value={broadcastData.imageUrl} onChange={(e) => setBroadcastData({ ...broadcastData, imageUrl: e.target.value })} />
                                <TextField label="Link URL (Optional)" fullWidth size="small" value={broadcastData.link} onChange={(e) => setBroadcastData({ ...broadcastData, link: e.target.value })} />
                                <Button variant="contained" color="error" startIcon={<CampaignIcon />} onClick={handleBroadcast}>Broadcast Now</Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <RevenueChart />
                </Grid>
            </Grid>
        </Stack>
    );
}
