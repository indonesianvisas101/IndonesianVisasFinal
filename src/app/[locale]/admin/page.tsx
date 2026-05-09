"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Import Supabase Client for Storage

// ... (existing imports)


import { VisaType, POPULAR_VISA_IDS } from "@/constants/visas";
import { VISA_DETAILS } from "@/constants/visaDetails"; // NEW: Import for fallback data
import { useApplication } from "@/components/application/ApplicationContext";
import { useColorMode } from "@/components/ThemeRegistry/ThemeRegistry";
import { formatCurrency } from "@/lib/utils";
import DashboardTab from "@/components/admin/sections/DashboardTab";
import VerificationTab from "@/components/admin/sections/VerificationTab";
import InvoicingTab from "@/components/admin/sections/InvoicingTab";
import ArrivalCardsTab from "@/components/admin/sections/ArrivalCardsTab";
import CompanyServicesTab from "@/components/admin/sections/CompanyServicesTab";
import SupportChatTab from "@/components/admin/sections/SupportChatTab";
import AuditLogTab from "@/components/admin/sections/AuditLogTab";
import AIMasterTab from "@/components/admin/sections/AIMasterTab";
import ImmigrationUpdatesTab from "@/components/admin/sections/ImmigrationUpdatesTab";
import MarketingTab from "@/components/admin/sections/MarketingTab";
import AddonsTab from "@/components/admin/sections/AddonsTab";
import { generatePDF } from "@/lib/pdf-export";

import Link from "@mui/material/Link";
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    Container,
    Grid,
    Paper,
    Avatar,
    Card,
    CardContent,
    CardHeader,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    useTheme,
    useMediaQuery,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    LinearProgress,
    Switch,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Menu, // Added
    Tooltip, // Added
    CircularProgress // Added for Admin loading state
} from "@mui/material";

// ... (Rest of imports)

// MUI Icons
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description"; // For Visas
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import WorkIcon from "@mui/icons-material/Work";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SpeedIcon from "@mui/icons-material/Speed";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LinkIcon from '@mui/icons-material/Link';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Campaign as CampaignIcon, BarChart as BarChartIcon, Assessment as AnalyticsIcon } from "@mui/icons-material";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BusinessIcon from "@mui/icons-material/Business";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login"; // New
import LockIcon from "@mui/icons-material/Lock"; // New
import DownloadIcon from '@mui/icons-material/Download'; // New
import PrintIcon from '@mui/icons-material/Print'; // New
import RefreshIcon from '@mui/icons-material/Refresh'; // New
import MailIcon from '@mui/icons-material/Mail'; // New

import GlobalSettingsTab from "@/components/admin/sections/GlobalSettingsTab";
import VisasTab from "@/components/admin/sections/VisasTab";
import PopularVisasTab from "@/components/admin/sections/PopularVisasTab";
import UsersTab from "@/components/admin/sections/UsersTab";
import HistoryIcon from '@mui/icons-material/History'; // New import
import PsychologyIcon from "@mui/icons-material/Psychology"; // Added
import OrderPanel from "@/components/admin/sections/OrderPanel";
import FinancePanel from "@/components/admin/sections/FinancePanel";
import EmailLogPanel from "@/components/admin/sections/EmailLogPanel";
import { sendAdminAlert } from "@/app/actions/sendAdminAlert"; // Smart Alert System

// Constants & Types
const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 80;

type TabType = 'dashboard' | 'visas' | 'users' | 'settings' | 'popular_visas' | 'verification' | 'company_services' | 'invoicing' | 'support' | 'logs' | 'arrival_cards' | 'ai_master' | 'orders' | 'updates' | 'marketing' | 'finance' | 'email_logs' | 'addons' | 'global_settings';

// Main Content Component (Logic moved here)
function AdminDashboardContent() {
    const { user, isLoading: authLoading, logout } = useAuth();
    const router = useRouter();
    const theme = useTheme();
    const colorMode = useColorMode();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const params = useParams();
    const locale = params?.locale || 'en';
    const {
        visas: globalVisas, // Rename to avoid conflict if needed, or use directly
        addDocument,
        updateAnnouncement,
        notifications: globalNotifications,
        clearNotifications,
        adminUsers,
        updateAdminUser
    } = useApplication();

    // Import the new tab component dynamically or directly if prefered
    // Since it's client component in same app, direct import is fine if we add it to imports
    // But let's use dynamic for consistency if needed, or better, just standard import.
    // I will need to add the import at the top first.
    // Wait, I can't add import at top with this chunk. 
    // I will add import at top in a separate tool call OR I can assume I can do it here if I include top lines?
    // Let's use a separate call for import or just add it here if I can match the top.

    // Actually, I'll use dynamic import inside the component for clean separation? 
    // No, standard import is better. 
    // Let's just do the Tab handling here.

    const [mobileOpen, setMobileOpen] = useState(false);
    const searchParams = useSearchParams();
    const routerActiveTab = (searchParams.get('tab') as TabType) || 'dashboard';
    const [activeTab, setActiveTab] = useState<TabType>(routerActiveTab);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const currentDrawerWidth = isSidebarCollapsed ? 80 : 260;

    useEffect(() => {
        if (routerActiveTab !== activeTab) {
            setActiveTab(routerActiveTab);
        }
    }, [routerActiveTab]);

    const [visas, setVisas] = useState<VisaType[]>([]);
    const [popularVisaIds, setPopularVisaIds] = useState<string[]>([]);
    const [usersList, setUsersList] = useState<any[]>([]);
    const [globalApiLoading, setGlobalApiLoading] = useState(false);
    const [newOrdersCount, setNewOrdersCount] = useState(0);

    const [latestNotification, setLatestNotification] = useState<any>(null);
    const [allNotifications, setAllNotifications] = useState<any[]>([]);

    // PDF Export Anchor
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const pdfMenuOpen = Boolean(anchorEl);

    // Health State
    const [checkingHealth, setCheckingHealth] = useState(false);

    const [stats, setStats] = useState<any[]>([]);

    // Modals
    const [showNotificationsModal, setShowNotificationsModal] = useState(false);
    const [selectedVerificationUser, setSelectedVerificationUser] = useState<string | null>(null);


    useEffect(() => {
        const fetchInitialData = async () => {
            setGlobalApiLoading(true);
            try {
                // Fetch Visas
                const visaRes = await fetch('/api/visas');
                if (visaRes.ok) {
                    const data = await visaRes.json();
                    setVisas(data);
                }

                // Fetch Popular IDs
                const settingsRes = await fetch('/api/admin/settings?key=popular_visas');
                if (settingsRes.ok) {
                    const data = await settingsRes.json();
                    if (data && data.value) {
                        setPopularVisaIds(JSON.parse(data.value));
                    }
                }
            } catch (e) {
                console.error("Initial data fetch failed", e);
            } finally {
                setGlobalApiLoading(false);
            }
        };

        if (!authLoading && user && user.role === 'admin') {
            fetchInitialData();
        }
    }, [user, authLoading]);

    // Admin Route Protection

    // Admin Route Protection
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'admin') {
                router.push('/');
            }
        }
    }, [user, authLoading, router]);

    // RESTORED: Fetch Users (Corrected)
    useEffect(() => {
        const fetchUsers = async () => {
            setGlobalApiLoading(true);
            try {
                const res = await fetch('/api/users');
                if (res.ok) {
                    const data = await res.json();
                    setUsersList(data);
                }
            } catch (e) {
                console.error("Failed to fetch users", e);
            } finally {
                setGlobalApiLoading(false);
            }
        };
        if (!authLoading && user && user.role === 'admin') {
            fetchUsers();
        }
    }, [user, authLoading]);

    // RESTORED: Sync Stats with Users List - REMOVED: Managed in DashboardTab

    // RESTORED: Fetch Admin Data (Notifications)
    useEffect(() => {
        const fetchAdminData = async () => {
            setGlobalApiLoading(true);
            try {
                const notifRes = await fetch('/api/notifications?target=ADMIN');
                if (notifRes.ok) {
                    const notifs = await notifRes.json();
                    setAllNotifications(notifs);
                    if (notifs.length > 0) {
                        setLatestNotification(notifs[0]);
                    }
                }
            } catch (e) {
                console.error("Notif fetch failed", e);
            } finally {
                setGlobalApiLoading(false);
            }
        };
        if (!authLoading && user && user.role === 'admin') {
            fetchAdminData();
        }
    }, [user, authLoading]);

    // NEW: Realtime Chat Listener (Admin Side)
    useEffect(() => {
        try {
            const channel = supabase
                .channel('admin_dashboard_global')
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'messages', filter: "senderType=eq.user" },
                    async (payload: any) => {
                        const newMsg = payload?.new;
                        if (!newMsg) return;

                        // Create a visual notification
                        const newNotif = {
                            id: `msg-${newMsg.id}`,
                            title: "New Support Message",
                            message: newMsg.message || "New message received",
                            type: 'info',
                            isRead: false,
                            createdAt: new Date().toISOString(),
                            actionLink: "/admin?tab=support"
                        };

                        setAllNotifications(prev => [newNotif, ...prev]);
                        setLatestNotification(newNotif);
                    }
                )
                .on(
                    'broadcast',
                    { event: 'NEW_ORDER' },
                    (payload: any) => {
                        const order = payload?.payload;
                        if (!order) return;

                        setNewOrdersCount(prev => prev + 1);

                        const newNotif = {
                            id: `order-${order.id}`,
                            title: "New Order Received!",
                            message: `Order #${order.slug || 'N/A'} from ${order.guestName || 'Guest'} for ${order.visaName || 'Visa'}`,
                            type: 'success',
                            isRead: false,
                            createdAt: new Date().toISOString(),
                            actionLink: "/admin?tab=orders"
                        };

                        setAllNotifications(prev => [newNotif, ...prev]);
                        setLatestNotification(newNotif);
                    }
                )
                .subscribe((status) => {
                    if (status === 'CHANNEL_ERROR') {
                        console.warn("Supabase Realtime subscription error - Content Blocker might be active");
                    }
                });

            return () => {
                supabase.removeChannel(channel);
            };
        } catch (error) {
            console.error("Failed to initialize realtime dashboard:", error);
        }
    }, []);

    // Filter Logic (Simplified, logic moved to tabs)

    // Handlers
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleDismissNotification = async (id: string) => {
        setAllNotifications(prev => prev.filter(n => n.id !== id));

        // If it's a DB notification (likely without custom prefixes)
        if (!id.startsWith('order-') && !id.startsWith('msg-')) {
            try {
                await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' });
            } catch (e) {
                console.error("Failed to delete notification", e);
            }
        }
    };

    const handleTogglePopular = async (id: string) => {
        const next = popularVisaIds.includes(id)
            ? popularVisaIds.filter(vId => vId !== id)
            : [...popularVisaIds, id];

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'popular_visas', value: JSON.stringify(next) })
            });

            if (res.ok) {
                setPopularVisaIds(next);
            }
        } catch (e) {
            console.error("Failed to toggle popular visa", e);
        }
    };


    // --- UPDATED STATS CALCULATION - REMOVED: Managed in DashboardTab

    const handlePdfMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePdfMenuClose = () => {
        setAnchorEl(null);
    };


    const handleDeleteNotification = async (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!confirm("Delete this notification?")) return;

        try {
            await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' });
            setAllNotifications(prev => prev.filter(n => n.id !== id));
            if (latestNotification?.id === id) {
                setLatestNotification(allNotifications.filter(n => n.id !== id)[0] || null);
            }
        } catch (e) {
            console.error("Delete notif failed", e);
        }
    };

    // --- LOGIC: FETCH STATS (Global for PDF & Dashboard) ---
    const fetchRealStats = async () => {
        try {
            // 1. Users
            const usersRes = await fetch('/api/users');
            const users = usersRes.ok ? await usersRes.json() : [];
            const totalUsers = users.length;

            // 2. Active Visas
            const appsRes = await fetch('/api/applications?isAdmin=true');
            const apps: any[] = appsRes.ok ? await appsRes.json() : [];
            const activeVisas = apps.filter(a =>
                (a.status === 'Active' || a.status === 'Approved') &&
                (a.expiresAt && a.expiresAt !== '-' ? new Date(a.expiresAt) > new Date() : true)
            ).length;
            const totalApps = apps.length;

            // 3. Revenue
            const invRes = await fetch('/api/invoices?isAdmin=true');
            const invoices: any[] = invRes.ok ? await invRes.json() : [];
            const revenue = invoices
                .filter(i => i.status === 'PAID')
                .reduce((acc, curr) => acc + (curr.amount || 0), 0);

            setStats([
                { key: 'users', title: "Total Users", value: totalUsers.toString(), change: "+2%", isPositive: true, icon: <PeopleIcon />, color: "primary.main", bg: "primary.light" },
                { key: 'activeVisas', title: "Active Visas", value: activeVisas.toString(), change: "Live", isPositive: true, icon: <AssignmentIcon />, color: "success.main", bg: "success.light" },
                { key: 'applications', title: "Total Apps", value: totalApps.toString(), change: "", isPositive: true, icon: <AccessTimeIcon />, color: "warning.main", bg: "warning.light" },
                { key: 'revenue', title: "Revenue", value: formatCurrency(revenue), change: "Real", isPositive: true, icon: <AttachMoneyIcon />, color: "info.main", bg: "info.light" },
            ]);
        } catch (e) {
            console.error("Stats Calc Failed", e);
        }
    };

    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchRealStats();
            const interval = setInterval(fetchRealStats, 30000);
            return () => clearInterval(interval);
        }
    }, [activeTab]);

    if (authLoading || !user || user.role !== 'admin') {
        return (
            <Box sx={{ display: 'flex', height: '100vh', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user || user.role !== 'admin') {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 4, maxWidth: 400 }}>
                    <Box sx={{ width: 64, height: 64, bgcolor: 'error.light', color: 'error.main', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                        <CloseIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>Access Denied</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>You must be an administrator to view this page.</Typography>
                    <Button variant="contained" onClick={() => router.push('/')}>Return Home</Button>
                </Paper>
            </Box>
        );
    }

    // --- DRAWER CONTENT ---
    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Toolbar sx={{
                px: 2,
                display: 'flex',
                flexDirection: isSidebarCollapsed ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                py: 2,
                minHeight: '82px !important'
            }}>
                {!isSidebarCollapsed && (
                    <Typography variant="h6" fontWeight="800" color="text.primary" sx={{ letterSpacing: '-0.5px' }}>
                        INDONESIAN<Box component="span" color="primary.main">VISAS</Box>
                    </Typography>
                )}

                <IconButton
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    sx={{
                        bgcolor: 'action.hover',
                        borderRadius: 2,
                        color: 'primary.main',
                        '&:hover': { bgcolor: 'primary.lighter' }
                    }}
                >
                    {isSidebarCollapsed ? <ArrowForwardIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
                </IconButton>
            </Toolbar>

            <Box sx={{ px: isSidebarCollapsed ? 1 : 2, mb: 2 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isSidebarCollapsed ? 0 : 1.5,
                    p: isSidebarCollapsed ? 1 : 1.5,
                    bgcolor: 'action.hover',
                    borderRadius: 3,
                    width: '100%',
                    justifyContent: isSidebarCollapsed ? 'center' : 'flex-start'
                }}>
                    <Avatar src={user?.avatar} sx={{ width: 40, height: 40, border: '1px solid', borderColor: 'divider' }}>{user?.name?.charAt(0)}</Avatar>
                    {!isSidebarCollapsed && (
                        <Box sx={{ overflow: 'hidden' }}>
                            <Typography variant="subtitle2" fontWeight="bold" noWrap>{user?.name || 'Admin'}</Typography>
                            <Typography variant="caption" color="text.secondary" noWrap display="block">{user?.email}</Typography>
                        </Box>
                    )}
                </Box>

                {!isSidebarCollapsed && (
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={
                            theme.palette.mode === "dark"
                                ? <Brightness7Icon />
                                : <Brightness4Icon />
                        }
                        onClick={colorMode.toggleColorMode}
                        sx={{
                            mt: 1,
                            justifyContent: "flex-start",
                            textTransform: "none",
                            fontWeight: "bold",
                            color: "text.secondary",
                            borderColor: "divider",
                            "&:hover": {
                                borderColor: "primary.main",
                                color: "primary.main",
                                bgcolor: "primary.lighter"
                            }
                        }}
                    >
                        {theme.palette.mode === "dark" ? "Light" : "Dark"}
                    </Button>
                )}
            </Box>
            <Divider />
            <List sx={{ px: 2, pt: 2 }}>
                {[
                    { key: 'dashboard', label: 'Overview', icon: <DashboardIcon /> },
                    { key: 'support', label: 'Support Chat', icon: <MessageIcon />, badge: allNotifications.filter(n => !n.isRead).length },
                    { key: 'users', label: 'User Management', icon: <PeopleIcon /> },
                    { key: 'verification', label: 'Verification', icon: <VerifiedUserIcon /> },
                    { key: 'visas', label: 'Visa Database', icon: <DescriptionIcon /> },
                    { key: 'popular_visas', label: 'Popular Visa', icon: <TrendingUpIcon /> },
                    { key: 'company_services', label: 'Company Formation', icon: <BusinessIcon /> },
                    { key: 'arrival_cards', label: 'Arrival Card', icon: <DescriptionIcon /> },
                    { key: 'orders', label: 'Incoming Order', icon: <ShoppingCart sx={{ fontSize: 20 }} />, badge: newOrdersCount },
                    { key: 'invoicing', label: 'Invoicing', icon: <ReceiptIcon /> },
                    { key: 'finance', label: 'Finance & Tax', icon: <AttachMoneyIcon /> },
                    { key: 'email_logs', label: 'Email Communication', icon: <MailIcon /> },
                    { key: 'logs', label: 'Audit Logs', icon: <HistoryIcon /> },
                    { key: 'ai_master', label: 'Ai Master', icon: <PsychologyIcon /> },
                    { key: 'marketing', label: 'Marketing Intelligence', icon: <BarChartIcon /> },
                    { key: 'updates', label: 'Immigration Updates', icon: <CampaignIcon /> },
                    { key: 'addons', label: 'Product Add-ons', icon: <ShoppingCart /> },
                    { key: 'global_settings', label: 'Global Info Popup', icon: <CampaignIcon /> },
                ].map((item) => (
                    <ListItem key={item.key} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            selected={activeTab === item.key}
                            onClick={() => {
                                setActiveTab(item.key as TabType);
                                router.push(`/${locale}/admin?tab=${item.key}`);
                                if (item.key === 'orders') setNewOrdersCount(0);
                                if (isMobile) setMobileOpen(false);
                            }}
                            sx={{
                                borderRadius: 2,
                                justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                                px: isSidebarCollapsed ? 1 : 2,
                                '&.Mui-selected': { bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, '& .MuiListItemIcon-root': { color: 'white' } }
                            }}
                        >
                            <Tooltip title={isSidebarCollapsed ? item.label : ""} placement="right">
                                <ListItemIcon sx={{
                                    minWidth: isSidebarCollapsed ? 0 : 40,
                                    mr: isSidebarCollapsed ? 0 : 0,
                                    justifyContent: 'center',
                                    color: activeTab === item.key ? 'white' : 'text.secondary'
                                }}>
                                    {/* Badge Logic */}
                                    {item.badge && item.badge > 0 ? (
                                        <Box sx={{ position: 'relative' }}>
                                            {item.icon}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: -4,
                                                    right: -4,
                                                    bgcolor: 'error.main',
                                                    color: 'white',
                                                    fontSize: '0.6rem',
                                                    fontWeight: 'bold',
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {item.badge > 9 ? '9+' : item.badge}
                                            </Box>
                                        </Box>
                                    ) : (
                                        item.icon
                                    )}
                                </ListItemIcon>
                            </Tooltip>
                            {!isSidebarCollapsed && (
                                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.85rem', noWrap: true }} />
                            )}
                        </ListItemButton>

                    </ListItem>
                ))}
                {/* Divider */}
                <Box sx={{ my: 2 }}><Divider /></Box>
                <ListItem disablePadding>
                    <ListItemButton
                        sx={{
                            borderRadius: 2,
                            justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                            px: isSidebarCollapsed ? 1 : 2
                        }}
                        onClick={logout}
                    >
                        <ListItemIcon sx={{ minWidth: isSidebarCollapsed ? 0 : 40 }}><LogoutIcon color="error" /></ListItemIcon>
                        {!isSidebarCollapsed && (
                            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, color: 'error.main' }} />
                        )}
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            {/* AppBar Removed per user request to use default Global Header or just remove white layer */}

            {/* Mobile Toggle Button (Floating) - Optional if we strictly want no AppBar */}
            {/* Mobile Toggle Button - REMOVED: Using Header Admin Panel instead */}

            {/* SIDEBAR */}
            <Box component="nav" sx={{ width: { md: currentDrawerWidth }, flexShrink: { md: 0 }, transition: 'width 0.3s' }}>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: currentDrawerWidth,
                            borderRight: '1px solid rgba(0,0,0,0.12)',
                            transition: 'width 0.3s',
                            overflowX: 'hidden',

                            /* ⬇️ INI INTINYA */
                            top: '82px',                  // tinggi header
                            height: 'calc(100% - 82px)',  // biar gak nutup header
                        }
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* MAIN CONTENT */}
            <Box component="main" sx={{
                flexGrow: 1,
                p: { xs: 2, md: 3 },
                pt: { xs: 10, md: 12 },
                width: { md: `calc(100% - ${currentDrawerWidth}px)` },
                transition: 'width 0.3s, margin 0.3s',
                minHeight: '100vh',
                bgcolor: 'background.default'
            }}>

                {/* GLOBAL LOADING INDICATOR */}
                {(globalApiLoading || checkingHealth) && (
                    <Box sx={{ position: 'fixed', top: '82px', left: { md: currentDrawerWidth }, right: 0, zIndex: 1100, transition: 'left 0.3s' }}>
                        <LinearProgress />
                    </Box>
                )}

                <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                    {/* GLOBAL NOTIFICATION BANNER START */}
                    {Array.isArray(allNotifications) && allNotifications.length > 0 && (
                        <Stack spacing={1} sx={{ mb: 3 }}>
                            {allNotifications.slice(0, 3).map((notif) => (
                                <Card
                                    key={notif.id}
                                    sx={{
                                        bgcolor: notif.type === 'success' ? 'success.lighter' : 'info.lighter',
                                        border: '1px solid',
                                        borderColor: notif.type === 'success' ? 'success.light' : 'info.light',
                                        color: notif.type === 'success' ? 'success.dark' : 'info.dark',
                                        borderRadius: 3,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <CardContent sx={{ py: '12px !important', px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box display="flex" alignItems="center" gap={1.5}>
                                            {notif.type === 'success' ? <ShoppingCart sx={{ fontSize: 20 }} /> : <NotificationsActiveIcon sx={{ fontSize: 20 }} />}
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">{notif.title}</Typography>
                                                <Typography variant="caption" display="block" color="inherit" sx={{ opacity: 0.8 }}>{notif.message}</Typography>
                                            </Box>
                                        </Box>
                                        <IconButton size="small" onClick={() => handleDismissNotification(notif.id)} color="inherit">
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    )}

                    {/* --- DASHBOARD TAB --- */}
                    {activeTab === 'dashboard' && (
                        <Stack spacing={3} sx={{ animation: 'fadeIn 0.5s ease' }}>
                            {/* Dashboard Global Header */}
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar src={user?.avatar} sx={{ width: 56, height: 56, border: '2px solid', borderColor: 'primary.main', p: 0.5, bgcolor: 'background.paper' }}>
                                        {user?.name?.charAt(0) || 'A'}
                                    </Avatar>
                                    <div>
                                        <Typography variant="h4" fontWeight="bold">Dashboard Overview</Typography>
                                        <Typography variant="body1" color="text.secondary">Welcome back, {user?.name || 'Admin'}.</Typography>
                                    </div>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<DownloadIcon />}
                                    onClick={handlePdfMenuClick}
                                >
                                    Export Report
                                </Button>
                            </Box>
                            <DashboardTab
                                user={user}
                                stats={stats}
                                allNotifications={allNotifications}
                                latestNotification={latestNotification}
                                setShowNotificationsModal={setShowNotificationsModal}
                                setAllNotifications={setAllNotifications}
                                setLatestNotification={setLatestNotification}
                                checkingHealth={checkingHealth}
                                setCheckingHealth={setCheckingHealth}
                            />
                        </Stack>
                    )}

                    {/* --- PRODUCT ADDONS TAB --- */}
                    {activeTab === 'addons' && (
                        <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                            <AddonsTab />
                        </Box>
                    )}

                    {/* --- GLOBAL SETTINGS TAB --- */}
                    {activeTab === 'global_settings' && (
                        <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                            <GlobalSettingsTab />
                        </Box>
                    )}

                    {/* --- VERIFICATION TAB --- */}
                    {activeTab === 'verification' && (
                        <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                            <VerificationTab />
                        </Box>
                    )}

                    {/* --- INCOMING ORDERS TAB --- */}
                    {activeTab === 'orders' && (
                        <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                            <OrderPanel />
                        </Box>
                    )}

                    {/* --- ARRIVAL CARDS TAB --- */}
                    {activeTab === 'arrival_cards' && (
                        <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                            <ArrivalCardsTab />
                        </Box>
                    )}

                    {/* --- COMPANY SERVICES TAB --- */}
                    {activeTab === 'company_services' && (
                        <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                            <CompanyServicesTab />
                        </Box>
                    )}

                    {/* --- INVOICING TAB --- */}
                    {activeTab === 'invoicing' && (
                        <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                            <InvoicingTab />
                        </Box>
                    )}


                    {/* --- SUPPORT CHAT TAB --- */}
                    {activeTab === 'support' && (
                        <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                            <SupportChatTab />
                        </Box>
                    )}

                    {/* --- AUDIT LOGS TAB --- */}
                    {activeTab === 'logs' && (
                        <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                            <AuditLogTab />
                        </Box>
                    )}

                    {/* --- FINANCE TAB --- */}
                    {activeTab === 'finance' && (
                        <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                            <FinancePanel />
                        </Box>
                    )}

                    {/* --- EMAIL LOGS TAB --- */}
                    {activeTab === 'email_logs' && (
                        <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                            <EmailLogPanel />
                        </Box>
                    )}

                    {/* --- AI MASTER TAB --- */}
                    {activeTab === 'ai_master' && (
                        <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                            <AIMasterTab />
                        </Box>
                    )}

                    {/* --- UPDATES TAB --- */}
                    {activeTab === 'updates' && (
                        <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                            <ImmigrationUpdatesTab />
                        </Box>
                    )}

                    {/* --- MARKETING TAB --- */}
                    {activeTab === 'marketing' && (
                        <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                            <MarketingTab />
                        </Box>
                    )}

                    {/* --- VISAS TAB --- */}
                    {activeTab === 'visas' && (
                        <VisasTab
                            visas={visas}
                            setVisas={setVisas}
                            popularVisaIds={popularVisaIds}
                            handleTogglePopular={handleTogglePopular}
                        />
                    )}

                    {/* --- POPULAR VISAS TAB --- */}
                    {activeTab === 'popular_visas' && (
                        <PopularVisasTab
                            visas={visas}
                            popularVisaIds={popularVisaIds}
                            handleTogglePopular={handleTogglePopular}
                        />
                    )}

                    {/* --- USERS TAB --- */}
                    {activeTab === 'users' && (
                        <UsersTab
                            usersList={usersList}
                            setUsersList={setUsersList}
                            addDocument={addDocument}
                        />
                    )}

                </Box>
            </Box>



            {/* Notifications Modal */}
            <Dialog
                open={showNotificationsModal}
                onClose={() => setShowNotificationsModal(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Information Center
                    <IconButton size="small" onClick={() => setShowNotificationsModal(false)}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {!Array.isArray(allNotifications) || allNotifications.length === 0 ? (
                        <Box textAlign="center" py={4}>
                            <Typography color="text.secondary">No notifications found.</Typography>
                        </Box>
                    ) : (
                        <List>
                            {Array.isArray(allNotifications) && allNotifications.map((notif: any) => (
                                <ListItem
                                    key={notif.id}
                                    disablePadding
                                    sx={{ mb: 2, display: 'block' }}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={(e) => handleDeleteNotification(notif.id, e)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2, pr: 6 }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                            <Typography variant="subtitle1" fontWeight="bold" color={notif.type === 'warning' ? 'warning.main' : 'primary.main'}>
                                                {notif.title}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(notif.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{ my: 1 }}>{notif.message}</Typography>
                                        {notif.actionLink && (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    setShowNotificationsModal(false);
                                                    router.push(notif.actionLink);
                                                }}
                                            >
                                                {notif.actionText || "View Details"}
                                            </Button>
                                        )}
                                    </Paper>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DialogContent>
            </Dialog>

            {/* PDF Export Menu */}
            <Menu
                anchorEl={anchorEl}
                open={pdfMenuOpen}
                onClose={handlePdfMenuClose}
                MenuListProps={{ 'aria-labelledby': 'pdf-export-button' }}
            >
                <MenuItem onClick={() => { generatePDF('users', { usersList }); handlePdfMenuClose(); }}><ListItemIcon><PeopleIcon fontSize="small" /></ListItemIcon>User Data</MenuItem>
                <MenuItem onClick={() => { generatePDF('visas', { visas }); handlePdfMenuClose(); }}><ListItemIcon><DescriptionIcon fontSize="small" /></ListItemIcon>Visa Database</MenuItem>
                <MenuItem onClick={() => { generatePDF('company', {}); handlePdfMenuClose(); }}><ListItemIcon><BusinessIcon fontSize="small" /></ListItemIcon>Company Formation</MenuItem>
                <MenuItem onClick={() => { generatePDF('invoicing', {}); handlePdfMenuClose(); }}><ListItemIcon><ReceiptIcon fontSize="small" /></ListItemIcon>All Invoicing Data</MenuItem>
                <Divider />
                <Typography variant="overline" sx={{ px: 2, color: 'text.secondary' }}>Financial Reports</Typography>
                <MenuItem onClick={() => { generatePDF('revenue-3m', {}); handlePdfMenuClose(); }}><ListItemIcon><AttachMoneyIcon fontSize="small" /></ListItemIcon>Revenue (Last 3 Months)</MenuItem>
                <MenuItem onClick={() => { generatePDF('revenue-6m', {}); handlePdfMenuClose(); }}><ListItemIcon><AttachMoneyIcon fontSize="small" /></ListItemIcon>Revenue (Last 6 Months)</MenuItem>
                <MenuItem onClick={() => { generatePDF('revenue-1y', {}); handlePdfMenuClose(); }}><ListItemIcon><AttachMoneyIcon fontSize="small" /></ListItemIcon>Revenue (Last 1 Year)</MenuItem>
                <Divider />
                <MenuItem onClick={() => { generatePDF('stats', { stats }); handlePdfMenuClose(); }}><ListItemIcon><TrendingUpIcon fontSize="small" /></ListItemIcon>Statistics Overview</MenuItem>
            </Menu>

        </Box >
    );
}


// Default Export with Suspense Boundary
export default function AdminDashboard() {
    return (
        <Suspense fallback={
            <Box sx={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LinearProgress sx={{ width: '50%' }} />
            </Box>
        }>
            <AdminDashboardContent />
        </Suspense>
    );
}
