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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import RevenueChart from "@/components/admin/sections/RevenueChart";

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

import VerificationTab from "@/components/admin/sections/VerificationTab";
import CompanyServicesTab from "@/components/admin/sections/CompanyServicesTab";
import InvoicingTab from "@/components/admin/sections/InvoicingTab";
import SupportChatTab from "@/components/admin/sections/SupportChatTab";
import AuditLogTab from "@/components/admin/sections/AuditLogTab"; // New import
import ArrivalCardsTab from "@/components/admin/sections/ArrivalCardsTab"; // NEW
import AIMasterTab from "@/components/admin/sections/AIMasterTab"; // NEW
import ImmigrationUpdatesTab from "@/components/admin/sections/ImmigrationUpdatesTab"; // NEW
import MarketingTab from "@/components/admin/sections/MarketingTab"; // NEW MARKETING TAB
import HistoryIcon from '@mui/icons-material/History'; // New import
import PsychologyIcon from "@mui/icons-material/Psychology"; // Added
import OrderPanel from "@/components/admin/sections/OrderPanel";
import { sendAdminAlert } from "@/app/actions/sendAdminAlert"; // Smart Alert System

// Constants & Types
const DRAWER_WIDTH = 260;

// Initial Stats renamed to Default or Initial State
const INITIAL_STATS = [
    { key: 'users', title: "Total Users", value: "-", change: "0%", isPositive: true, icon: <PeopleIcon />, color: "primary.main", bg: "primary.light" },
    { key: 'activeVisas', title: "Active Visas", value: "-", change: "0%", isPositive: true, icon: <AssignmentIcon />, color: "success.main", bg: "success.light" },
    { key: 'applications', title: "Total Apps", value: "-", change: "0%", isPositive: false, icon: <AccessTimeIcon />, color: "warning.main", bg: "warning.light" },
    { key: 'revenue', title: "Revenue", value: "$0", change: "0%", isPositive: true, icon: <AttachMoneyIcon />, color: "info.main", bg: "info.light" },
];

type TabType = 'dashboard' | 'visas' | 'users' | 'settings' | 'popular_visas' | 'verification' | 'company_services' | 'invoicing' | 'support' | 'logs' | 'arrival_cards' | 'ai_master' | 'orders' | 'updates' | 'marketing';

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
    const activeTab = (searchParams.get('tab') as TabType) || 'dashboard';

    // Data State
    const [visas, setVisas] = useState<VisaType[]>([]);
    const [stats, setStats] = useState(INITIAL_STATS);
    const [latestNotification, setLatestNotification] = useState<any>(null);
    const [allNotifications, setAllNotifications] = useState<any[]>([]);

    // Edit States
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [editingVisa, setEditingVisa] = useState<VisaType | null>(null);

    // Verification Link State
    const [selectedVerificationUser, setSelectedVerificationUser] = useState<string | undefined>(undefined);

    // Notifications
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotificationsModal, setShowNotificationsModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [newOrdersCount, setNewOrdersCount] = useState(0);
    // Initialize users list from Context logic
    const [usersList, setUsersList] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Broadcast State
    const [broadcastData, setBroadcastData] = useState({
        text: "",
        imageUrl: "",
        link: ""
    });

    // Health Check State
    const [healthStatus, setHealthStatus] = useState<any>(null);
    const [checkingHealth, setCheckingHealth] = useState(false);



    // Initial Health Check moved to after function definition

    // NEW: Structured Form State instead of raw JSON string
    const [detailsForm, setDetailsForm] = useState({
        intro: '',
        descriptionTitle: '',
        descriptionText: '',
        allowedTitle: '',
        allowedText: '',
        sponsorTitle: '',
        sponsorText: '',
        periodTitle: '',
        periodText: '',
        provisionsTitle: '',
        provisionsText: '',
        specialTitle: '',
        specialText: '',
        processingTitle: '',
        processingText: '',
        requirementsTitle: '',
        requirementsNote: '',
        pricingTitle: '',
        pricingNote: '',
        ctaTitle: '',
        ctaSubtitle: ''
    });

    // NEW: Pricing Editor State
    const [isMultiPricing, setIsMultiPricing] = useState(false);
    const [pricingRows, setPricingRows] = useState<{ label: string; price: string; fee: number }[]>([
        { label: 'Standard', price: '', fee: 0 }
    ]);

    // Sync Form State when opening edit dialog
    useEffect(() => {
        if (editingVisa) {
            // ... (existing logic handled inside)
        }
    }, [editingVisa]);

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
            try {
                const res = await fetch('/api/users');
                if (res.ok) {
                    const data = await res.json();
                    setUsersList(data);
                }
            } catch (e) {
                console.error("Failed to fetch users", e);
            }
        };
        fetchUsers();
    }, []);

    // RESTORED: Sync Stats with Users List
    useEffect(() => {
        if (usersList.length > 0) {
            setStats(prev => prev.map(s => {
                if (s.key === 'users') {
                    return { ...s, value: usersList.length.toString() };
                }
                return s;
            }));
        }
    }, [usersList]);

    // RESTORED: Fetch Admin Data (Stats & Notifications)
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(prev => prev.map(s => {
                        if (data[s.key]) {
                            return { ...s, value: data[s.key].value, change: data[s.key].change };
                        }
                        return s;
                    }));
                }
            } catch (e) {
                console.error("Stats fetch failed", e);
            }

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
            }
        };
        fetchAdminData();
    }, []);

    // NEW: Realtime Chat Listener (Admin Side)
    useEffect(() => {
        const channel = supabase
            .channel('admin_dashboard_global')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: "senderType=eq.user" },
                async (payload: any) => {
                    const newMsg = payload.new;
                    // Create a visual notification
                    const newNotif = {
                        id: `msg-${newMsg.id}`,
                        title: "New Support Message",
                        message: newMsg.message,
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
                    const order = payload.payload;
                    setNewOrdersCount(prev => prev + 1);
                    
                    const newNotif = {
                        id: `order-${order.id}`,
                        title: "New Order Received!",
                        message: `Order #${order.slug} from ${order.guestName} for ${order.visaName}`,
                        type: 'success',
                        isRead: false,
                        createdAt: new Date().toISOString(),
                        actionLink: "/admin?tab=orders"
                    };
                    
                    setAllNotifications(prev => [newNotif, ...prev]);
                    setLatestNotification(newNotif);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        if (editingVisa) {
            // Check if DB details are populated, otherwise fallback to static data
            const dbDetails = editingVisa.details;
            // Use DB details if they have keys, otherwise try static ID match
            const sourceInfo = (dbDetails && Object.keys(dbDetails).length > 0)
                ? dbDetails
                : (VISA_DETAILS[editingVisa.id] || {});

            setDetailsForm({
                intro: sourceInfo.intro || '',
                descriptionTitle: sourceInfo.description?.title || 'What is this Visa?',
                descriptionText: sourceInfo.description?.text || '',
                allowedTitle: sourceInfo.allowed?.title || 'What You Can Do',
                allowedText: sourceInfo.allowed?.text || '',
                sponsorTitle: sourceInfo.sponsor?.title || 'Sponsor Requirements',
                sponsorText: sourceInfo.sponsor?.text || '',
                periodTitle: sourceInfo.period?.title || 'Period of Stay',
                periodText: sourceInfo.period?.text || '',
                provisionsTitle: sourceInfo.provisions?.title || 'Other Provisions',
                provisionsText: sourceInfo.provisions?.text || '',
                specialTitle: sourceInfo.special?.title || 'Special Note',
                specialText: sourceInfo.special?.text || '',
                processingTitle: sourceInfo.processing?.title || 'Processing Time & Procedure',
                processingText: sourceInfo.processing?.text || '',
                requirementsTitle: sourceInfo.requirements?.title || 'Submission Requirements',
                requirementsNote: sourceInfo.requirements?.note || '',
                pricingTitle: sourceInfo.pricing?.title || 'Visa Fees',
                pricingNote: sourceInfo.pricing?.note || '',
                ctaTitle: sourceInfo.cta?.title || 'Apply Now',
                ctaSubtitle: sourceInfo.cta?.subtitle || 'Contact us to get started'
            });

            // Parse Pricing Logic for Editor
            const rawPrice = editingVisa.price;
            const rawFee = editingVisa.fee;
            let rows: { label: string; price: string; fee: number }[] = [];
            let isMulti = false;

            if (typeof rawPrice === 'object' && rawPrice !== null) {
                isMulti = true;
                // It's an object of {Duration: Price }
                Object.entries(rawPrice).forEach(([key, val]) => {
                    let feeVal = 0;
                    if (typeof rawFee === 'object' && rawFee !== null) {
                        feeVal = (rawFee as any)[key] || 0;
                    } else {
                        feeVal = Number(rawFee) || 0;
                    }
                    rows.push({ label: key, price: String(val), fee: feeVal });
                });
            } else {
                // It's a single string price
                rows.push({
                    label: 'Standard',
                    price: String(rawPrice || ''),
                    fee: Number(rawFee) || 0
                });
            }
            if (rows.length === 0) rows.push({ label: 'Standard', price: '', fee: 0 });

            setPricingRows(rows);
            setIsMultiPricing(isMulti);
        }
    }, [editingVisa]);

    // Fetch Visas
    useEffect(() => {
        const fetchVisas = async () => {
            try {
                const res = await fetch('/api/visas');
                if (res.ok) {
                    const data: VisaType[] = await res.json();

                    // Sort: Popular first
                    const sortedData = data.sort((a, b) => {
                        const indexA = POPULAR_VISA_IDS.indexOf(a.id);
                        const indexB = POPULAR_VISA_IDS.indexOf(b.id);

                        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                        if (indexA !== -1) return -1;
                        if (indexB !== -1) return 1;
                        return 0; // Keep original order
                    });

                    setVisas(sortedData);
                }
            } catch (error) {
                console.error("Failed to fetch visas", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchVisas();
    }, []);



    // Filter Logic
    const filteredVisas = visas.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handlers
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleBroadcast = () => {
        if (!broadcastData.text) {
            alert("Please enter announcement text.");
            return;
        }
        updateAnnouncement(broadcastData);
        alert("Announcement broadcasted to all users!");
        setBroadcastData({ text: "", imageUrl: "", link: "" });
    };

    const handleSaveVisa = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingVisa) return;

        // Reconstruct Pricing/Fee
        let finalPrice: any = '';
        let finalFee: any = 0;

        if (isMultiPricing) {
            const priceObj: Record<string, string> = {};
            const feeObj: Record<string, number> = {};
            pricingRows.forEach(row => {
                if (row.label.trim()) {
                    priceObj[row.label] = row.price.trim();
                    feeObj[row.label] = Number(String(row.fee).replace(/[^0-9.]/g, '')) || 0;
                }
            });
            finalPrice = priceObj;
            finalFee = feeObj;
        } else {
            const row = pricingRows[0] || { price: '', fee: 0 };
            finalPrice = row.price.trim();
            finalFee = Number(String(row.fee).replace(/[^0-9.]/g, '')) || 0;
        }

        // Construct the rich details object from the Form State
        const richDetails = {
            ...editingVisa.details,
            intro: detailsForm.intro,
            description: { title: detailsForm.descriptionTitle, text: detailsForm.descriptionText },
            allowed: { title: detailsForm.allowedTitle, text: detailsForm.allowedText },
            sponsor: { title: detailsForm.sponsorTitle, text: detailsForm.sponsorText },
            period: { title: detailsForm.periodTitle, text: detailsForm.periodText },
            provisions: { title: detailsForm.provisionsTitle, text: detailsForm.provisionsText },
            special: { title: detailsForm.specialTitle, text: detailsForm.specialText },
            processing: { title: detailsForm.processingTitle, text: detailsForm.processingText },
            requirements: {
                title: detailsForm.requirementsTitle,
                items: editingVisa.requirements || [], // Existing array
                note: detailsForm.requirementsNote
            },
            pricing: {
                title: detailsForm.pricingTitle,
                note: detailsForm.pricingNote,
                options: [] // Simplified: Pricing options logic linked to DB prices
            },
            cta: { title: detailsForm.ctaTitle, subtitle: detailsForm.ctaSubtitle }
        };

        try {
            const response = await fetch('/api/visas', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...editingVisa,
                    price: finalPrice,
                    fee: finalFee,
                    details: richDetails // Send the constructed object
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || data.error || 'Failed to update visa');
            }

            setVisas(prev => prev.map(v => v.id === data.id ? data : v));
            alert('Visa updated successfully');
            setEditingVisa(null);
        } catch (err: any) {
            console.error("Error saving visa", err);
            alert(`Failed to save visa: ${err.message}`);
        }
    };


    // DELETE HANDLER: Visa Application
    const handleDeleteApplication = async (appId: string) => {
        if (!confirm("Are you sure you want to delete this visa history record?")) return;
        try {
            const res = await fetch(`/api/applications?id=${appId}`, { method: 'DELETE' });
            if (res.ok) {
                // Remove from local state
                setEditingUser((prev: any) => prev ? {
                    ...prev,
                    applications: prev.applications.filter((a: any) => a.id !== appId)
                } : null);
                alert("Record deleted.");
            } else {
                const err = await res.json();
                alert(`Failed to delete record: ${err.details || err.error}`);
            }
        } catch (e: any) {
            console.error("Delete App Error", e);
            alert(`Error deleting record: ${e.message}`);
        }
    };

    // DELETE HANDLER: Document
    const handleDeleteDocument = async (docId: string) => {
        if (!confirm("Are you sure you want to delete this document?")) return;
        try {
            const res = await fetch(`/api/documents?id=${docId}`, { method: 'DELETE' });
            if (res.ok) {
                // Remove from local state
                setEditingUser((prev: any) => prev ? {
                    ...prev,
                    documents: prev.documents.filter((d: any) => d.id !== docId)
                } : null);
                alert("Document deleted.");
            } else {
                alert("Failed to delete document.");
            }
        } catch (e) {
            console.error("Delete Doc Error", e);
            alert("Error deleting document.");
        }
    };

    if (authLoading || !user || user.role !== 'admin') {
        return (
            <Box sx={{ display: 'flex', height: '100vh', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

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
                console.error("Update failed", errData);
                alert(`Failed to update user: ${errData.details || errData.error || 'Unknown error'}`);
            }
        } catch (e) {
            console.error("Error saving user", e);
            alert("Error saving user.");
        }
    };

    // Link Document Logic (Replaces File Upload)
    const [docName, setDocName] = useState("");
    const [docUrl, setDocUrl] = useState("");

    const handleAddLink = async () => {
        if (!editingUser || !docName || !docUrl) {
            alert("Please enter both Document Name and URL.");
            return;
        }

        try {
            // Save Metadata to DB
            const res = await fetch('/api/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: editingUser.id,
                    name: docName,
                    type: "application/link", // Special type for links
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
            } else {
                console.error("Failed to save document link");
                alert("Failed to save link.");
            }
        } catch (e: any) {
            console.error("Link add error", e);
            alert(`Failed to add link: ${e.message}`);
        }
    };

    // UI HELPER: Reset link inputs when dialog opens/closes
    useEffect(() => {
        if (!editingUser) {
            setDocName("");
            setDocUrl("");
        }
    }, [editingUser]);

    // PDF Export Menu State
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const pdfMenuOpen = Boolean(anchorEl);
    const handlePdfMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePdfMenuClose = () => {
        setAnchorEl(null);
    };

    // --- NEW LOGIC: PDF EXPORT ---
    const generatePDF = async (type: 'users' | 'visas' | 'company' | 'invoicing' | 'stats' | 'revenue-3m' | 'revenue-6m' | 'revenue-1y') => {
        handlePdfMenuClose();
        const doc = new jsPDF();
        let title = `Indonesian Visas - Report`;
        const timestamp = new Date().toLocaleString();

        let bodyData: any[] = [];
        let headData: string[] = [];
        let summaryText = "";

        try {
            if (type === 'users') {
                title += " - User Data";
                headData = ['Name', 'Email', 'Role', 'Status', 'Visa', 'Expires'];
                // Fetch latest users if needed, or use usersList
                bodyData = usersList.map(u => [u.name, u.email, u.role, u.status, u.visa || '-', u.expires || '-']);
            } else if (type === 'visas') {
                title += " - Visa Database";
                headData = ['Visa Name', 'ID', 'Category', 'Validity', 'Price'];
                bodyData = visas.map(v => [
                    v.name,
                    v.id,
                    v.category,
                    v.validity,
                    typeof v.price === 'object' ? 'Multi' : v.price
                ]);
            } else if (type === 'company') {
                title += " - Company Services";
                headData = ['Category', 'Product', 'Package', 'Price'];
                const res = await fetch('/api/company-services?isAdmin=true');
                const services = await res.json();
                bodyData = services.map((s: any) => [s.category, s.name, s.package, formatCurrency(Number(s.price))]);
            } else if (type === 'invoicing') {
                title += " - All Invoices";
                headData = ['Invoice #', 'User', 'Amount', 'Status', 'Date'];
                const res = await fetch('/api/invoices?isAdmin=true');
                const invs = await res.json();
                bodyData = invs.map((i: any) => [
                    i.invoiceNumber,
                    i.customerName,
                    formatCurrency(i.amount),
                    i.status,
                    new Date(i.createdAt).toLocaleDateString()
                ]);
            } else if (type === 'stats') {
                title += " - Statistics Overview";
                headData = ['Metric', 'Value', 'Change'];
                bodyData = stats.map(s => [s.title, s.value, s.change]);
            } else if (type.startsWith('revenue')) {
                const range = type.replace('revenue-', ''); // 3m, 6m, 1y
                title += ` - Revenue Report (${range.toUpperCase()})`;

                headData = ['Date', 'Invoice #', 'User', 'Amount', 'Status'];
                const res = await fetch('/api/invoices?isAdmin=true');
                const allInvoices = await res.json();

                // Filter Logic
                const now = new Date();
                let pastDate = new Date();
                if (range === '3m') pastDate.setMonth(now.getMonth() - 3);
                if (range === '6m') pastDate.setMonth(now.getMonth() - 6);
                if (range === '1y') pastDate.setFullYear(now.getFullYear() - 1);

                const filtered = allInvoices.filter((i: any) => new Date(i.createdAt) >= pastDate && i.status === 'PAID');

                // Smart Calculation
                const totalRevenue = filtered.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
                const avgRevenue = filtered.length > 0 ? totalRevenue / filtered.length : 0;

                bodyData = filtered.map((i: any) => [
                    new Date(i.createdAt).toLocaleDateString(),
                    i.invoiceNumber,
                    i.customerName,
                    formatCurrency(i.amount),
                    i.status
                ]);

                // Add Summary Row
                bodyData.push(['', '', 'TOTAL PERIOD REVENUE', formatCurrency(totalRevenue), '']);
                bodyData.push(['', '', 'AVERAGE / TXN', formatCurrency(avgRevenue), '']);

                summaryText = `Total Revenue: ${formatCurrency(totalRevenue)} | Txns: ${filtered.length}`;
            }

            doc.setFontSize(18);
            doc.text(title, 14, 22);
            doc.setFontSize(11);
            doc.text(`Generated on: ${timestamp}`, 14, 30);
            doc.text(`Company: Indonesian Visas (PT Antigravity)`, 14, 35);
            if (summaryText) {
                doc.setFont("helvetica", "bold");
                doc.text(summaryText, 14, 42);
                doc.setFont("helvetica", "normal");
            }

            autoTable(doc, {
                head: [headData],
                body: bodyData,
                startY: summaryText ? 48 : 45,
                theme: 'grid',
                headStyles: { fillColor: [145, 85, 253] }, // Brand Color
                didParseCell: function (data: any) {
                    if (data.row.index >= bodyData.length - 2 && type.startsWith('revenue')) {
                        data.cell.styles.fontStyle = 'bold';
                        data.cell.styles.fillColor = [240, 240, 240];
                    }
                }
            });

            doc.save(`report_${type}_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (e) {
            console.error("PDF Gen Error", e);
            alert("Failed to generate PDF. check console.");
        }
    };

    // --- NEW LOGIC: NOTIFICATION DELETE ---
    const handleDeleteNotification = async (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!confirm("Delete this notification?")) return;

        try {
            await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' });
            // Update UI
            setAllNotifications(prev => prev.filter(n => n.id !== id));
            // Update latest if needed
            if (latestNotification?.id === id) {
                setLatestNotification(allNotifications.filter(n => n.id !== id)[0] || null);
            }
        } catch (e) {
            console.error("Delete notif failed", e);
        }
    };

    // --- NEW LOGIC: SMART DIAGNOSTICS ---
    // --- NEW LOGIC: SMART DIAGNOSTICS ---
    // --- NEW LOGIC: SMART DIAGNOSTICS & AUTO-RECOVERY ---
    const checkHealth = async (service: string = 'all') => {
        setCheckingHealth(true);

        const checks: Record<string, () => Promise<boolean>> = {
            // INFRASTRUCTURE
            database: async () => simpleFetch('/api/health'),
            supabase: async () => simpleFetch('/api/storage'), // Dummy endpoint
            admin: async () => simpleFetch('/api/admin/stats'),
            public: async () => simpleFetch('/api/public'), // Uses new endpoint

            // EXTERNAL
            openai: async () => simpleFetch('/api/chat'), // Ping proxy
            google_maps: async () => simpleFetch('/api/google-maps'),
            internal_chat: async () => simpleFetch('/api/internal-chat'), // Dummy endpoint

            // AUTH
            login: async () => simpleFetch('/api/auth/session'), // Check session capability
            register: async () => simpleFetch('/api/users'), // Check user creation
            forgot_password: async () => simpleFetch('/api/forgot-password'),

            // FEATURES
            users: async () => simpleFetch('/api/users?limit=1'),
            visas: async () => simpleFetch('/api/visas?limit=1'),
            company: async () => simpleFetch('/api/company-services'),
            verification: async () => simpleFetch('/api/verification?check=true'),
            invoicing: async () => simpleFetch('/api/invoices?limit=1'),
            applications: async () => simpleFetch('/api/applications?limit=1'),
            documents: async () => simpleFetch('/api/documents'), // HEAD
            notifications: async () => simpleFetch('/api/notifications'), // HEAD
            upload: async () => simpleFetch('/api/upload'), // Check Bucket & Auto-Recover
            report_pull: async () => simpleFetch('/api/admin/reports/dynamic'),
            reporting: async () => simpleFetch('/api/admin/reports/dynamic')
        };

        const simpleFetch = async (url: string) => {
            try {
                // Try HEAD first (faster)
                const res = await fetch(url, { method: 'HEAD' });
                if (res.status === 405 || res.ok) return true;

                // Fallback to GET ensures we trigger any recovery logic in endpoints
                const res2 = await fetch(url);
                return res2.ok || (res2.status < 500);
            } catch { return false; }
        };

        // Helper to update status with Recovery Logic
        const runCheck = async (key: string) => {
            if (checks[key]) {
                let result = await checks[key]();

                // AUTO-RECOVERY ATTEMPT 1
                if (!result) {
                    console.warn(`[SmartHealth] ${key} failed. Retrying in 2s...`);
                    await new Promise(r => setTimeout(r, 2000));
                    result = await checks[key]();

                    if (result) {
                        console.info(`[SmartHealth] ${key} recovered successfully.`);
                    }
                }

                setHealthStatus((prev: any) => ({ ...prev, [key]: result }));

                // ALERTING (If still failed)
                if (!result && service !== 'all') { // Only alert on explicit single checks or persistent failures
                    const title = `System Alert: ${key.toUpperCase()} Critical Failure`;

                    // 1. Dashboard Notification
                    setAllNotifications(prev => {
                        if (prev.find(n => n.title === title)) return prev;
                        return [{
                            id: `alert-${Date.now()}`,
                            title: title,
                            message: `Auto-recovery failed for ${key}. Admin has been notified via email.`,
                            type: 'error',
                            read: false,
                            createdAt: new Date().toISOString()
                        }, ...prev];
                    });

                    // 2. Email Notification (Server Action)
                    sendAdminAlert(
                        `URGENT: ${key} Service Down on IndonesianVisas`,
                        `System detected that the '${key}' service is offline and auto-recovery failed.\n\nPlease check the server logs immediately.\nTime: ${new Date().toLocaleString()}`
                    );
                }
            }
        };

        if (service === 'all') {
            const results = await Promise.all(Object.keys(checks).map(async (key) => {
                // Stagger checks slightly to avoid hammering server
                await new Promise(r => setTimeout(r, Math.random() * 500));
                return runCheck(key);
            }));
        } else {
            await runCheck(service);
        }

        setCheckingHealth(false);
    };

    // Initial Health Check
    useEffect(() => {
        checkHealth('all');
    }, []);

    const handleAddVerification = () => {
        if (!editingUser) return;
        // Redirect to Verification Tab with ID
        setSelectedVerificationUser(editingUser.id);
        router.push(`/${locale}/admin?tab=verification`);
        setEditingUser(null);
    };

    // --- UPDATED STATS CALCULATION WITH REAL DATA ---
    useEffect(() => {
        const fetchRealStats = async () => {
            try {
                // 1. Users
                const usersRes = await fetch('/api/users');
                const users = usersRes.ok ? await usersRes.json() : [];
                const totalUsers = users.length;

                // 2. Active Visas (From Visa Applications Table)
                const appsRes = await fetch('/api/applications?isAdmin=true'); // Ensure this route supports returning all for admin
                const apps: any[] = appsRes.ok ? await appsRes.json() : [];

                // Logic: Active if status is 'Active' or 'Approved' AND not expired
                const activeVisas = apps.filter(a =>
                    (a.status === 'Active' || a.status === 'Approved') &&
                    (a.expiresAt && a.expiresAt !== '-' ? new Date(a.expiresAt) > new Date() : true)
                ).length;

                const totalApps = apps.length;

                // 3. Revenue (From Invoices)
                const invRes = await fetch('/api/invoices?isAdmin=true');
                const invoices: any[] = invRes.ok ? await invRes.json() : [];

                // Logic: Sum of PAID invoices
                const revenue = invoices
                    .filter(i => i.status === 'PAID')
                    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

                // Update Stats State
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

        if (activeTab === 'dashboard') {
            fetchRealStats(); // Initial fetch
            const interval = setInterval(fetchRealStats, 30000); // Realtime Polling every 30s
            return () => clearInterval(interval);
        }
    }, [activeTab]);

    // --- ACCESS CHECK ---
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
        <div>
            <Toolbar sx={{ px: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', py: 3, gap: 1 }}>
                <Typography variant="h6" fontWeight="800" color="text.primary" sx={{ letterSpacing: '-0.5px', mb: 1 }}>
                    INDONESIAN<Box component="span" color="primary.main">VISAS</Box>
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: 'action.hover', borderRadius: 3, width: '100%', mb: 1 }}>
                    <Avatar src={user?.avatar} sx={{ width: 40, height: 40, border: '1px solid', borderColor: 'divider' }}>{user?.name?.charAt(0)}</Avatar>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="subtitle2" fontWeight="bold" noWrap>{user?.name || 'Admin'}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap display="block">{user?.email}</Typography>
                    </Box>
                </Box>
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
                    {theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}
                </Button>

            </Toolbar>
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
                    { key: 'logs', label: 'Audit Logs', icon: <HistoryIcon /> },
                    { key: 'ai_master', label: 'Ai Master', icon: <PsychologyIcon /> },
                    { key: 'marketing', label: 'Marketing Intelligence', icon: <BarChartIcon /> },
                    { key: 'updates', label: 'Immigration Updates', icon: <CampaignIcon /> },
                ].map((item) => (
                    <ListItem key={item.key} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            selected={activeTab === item.key}
                            onClick={() => { 
                                router.push(`/${locale}/admin?tab=${item.key}`); 
                                if (item.key === 'orders') setNewOrdersCount(0);
                                if (isMobile) setMobileOpen(false); 
                            }}
                            sx={{
                                borderRadius: 2,
                                '&.Mui-selected': { bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, '& .MuiListItemIcon-root': { color: 'white' } }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: activeTab === item.key ? 'white' : 'text.secondary' }}>
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
                            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
                        </ListItemButton>

                    </ListItem>
                ))}
                {/* Divider */}
                <Box sx={{ my: 2 }}><Divider /></Box>
                <ListItem disablePadding>
                    <ListItemButton sx={{ borderRadius: 2 }} onClick={logout}>
                        <ListItemIcon sx={{ minWidth: 40 }}><LogoutIcon color="error" /></ListItemIcon>
                        <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, color: 'error.main' }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            {/* AppBar Removed per user request to use default Global Header or just remove white layer */}

            {/* Mobile Toggle Button (Floating) - Optional if we strictly want no AppBar */}
            {/* Mobile Toggle Button - REMOVED: Using Header Admin Panel instead */}

            {/* SIDEBAR */}
            <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: DRAWER_WIDTH,
                            borderRight: '1px solid rgba(0,0,0,0.12)',

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
            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, pt: { xs: 10, md: 12 }, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh', bgcolor: 'background.default' }}>
                <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
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
                                    id="pdf-export-button"
                                >
                                    Download Report
                                </Button>
                            </Box>

                            {/* ROW 1: Welcome & Statistics */}
                            <Grid container spacing={3}>
                                {/* Welcome Card */}
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
                                        <CardContent>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                Information Center
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                {Array.isArray(allNotifications) && allNotifications.length > 0
                                                    ? `You have ${allNotifications.length} active notification${allNotifications.length > 1 ? 's' : ''}.`
                                                    : "No new notifications. System is running smoothly."}
                                            </Typography>

                                            {latestNotification && (
                                                <Box sx={{ mb: 2, p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                                    <Typography variant="subtitle2" fontWeight="bold" color="primary">Latest: {latestNotification.title}</Typography>
                                                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                                                        {latestNotification.message}
                                                    </Typography>
                                                </Box>
                                            )}

                                            <Button
                                                variant="contained"
                                                size="small"
                                                fullWidth
                                                onClick={() => setShowNotificationsModal(true)}
                                                startIcon={<NotificationsActiveIcon />}
                                            >
                                                View All Notifications
                                            </Button>

                                            {/* Trophy Illustration (Abstract) */}
                                            <Box sx={{ position: 'absolute', right: 10, bottom: 10, opacity: 0.1 }}>
                                                <NotificationsActiveIcon sx={{ fontSize: 100, color: 'primary.main' }} />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Statistics Cards */}
                                <Grid size={{ xs: 12, md: 8 }}>
                                    <Grid container spacing={3}>
                                        {stats.map((stat, idx) => (
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                                                <Card sx={{ height: '100%' }}>
                                                    <CardContent>
                                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                            <Avatar variant="rounded" sx={{ bgcolor: stat.bg, color: stat.color }}>
                                                                {stat.icon}
                                                            </Avatar>
                                                            <IconButton size="small"><MoreVertIcon fontSize="small" /></IconButton>
                                                        </Stack>
                                                        <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5 }}>{stat.value}</Typography>
                                                        <Typography variant="body2" color="text.secondary">{stat.title}</Typography>
                                                        <Typography variant="caption" color={stat.isPositive ? "success.main" : "error.main"} fontWeight="bold">
                                                            {stat.change}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Grid>




                            {/* ROW 1.5: SYSTEM HEALTH PANEL (NEW) */}
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12 }}>
                                    <Card>
                                        <CardHeader
                                            title="Smart System Health Panel"
                                            subheader="Real-time control & connection status of all system APIs"
                                            action={
                                                <Button
                                                    startIcon={<SpeedIcon />}
                                                    size="small"
                                                    onClick={() => checkHealth('all')}
                                                    disabled={checkingHealth}
                                                    variant="contained"
                                                    color="primary"
                                                >
                                                    {checkingHealth ? "Running Diagnostics..." : "Run Global Diagnostics"}
                                                </Button>
                                            }
                                        />
                                        <Divider />
                                        <CardContent sx={{ maxHeight: 600, overflowY: 'auto' }}>
                                            {[
                                                {
                                                    title: "Core Infrastructure",
                                                    items: [
                                                        { key: 'database', label: 'Primary Database', icon: <DescriptionIcon /> },
                                                        { key: 'supabase', label: 'Supabase Storage', icon: <CloudUploadIcon /> },
                                                        { key: 'admin', label: 'Admin API', icon: <DashboardIcon /> },
                                                        { key: 'public', label: 'Public API', icon: <PeopleIcon /> },
                                                    ]
                                                },
                                                {
                                                    title: "External Integration",
                                                    items: [
                                                        { key: 'openai', label: 'OpenAI API', icon: <Box component="span" sx={{ fontSize: 20 }}>🤖</Box> },
                                                        { key: 'google_maps', label: 'Google Maps', icon: <Box component="span" sx={{ fontSize: 20 }}>🗺️</Box> },
                                                        { key: 'internal_chat', label: 'Internal Chat', icon: <MessageIcon /> },
                                                    ]
                                                },
                                                {
                                                    title: "Authentication",
                                                    items: [
                                                        { key: 'login', label: 'System Login', icon: <LoginIcon /> },
                                                        { key: 'register', label: 'Register', icon: <AddCircleIcon /> },
                                                        { key: 'forgot_password', label: 'Forgot Password', icon: <LockIcon /> },
                                                    ]
                                                },
                                                {
                                                    title: "Feature APIs",
                                                    items: [
                                                        { key: 'users', label: 'User Database', icon: <PeopleIcon /> },
                                                        { key: 'visas', label: 'Visa Database', icon: <DescriptionIcon /> },
                                                        { key: 'company', label: 'Company Services', icon: <BusinessIcon /> },
                                                        { key: 'verification', label: 'Verification', icon: <VerifiedUserIcon /> },
                                                        { key: 'invoicing', label: 'Invoicing', icon: <ReceiptIcon /> },
                                                        { key: 'applications', label: 'Applications', icon: <AssignmentIcon /> },
                                                        { key: 'documents', label: 'Documents', icon: <DescriptionIcon /> },
                                                        { key: 'notifications', label: 'Notifications', icon: <NotificationsActiveIcon /> },
                                                        { key: 'upload', label: 'Upload System', icon: <CloudUploadIcon /> },
                                                    ]
                                                },
                                                {
                                                    title: "Production Intelligence",
                                                    items: [
                                                        { key: 'reporting', label: 'Dynamic Reporting', icon: <AnalyticsIcon /> },
                                                    ]
                                                }
                                            ].map((group, gIdx) => (
                                                <Box key={gIdx} sx={{ mb: 3 }}>
                                                    <Typography variant="overline" color="text.secondary" fontWeight="bold" sx={{ display: 'block', mb: 1 }}>
                                                        {group.title}
                                                    </Typography>
                                                    <Grid container spacing={2}>
                                                        {group.items.map((service) => (
                                                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={service.key}>
                                                                <Box sx={{
                                                                    p: 1.5,
                                                                    border: '1px solid',
                                                                    borderColor: 'divider',
                                                                    borderRadius: 2,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    gap: 1.5,
                                                                    bgcolor: healthStatus?.[service.key] ? 'success.lighter' : healthStatus?.[service.key] === false ? 'error.lighter' : 'background.paper',
                                                                    position: 'relative',
                                                                    overflow: 'hidden',
                                                                    transition: 'all 0.2s',
                                                                    '&:hover': { boxShadow: 2 }
                                                                }}>
                                                                    {/* Status Light Strip */}
                                                                    <Box sx={{
                                                                        position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
                                                                        bgcolor: healthStatus?.[service.key] ? 'success.main' : healthStatus?.[service.key] === false ? 'error.main' : 'grey.300'
                                                                    }} />

                                                                    <Box display="flex" alignItems="center" gap={1.5}>
                                                                        <Avatar sx={{
                                                                            bgcolor: healthStatus?.[service.key] ? 'success.light' : healthStatus?.[service.key] === false ? 'error.light' : 'action.disabledBackground',
                                                                            color: healthStatus?.[service.key] ? 'success.main' : healthStatus?.[service.key] === false ? 'error.main' : 'text.disabled',
                                                                            width: 32, height: 32
                                                                        }}>
                                                                            {service.icon}
                                                                        </Avatar>
                                                                        <Box>
                                                                            <Typography variant="caption" fontWeight="bold" display="block" sx={{ lineHeight: 1.1 }}>{service.label}</Typography>
                                                                            <Typography variant="caption" sx={{ fontSize: '0.65rem' }} color="text.secondary">
                                                                                {healthStatus?.[service.key] ? 'Online' : healthStatus?.[service.key] === false ? 'Offline' : 'Pending'}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>

                                                                    <Tooltip title={`Trigger ${service.label} Check`}>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => checkHealth(service.key)}
                                                                            disabled={checkingHealth}
                                                                            sx={{
                                                                                width: 28, height: 28,
                                                                                border: '1px solid',
                                                                                borderColor: 'divider',
                                                                                '&:hover': { bgcolor: 'primary.lighter', color: 'primary.main', borderColor: 'primary.main' }
                                                                            }}
                                                                        >
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


                            {/* ROW 2: Broadcast Panel (Moved Up & Expanded) */}
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
                                        <CardHeader
                                            title="Broadcast Announcement"
                                            avatar={<Avatar sx={{ bgcolor: 'error.main' }}><CampaignIcon /></Avatar>}
                                        />
                                        <CardContent>
                                            <Stack spacing={2}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Send a message to all user dashboards immediately.
                                                </Typography>
                                                <TextField
                                                    label="Message"
                                                    multiline
                                                    rows={3}
                                                    fullWidth
                                                    size="small"
                                                    value={broadcastData.text}
                                                    onChange={(e) => setBroadcastData({ ...broadcastData, text: e.target.value })}
                                                />
                                                <TextField
                                                    label="Image URL (Optional)"
                                                    fullWidth
                                                    size="small"
                                                    value={broadcastData.imageUrl}
                                                    onChange={(e) => setBroadcastData({ ...broadcastData, imageUrl: e.target.value })}
                                                />
                                                <TextField
                                                    label="Link URL (Optional)"
                                                    fullWidth
                                                    size="small"
                                                    value={broadcastData.link}
                                                    onChange={(e) => setBroadcastData({ ...broadcastData, link: e.target.value })}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    startIcon={<CampaignIcon />}
                                                    onClick={handleBroadcast}
                                                >
                                                    Broadcast Now
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Revenue Chart */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <RevenueChart />
                                </Grid>
                            </Grid>

                        </Stack>
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
                        <Stack spacing={4} sx={{ animation: 'fadeIn 0.5s ease' }}>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-end" flexWrap="wrap" gap={2}>
                                <div>
                                    <Typography variant="h4" fontWeight="bold">Visa Database</Typography>
                                    <Typography variant="body1" color="text.secondary">Manage {visas.length} active visa products.</Typography>
                                </div>
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        size="small"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                                            sx: { bgcolor: 'background.paper', borderRadius: 2 }
                                        }}
                                        inputProps={{ 'aria-label': 'Search Visas' }}
                                    />
                                    <Button variant="contained" startIcon={<AddIcon />}>Add Product</Button>
                                </Stack>
                            </Box>

                            <Card>
                                <TableContainer>
                                    <Table sx={{ minWidth: 650 }} aria-label="visas table">
                                        <TableHead sx={{ bgcolor: 'background.default' }}>
                                            <TableRow>
                                                <TableCell>PRODUCT NAME</TableCell>
                                                <TableCell>ID VISA</TableCell>
                                                <TableCell>PRICES (IDR)</TableCell>
                                                <TableCell>FEES (IDR)</TableCell>
                                                <TableCell>VALIDITY</TableCell>
                                                <TableCell>REQUIREMENTS</TableCell>
                                                <TableCell align="center">STATUS</TableCell>
                                                <TableCell align="right">ACTIONS</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredVisas.map((row) => (
                                                <TableRow key={row.id} hover>
                                                    <TableCell>
                                                        <Typography variant="subtitle2" fontWeight="bold">{row.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200, display: 'block' }}>{row.category}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={row.id}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {(() => {
                                                            if (typeof row.price === 'object' && row.price !== null) {
                                                                return (
                                                                    <Stack spacing={0.5}>
                                                                        {Object.entries(row.price).map(([key, val]) => (
                                                                            <Typography key={key} variant="caption" display="block" fontFamily="monospace">
                                                                                <Box component="span" sx={{ opacity: 0.7 }}>{key}:</Box> {String(val)}
                                                                            </Typography>
                                                                        ))}
                                                                    </Stack>
                                                                );
                                                            }
                                                            if (!row.price || row.price === 'IDR 0' || row.price === '0') {
                                                                return <Chip label="Contact Us" size="small" variant="outlined" />;
                                                            }
                                                            return (
                                                                <Typography variant="body2" fontFamily="monospace" fontWeight="bold">
                                                                    {String(row.price)}
                                                                </Typography>
                                                            );
                                                        })()}
                                                    </TableCell>
                                                    <TableCell>
                                                        {(() => {
                                                            if (typeof row.fee === 'object' && row.fee !== null) {
                                                                return (
                                                                    <Stack spacing={0.5}>
                                                                        {Object.entries(row.fee).map(([key, val]) => (
                                                                            <Typography key={key} variant="caption" display="block" fontFamily="monospace" color="text.secondary">
                                                                                <Box component="span" sx={{ opacity: 0.7 }}>{key}:</Box> {formatCurrency(Number(val))}
                                                                            </Typography>
                                                                        ))}
                                                                    </Stack>
                                                                );
                                                            }
                                                            if (typeof row.fee === 'number') {
                                                                return (
                                                                    <Typography variant="body2" fontFamily="monospace" color="text.secondary">
                                                                        {formatCurrency(row.fee)}
                                                                    </Typography>
                                                                );
                                                            }
                                                            return (
                                                                <Typography variant="body2" fontFamily="monospace" color="text.secondary">
                                                                    {String(row.fee || '-')}
                                                                </Typography>
                                                            );
                                                        })()}
                                                    </TableCell>
                                                    <TableCell>{row.validity}</TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {row.requirements ? `${row.requirements.length} Items` : '0 Items'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'success.light', color: 'success.main', mx: 'auto' }}>
                                                            <CheckIcon sx={{ fontSize: 14 }} />
                                                        </Avatar>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <IconButton size="small" onClick={() => setEditingVisa(row)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Card>
                        </Stack>
                    )}

                    {/* --- POPULAR VISAS TAB --- */}
                    {activeTab === 'popular_visas' && (
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
                                            {visas.filter(v => POPULAR_VISA_IDS.includes(v.id)).map((row) => (
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
                                                            startIcon={<EditIcon />}
                                                            onClick={() => setEditingVisa(row)}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Card>
                        </Stack>
                    )}

                    {/* --- USERS TAB --- */}
                    {activeTab === 'users' && (
                        <Stack spacing={4} sx={{ animation: 'fadeIn 0.5s ease' }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <div>
                                    <Typography variant="h4" fontWeight="bold">User Management</Typography>
                                    <Typography variant="body1" color="text.secondary">Total 1,245 registered users.</Typography>
                                </div>
                                <Button variant="outlined" startIcon={<CloudUploadIcon />}>Export CSV</Button>
                            </Box>

                            <Card>
                                <TableContainer>
                                    <Table>
                                        <TableHead sx={{ bgcolor: 'background.default' }}>
                                            <TableRow>
                                                <TableCell>USER</TableCell>
                                                <TableCell>ROLE</TableCell>
                                                <TableCell>CURRENT VISA</TableCell>
                                                <TableCell>EXPIRY</TableCell>
                                                <TableCell>STATUS</TableCell>
                                                <TableCell align="right">ACTIONS</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {usersList.map((u) => (
                                                <TableRow key={u.id} hover sx={{ bgcolor: u.status === 'Deleted' ? 'error.lighter' : 'inherit', opacity: u.status === 'Deleted' ? 0.7 : 1 }}>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={2} alignItems="center">
                                                            <Avatar sx={{ bgcolor: u.status === 'Deleted' ? 'grey.500' : 'primary.main', fontWeight: 'bold' }}>{(u.name || 'U').charAt(0).toUpperCase()}</Avatar>
                                                            <Box>
                                                                <Stack direction="row" alignItems="center" gap={1}>
                                                                    <Typography variant="subtitle2" fontWeight="bold" sx={{ textDecoration: u.status === 'Deleted' ? 'line-through' : 'none' }}>{u.name || 'Unknown User'}</Typography>
                                                                    {/* NOTIFICATION BADGE */}
                                                                    {notifications && (notifications as any)[String(u.id)] && (notifications as any)[String(u.id)].length > 0 && (
                                                                        <Chip
                                                                            label="Urgent"
                                                                            color="error"
                                                                            size="small"
                                                                            icon={<NotificationsActiveIcon />}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                alert((notifications as any)[String(u.id)][0].message);
                                                                                clearNotifications(String(u.id));
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Stack>
                                                                <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                                                            </Box>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell><Typography variant="body2" fontWeight="bold" color="text.secondary">{u.role}</Typography></TableCell>
                                                    <TableCell>{u.visa}</TableCell>
                                                    <TableCell>{u.expires}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={u.status}
                                                            size="small"
                                                            color={u.status === 'Active' ? 'success' : u.status === 'Deleted' ? 'error' : u.status === 'Pending' ? 'warning' : 'default'}
                                                            sx={{ fontWeight: 'bold' }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button size="small" variant="text" onClick={() => setEditingUser(u)}>Manage</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Card>
                        </Stack>
                    )}
                </Box>
            </Box>

            {/* --- EDIT VISA DIALOG --- */}
            <Dialog open={!!editingVisa} onClose={() => setEditingVisa(null)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Visa Product</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} pt={1}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="ID Visa"
                                    fullWidth
                                    disabled
                                    value={editingVisa?.id || ''}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Category"
                                    fullWidth
                                    value={editingVisa?.category || ''}
                                    onChange={e => setEditingVisa((prev: VisaType | null) => prev ? { ...prev, category: e.target.value } : null)}
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            label="Product Name"
                            fullWidth
                            value={editingVisa?.name || ''}
                            onChange={e => setEditingVisa((prev: VisaType | null) => prev ? { ...prev, name: e.target.value } : null)}
                        />

                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={2}
                            value={editingVisa?.description || ''}
                            onChange={e => setEditingVisa((prev: VisaType | null) => prev ? { ...prev, description: e.target.value } : null)}
                        />

                        {/* --- PRICING EDITOR --- */}
                        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2, mb: 2, mt: 1 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                                    Pricing Configuration
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={isMultiPricing}
                                            onChange={(e) => setIsMultiPricing(e.target.checked)}
                                            size="small"
                                        />
                                    }
                                    label={<Typography variant="caption">Multi-Option (Stacked)</Typography>}
                                />
                            </Stack>

                            {isMultiPricing ? (
                                <Stack spacing={2}>
                                    {pricingRows.map((row, idx) => (
                                        <Grid container spacing={2} key={idx} alignItems="center">
                                            <Grid size={{ xs: 4, sm: 4 }}>
                                                <TextField
                                                    label="Label (e.g. 1 Year)"
                                                    size="small"
                                                    fullWidth
                                                    value={row.label}
                                                    onChange={(e) => {
                                                        const newRows = [...pricingRows];
                                                        newRows[idx].label = e.target.value;
                                                        setPricingRows(newRows);
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 3, sm: 3 }}>
                                                <TextField
                                                    label="Price"
                                                    size="small"
                                                    fullWidth
                                                    value={row.price}
                                                    onChange={(e) => {
                                                        const newRows = [...pricingRows];
                                                        newRows[idx].price = e.target.value;
                                                        setPricingRows(newRows);
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 3, sm: 3 }}>
                                                <TextField
                                                    label="Fee"
                                                    size="small"
                                                    fullWidth
                                                    value={row.fee}
                                                    onChange={(e) => {
                                                        const newRows = [...pricingRows];
                                                        newRows[idx].fee = Number(e.target.value);
                                                        setPricingRows(newRows);
                                                    }}
                                                    type="number"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 2, sm: 2 }}>
                                                <IconButton color="error" size="small" onClick={() => {
                                                    const newRows = pricingRows.filter((_, i) => i !== idx);
                                                    setPricingRows(newRows);
                                                }}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    ))}
                                    <Button
                                        startIcon={<AddCircleIcon />}
                                        onClick={() => setPricingRows([...pricingRows, { label: 'New Option', price: '', fee: 0 }])}
                                        size="small"
                                    >
                                        Add Option
                                    </Button>
                                </Stack>
                            ) : (
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="Price (Normal Text)"
                                            fullWidth
                                            value={pricingRows[0]?.price || ''}
                                            onChange={(e) => {
                                                const newRows = [...pricingRows];
                                                if (!newRows[0]) newRows[0] = { label: 'Standard', price: '', fee: 0 };
                                                newRows[0].price = e.target.value;
                                                setPricingRows(newRows);
                                            }}
                                            helperText="e.g. IDR 500.000"
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="Fee (Number)"
                                            fullWidth
                                            value={pricingRows[0]?.fee || 0}
                                            onChange={(e) => {
                                                const newRows = [...pricingRows];
                                                if (!newRows[0]) newRows[0] = { label: 'Standard', price: '', fee: 0 };
                                                newRows[0].fee = Number(e.target.value);
                                                setPricingRows(newRows);
                                            }}
                                            type="number"
                                            helperText="e.g. 250000"
                                        />
                                    </Grid>
                                </Grid>
                            )}
                        </Box>

                        <TextField
                            label="Intro (Header Text)"
                            fullWidth
                            multiline
                            rows={3}
                            value={detailsForm.intro}
                            onChange={e => setDetailsForm({ ...detailsForm, intro: e.target.value })}
                            placeholder="Main text at the top of the page"
                        />

                        <Divider><Typography variant="overline" color="text.secondary">Detailed Content</Typography></Divider>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    label="Description Title"
                                    fullWidth
                                    value={detailsForm.descriptionTitle}
                                    onChange={e => setDetailsForm({ ...detailsForm, descriptionTitle: e.target.value })}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    label="Description Text"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={detailsForm.descriptionText}
                                    onChange={e => setDetailsForm({ ...detailsForm, descriptionText: e.target.value })}
                                />
                            </Grid>
                        </Grid>

                        <Divider><Typography variant="overline" color="text.secondary">Rules & Activities</Typography></Divider>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    label="Allowed Title"
                                    fullWidth
                                    value={detailsForm.allowedTitle}
                                    onChange={e => setDetailsForm({ ...detailsForm, allowedTitle: e.target.value })}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    label="Allowed Text"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={detailsForm.allowedText}
                                    onChange={e => setDetailsForm({ ...detailsForm, allowedText: e.target.value })}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    label="Sponsor Title"
                                    fullWidth
                                    value={detailsForm.sponsorTitle}
                                    onChange={e => setDetailsForm({ ...detailsForm, sponsorTitle: e.target.value })}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    label="Sponsor Text"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={detailsForm.sponsorText}
                                    onChange={e => setDetailsForm({ ...detailsForm, sponsorText: e.target.value })}
                                />
                            </Grid>
                        </Grid>

                        <Divider><Typography variant="overline" color="text.secondary">Validity & Provisions</Typography></Divider>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    label="Period Title"
                                    fullWidth
                                    value={detailsForm.periodTitle}
                                    onChange={e => setDetailsForm({ ...detailsForm, periodTitle: e.target.value })}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    label="Period Text"
                                    fullWidth
                                    value={detailsForm.periodText}
                                    onChange={e => setDetailsForm({ ...detailsForm, periodText: e.target.value })}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    label="Provisions Title"
                                    fullWidth
                                    value={detailsForm.provisionsTitle}
                                    onChange={e => setDetailsForm({ ...detailsForm, provisionsTitle: e.target.value })}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    label="Provisions Text"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={detailsForm.provisionsText}
                                    onChange={e => setDetailsForm({ ...detailsForm, provisionsText: e.target.value })}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    label="Special Title"
                                    fullWidth
                                    value={detailsForm.specialTitle}
                                    onChange={e => setDetailsForm({ ...detailsForm, specialTitle: e.target.value })}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    label="Special Text"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={detailsForm.specialText}
                                    onChange={e => setDetailsForm({ ...detailsForm, specialText: e.target.value })}
                                />
                            </Grid>
                        </Grid>

                        <Divider><Typography variant="overline" color="text.secondary">Process & Requirements</Typography></Divider>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    label="Processing Title"
                                    fullWidth
                                    value={detailsForm.processingTitle}
                                    onChange={e => setDetailsForm({ ...detailsForm, processingTitle: e.target.value })}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    label="Processing Text"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={detailsForm.processingText}
                                    onChange={e => setDetailsForm({ ...detailsForm, processingText: e.target.value })}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    label="Requirements Title"
                                    fullWidth
                                    value={detailsForm.requirementsTitle}
                                    onChange={e => setDetailsForm({ ...detailsForm, requirementsTitle: e.target.value })}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    label="Requirements Note"
                                    fullWidth
                                    multiline
                                    rows={1}
                                    value={detailsForm.requirementsNote}
                                    onChange={e => setDetailsForm({ ...detailsForm, requirementsNote: e.target.value })}
                                    helperText="Note displayed below the list"
                                />
                            </Grid>
                        </Grid>

                        <Divider><Typography variant="overline" color="text.secondary">Requirements</Typography></Divider>

                        <TextField
                            label="Requirements (One per line)"
                            fullWidth
                            multiline
                            rows={4}
                            value={editingVisa?.requirements ? editingVisa.requirements.join('\n') : ''}
                            onChange={e => {
                                const val = e.target.value;
                                setEditingVisa((prev: VisaType | null) => prev ? { ...prev, requirements: val.split('\n') } : null);
                            }}
                            helperText="Split items with a new line"
                        />

                        <Divider><Typography variant="overline" color="text.secondary">Pricing & Call to Action (CTA)</Typography></Divider>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    label="Pricing Title"
                                    fullWidth
                                    value={detailsForm.pricingTitle}
                                    onChange={e => setDetailsForm({ ...detailsForm, pricingTitle: e.target.value })}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    label="Pricing Note"
                                    fullWidth
                                    multiline
                                    rows={1}
                                    value={detailsForm.pricingNote}
                                    onChange={e => setDetailsForm({ ...detailsForm, pricingNote: e.target.value })}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    label="CTA Title"
                                    fullWidth
                                    value={detailsForm.ctaTitle}
                                    onChange={e => setDetailsForm({ ...detailsForm, ctaTitle: e.target.value })}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    label="CTA Subtitle"
                                    fullWidth
                                    multiline
                                    rows={1}
                                    value={detailsForm.ctaSubtitle}
                                    onChange={e => setDetailsForm({ ...detailsForm, ctaSubtitle: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setEditingVisa(null)} color="inherit">Cancel</Button>
                    <Button onClick={handleSaveVisa} variant="contained">Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* --- EDIT USER DIALOG --- */}
            <Dialog open={!!editingUser} onClose={() => setEditingUser(null)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 'bold' }}>Manage User: {editingUser?.name}</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} pt={1}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={editingUser?.status || 'Active'}
                                label="Status"
                                onChange={(e) => setEditingUser((prev: any) => prev ? { ...prev, status: e.target.value } : null)}
                            >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                                <MenuItem value="Hold">Hold (Payment/Visa Issue)</MenuItem>
                                <MenuItem value="Deleted">Deleted</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Current Visa"
                            fullWidth
                            value={editingUser?.visa || ''}
                            onChange={e => setEditingUser((prev: any) => prev ? { ...prev, visa: e.target.value } : null)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><WorkIcon fontSize="small" /></InputAdornment>
                            }}
                        />
                        <TextField
                            label="Expiry Date"
                            type="date"
                            fullWidth
                            value={editingUser?.expires && !isNaN(Date.parse(editingUser.expires))
                                ? new Date(editingUser.expires).toISOString().split('T')[0]
                                : ''}
                            onChange={e => setEditingUser((prev: any) => prev ? { ...prev, expires: e.target.value } : null)}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><AccessTimeIcon fontSize="small" /></InputAdornment>
                            }}
                        />
                        {/* Document Link Input Section */}
                        <Box sx={{ border: '2px dashed', borderColor: 'divider', p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LinkIcon color="primary" fontSize="small" /> Add Document Link
                            </Typography>
                            <Stack spacing={2} sx={{ mt: 1 }}>
                                <TextField
                                    label="Document Name"
                                    placeholder="e.g. Passport, Visa Scan"
                                    size="small"
                                    fullWidth
                                    value={docName}
                                    onChange={(e) => setDocName(e.target.value)}
                                />
                                <TextField
                                    label="Document URL"
                                    placeholder="https://drive.google.com/..."
                                    size="small"
                                    fullWidth
                                    value={docUrl}
                                    onChange={(e) => setDocUrl(e.target.value)}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleAddLink}
                                    disabled={!docName || !docUrl}
                                    size="small"
                                >
                                    Add Link
                                </Button>
                            </Stack>
                        </Box>

                        {/* VISA HISTORY LIST */}
                        {editingUser?.applications && editingUser.applications.length > 0 && (
                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Visa History</Typography>
                                <Paper variant="outlined" sx={{ maxHeight: 150, overflow: 'auto' }}>
                                    <List dense>
                                        {editingUser.applications.map((app: any) => (
                                            <ListItem
                                                key={app.id}
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteApplication(app.id)} size="small" color="error">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemText
                                                    primary={app.visaName}
                                                    secondary={`${app.status} • Exp: ${app.expiresAt ? new Date(app.expiresAt).toLocaleDateString() : 'N/A'}`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </Box>
                        )}

                        {/* DOCUMENTS LIST */}
                        {editingUser?.documents && editingUser.documents.length > 0 && (
                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>User Documents</Typography>
                                <Paper variant="outlined" sx={{ maxHeight: 150, overflow: 'auto' }}>
                                    <List dense>
                                        {editingUser.documents.map((doc: any) => (
                                            <ListItem
                                                key={doc.id}
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteDocument(doc.id)} size="small" color="error">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemText
                                                    primary={doc.name}
                                                    secondary={<Link href={doc.url} target="_blank" rel="noopener">Open Link</Link>}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </Box>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, justifyContent: 'space-between' }}>
                    <Button
                        startIcon={<VerifiedUserIcon />}
                        color="secondary"
                        onClick={handleAddVerification}
                    >
                        Add Verification
                    </Button>
                    <Box>
                        <Button onClick={() => setEditingUser(null)} color="inherit" sx={{ mr: 1 }}>Cancel</Button>
                        <Button onClick={handleSaveUser} variant="contained" endIcon={<ArrowForwardIcon />}>Save Changes</Button>
                    </Box>
                </DialogActions>
            </Dialog>

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
                <MenuItem onClick={() => generatePDF('users')}><ListItemIcon><PeopleIcon fontSize="small" /></ListItemIcon>User Data</MenuItem>
                <MenuItem onClick={() => generatePDF('visas')}><ListItemIcon><DescriptionIcon fontSize="small" /></ListItemIcon>Visa Database</MenuItem>
                <MenuItem onClick={() => generatePDF('company')}><ListItemIcon><BusinessIcon fontSize="small" /></ListItemIcon>Company Formation</MenuItem>
                <MenuItem onClick={() => generatePDF('invoicing')}><ListItemIcon><ReceiptIcon fontSize="small" /></ListItemIcon>All Invoicing Data</MenuItem>
                <Divider />
                <Typography variant="overline" sx={{ px: 2, color: 'text.secondary' }}>Financial Reports</Typography>
                <MenuItem onClick={() => generatePDF('revenue-3m')}><ListItemIcon><AttachMoneyIcon fontSize="small" /></ListItemIcon>Revenue (Last 3 Months)</MenuItem>
                <MenuItem onClick={() => generatePDF('revenue-6m')}><ListItemIcon><AttachMoneyIcon fontSize="small" /></ListItemIcon>Revenue (Last 6 Months)</MenuItem>
                <MenuItem onClick={() => generatePDF('revenue-1y')}><ListItemIcon><AttachMoneyIcon fontSize="small" /></ListItemIcon>Revenue (Last 1 Year)</MenuItem>
                <Divider />
                <MenuItem onClick={() => generatePDF('stats')}><ListItemIcon><TrendingUpIcon fontSize="small" /></ListItemIcon>Statistics Overview</MenuItem>
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
