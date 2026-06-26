"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useApplication } from "@/components/application/ApplicationContext";
import { useColorMode } from "@/components/ThemeRegistry/ThemeRegistry";
import { formatCurrency } from "@/lib/utils";
import { formatNavLink } from "@/utils/seo";
import DocumentViewer from "@/components/admin/DocumentViewer";
import { COUNTRY_DATA } from "@/constants/countries";

// MUI Components
import {
    Box,
    Drawer,
    List,
    Typography,
    Divider,
    IconButton,
    Grid,
    Paper,
    Card,
    CardContent,
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
    Tooltip,
    CircularProgress,
    Avatar,
    Toolbar,
    ListItemAvatar
} from "@mui/material";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PublicIcon from "@mui/icons-material/Public";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import MessageIcon from "@mui/icons-material/Message";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";

const DRAWER_WIDTH = 260;
type TabType = "dashboard" | "orders" | "support" | "arrival_cards";

interface Conversation {
    id: string;
    user_id: string;
    status: "open" | "assigned" | "closed";
    updated_at: string;
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    lastMessage?: {
        message: string;
        senderType: string;
        created_at: string;
    } | null;
    unreadCount?: number;
}

interface Message {
    id: string;
    senderType: "user" | "admin" | "worker" | "system" | string;
    message: string;
    created_at: string;
}

export default function WorkerDashboardPage() {
    const { user, isLoading: authLoading, logout } = useAuth();
    const router = useRouter();
    const theme = useTheme();
    const colorMode = useColorMode();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const params = useParams();
    const locale = (params?.locale as string) || "en";
    const searchParams = useSearchParams();

    // Tab control
    const routerActiveTab = (searchParams.get("tab") as TabType) || "dashboard";
    const [activeTab, setActiveTab] = useState<TabType>(routerActiveTab);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const currentDrawerWidth = isSidebarCollapsed ? 80 : DRAWER_WIDTH;

    // Global loading state
    const [globalLoading, setGlobalLoading] = useState(false);

    // Document Viewer state
    const [viewingDoc, setViewingDoc] = useState<{ url: string; name: string } | null>(null);

    // Overview Stats
    const [stats, setStats] = useState({
        pendingReview: 0,
        activeCases: 0,
        openChats: 0,
        myCases: 0
    });

    // Orders State
    const [orders, setOrders] = useState<any[]>([]);
    const [orderSearchQuery, setOrderSearchQuery] = useState("");
    const [orderFilter, setOrderFilter] = useState("all"); // all, pending, my_cases, paid
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [updatingOrder, setUpdatingOrder] = useState(false);
    const [orderNotes, setOrderNotes] = useState("");

    // Chat State
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [chatSearch, setChatSearch] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Arrival Cards State
    const [arrivalCards, setArrivalCards] = useState<any[]>([]);
    const [selectedArrivalCard, setSelectedArrivalCard] = useState<any | null>(null);
    const [updatingArrivalCard, setUpdatingArrivalCard] = useState(false);

    // Route Protection
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push(formatNavLink(locale, "/login"));
            } else if (user.role !== "worker" && user.role !== "admin") {
                router.push(formatNavLink(locale, "/"));
            }
        }
    }, [user, authLoading, router, locale]);

    // Sync tab with URL
    useEffect(() => {
        if (routerActiveTab !== activeTab) {
            setActiveTab(routerActiveTab);
        }
    }, [routerActiveTab]);

    // Data Loaders
    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/applications");
            if (res.ok) {
                const data = await res.json();
                setOrders(data || []);
                return data || [];
            }
        } catch (e) {
            console.error("Failed to fetch applications", e);
        }
        return [];
    };

    const fetchArrivalCards = async () => {
        try {
            const res = await fetch("/api/admin/arrival-cards");
            if (res.ok) {
                const data = await res.json();
                setArrivalCards(data.results || []);
            }
        } catch (e) {
            console.error("Failed to fetch arrival cards", e);
        }
    };

    const fetchConversations = async () => {
        try {
            const res = await fetch("/api/admin/chat/conversations");
            if (res.ok) {
                const data = await res.json();
                setConversations(data || []);
                return data || [];
            }
        } catch (e) {
            console.error("Failed to fetch conversations", e);
        }
        return [];
    };

    // Calculate Stats from fetched data
    const refreshAllData = async () => {
        setGlobalLoading(true);
        const [ordersList, convsList] = await Promise.all([
            fetchOrders(),
            fetchConversations(),
            fetchArrivalCards()
        ]);

        const pending = ordersList.filter((o: any) => o.status === "Review by Agent" || o.status === "Pending").length;
        const active = ordersList.filter((o: any) => ["Active", "On Going", "Preparing for submission", "Submited", "Process by Immigration"].includes(o.status)).length;
        const openChatsCount = convsList.filter((c: any) => c.status === "open").length;
        const myCasesCount = ordersList.filter((o: any) => o.adminNotes && o.adminNotes.toLowerCase().includes(user?.email || "")).length;

        setStats({
            pendingReview: pending,
            activeCases: active,
            openChats: openChatsCount,
            myCases: myCasesCount
        });
        setGlobalLoading(false);
    };

    useEffect(() => {
        if (user && (user.role === "worker" || user.role === "admin")) {
            refreshAllData();
        }
    }, [user]);

    // Realtime Supabase Listeners
    useEffect(() => {
        if (!user) return;
        const channel = supabase
            .channel("worker_conversations")
            .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => {
                fetchConversations();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    // Fetch Messages when conversation selected
    useEffect(() => {
        if (!selectedConvId) return;

        const fetchMessages = async () => {
            setMessagesLoading(true);
            try {
                const res = await fetch(`/api/admin/chat/messages?conversationId=${selectedConvId}`);
                if (res.ok) {
                    const data = await res.json();
                    setChatMessages(data || []);
                    scrollToChatBottom();
                }
            } catch (err) {
                console.error("Error fetching messages:", err);
            } finally {
                setMessagesLoading(false);
            }
        };

        fetchMessages();

        const channel = supabase
            .channel(`worker_chat:${selectedConvId}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${selectedConvId}` },
                (payload) => {
                    const newMsg = payload.new as Message;
                    setChatMessages((prev) => {
                        if (prev.find((m) => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg];
                    });
                    scrollToChatBottom();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [selectedConvId]);

    const scrollToChatBottom = () => {
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    // Helper for secure URL signing
    const handleViewFile = async (rawUrl: string, friendlyName: string) => {
        if (!rawUrl) return;
        try {
            setGlobalLoading(true);
            // Sign URL secure backend route
            const res = await fetch(`/api/admin/sign-url?path=${encodeURIComponent(rawUrl)}`);
            if (res.ok) {
                const data = await res.json();
                setViewingDoc({ url: data.url || rawUrl, name: friendlyName });
            } else {
                setViewingDoc({ url: rawUrl, name: friendlyName });
            }
        } catch (e) {
            console.error("Error signing url", e);
            setViewingDoc({ url: rawUrl, name: friendlyName });
        } finally {
            setGlobalLoading(false);
        }
    };

    // Handle Order status update
    const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
        setUpdatingOrder(true);
        try {
            const res = await fetch("/api/applications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetId: orderId,
                    status: newStatus,
                    adminNotes: orderNotes
                })
            });

            if (res.ok) {
                alert(`Order updated successfully to: ${newStatus}`);
                fetchOrders();
                // update selection
                if (selectedOrder && selectedOrder.id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status: newStatus, adminNotes: orderNotes });
                }
            } else {
                const err = await res.json();
                alert(`Failed to update order: ${err.error || "Unknown error"}`);
            }
        } catch (e) {
            console.error(e);
            alert("Error updating order status.");
        } finally {
            setUpdatingOrder(false);
        }
    };

    // Handle Arrival Card status update
    const handleArrivalCardStatus = async (cardId: string, newStatus: string) => {
        setUpdatingArrivalCard(true);
        try {
            const res = await fetch(`/api/admin/arrival-cards/${cardId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                alert(`Arrival card updated to: ${newStatus}`);
                fetchArrivalCards();
                if (selectedArrivalCard && selectedArrivalCard.id === cardId) {
                    setSelectedArrivalCard({ ...selectedArrivalCard, status: newStatus });
                }
            } else {
                alert("Failed to update arrival card.");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setUpdatingArrivalCard(false);
        }
    };

    // Handle Chat Reply
    const handleSendChat = async () => {
        if (!chatInput.trim() || !selectedConvId) return;
        const msg = chatInput.trim();
        setChatInput("");
        try {
            const res = await fetch("/api/admin/chat/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    conversationId: selectedConvId,
                    message: msg,
                    senderType: "worker"
                })
            });
            if (!res.ok) {
                console.error("Failed to send message");
            }
        } catch (e) {
            console.error("Send message error", e);
        }
    };

    // Handle Chat Conversation claim
    const handleClaimConversation = async (convId: string) => {
        try {
            await fetch("/api/admin/chat/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    conversationId: convId,
                    message: `Staff (${user?.name || "Worker"}) joined the chat session.`,
                    senderType: "system"
                })
            });
            refreshAllData();
        } catch (e) {
            console.error(e);
        }
    };

    if (authLoading || !user) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" width="100%">
                <CircularProgress />
            </Box>
        );
    }

    // Sidebar navigation items
    const sidebarItems = [
        { key: "dashboard", label: "Overview", icon: <DashboardIcon /> },
        { key: "orders", label: "Incoming Orders", icon: <ShoppingCart />, badge: stats.pendingReview },
        { key: "support", label: "Support Chats", icon: <MessageIcon />, badge: stats.openChats },
        { key: "arrival_cards", label: "Arrival Cards", icon: <DescriptionIcon /> }
    ];

    const drawerContent = (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflowX: "hidden" }}>
            <Toolbar sx={{
                display: "flex",
                flexDirection: isSidebarCollapsed ? "column" : "row",
                alignItems: "center",
                justifyContent: isSidebarCollapsed ? "center" : "space-between",
                py: 2,
                minHeight: "82px !important"
            }}>
                {!isSidebarCollapsed && (
                    <Typography variant="h6" fontWeight="800" color="text.primary" sx={{ letterSpacing: "-0.5px" }}>
                        INDONESIAN<Box component="span" color="primary.main">VISAS</Box>
                        <Box sx={{ fontSize: "10px", fontWeight: "bold", bgcolor: "primary.main", color: "white", px: 1, py: 0.2, borderRadius: 1, mt: 0.5, display: "inline-block" }}>
                            WORKER
                        </Box>
                    </Typography>
                )}
                <IconButton onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} sx={{ bgcolor: "action.hover", borderRadius: 2 }}>
                    {isSidebarCollapsed ? <ArrowForwardIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
                </IconButton>
            </Toolbar>

            <Box sx={{ px: isSidebarCollapsed ? 1 : 2, mb: 2 }}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: isSidebarCollapsed ? 0 : 1.5,
                    p: isSidebarCollapsed ? 1 : 1.5,
                    bgcolor: "action.hover",
                    borderRadius: 3,
                    justifyContent: isSidebarCollapsed ? "center" : "flex-start"
                }}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>{user.name?.charAt(0)}</Avatar>
                    {!isSidebarCollapsed && (
                        <Box sx={{ overflow: "hidden" }}>
                            <Typography variant="subtitle2" fontWeight="bold" noWrap>{user.name}</Typography>
                            <Typography variant="caption" color="text.secondary" noWrap display="block">{user.email}</Typography>
                        </Box>
                    )}
                </Box>

                {!isSidebarCollapsed && (
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                        onClick={colorMode.toggleColorMode}
                        sx={{ mt: 1, textTransform: "none", fontWeight: "bold", color: "text.secondary", borderColor: "divider" }}
                    >
                        {theme.palette.mode === "dark" ? "Light" : "Dark"}
                    </Button>
                )}
            </Box>

            <Divider />

            <List sx={{ px: 2, pt: 2, flexGrow: 1 }}>
                {sidebarItems.map((item) => (
                    <ListItem key={item.key} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            selected={activeTab === item.key}
                            onClick={() => {
                                setActiveTab(item.key as TabType);
                                router.push(`/${locale}/worker?tab=${item.key}`);
                            }}
                            sx={{
                                borderRadius: 2,
                                justifyContent: isSidebarCollapsed ? "center" : "flex-start",
                                px: isSidebarCollapsed ? 1 : 2,
                                "&.Mui-selected": { bgcolor: "primary.main", color: "white", "&:hover": { bgcolor: "primary.dark" }, "& .MuiListItemIcon-root": { color: "white" } }
                            }}
                        >
                            <Tooltip title={isSidebarCollapsed ? item.label : ""} placement="right">
                                <ListItemIcon sx={{
                                    minWidth: isSidebarCollapsed ? 0 : 40,
                                    color: activeTab === item.key ? "white" : "text.secondary",
                                    justifyContent: "center"
                                }}>
                                    {item.badge && item.badge > 0 ? (
                                        <Box sx={{ position: "relative" }}>
                                            {item.icon}
                                            <Box sx={{
                                                position: "absolute",
                                                top: -4,
                                                right: -4,
                                                bgcolor: "error.main",
                                                color: "white",
                                                fontSize: "0.65rem",
                                                fontWeight: "bold",
                                                width: 16,
                                                height: 16,
                                                borderRadius: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}>
                                                {item.badge}
                                            </Box>
                                        </Box>
                                    ) : (
                                        item.icon
                                    )}
                                </ListItemIcon>
                            </Tooltip>
                            {!isSidebarCollapsed && (
                                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600, fontSize: "0.85rem" }} />
                            )}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider />
            <List sx={{ px: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton sx={{ borderRadius: 2 }} onClick={logout}>
                        <ListItemIcon sx={{ minWidth: isSidebarCollapsed ? 0 : 40 }}><LogoutIcon color="error" /></ListItemIcon>
                        {!isSidebarCollapsed && (
                            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, color: "error.main" }} />
                        )}
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", width: "100%", minHeight: "100vh" }}>
            {/* Sidebar drawer navigation */}
            <Box component="nav" sx={{ width: { md: currentDrawerWidth }, flexShrink: { md: 0 }, transition: "width 0.3s" }}>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", md: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: currentDrawerWidth,
                            borderRight: "1px solid rgba(0,0,0,0.12)",
                            transition: "width 0.3s",
                            overflowX: "hidden",
                            top: "82px",
                            height: "calc(100% - 82px)"
                        }
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Main Content Area */}
            <Box component="main" sx={{
                flexGrow: 1,
                p: { xs: 2, md: 3 },
                pt: { xs: 12, md: 14 },
                width: { md: `calc(100% - ${currentDrawerWidth}px)` },
                transition: "width 0.3s",
                bgcolor: "background.default"
            }}>
                {globalLoading && (
                    <Box sx={{ position: "fixed", top: "82px", left: { md: currentDrawerWidth }, right: 0, zIndex: 1100 }}>
                        <LinearProgress />
                    </Box>
                )}

                <Box sx={{ maxWidth: 1200, mx: "auto" }}>
                    {/* TAB 1: OVERVIEW */}
                    {activeTab === "dashboard" && (
                        <Stack spacing={4}>
                            <div>
                                <Typography variant="h4" fontWeight="bold">Operational Dashboard</Typography>
                                <Typography variant="body1" color="text.secondary">Welcome back, {user.name}. Here's your workspace overview for today.</Typography>
                            </div>

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Card sx={{ borderLeft: "4px solid", borderColor: "warning.main" }}>
                                        <CardContent>
                                            <Typography variant="overline" color="text.secondary" fontWeight="bold">Pending Review</Typography>
                                            <Typography variant="h3" fontWeight="bold">{stats.pendingReview}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Card sx={{ borderLeft: "4px solid", borderColor: "primary.main" }}>
                                        <CardContent>
                                            <Typography variant="overline" color="text.secondary" fontWeight="bold">Active Cases</Typography>
                                            <Typography variant="h3" fontWeight="bold">{stats.activeCases}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Card sx={{ borderLeft: "4px solid", borderColor: "info.main" }}>
                                        <CardContent>
                                            <Typography variant="overline" color="text.secondary" fontWeight="bold">Open Support Chats</Typography>
                                            <Typography variant="h3" fontWeight="bold">{stats.openChats}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Card sx={{ borderLeft: "4px solid", borderColor: "success.main" }}>
                                        <CardContent>
                                            <Typography variant="overline" color="text.secondary" fontWeight="bold">Assigned to Me</Typography>
                                            <Typography variant="h3" fontWeight="bold">{stats.myCases}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Recent incoming orders */}
                            <Paper sx={{ p: 3, borderRadius: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Recent Visa Applications</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Order ID</TableCell>
                                                <TableCell>Applicant</TableCell>
                                                <TableCell>Visa Type</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {orders.slice(0, 5).map((order) => (
                                                <TableRow key={order.id} hover sx={{ cursor: "pointer" }} onClick={() => { setActiveTab("orders"); router.push(`/${locale}/worker?tab=orders`); }}>
                                                    <TableCell sx={{ fontWeight: "bold" }}>#{order.slug || order.id.substring(0, 8)}</TableCell>
                                                    <TableCell>{order.guestName}</TableCell>
                                                    <TableCell>{order.visaName || "Visa"}</TableCell>
                                                    <TableCell>{new Date(order.appliedAt || order.created_at).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        <Chip label={order.status} color={["Paid", "Approved"].includes(order.status) ? "success" : "warning"} size="small" />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Stack>
                    )}

                    {/* TAB 2: ORDERS */}
                    {activeTab === "orders" && (
                        <Stack spacing={4}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <div>
                                    <Typography variant="h4" fontWeight="bold">Application Explorer</Typography>
                                    <Typography variant="body1" color="text.secondary">Review traveler documents, upload official e-visas, or update statuses.</Typography>
                                </div>
                                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={refreshAllData}>Refresh</Button>
                            </Box>

                            {/* Search and Filters */}
                            <Card sx={{ p: 2 }}>
                                <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
                                    <TextField
                                        placeholder="Search applicant name, email, or order ID..."
                                        size="small"
                                        fullWidth
                                        sx={{ maxWidth: 400 }}
                                        value={orderSearchQuery}
                                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
                                        }}
                                    />
                                    <Stack direction="row" spacing={1}>
                                        <Button variant={orderFilter === "all" ? "contained" : "outlined"} size="small" onClick={() => setOrderFilter("all")}>All</Button>
                                        <Button variant={orderFilter === "pending" ? "contained" : "outlined"} color="warning" size="small" onClick={() => setOrderFilter("pending")}>Pending Review</Button>
                                        <Button variant={orderFilter === "my_cases" ? "contained" : "outlined"} color="success" size="small" onClick={() => setOrderFilter("my_cases")}>My Cases</Button>
                                    </Stack>
                                </Stack>
                            </Card>

                            {/* Orders Table */}
                            <TableContainer component={Card}>
                                <Table>
                                    <TableHead sx={{ bgcolor: "action.hover" }}>
                                        <TableRow>
                                            <TableCell>ORDER INFO</TableCell>
                                            <TableCell>CUSTOMER</TableCell>
                                            <TableCell>VISA / SERVICE</TableCell>
                                            <TableCell>STATUS</TableCell>
                                            <TableCell>DOCUMENTS</TableCell>
                                            <TableCell align="right">ACTION</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orders
                                            .filter((order) => {
                                                const query = orderSearchQuery.toLowerCase();
                                                const matchesSearch =
                                                    (order.guestName || "").toLowerCase().includes(query) ||
                                                    (order.guestEmail || "").toLowerCase().includes(query) ||
                                                    (order.id || "").toLowerCase().includes(query) ||
                                                    (order.slug || "").toLowerCase().includes(query);

                                                if (!matchesSearch) return false;

                                                if (orderFilter === "pending") {
                                                    return !["Reject", "Rejected", "Approved"].includes(order.status);
                                                }
                                                if (orderFilter === "my_cases") {
                                                    return order.adminNotes && order.adminNotes.toLowerCase().includes(user?.email || "");
                                                }
                                                return true;
                                            })
                                            .map((order) => {
                                                const isPaid = ["Paid", "Active", "Review by Agent", "On Going", "Preparing for submission", "Submited", "Process by Immigration", "Approved"].includes(order.status);
                                                return (
                                                    <TableRow key={order.id} hover>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight="bold">#{order.slug || order.id.substring(0, 8)}</Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {new Date(order.appliedAt || order.created_at).toLocaleDateString()}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight="bold">{order.guestName || "Guest"}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{order.guestEmail || "-"}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip label={order.visaName || "Visa"} size="small" variant="outlined" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip label={order.status} color={isPaid ? "success" : "warning"} size="small" />
                                                        </TableCell>
                                                        <TableCell>
                                                            {/* User uploaded files */}
                                                            {order.documents && (() => {
                                                                try {
                                                                    let docs = typeof order.documents === "string" ? JSON.parse(order.documents) : order.documents;
                                                                    if (!Array.isArray(docs)) {
                                                                        if (typeof docs === "object" && docs !== null) docs = [docs];
                                                                        else return null;
                                                                    }
                                                                    return (
                                                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                                            {docs.flatMap((docSet: any, travelerIndex: number) => {
                                                                                return Object.entries(docSet).map(([key, urlValue]: any) => {
                                                                                    const url = Array.isArray(urlValue) ? urlValue[0] : urlValue;
                                                                                    if (typeof url !== "string") return null;
                                                                                    const friendlyName = `T${travelerIndex + 1} - ${key.replace(/([A-Z])/g, " $1").trim()}`;
                                                                                    return (
                                                                                        <Chip
                                                                                            key={key}
                                                                                            label={key.replace(/([A-Z])/g, " $1").trim()}
                                                                                            size="small"
                                                                                            onClick={() => handleViewFile(url, friendlyName)}
                                                                                            icon={<OpenInNewIcon style={{ fontSize: 12 }} />}
                                                                                            sx={{ cursor: "pointer" }}
                                                                                        />
                                                                                    );
                                                                                });
                                                                            })}
                                                                        </Stack>
                                                                    );
                                                                } catch (e) {
                                                                    return <Typography variant="caption" color="error">Parse error</Typography>;
                                                                }
                                                            })()}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                onClick={() => {
                                                                    setSelectedOrder(order);
                                                                    setOrderNotes(order.adminNotes || "");
                                                                }}
                                                            >
                                                                Process
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Stack>
                    )}

                    {/* TAB 3: SUPPORT CHATS */}
                    {activeTab === "support" && (
                        <Grid container spacing={3} sx={{ height: "calc(100vh - 220px)" }}>
                            {/* Conversations list sidebar */}
                            <Grid size={{ xs: 12, md: 4 }} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%", borderRadius: 3 }}>
                                    <TextField
                                        placeholder="Search conversations..."
                                        size="small"
                                        fullWidth
                                        value={chatSearch}
                                        onChange={(e) => setChatSearch(e.target.value)}
                                        sx={{ mb: 2 }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
                                        }}
                                    />
                                    <List sx={{ flexGrow: 1, overflowY: "auto" }}>
                                        {conversations
                                            .filter((conv) => {
                                                const query = chatSearch.toLowerCase();
                                                const name = conv.user?.name || "";
                                                const email = conv.user?.email || "";
                                                return name.toLowerCase().includes(query) || email.toLowerCase().includes(query);
                                            })
                                            .map((conv) => (
                                                <ListItemButton
                                                    key={conv.id}
                                                    selected={selectedConvId === conv.id}
                                                    onClick={() => setSelectedConvId(conv.id)}
                                                    sx={{ borderRadius: 2, mb: 1 }}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar sx={{ bgcolor: "primary.lighter", color: "primary.main" }}>
                                                            {conv.user?.name?.charAt(0) || "U"}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={conv.user?.name || "Guest Customer"}
                                                        secondary={conv.lastMessage?.message || "No messages yet"}
                                                        primaryTypographyProps={{ fontWeight: "bold", noWrap: true }}
                                                        secondaryTypographyProps={{ noWrap: true }}
                                                    />
                                                    {conv.status === "open" && (
                                                        <Chip label="Open" color="warning" size="small" sx={{ ml: 1 }} />
                                                    )}
                                                </ListItemButton>
                                            ))}
                                    </List>
                                </Paper>
                            </Grid>

                            {/* Chat panel */}
                            <Grid size={{ xs: 12, md: 8 }} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                {selectedConvId ? (
                                    <Paper sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2, borderRadius: 3 }}>
                                        {/* Conversation Header */}
                                        <Box display="flex" justifyContent="space-between" alignItems="center" pb={2} borderBottom="1px solid" borderColor="divider">
                                            {(() => {
                                                const currentConv = conversations.find((c) => c.id === selectedConvId);
                                                return (
                                                    <>
                                                        <Box>
                                                            <Typography variant="subtitle1" fontWeight="bold">{currentConv?.user?.name || "Guest User"}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{currentConv?.user?.email}</Typography>
                                                        </Box>
                                                        <Stack direction="row" spacing={1}>
                                                            <Button size="small" variant="outlined" onClick={() => handleClaimConversation(selectedConvId)}>Claim Session</Button>
                                                            <Chip label={currentConv?.status || "open"} color="success" size="small" />
                                                        </Stack>
                                                    </>
                                                );
                                            })()}
                                        </Box>

                                        {/* Message stream */}
                                        <Box sx={{ flexGrow: 1, overflowY: "auto", py: 2, px: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
                                            {messagesLoading ? (
                                                <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
                                            ) : (
                                                chatMessages.map((msg) => {
                                                    const isMe = msg.senderType === "worker" || msg.senderType === "admin";
                                                    const isSystem = msg.senderType === "system";

                                                    if (isSystem) {
                                                        return (
                                                            <Box key={msg.id} alignSelf="center" sx={{ bgcolor: "action.hover", px: 2, py: 0.5, borderRadius: 2 }}>
                                                                <Typography variant="caption" color="text.secondary">{msg.message}</Typography>
                                                            </Box>
                                                        );
                                                    }

                                                    return (
                                                        <Box
                                                            key={msg.id}
                                                            alignSelf={isMe ? "flex-end" : "flex-start"}
                                                            sx={{
                                                                maxWidth: "70%",
                                                                bgcolor: isMe ? "primary.main" : "grey.100",
                                                                color: isMe ? "white" : "text.primary",
                                                                p: 1.5,
                                                                borderRadius: 3,
                                                                borderBottomRightRadius: isMe ? 0 : 3,
                                                                borderBottomLeftRadius: isMe ? 3 : 0
                                                            }}
                                                        >
                                                            <Typography variant="body2">{msg.message}</Typography>
                                                            <Typography variant="caption" sx={{ display: "block", textAlign: "right", mt: 0.5, opacity: 0.6, fontSize: "9px" }}>
                                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                            </Typography>
                                                        </Box>
                                                    );
                                                })
                                            )}
                                            <div ref={chatEndRef} />
                                        </Box>

                                        {/* Input Box */}
                                        <Box display="flex" gap={1} pt={2} borderTop="1px solid" borderColor="divider">
                                            <TextField
                                                placeholder="Type your message..."
                                                fullWidth
                                                size="small"
                                                value={chatInput}
                                                onChange={(e) => setChatInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handleSendChat();
                                                }}
                                            />
                                            <IconButton color="primary" onClick={handleSendChat}>
                                                <SendIcon />
                                            </IconButton>
                                        </Box>
                                    </Paper>
                                ) : (
                                    <Paper sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", borderRadius: 3 }}>
                                        <Typography color="text.secondary">Select a conversation to start chatting</Typography>
                                    </Paper>
                                )}
                            </Grid>
                        </Grid>
                    )}

                    {/* TAB 4: ARRIVAL CARDS */}
                    {activeTab === "arrival_cards" && (
                        <Stack spacing={4}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <div>
                                    <Typography variant="h4" fontWeight="bold">Arrival Cards (e-CD)</Typography>
                                    <Typography variant="body1" color="text.secondary">Manage customs declarations and arrival submissions.</Typography>
                                </div>
                                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={refreshAllData}>Refresh</Button>
                            </Box>

                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Submitted Date</TableCell>
                                            <TableCell>Passenger Name</TableCell>
                                            <TableCell>Passport Number</TableCell>
                                            <TableCell>Arrival Date</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="right">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {arrivalCards.map((card) => (
                                            <TableRow key={card.id}>
                                                <TableCell>{new Date(card.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell sx={{ fontWeight: "bold" }}>{card.fullName}</TableCell>
                                                <TableCell>{card.passportNumber}</TableCell>
                                                <TableCell>{new Date(card.arrivalDate).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Chip label={card.status} color={card.status === "APPROVED" ? "success" : card.status === "PENDING" ? "warning" : "error"} size="small" />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button variant="outlined" size="small" onClick={() => setSelectedArrivalCard(card)}>View Details</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Stack>
                    )}
                </Box>
            </Box>

            {/* Document Viewer Modal */}
            {viewingDoc && (
                <DocumentViewer
                    open={!!viewingDoc}
                    onClose={() => setViewingDoc(null)}
                    documentUrl={viewingDoc.url}
                    documentName={viewingDoc.name}
                />
            )}

            {/* ORDER DETAIL DIALOG */}
            <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="md" fullWidth>
                {selectedOrder && (
                    <>
                        <DialogTitle sx={{ borderBottom: "1px solid #eee", pb: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">Order Detail</Typography>
                                    <Typography variant="caption" color="text.secondary">ID: #{selectedOrder.id}</Typography>
                                </Box>
                                <Chip label={selectedOrder.status} color={selectedOrder.status === "Paid" || selectedOrder.status === "Approved" ? "success" : "warning"} />
                            </Stack>
                        </DialogTitle>
                        <DialogContent sx={{ py: 3 }}>
                            <Grid container spacing={4}>
                                {/* Customer Summary */}
                                <Grid size={{ xs: 12, md: 7 }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">CUSTOMER SUMMARY</Typography>
                                    <List dense>
                                        <ListItem>
                                            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                                            <ListItemText primary="Full Name" secondary={selectedOrder.guestName} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><EmailIcon fontSize="small" /></ListItemIcon>
                                            <ListItemText primary="Email Address" secondary={selectedOrder.guestEmail} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><PublicIcon fontSize="small" /></ListItemIcon>
                                            <ListItemText primary="Origin Country" secondary={selectedOrder.country || "N/A"} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><AssignmentIcon fontSize="small" /></ListItemIcon>
                                            <ListItemText primary="Visa Type" secondary={selectedOrder.visaName} />
                                        </ListItem>
                                    </List>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">PROCESS NOTES</Typography>
                                    <TextField
                                        label="Internal Notes / Action Details"
                                        multiline
                                        rows={4}
                                        fullWidth
                                        value={orderNotes}
                                        onChange={(e) => setOrderNotes(e.target.value)}
                                        placeholder="Add details of submission, updates, or notes for the customer."
                                        variant="outlined"
                                        sx={{ mt: 1 }}
                                    />
                                </Grid>

                                {/* Documents and Actions */}
                                <Grid size={{ xs: 12, md: 5 }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">UPLOADED DOCUMENTS</Typography>
                                    <Stack spacing={1}>
                                        {(() => {
                                            try {
                                                let docs = typeof selectedOrder.documents === "string" ? JSON.parse(selectedOrder.documents) : selectedOrder.documents;
                                                if (!Array.isArray(docs)) {
                                                    if (typeof docs === "object" && docs !== null) docs = [docs];
                                                    else return <Typography variant="caption">No documents found.</Typography>;
                                                }

                                                return docs.flatMap((docSet: any, tIdx: number) =>
                                                    Object.entries(docSet).map(([key, url]: any) => (
                                                        <Button
                                                            key={`${tIdx}-${key}`}
                                                            variant="outlined"
                                                            fullWidth
                                                            size="small"
                                                            startIcon={<OpenInNewIcon />}
                                                            onClick={() => handleViewFile(url, `${key} (T${tIdx + 1})`)}
                                                            sx={{ justifyContent: "flex-start", textTransform: "none" }}
                                                        >
                                                            {key.replace(/([A-Z])/g, " $1").trim()}
                                                        </Button>
                                                    ))
                                                );
                                            } catch (e) {
                                                return <Typography variant="caption" color="error">Error parsing documents</Typography>;
                                            }
                                        })()}
                                    </Stack>

                                    <Box sx={{ mt: 3, p: 2, border: "1px dashed #ccc", borderRadius: 2 }}>
                                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>UPDATE STATUS</Typography>
                                        <Stack spacing={1}>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                color="success"
                                                onClick={() => handleUpdateOrderStatus(selectedOrder.id, "Approved")}
                                                disabled={updatingOrder}
                                            >
                                                Mark Approved
                                            </Button>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                color="primary"
                                                onClick={() => handleUpdateOrderStatus(selectedOrder.id, "Process by Immigration")}
                                                disabled={updatingOrder}
                                            >
                                                Submit to Immigration
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                color="error"
                                                onClick={() => handleUpdateOrderStatus(selectedOrder.id, "Rejected")}
                                                disabled={updatingOrder}
                                            >
                                                Reject / Needs Revision
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ borderTop: "1px solid #eee", p: 2 }}>
                            <Button onClick={() => setSelectedOrder(null)}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* ARRIVAL CARD DETAIL DIALOG */}
            <Dialog open={!!selectedArrivalCard} onClose={() => setSelectedArrivalCard(null)} maxWidth="sm" fullWidth>
                {selectedArrivalCard && (
                    <>
                        <DialogTitle>Arrival Card Detail</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid size={6}>
                                    <Typography variant="caption" color="text.secondary">Name</Typography>
                                    <Typography variant="body1" fontWeight="bold">{selectedArrivalCard.fullName}</Typography>
                                </Grid>
                                <Grid size={6}>
                                    <Typography variant="caption" color="text.secondary">Passport Number</Typography>
                                    <Typography variant="body1">{selectedArrivalCard.passportNumber}</Typography>
                                </Grid>
                                <Grid size={6}>
                                    <Typography variant="caption" color="text.secondary">Arrival Date</Typography>
                                    <Typography variant="body1">{new Date(selectedArrivalCard.arrivalDate).toLocaleDateString()}</Typography>
                                </Grid>
                                <Grid size={6}>
                                    <Typography variant="caption" color="text.secondary">Flight Number</Typography>
                                    <Typography variant="body1">{selectedArrivalCard.flightNumber || "N/A"}</Typography>
                                </Grid>
                                <Grid size={12}>
                                    <Typography variant="caption" color="text.secondary">Customs Declaration / Answers</Typography>
                                    <Paper sx={{ p: 2, bgcolor: "action.hover", mt: 1 }}>
                                        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                            {JSON.stringify(selectedArrivalCard.formData, null, 2)}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                color="success"
                                variant="contained"
                                onClick={() => handleArrivalCardStatus(selectedArrivalCard.id, "APPROVED")}
                                disabled={updatingArrivalCard}
                            >
                                Approve Card
                            </Button>
                            <Button
                                color="error"
                                variant="outlined"
                                onClick={() => handleArrivalCardStatus(selectedArrivalCard.id, "REJECTED")}
                                disabled={updatingArrivalCard}
                            >
                                Reject Card
                            </Button>
                            <Button onClick={() => setSelectedArrivalCard(null)}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}
