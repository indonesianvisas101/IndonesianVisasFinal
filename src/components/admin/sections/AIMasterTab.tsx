"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    Button,
    Chip,
    Stack,
    Divider,
    IconButton,
    Tooltip,
    LinearProgress,
    Paper,
    useTheme,
    alpha,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Switch,
    FormControlLabel,
    Alert,
    AlertTitle,
    Tab,
    Tabs,
    Badge,
    TextField,
    InputAdornment,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemButton,
    ListItemIcon,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { useRef } from 'react';
import {
    SmartToy as RobotIcon,
    Gavel as LawIcon,
    FactCheck as AuditIcon,
    Chat as ChatIcon,
    DataExploration as StrategyIcon,
    Settings as SettingsIcon,
    Refresh as RefreshIcon,
    PlayArrow as PlayIcon,
    Pause as PauseIcon,
    Psychology as PsychologyIcon,
    AutoAwesome as AIHeroIcon,
    History as HistoryIcon,
    Warning as WarningIcon,
    CheckCircle as SuccessIcon,
    Security as RiskIcon,
    ReportProblem as AlertIcon,
    Assessment as AnalyticsIcon,
    Memory as MemoryIcon,
    CloudDownload as ExportIcon,
    ToggleOn as ToggleOnIcon,
    ToggleOff as ToggleOffIcon,
    ArrowForward as ArrowForwardIcon,
    SupportAgent as SellerIcon,
    Send as SendIcon,
    Forum as ForumIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Topic as KnowledgeIcon,
    Search as SearchIcon,
    Add as AddIcon
} from '@mui/icons-material';

// --- Types ---
interface SystemState {
    mode: 'normal' | 'emergency' | 'maintenance';
    lastRiskScan: string | null;
    systemHealthStatus: string;
}

interface ChangeRequest {
    id: string;
    requestId: string;
    initiatedBy: string;
    changeType: string;
    riskScore: string;
    modeStatus: string;
    currentState?: string;
    targetPage?: string;
    proposedChanges?: any;
    createdAt: string;
}

interface RiskLog {
    id: string;
    scanType: string;
    riskLevel: string;
    createdAt: string;
    findings: any;
}

interface KnowledgePage {
    id: string;
    slug: string;
    title: string;
    category: string | null;
    createdAt: string;
    metadata?: any; // Added metadata for Topic
    quality?: {
        overallScore: number;
        wordCount: number;
    } | null;
}

interface ImmigrationUpdate {
    id: string;
    slug: string;
    title: string;
    category: string;
    publishedAt?: string;
    createdAt: string;
    metadata?: any;
}

interface ClusterSummary {
    totalClusters: number;
    averageVisasPerCluster: number;
    totalStaticPages: number;
    lastGlobalSync: string | null;
}

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface EditPageState {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    category: string;
    image?: string;
    type: 'KNOWLEDGE' | 'NEWS';
}

// Lightweight markdown renderer — no external dep needed
function MarkdownContent({ content }: { content: string }) {
    const parseMarkdown = (text: string): React.ReactNode[] => {
        const lines = text.split('\n');
        const elements: React.ReactNode[] = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];

            // Code block
            if (line.startsWith('```')) {
                const codeLines: string[] = [];
                i++;
                while (i < lines.length && !lines[i].startsWith('```')) {
                    codeLines.push(lines[i]);
                    i++;
                }
                elements.push(<pre key={i}><code>{codeLines.join('\n')}</code></pre>);
                i++;
                continue;
            }

            // H1
            if (line.startsWith('# ')) {
                elements.push(<h1 key={i}>{inlineFormat(line.slice(2))}</h1>);
                i++; continue;
            }
            // H2
            if (line.startsWith('## ')) {
                elements.push(<h2 key={i}>{inlineFormat(line.slice(3))}</h2>);
                i++; continue;
            }
            // H3
            if (line.startsWith('### ')) {
                elements.push(<h3 key={i}>{inlineFormat(line.slice(4))}</h3>);
                i++; continue;
            }
            // HR
            if (line === '---' || line === '***') {
                elements.push(<hr key={i} />);
                i++; continue;
            }
            // Bullet list
            if (line.startsWith('- ') || line.startsWith('* ')) {
                const listItems: React.ReactNode[] = [];
                while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
                    listItems.push(<li key={i}>{inlineFormat(lines[i].slice(2))}</li>);
                    i++;
                }
                elements.push(<ul key={`ul-${i}`}>{listItems}</ul>);
                continue;
            }
            // Numbered list
            if (/^\d+\. /.test(line)) {
                const listItems: React.ReactNode[] = [];
                while (i < lines.length && /^\d+\. /.test(lines[i])) {
                    listItems.push(<li key={i}>{inlineFormat(lines[i].replace(/^\d+\. /, ''))}</li>);
                    i++;
                }
                elements.push(<ol key={`ol-${i}`}>{listItems}</ol>);
                continue;
            }
            // Empty line
            if (line.trim() === '') {
                elements.push(<br key={i} />);
                i++; continue;
            }
            // Paragraph
            elements.push(<p key={i}>{inlineFormat(line)}</p>);
            i++;
        }
        return elements;
    };

    const inlineFormat = (text: string): React.ReactNode => {
        // Handle bold + italic + inline code
        const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
        return parts.map((part, idx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={idx}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
                return <em key={idx}>{part.slice(1, -1)}</em>;
            }
            if (part.startsWith('`') && part.endsWith('`')) {
                return <code key={idx}>{part.slice(1, -1)}</code>;
            }
            return part;
        });
    };

    return <>{parseMarkdown(content)}</>;
}

export default function AIMasterTab() {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const [agentId, setAgentId] = useState<'ai_master' | 'order_intelligence' | 'risk_guard'>('ai_master');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [chatInput, setChatInput] = useState('');
    const [approvingTopicId, setApprovingTopicId] = useState<string | null>(null);

    // Data States
    const [systemState, setSystemState] = useState<SystemState | null>(null);
    const [pendingRequests, setPendingRequests] = useState<ChangeRequest[]>([]);
    const [riskLogs, setRiskLogs] = useState<RiskLog[]>([]);
    const [intelligence, setIntelligence] = useState<any>(null);
    const [strategicReport, setStrategicReport] = useState<any>(null);
    const [vvipQueue, setVvipQueue] = useState<any[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<EditPageState | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Seller Conversations State
    const [sellerConversations, setSellerConversations] = useState<any[]>([]);
    const [sellerStats, setSellerStats] = useState<{ todayCount: number; masterCmdCount: number }>({ todayCount: 0, masterCmdCount: 0 });
    const [sellerCmdInput, setSellerCmdInput] = useState('');
    const [sellerCmdLoading, setSellerCmdLoading] = useState(false);
    const [selectedConv, setSelectedConv] = useState<any | null>(null);
    const [lastSyncInfo, setLastSyncInfo] = useState<{ time: string; action: string } | null>(null);

    // Knowledge Pages State
    const [knowledgePages, setKnowledgePages] = useState<KnowledgePage[]>([]);
    const [immigrationUpdates, setImmigrationUpdates] = useState<ImmigrationUpdate[]>([]);
    const [clusterSummary, setClusterSummary] = useState<ClusterSummary | null>(null);
    const [searchQueryPages, setSearchQueryPages] = useState('');
    const [manualTopicInput, setManualTopicInput] = useState('');
    const [isQueuing, setIsQueuing] = useState(false);
    const [queueTab, setQueueTab] = useState(0); // 0: Master, 1: AI

    // Chat State — plain messages, no useChat dependency
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chatLoading, setChatLoading] = useState(false);
    const chatMessagesRef = useRef<HTMLDivElement>(null);

    const scrollChatToBottom = () => {
        setTimeout(() => {
            chatMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
    };

    const sendChatMessage = async (content: string) => {
        if (!content.trim() || chatLoading) return;

        const userMsg: ChatMessage = { role: 'user', content };
        const newHistory = [...messages, userMsg];
        setMessages(prev => [...prev, userMsg]);
        setChatLoading(true);
        scrollChatToBottom();

        try {
            const res = await fetch('/api/ai-master/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newHistory.map(m => ({ role: m.role, content: m.content })),
                    agentId
                })
            });

            if (res.status === 403) {
                alert('Unauthorized for AI Master Commands.');
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `API error: ${res.status}`);
            }

            const aiText = data.text || '✅ Command executed successfully.';
            setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);

            // Auto-refresh data after command might have run
            fetchData();
        } catch (err: any) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Error: ${err.message}` }]);
        } finally {
            setChatLoading(false);
            scrollChatToBottom();
        }
    };

    const handleChatSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const val = chatInput.trim();
        if (!val) return;
        setChatInput('');
        sendChatMessage(val);
    };

    useEffect(() => {
        console.log("AIMasterTab mounted/updated. TabValue:", tabValue);
    }, [tabValue]);

    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [reviewOpen, setReviewOpen] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);

    const fetchManagementData = useCallback(async () => {
        setLoading(true);
        // We don't clear error here to avoid flickering during polling
        try {
            const mgmtRes = await fetch('/api/ai-master/management');
            if (mgmtRes.ok) {
                const data = await mgmtRes.json();
                setSystemState(data.systemState);
                setPendingRequests(data.pendingRequests || []);
                setRiskLogs(data.riskLogs || []);
                setKnowledgePages(data.knowledgePages || []);
                setImmigrationUpdates(data.immigrationUpdates || []);
                setClusterSummary(data.clusterSummary || null);
                setVvipQueue(data.vvipQueue || []);
                setError(null); // Clear error on success
            } else {
                console.warn(`[JARVIS] Management API returned ${mgmtRes.status}. Retrying in next cycle.`);
            }
        } catch (err) {
            console.error("[JARVIS] Sync Offline:", err);
            // Don't show fatal error for transient network issues during background polling
        } finally {
            // Loading is handled by main fetchData
        }
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            await fetchManagementData(); // Fetch management data first

            // Fetch Seller Conversations (Independent)
            try {
                const convRes = await fetch('/api/chat/conversations?limit=30');
                if (convRes.ok) {
                    const convData = await convRes.json();
                    setSellerConversations(convData.conversations || []);
                    setSellerStats(convData.stats || { todayCount: 0, masterCmdCount: 0 });
                }
            } catch (e) { console.warn("[JARVIS] Conversations Sync Offline"); }

            // Fetch Intelligence (Independent)
            try {
                const intelRes = await fetch('/api/ai-master/order-intelligence');
                if (intelRes.ok) {
                    const data = await intelRes.json();
                    setIntelligence(data.metrics);
                }
            } catch (e) { console.warn("[JARVIS] Intelligence Sync Offline"); }

            // Fetch Strategic Report (Independent)
            try {
                const strategyRes = await fetch('/api/ai-master/strategic-report');
                if (strategyRes.ok) {
                    const data = await strategyRes.json();
                    setStrategicReport(data.metrics);
                }
            } catch (e) { console.warn("[JARVIS] Strategy Sync Offline"); }

            // Fetch Audit Logs (Silent)
            try {
                const logRes = await fetch('/api/admin/logs?limit=1');
                if (logRes.ok) {
                    const logData = await logRes.json();
                    if (logData.data && logData.data.length > 0) {
                        setLastSyncInfo({
                            time: logData.data[0].createdAt,
                            action: logData.data[0].action
                        });
                    }
                }
            } catch (e) { /* ignore */ }

        } catch (err) {
            console.error("[JARVIS] Global Dashboard Sync Error:", err);
            // Critical sync failed, but we keep the UI alive
        } finally {
            setLoading(false);
        }
    }, [fetchManagementData]);

    useEffect(() => {
        fetchData();
        // Background polling every 30s
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleManagementAction = async (action: string, data: any = {}) => {
        try {
            setLoadingAction(true);
            const res = await fetch('/api/ai-master/management', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, data })
            });

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await res.text();
                throw new Error(`Server returned non-JSON response: ${text.slice(0, 100)}`);
            }

            const result = await res.json();
            if (res.ok) {
                fetchManagementData(); 
                setReviewOpen(false);
                // Proactively show success if it was an approval
                if (action === 'APPROVE_REQUEST') {
                    alert(`Success: ${result.message || 'Execution complete'}`);
                }
                return result;
            } else {
                throw new Error(result.error || `API error: ${res.status}`);
            }
        } catch (error) {
            console.error("Management Action Failed:", error);
            alert(`Execution Error: ${error instanceof Error ? error.message : String(error)}`);
            return null;
        } finally {
            setLoadingAction(false);
        }
    };

    const handleReviewClick = (req: any) => {
        setSelectedRequest(req);
        setReviewOpen(true);
    };

    const toggleMode = (mode: 'normal' | 'emergency' | 'maintenance') => {
        handleManagementAction('TOGGLE_MODE', { mode });
    };

    const handleResetMemory = async () => {
        if (!confirm("Are you sure you want to reset AI Strategic Memory? Logs will be preserved but context will be cleared.")) return;
        try {
            const res = await fetch('/api/ai-master/management', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'RESET_MEMORY' })
            });
            if (res.ok) alert("Strategic Memory Reset Successful");
        } catch (err) {
            alert("Reset failed");
        }
    };

    const handleDeletePage = async (id: string) => {
        if (!confirm("Are you sure you want to PERMANENTLY delete this AIR generated page? This action cannot be undone.")) return;
        try {
            setLoadingAction(true);
            const res = await fetch('/api/ai-master/management', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'DELETE_PAGE', data: { id } })
            });
            if (res.ok) {
                setKnowledgePages(prev => prev.filter(p => p.id !== id));
                alert("Page removed from database.");
            } else {
                alert("Failed to delete page.");
            }
        } catch (err) {
            alert("Error deleting page.");
        } finally {
            setLoadingAction(false);
        }
    };

    const handleEditOpen = async (item: any) => {
        // Fetch full content if not in list
        try {
            const res = await fetch(`/api/ai-master/management?action=GET_PAGE&id=${item.id}&type=${item.type}`);
            if (res.ok) {
                const data = await res.json();
                setEditingPage({
                    id: item.id,
                    title: data.page?.title || item.title,
                    slug: data.page?.slug || item.slug,
                    summary: data.page?.summary || '',
                    content: data.page?.content || '',
                    category: item.category || '',
                    image: data.page?.image || '',
                    type: item.type
                });
                setIsEditModalOpen(true);
            }
        } catch (e) {
            // Fallback to basic data
            setEditingPage({
                id: item.id,
                title: item.title,
                slug: item.slug,
                summary: '',
                content: '',
                category: item.category || '',
                type: item.type
            });
            setIsEditModalOpen(true);
        }
    };

    const handleSavePage = async () => {
        if (!editingPage) return;
        setIsSaving(true);
        try {
            const res = await fetch('/api/ai-master/management', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'UPDATE_PAGE_CONTENT',
                    data: editingPage
                })
            });
            if (res.ok) {
                alert("Master, perubahan telah berhasil dikunci ke basis data.");
                setIsEditModalOpen(false);
                fetchData();
            } else {
                alert("Gagal menyimpan perubahan, Master.");
            }
        } catch (e) {
            alert("Terjadi kesalahan sistem saat menyimpan.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleQueueManualTopic = async () => {
        if (!manualTopicInput.trim()) return;
        setIsQueuing(true);
        try {
            const res = await fetch('/api/ai-master/management', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'ADD_MANUAL_TOPIC',
                    data: { topic: manualTopicInput }
                })
            });
            if (res.ok) {
                setManualTopicInput('');
                fetchData(); // Refresh list
            }
        } catch (e) {
            console.error("Failed to queue topic", e);
        } finally {
            setIsQueuing(false);
        }
    };

    const handleDeleteVvipTopic = async (id: string) => {
        try {
            const res = await fetch('/api/ai-master/management', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'DELETE_VVIP_TOPIC', data: { id } })
            });
            if (res.ok) fetchData();
        } catch (e) { console.error(e); }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleApproveDiscoveryTopic = async (topic: string, id: string) => {
        setApprovingTopicId(id);
        try {
            const res = await fetch('/api/ai-master/management', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'UPDATE_TOPIC', data: { type: 'KNOWLEDGE', topic } })
            });
            if (res.ok) {
                // Refresh data
                fetchData();
            }
        } catch (e) {
            console.error("Failed to approve topic", e);
        } finally {
            setApprovingTopicId(null);
        }
    };

    return (
        <>
            {/* Edit Modal (Immigration Updates DNA) */}
            <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), borderBottom: '1px solid', borderColor: 'divider', py: 2 }}>
                    <Typography component="div" variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AIHeroIcon color="primary" /> Edit {editingPage?.type === 'KNOWLEDGE' ? 'Knowledge Article' : 'Immigration News'}
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ mt: 3, pt: 2 }}>
                    <Stack spacing={3}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <TextField 
                                    label="Title" 
                                    fullWidth 
                                    value={editingPage?.title || ''} 
                                    onChange={(e) => setEditingPage(prev => prev ? { ...prev, title: e.target.value } : null)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField 
                                    label="Category" 
                                    fullWidth 
                                    value={editingPage?.category || ''} 
                                    onChange={(e) => setEditingPage(prev => prev ? { ...prev, category: e.target.value } : null)}
                                />
                            </Grid>
                        </Grid>

                        <TextField 
                            label="URL Slug" 
                            fullWidth 
                            size="small"
                            disabled
                            value={editingPage?.slug || ''} 
                            helperText="Slug is locked to maintain SEO integrity."
                        />

                        <Box>
                            <Typography variant="caption" fontWeight="bold" gutterBottom display="block" color="text.secondary">FEATURED IMAGE (AUTO-WEBP CONVERT)</Typography>
                            {editingPage?.image && (
                                <Box sx={{ mb: 1, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider', width: 240, height: 140, bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src={editingPage.image} alt="Featured" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                </Box>
                            )}
                            <Button variant="outlined" component="label" startIcon={<ExportIcon />}>
                                {editingPage?.image ? 'Change Image' : 'Upload Image'}
                                <input 
                                    type="file" 
                                    hidden 
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setIsSaving(true);
                                            try {
                                                // 1. Create a canvas for WebP conversion
                                                const img = new Image();
                                                img.src = URL.createObjectURL(file);
                                                await new Promise((resolve) => (img.onload = resolve));

                                                const canvas = document.createElement('canvas');
                                                canvas.width = img.width;
                                                canvas.height = img.height;
                                                const ctx = canvas.getContext('2d');
                                                ctx?.drawImage(img, 0, 0);

                                                // 2. Convert to WebP Blob
                                                const webpBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.8));
                                                
                                                if (webpBlob) {
                                                    const formData = new FormData();
                                                    formData.append('file', new File([webpBlob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: "image/webp" }));
                                                    
                                                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                                    if (res.ok) {
                                                        const data = await res.json();
                                                        setEditingPage(prev => prev ? { ...prev, image: data.url } : null);
                                                    }
                                                }
                                            } catch (err) {
                                                console.error("Image Processing Failed:", err);
                                            } finally {
                                                setIsSaving(false);
                                            }
                                        }
                                    }}
                                />
                            </Button>
                        </Box>

                        <TextField 
                            label="Summary / Meta Description" 
                            fullWidth 
                            multiline 
                            rows={3}
                            placeholder="A brief summary for SEO and cards..."
                            value={editingPage?.summary || ''} 
                            onChange={(e) => setEditingPage(prev => prev ? { ...prev, summary: e.target.value } : null)}
                        />

                        <TextField 
                            label="Main Content (Markdown Supported)" 
                            fullWidth 
                            multiline 
                            rows={15}
                            value={editingPage?.content || ''} 
                            onChange={(e) => setEditingPage(prev => prev ? { ...prev, content: e.target.value } : null)}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleSavePage} 
                        disabled={isSaving}
                        startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SuccessIcon />}
                    >
                        {isSaving ? 'Saving Master...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Stack spacing={4} sx={{ animation: 'fadeIn 0.5s ease', pb: 8 }}>
            {/* --- HEADER & CONTROLS --- */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={3} alignItems="center">
                    <Avatar sx={{
                        bgcolor: systemState?.mode === 'emergency' ? 'error.main' : 'primary.main',
                        width: 64, height: 64,
                        boxShadow: `0 0 20px ${alpha(systemState?.mode === 'emergency' ? theme.palette.error.main : theme.palette.primary.main, 0.4)}`,
                        animation: systemState?.mode === 'emergency' ? 'pulse 1.5s infinite' : 'none'
                    }}>
                        <PsychologyIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h3" fontWeight="900" letterSpacing="-1px">AI MASTER ORCHESTRATOR</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                                label="PRODUCTION ACTIVE"
                                color="success"
                                size="small"
                                sx={{ fontWeight: 'bold', px: 1 }}
                            />
                            <Chip
                                label={`MODE: ${systemState?.mode?.toUpperCase() || 'NORMAL'}`}
                                color={systemState?.mode === 'normal' ? 'primary' : 'warning'}
                                size="small"
                                variant="outlined"
                            />
                            <Typography variant="caption" color="text.secondary">Antigravity Neural Engine v2.5-PROD</Typography>
                        </Stack>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<ExportIcon />}>Export Logs</Button>
                    <Button variant="contained" startIcon={<RefreshIcon />} onClick={fetchData} disabled={loading}>
                        {loading ? "Syncing..." : "Manual Sync"}
                    </Button>
                </Stack>
            </Box>

            {error && (
                <Alert severity="error" variant="filled">
                    <AlertTitle>Synchronization Error</AlertTitle>
                    {error}
                </Alert>
            )}

            {/* --- TOP METRICS GRID --- */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ bgcolor: 'background.paper', borderLeft: '6px solid', borderColor: 'primary.main' }}>
                        <CardContent>
                            <Typography variant="overline" color="text.secondary">Engine Accuracy</Typography>
                            <Typography variant="h4" fontWeight="bold">98.4%</Typography>
                            <LinearProgress variant="determinate" value={98.4} sx={{ mt: 1, height: 8, borderRadius: 4 }} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ bgcolor: 'background.paper', borderLeft: '6px solid', borderColor: 'success.main' }}>
                        <CardContent>
                            <Typography variant="overline" color="text.secondary">Knowledge Distribution (40/40/20)</Typography>
                            <Box sx={{ mt: 1 }}>
                                <Box sx={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', mb: 1 }}>
                                    <Box sx={{ width: '40%', bgcolor: 'primary.main' }} />
                                    <Box sx={{ width: '40%', bgcolor: 'success.main' }} />
                                    <Box sx={{ width: '20%', bgcolor: 'warning.main' }} />
                                </Box>
                                <Stack direction="row" spacing={2} justifyContent="space-between">
                                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Box sx={{ w: 8, h: 8, bgcolor: 'primary.main', borderRadius: '50%' }} /> Core (40%)
                                    </Typography>
                                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Box sx={{ w: 8, h: 8, bgcolor: 'success.main', borderRadius: '50%' }} /> Ops (40%)
                                    </Typography>
                                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Box sx={{ w: 8, h: 8, bgcolor: 'warning.main', borderRadius: '50%' }} /> News (20%)
                                    </Typography>
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ bgcolor: 'background.paper', borderLeft: '6px solid', borderColor: 'warning.main' }}>
                        <CardContent>
                            <Typography variant="overline" color="text.secondary">System Status</Typography>
                            <Typography variant="h4" fontWeight="bold" color={systemState?.systemHealthStatus === 'healthy' ? 'success.main' : 'error.main'}>
                                {systemState?.systemHealthStatus?.toUpperCase() || 'UNKNOWN'}
                            </Typography>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="caption">Last risk scan: {systemState?.lastRiskScan ? new Date(systemState.lastRiskScan).toLocaleTimeString() : 'Never'}</Typography>
                                {lastSyncInfo && (
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <AuditIcon sx={{ fontSize: 12 }} /> Last Sync: {new Date(lastSyncInfo.time).toLocaleTimeString()}
                                    </Typography>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* --- TOPIC INTELLIGENCE CARD --- */}
            <Card variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.2) }}>
                <CardHeader 
                    title={<Typography variant="h5" fontWeight="900" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><KnowledgeIcon color="primary" /> Topic Intelligence & Queue</Typography>}
                    subheader="Double-Track Content Scheduling: Manual (Daily) | AI (3-Day Cycle)"
                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02), borderBottom: '1px solid', borderColor: 'divider' }}
                />
                <CardContent>
                    <Grid container spacing={3}>
                        {/* Manual Priority Queue */}
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.03), border: '1px dashed', borderColor: 'warning.main', height: '100%' }}>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <SellerIcon color="warning" /> MANUAL PRIORITY STACK (1 Post / Day)
                                </Typography>
                                <Stack spacing={1.5} sx={{ mt: 2 }}>
                                    {/* Topic Input Area */}
                                    <Box display="flex" gap={1}>
                                        <TextField 
                                            fullWidth 
                                            size="small" 
                                            placeholder="Add strategic topic... (e.g. New B1 Visa Rules 2026)" 
                                            id="new-manual-topic"
                                            value={manualTopicInput}
                                            onChange={(e) => setManualTopicInput(e.target.value)}
                                            disabled={isQueuing}
                                            onKeyDown={(e) => e.key === 'Enter' && handleQueueManualTopic()}
                                        />
                                        <Button 
                                            variant="contained" 
                                            color="warning" 
                                            startIcon={isQueuing ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
                                            onClick={handleQueueManualTopic}
                                            disabled={isQueuing}
                                        >
                                            {isQueuing ? 'Queuing...' : 'Queue'}
                                        </Button>
                                    </Box>
                                    
                                    {/* Tab Switcher for Queue */}
                                    <Tabs 
                                        value={queueTab} 
                                        onChange={(_, v) => setQueueTab(v)} 
                                        variant="fullWidth"
                                        sx={{ 
                                            minHeight: 32, 
                                            mb: 1.5,
                                            '& .MuiTab-root': { py: 0.5, fontSize: '10px', fontWeight: 'bold', minHeight: 32 } 
                                        }}
                                    >
                                        <Tab label="MASTER'S PRIORITY" icon={<AIHeroIcon sx={{ fontSize: 14 }} />} iconPosition="start" />
                                        <Tab label="AI DISCOVERIES" icon={<SearchIcon sx={{ fontSize: 14 }} />} iconPosition="start" />
                                    </Tabs>
                                    
                                    {/* The Queue List Content */}
                                    <Paper variant="outlined" sx={{ maxHeight: 250, overflow: 'auto', p: 0, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                                        <List disablePadding>
                                            {queueTab === 0 ? (
                                                /* MASTER TOPICS */
                                                vvipQueue.length === 0 ? (
                                                    <Box sx={{ p: 4, textAlign: 'center', opacity: 0.5 }}>
                                                        <Typography variant="caption" display="block">No active Master commands.</Typography>
                                                        <Typography variant="caption" sx={{ fontSize: '9px' }}>Master's direct instructions appear here.</Typography>
                                                    </Box>
                                                ) : (
                                                    vvipQueue.map((item, idx) => (
                                                        <ListItem key={item.id} divider={idx !== vvipQueue.length - 1}>
                                                            <ListItemAvatar>
                                                                <Avatar sx={{ bgcolor: 'warning.main', width: 24, height: 24 }}>
                                                                    {item.status === 'processing' ? <CircularProgress size={14} color="inherit" /> : <PlayIcon sx={{ fontSize: 14 }} />}
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText 
                                                                primary={<Typography variant="caption" fontWeight="bold" sx={{ color: 'warning.main' }}>{item.topicTitle}</Typography>}
                                                                secondary={<Typography variant="caption" sx={{ fontSize: '9px' }}>Priority: VVIP | Status: {item.status === 'vvip_queued' ? 'Awaiting Research' : 'Searching & Deeper Researching...'}</Typography>}
                                                            />
                                                            <IconButton size="small" color="error" onClick={() => handleDeleteVvipTopic(item.id)}>
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </ListItem>
                                                    ))
                                                )
                                            ) : (
                                                /* AI DISCOVERIES */
                                                pendingRequests.length === 0 ? (
                                                    <Box sx={{ p: 4, textAlign: 'center', opacity: 0.5 }}>
                                                        <Typography variant="caption" display="block">AI hasn't discovered new topics yet today.</Typography>
                                                        <Typography variant="caption" sx={{ fontSize: '9px' }}>Jarvis is scanning global immigration news...</Typography>
                                                    </Box>
                                                ) : (
                                                    pendingRequests.map((req, idx) => (
                                                        <ListItem key={req.id} divider={idx !== pendingRequests.length - 1}>
                                                            <ListItemAvatar>
                                                                <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24 }}>
                                                                    <SearchIcon sx={{ fontSize: 14 }} />
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText 
                                                                primary={<Typography variant="caption" fontWeight="bold">{req.targetPage || req.proposedChanges?.title}</Typography>}
                                                                secondary={<Typography variant="caption" sx={{ fontSize: '9px' }}>Discovered by AI | Confidence: {req.proposedChanges?.qualityScore || 85}%</Typography>}
                                                            />
                                                            <Stack direction="row" spacing={0.5}>
                                                                <IconButton 
                                                                    size="small" 
                                                                    color="success" 
                                                                    onClick={() => handleManagementAction('APPROVE_REQUEST', { requestId: req.requestId })}
                                                                    disabled={loadingAction}
                                                                >
                                                                    {loadingAction ? <CircularProgress size={14} color="inherit" /> : <SuccessIcon fontSize="inherit" />}
                                                                </IconButton>
                                                                <IconButton 
                                                                    size="small" 
                                                                    color="error" 
                                                                    onClick={() => handleManagementAction('REJECT_REQUEST', { requestId: req.requestId })}
                                                                    disabled={loadingAction}
                                                                >
                                                                    <DeleteIcon fontSize="inherit" />
                                                                </IconButton>
                                                            </Stack>
                                                        </ListItem>
                                                    ))
                                                )
                                            )}
                                        </List>
                                    </Paper>
                                </Stack>
                            </Box>
                        </Grid>

                        {/* AI Discovery Stack */}
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.03), border: '1px dashed', borderColor: 'primary.main', height: '100%' }}>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <RobotIcon color="primary" /> AI DISCOVERY FEED (1 Post / 3 Days)
                                </Typography>
                                    {/* Suggested Topics */}
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ mb: 1, display: 'block' }}>NEW OPPORTUNITIES</Typography>
                                        <Stack spacing={1}>
                                            <Paper variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={{ width: 4, height: 30, bgcolor: 'primary.main', borderRadius: 2 }} />
                                                <Box flexGrow={1}>
                                                    <Typography variant="caption" display="block" fontWeight="bold">Suggested: Bali Tourism Tax Impacts</Typography>
                                                    <Typography variant="caption" color="text.secondary">Based on Sitemap & Trends</Typography>
                                                </Box>
                                                <Button 
                                                    size="small" 
                                                    variant="text" 
                                                    color="primary"
                                                    disabled={!!approvingTopicId}
                                                    onClick={() => handleApproveDiscoveryTopic('Bali Tourism Tax Impacts', 'disc-1')}
                                                    startIcon={approvingTopicId === 'disc-1' ? <CircularProgress size={12} color="inherit" /> : null}
                                                >
                                                    {approvingTopicId === 'disc-1' ? 'Approving...' : 'Approve'}
                                                </Button>
                                            </Paper>
                                        </Stack>
                                    </Box>

                                    <Divider sx={{ my: 1 }} />

                                    {/* Recently Approved Pipeline */}
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ mb: 1, display: 'block' }}>VVIP PIPELINE STATUS</Typography>
                                        <Stack spacing={1}>
                                            <Paper variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2, bgcolor: alpha(theme.palette.success.main, 0.02) }}>
                                                <Box sx={{ width: 4, height: 30, bgcolor: 'success.main', borderRadius: 2 }} />
                                                <Box flexGrow={1}>
                                                    <Typography variant="caption" display="block" fontWeight="bold">Investor KITAS (E28A) Requirements</Typography>
                                                    <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <AIHeroIcon sx={{ fontSize: 12 }} /> Approved by Master - AI Generating Content...
                                                    </Typography>
                                                </Box>
                                                <Typography variant="caption" color="text.secondary">ETA: 6 mins</Typography>
                                            </Paper>
                                            <Paper variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2, opacity: 0.8 }}>
                                                <Box sx={{ width: 4, height: 30, bgcolor: 'warning.main', borderRadius: 2 }} />
                                                <Box flexGrow={1}>
                                                    <Typography variant="caption" display="block" fontWeight="bold">New B1 Visa Rules 2026 Audit</Typography>
                                                    <Typography variant="caption" color="text.secondary">Draft Ready - Scheduled for Daily Slot</Typography>
                                                </Box>
                                                <Typography variant="caption" color="warning.main" fontWeight="bold">LIVE: Tomorrow</Typography>
                                            </Paper>
                                        </Stack>
                                    </Box>

                                    <Box sx={{ textAlign: 'center', mt: 1 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
                                            {new Date().getHours() === 2 ? 'DEEP DISCOVERY ACTIVE' : 'STATUS: POWER SAVING MODE'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date().getHours() === 2 ? 'AI is scanning government portals & sitemaps...' : 'Next Deep Discovery Window: 02:00 AM'}
                                        </Typography>
                                        <LinearProgress 
                                            variant={new Date().getHours() === 2 ? "indeterminate" : "determinate"} 
                                            value={new Date().getHours() === 2 ? 100 : 30}
                                            color={new Date().getHours() === 2 ? "primary" : "inherit"}
                                            sx={{ mt: 1, height: 2, borderRadius: 1, opacity: 0.5 }} 
                                        />
                                    </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* --- MAIN TABS --- */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} variant="scrollable" scrollButtons="auto">
                    <Tab label="Interactive Command Center" icon={<ChatIcon />} iconPosition="start" />
                    <Tab label={<Badge badgeContent={pendingRequests.length} color="error" sx={{ px: 2 }}>Approval Queue</Badge>} />
                    <Tab label="Risk Intelligence" />
                    <Tab label="Strategic Advisories" />
                    <Tab label="System Orchestration" />
                    <Tab label="AI Seller Brain" icon={<SellerIcon />} iconPosition="start" />
                    <Tab label={<Badge badgeContent={knowledgePages.length + immigrationUpdates.length} color="primary" sx={{ px: 2 }}>Published Knowledge</Badge>} icon={<KnowledgeIcon />} iconPosition="start" />
                    <Tab label="Cluster Orchestration" icon={<StrategyIcon />} iconPosition="start" />
                </Tabs>
            </Box>

            {/* Tab 0: Interactive Command Center */}
            {tabValue === 0 && (
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardHeader title="Agent Selection" subheader="Switch between specialized entities" />
                            <Divider />
                            <List>
                                {[
                                    { id: 'ai_master', name: 'Master AI Orchestrator', icon: <PsychologyIcon />, color: 'primary' },
                                    { id: 'order_intelligence', name: 'Order Brain', icon: <AnalyticsIcon />, color: 'success' },
                                    { id: 'risk_guard', name: 'Risk Guard', icon: <RiskIcon />, color: 'error' }
                                ].map((agent) => (
                                    <ListItem key={agent.id} disablePadding>
                                        <ListItemButton
                                            selected={agentId === agent.id}
                                            onClick={() => setAgentId(agent.id as any)}
                                            sx={{
                                                borderLeft: agentId === agent.id ? `4px solid ${theme.palette[agent.color as 'primary'].main}` : 'none',
                                                bgcolor: agentId === agent.id ? alpha(theme.palette[agent.color as 'primary'].main, 0.05) : 'transparent'
                                            }}
                                        >
                                            <ListItemIcon sx={{ color: `${agent.color}.main` }}>{agent.icon}</ListItemIcon>
                                            <ListItemText primary={agent.name} secondary={agentId === agent.id ? 'Active Context' : 'Available'} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                            <Divider />
                            <CardContent>
                                <Typography variant="caption" fontWeight="bold" gutterBottom display="block">QUICK COMMANDS</Typography>
                                <Stack spacing={1}>
                                    <Button size="small" variant="outlined" fullWidth onClick={() => sendChatMessage("Scan system for risks")}>Scan for Risks</Button>
                                    <Button size="small" variant="outlined" fullWidth onClick={() => sendChatMessage("Summarize today's revenue and orders")}>Revenue Summary</Button>
                                    <Button size="small" variant="outlined" fullWidth onClick={() => sendChatMessage("Show me pending change requests")}>Review Queue</Button>
                                    <Divider sx={{ my: 0.5 }} />
                                    <Button 
                                        size="small" 
                                        variant="contained" 
                                        color="secondary" 
                                        fullWidth 
                                        onClick={() => handleManagementAction('RUN_ANALYTICS')}
                                        disabled={loadingAction}
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Trigger AI Analytics
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper variant="outlined" sx={{
                            height: 600,
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: alpha(theme.palette.background.default, 0.5),
                            backdropFilter: 'blur(10px)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Badge variant="dot" color="success">
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                        {agentId === 'ai_master' ? <PsychologyIcon /> : agentId === 'order_intelligence' ? <AnalyticsIcon /> : <RiskIcon />}
                                    </Avatar>
                                </Badge>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {agentId.toUpperCase().replace('_', ' ')} <Typography variant="caption" color="text.secondary">| Online</Typography>
                                </Typography>
                            </Box>

                            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {messages.length === 0 && !chatLoading && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5 }}>
                                        <RobotIcon sx={{ fontSize: 64, mb: 2 }} />
                                        <Typography>Command Center Initialized. Awaiting input.</Typography>
                                    </Box>
                                )}
                                {messages.map((m, i) => (
                                    <Box key={i} sx={{
                                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: m.role === 'assistant' ? '92%' : '75%',
                                    }}>
                                        <Paper sx={{
                                            p: 2,
                                            bgcolor: m.role === 'user' ? 'primary.main' : alpha(theme.palette.background.paper, 0.95),
                                            color: m.role === 'user' ? 'primary.contrastText' : 'text.primary',
                                            borderRadius: m.role === 'user' ? '20px 20px 0 20px' : '4px 20px 20px 20px',
                                            boxShadow: m.role === 'assistant' ? 3 : 1,
                                            border: m.role === 'assistant' ? `1px solid ${alpha(theme.palette.primary.main, 0.15)}` : 'none',
                                        }}>
                                            {m.role === 'user' ? (
                                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{m.content}</Typography>
                                            ) : (
                                                // Markdown renderer for AI responses
                                                <Box sx={{
                                                    '& h1, & h2, & h3': { fontWeight: 700, mt: 1.5, mb: 0.5, lineHeight: 1.3 },
                                                    '& h1': { fontSize: '1.1rem', color: 'primary.main' },
                                                    '& h2': { fontSize: '0.95rem', color: 'primary.dark', borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`, pb: 0.5 },
                                                    '& h3': { fontSize: '0.875rem', color: 'text.primary' },
                                                    '& p': { mb: 1, lineHeight: 1.7, fontSize: '0.875rem' },
                                                    '& ul, & ol': { pl: 2.5, mb: 1 },
                                                    '& li': { mb: 0.25, fontSize: '0.875rem', lineHeight: 1.6 },
                                                    '& code': { fontFamily: 'monospace', fontSize: '0.8rem', bgcolor: alpha(theme.palette.primary.main, 0.08), px: 0.5, py: 0.1, borderRadius: 0.5 },
                                                    '& pre': { bgcolor: alpha(theme.palette.grey[900], 0.85), color: '#e0e0e0', p: 1.5, borderRadius: 1, overflow: 'auto', fontSize: '0.8rem', mb: 1 },
                                                    '& strong': { fontWeight: 700 },
                                                    '& em': { fontStyle: 'italic' },
                                                    '& hr': { border: 'none', borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`, my: 1 },
                                                }}>
                                                    <MarkdownContent content={m.content} />
                                                </Box>
                                            )}
                                        </Paper>
                                        <Typography variant="caption" sx={{ mt: 0.5, display: 'block', textAlign: m.role === 'user' ? 'right' : 'left', opacity: 0.6 }}>
                                            {m.role === 'user' ? 'Master Admin' : agentId.replace(/_/g, ' ').toUpperCase()}
                                        </Typography>
                                    </Box>
                                ))}
                                {chatLoading && (
                                    <Box sx={{ alignSelf: 'flex-start', display: 'flex', gap: 1.5, alignItems: 'center', p: 1.5, bgcolor: alpha(theme.palette.background.paper, 0.85), borderRadius: '4px 16px 16px 16px', boxShadow: 1 }}>
                                        <CircularProgress size={16} color="primary" />
                                        <Typography variant="body2" sx={{ opacity: 0.7 }}>AI is processing your request...</Typography>
                                    </Box>
                                )}
                                <div ref={chatMessagesRef} />
                            </Box>

                            <Box component="form" onSubmit={handleChatSubmit} sx={{ p: 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
                                <TextField
                                    fullWidth
                                    placeholder={`Message ${agentId.replace('_', ' ')}...`}
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    disabled={chatLoading}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton type="submit" color="primary" disabled={!chatInput.trim() || chatLoading}>
                                                    <ArrowForwardIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* Tab 1: Approval Queue */}
            {tabValue === 1 && (
                <TableContainer component={Paper} variant="outlined">
                    <Table>
                        <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Initiator</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Cluster</TableCell>
                                <TableCell>Risk/Score</TableCell>
                                <TableCell>Timestamp</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pendingRequests.length === 0 ? (
                                <TableRow><TableCell colSpan={6} align="center">No pending change requests.</TableCell></TableRow>
                            ) : pendingRequests.map(req => (
                                <TableRow key={req.id} hover>
                                    <TableCell><Typography variant="body2" fontWeight="bold">{req.requestId}</Typography></TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={req.initiatedBy === 'analyst' ? 'AGENT' : req.initiatedBy.toUpperCase()} 
                                            size="small" 
                                            color={req.initiatedBy === 'analyst' ? 'secondary' : 'default'}
                                            variant={req.initiatedBy === 'analyst' ? 'filled' : 'outlined'}
                                        />
                                    </TableCell>
                                    <TableCell><Chip label={req.changeType.replace('_', ' ')} size="small" variant="outlined" /></TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={(req as any).proposedChanges?.cluster || 'N/A'} 
                                            size="small" 
                                            variant="outlined"
                                            color="info"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Chip
                                                label={req.riskScore || 'LOW'}
                                                size="small"
                                                color={Number(req.riskScore) > 70 ? 'error' : Number(req.riskScore) > 30 ? 'warning' : 'success'}
                                            />
                                            {(req as any).proposedChanges?.qualityScore && (
                                                <Badge badgeContent={`${(req as any).proposedChanges.qualityScore}%`} color="secondary">
                                                    <PsychologyIcon fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                                                </Badge>
                                            )}
                                        </Stack>
                                    </TableCell>
                                    <TableCell>{new Date(req.createdAt).toLocaleString()}</TableCell>
                                    <TableCell align="right">
                                        <Button 
                                            size="small" 
                                            variant="contained"
                                            onClick={() => handleReviewClick(req)}
                                        >
                                            Review
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Tab 2: Risk Intelligence */}
            {tabValue === 2 && (
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Stack spacing={2}>
                            {riskLogs.map(log => (
                                <Paper key={log.id} sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                    <Avatar sx={{ bgcolor: log.riskLevel === 'CRITICAL' ? 'error.main' : 'warning.main', mt: 0.5 }}>
                                        <AlertIcon />
                                    </Avatar>
                                    <Box flexGrow={1}>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="subtitle2" fontWeight="bold">{log.scanType}</Typography>
                                            <Typography variant="caption" color="text.secondary">{new Date(log.createdAt).toLocaleString()}</Typography>
                                        </Box>
                                        <Typography variant="body2">{JSON.stringify(log.findings)}</Typography>
                                        <Chip label={log.riskLevel} size="small" sx={{ mt: 1 }} color={log.riskLevel === 'CRITICAL' ? 'error' : 'warning'} />
                                    </Box>
                                </Paper>
                            ))}
                        </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Card>
                            <CardHeader title="Security Posture" subheader="Active Shield Analytics" />
                            <Divider />
                            <CardContent>
                                <Stack spacing={3}>
                                    <Box>
                                        <Typography variant="caption" fontWeight="bold">SSL & TSL INTEGRITY</Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <LinearProgress variant="determinate" value={100} sx={{ flexGrow: 1 }} color="success" />
                                            <Typography variant="caption">100%</Typography>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" fontWeight="bold">RECAPTHCA v3 SCORE</Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <LinearProgress variant="determinate" value={92} sx={{ flexGrow: 1 }} color="primary" />
                                            <Typography variant="caption">0.92</Typography>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" fontWeight="bold">BRUTE-FORCE MITIGATION</Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <LinearProgress variant="determinate" value={100} sx={{ flexGrow: 1 }} color="success" />
                                            <Typography variant="caption">ACTIVE</Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Tab 3: Strategic Advisories */}
            {tabValue === 3 && (
                <Grid container spacing={3}>
                    {strategicReport ? (
                        <>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Alert severity="info" icon={<AnalyticsIcon />}>
                                    <AlertTitle>Market Sensitivity Advisory</AlertTitle>
                                    {strategicReport.price_sensitivity_advisory === 'LOW'
                                        ? "Market shows low sensitivity to current pricing. Consider value-added tier updates."
                                        : "High drop-off detected in Checkout. Strategic review of pricing recommended."}
                                </Alert>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Alert severity={strategicReport.risk_pattern_status === 'NOMINAL' ? 'success' : 'warning'} icon={<RiskIcon />}>
                                    <AlertTitle>Anomaly Detection</AlertTitle>
                                    Pattern Status: {strategicReport.risk_pattern_status}.
                                    {strategicReport.risk_pattern_status === 'NOMINAL' ? " All traffic clusters identified as legitimate." : " Abnormal spike in specific visa category requests."}
                                </Alert>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Paper sx={{ p: 3, textAlign: 'center' }}>
                                    <Typography variant="overline" color="text.secondary">7D Revenue Velocity</Typography>
                                    <Typography variant="h4" fontWeight="bold">{formatCurrency(strategicReport.revenue_7d)}</Typography>
                                </Paper>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Paper sx={{ p: 3, textAlign: 'center' }}>
                                    <Typography variant="overline" color="text.secondary">Funnel Conversion</Typography>
                                    <Typography variant="h4" fontWeight="bold" color="primary">{strategicReport.funnel_conversion_rate}</Typography>
                                </Paper>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Paper sx={{ p: 3, textAlign: 'center' }}>
                                    <Typography variant="overline" color="text.secondary">90D Expiry Forecast</Typography>
                                    <Typography variant="h4" fontWeight="bold" color="warning.main">{strategicReport.expiry_forecast_30d}</Typography>
                                </Paper>
                            </Grid>
                        </>
                    ) : (
                        <Grid size={{ xs: 12 }}><Typography>No strategic data available. Verify Master Key authorization.</Typography></Grid>
                    )}
                </Grid>
            )}

            {/* Tab 4: System Orchestration */}
            {tabValue === 4 && (
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardHeader title="Mode Control" avatar={<ToggleOnIcon color="primary" />} />
                            <Divider />
                            <CardContent>
                                <Stack spacing={2}>
                                    <FormControlLabel
                                        control={<Switch checked={systemState?.mode === 'normal'} onChange={() => toggleMode('normal')} />}
                                        label="Normal Mode (Standard Operations)"
                                    />
                                    <FormControlLabel
                                        control={<Switch checked={systemState?.mode === 'emergency'} onChange={() => toggleMode('emergency')} color="error" />}
                                        label="Emergency Mode (Strict Scan & Freeze)"
                                    />
                                    <FormControlLabel
                                        control={<Switch checked={systemState?.mode === 'maintenance'} onChange={() => toggleMode('maintenance')} color="warning" />}
                                        label="Maintenance Mode (Worker Restricted)"
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardHeader title="Strategic Actions" avatar={<MemoryIcon color="secondary" />} />
                            <Divider />
                            <CardContent>
                                <Stack spacing={2}>
                                    <Button variant="outlined" color="warning" fullWidth onClick={handleResetMemory} startIcon={<RefreshIcon />}>
                                        Reset Strategic Memory
                                    </Button>
                                    <Typography variant="caption" color="text.secondary" align="center" display="block">
                                        Clears Master AI context. Does not delete logs or transactions.
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <Button variant="contained" color="error" fullWidth startIcon={<WarningIcon />}>
                                        Immediate System Freeze
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
            {/* Tab 5: AI Seller Brain */}
            {tabValue === 5 && (
                <Grid container spacing={3}>
                    {/* Left: Conversation List */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Card variant="outlined" sx={{ height: 620, display: 'flex', flexDirection: 'column' }}>
                            <CardHeader
                                avatar={<Avatar sx={{ bgcolor: 'success.main' }}><SellerIcon /></Avatar>}
                                title="Live Seller Chat Log"
                                subheader={
                                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                                        <Chip label={`Today: ${sellerStats.todayCount}`} size="small" color="primary" variant="outlined" />
                                        <Chip label={`@AI_Master cmds: ${sellerStats.masterCmdCount}`} size="small" color="warning" variant="outlined" />
                                    </Stack>
                                }
                                action={
                                    <Tooltip title="Refresh">
                                        <IconButton onClick={fetchData} size="small"><RefreshIcon /></IconButton>
                                    </Tooltip>
                                }
                            />
                            <Divider />
                            <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                                {sellerConversations.length === 0 ? (
                                    <Box sx={{ p: 4, textAlign: 'center' }}>
                                        <ForumIcon sx={{ fontSize: 48, opacity: 0.2, mb: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            No seller conversations yet. Customer chats will appear here as they happen.
                                        </Typography>
                                    </Box>
                                ) : (
                                    <List dense disablePadding>
                                        {sellerConversations.map((conv) => (
                                            <ListItem key={conv.id} disablePadding>
                                                <ListItemButton
                                                    selected={selectedConv?.id === conv.id}
                                                    onClick={() => setSelectedConv(conv)}
                                                    sx={{ py: 1.5, px: 2 }}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar sx={{ bgcolor: conv.isMasterCmd ? 'warning.main' : 'success.main', width: 34, height: 34, fontSize: 14 }}>
                                                            {conv.isMasterCmd ? '🔐' : '👤'}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="body2" noWrap fontWeight={conv.isMasterCmd ? 700 : 400}>
                                                                {conv.topic || 'General Inquiry'}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <Typography variant="caption" color="text.secondary">
                                                                {conv.isMasterCmd ? '🔐 Boss Command' : `${Array.isArray(conv.messages) ? conv.messages.length : 0} messages`} · {new Date(conv.updatedAt).toLocaleDateString()} {new Date(conv.updatedAt).toLocaleTimeString()}
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Box>
                        </Card>
                    </Grid>

                    {/* Right: Conversation Detail + Command Box */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Stack spacing={2} sx={{ height: 620 }}>
                            {/* Conversation viewer */}
                            <Paper variant="outlined" sx={{ flexGrow: 1, overflowY: 'auto', p: 2, bgcolor: alpha(theme.palette.background.default, 0.6) }}>
                                {selectedConv ? (
                                    <Stack spacing={2}>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary">
                                            SESSION: {selectedConv.sessionId}
                                        </Typography>
                                        {(Array.isArray(selectedConv.messages) ? selectedConv.messages : []).map((msg: any, i: number) => (
                                            <Box key={i} sx={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row' : 'row-reverse', gap: 1, alignItems: 'flex-start' }}>
                                                <Avatar sx={{ width: 28, height: 28, bgcolor: msg.role === 'user' ? 'grey.600' : 'success.main', fontSize: 12 }}>
                                                    {msg.role === 'user' ? '👤' : '🤖'}
                                                </Avatar>
                                                <Paper sx={{
                                                    p: 1.5, maxWidth: '80%', borderRadius: 2,
                                                    bgcolor: msg.role === 'user' ? 'background.paper' : alpha(theme.palette.success.main, 0.08),
                                                    border: `1px solid ${msg.role === 'user' ? theme.palette.divider : alpha(theme.palette.success.main, 0.2)}`
                                                }}>
                                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>
                                                    {msg.timestamp && (
                                                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                                        </Typography>
                                                    )}
                                                </Paper>
                                            </Box>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.4 }}>
                                        <SellerIcon sx={{ fontSize: 56, mb: 1 }} />
                                        <Typography variant="body2">Select a conversation to view messages</Typography>
                                    </Box>
                                )}
                            </Paper>

                            {/* Command box — sends commands to Seller AI via AI Master */}
                            <Card variant="outlined">
                                <CardHeader
                                    title="Command Seller AI"
                                    subheader="Instruct the seller agent — changes its behavior mid-session"
                                    avatar={<Avatar sx={{ bgcolor: 'warning.main', width: 30, height: 30 }}><PsychologyIcon fontSize="small" /></Avatar>}
                                    sx={{ pb: 0 }}
                                />
                                <CardContent>
                                    <Stack direction="row" spacing={1}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="e.g. 'Focus on upselling extended visas' or 'Be more concise'"
                                            value={sellerCmdInput}
                                            onChange={(e) => setSellerCmdInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    if (sellerCmdInput.trim()) {
                                                        setSellerCmdLoading(true);
                                                        // Route command to AI Master to process seller command
                                                        setAgentId('ai_master');
                                                        setTabValue(0);
                                                        sendChatMessage(`[SELLER AI COMMAND] ${sellerCmdInput.trim()}`);
                                                        setSellerCmdInput('');
                                                        setSellerCmdLoading(false);
                                                    }
                                                }
                                            }}
                                            disabled={sellerCmdLoading}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            disabled={!sellerCmdInput.trim() || sellerCmdLoading}
                                                            onClick={() => {
                                                                if (sellerCmdInput.trim()) {
                                                                    setSellerCmdLoading(true);
                                                                    setAgentId('ai_master');
                                                                    setTabValue(0);
                                                                    sendChatMessage(`[SELLER AI COMMAND] ${sellerCmdInput.trim()}`);
                                                                    setSellerCmdInput('');
                                                                    setSellerCmdLoading(false);
                                                                }
                                                            }}
                                                        >
                                                            <SendIcon fontSize="small" />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                        Press Enter to send. Command will be routed to AI Master for processing.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            )}
            {/* Tab 6: Published Knowledge Management */}
            {tabValue === 6 && (
                <Box>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight="bold">AI Knowledge Base & Updates <Typography variant="caption" color="text.secondary">({knowledgePages.length + immigrationUpdates.length} Published)</Typography></Typography>
                        <TextField
                            size="small"
                            placeholder="Search articles or news..."
                            value={searchQueryPages}
                            onChange={(e) => setSearchQueryPages(e.target.value)}
                            sx={{ width: 350 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
                            }}
                        />
                    </Box>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                                <TableRow>
                                    <TableCell>Content Title</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Slug</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Combined Knowledge and News for max visibility */}
                                {[
                                    ...(knowledgePages || []).map(p => ({ ...p, type: 'KNOWLEDGE' })),
                                    ...(immigrationUpdates || []).map(u => ({ ...u, type: 'NEWS' }))
                                ].filter(p => 
                                    (p?.title || '').toLowerCase().includes((searchQueryPages || '').toLowerCase()) || 
                                    (p?.slug || '').toLowerCase().includes((searchQueryPages || '').toLowerCase())
                                ).sort((a, b) => {
                                    const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
                                    const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
                                    return dateB - dateA;
                                })
                                .map((item: any) => (
                                    <TableRow key={item?.id || Math.random()} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold" sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item?.title || 'Untitled Content'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">{item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'No Date'}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={item.type} 
                                                size="small" 
                                                color={item.type === 'KNOWLEDGE' ? 'primary' : 'secondary'} 
                                                variant="outlined" 
                                                sx={{ fontSize: '9px', height: 20 }}
                                            />
                                        </TableCell>
                                        <TableCell><Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.7 }}>{item.slug}</Typography></TableCell>
                                        <TableCell><Chip label={item.category || 'General'} size="small" variant="outlined" sx={{ fontSize: '10px' }} /></TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                <Tooltip title="View Live">
                                                    <IconButton 
                                                        size="small" 
                                                        color="primary" 
                                                        onClick={() => {
                                                            const path = item.type === 'KNOWLEDGE' ? `/en/visa-knowledge/${item.slug}` : `/en/indonesia-visa-updates/${item.slug}`;
                                                            window.open(path, '_blank');
                                                        }}
                                                    >
                                                        <ViewIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit Content">
                                                    <IconButton 
                                                        size="small" 
                                                        color="secondary" 
                                                        onClick={() => handleEditOpen(item)}
                                                    >
                                                        <AIHeroIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton 
                                                        size="small" 
                                                        color="error"
                                                        onClick={() => item.type === 'KNOWLEDGE' ? handleDeletePage(item.id) : alert("News deletion restricted to maintain audit trail.")}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {knowledgePages.length === 0 && immigrationUpdates.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography variant="body2" sx={{ py: 4, opacity: 0.5 }}>No generated content found. Approved articles appear here.</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Tab 7: Cluster Orchestration (The "Thousand Pages") */}
            {tabValue === 7 && (
                <Box>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Card variant="outlined">
                                <CardHeader 
                                    title="Regional Cluster Orchestration" 
                                    subheader="Status of the 3,000+ AI-generated regional visa pages."
                                    avatar={<Avatar sx={{ bgcolor: 'success.main' }}><StrategyIcon /></Avatar>}
                                />
                                <Divider />
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6, md: 3 }}>
                                            <Typography variant="caption" color="text.secondary">TOTAL CLUSTERS</Typography>
                                            <Typography variant="h5" fontWeight="bold">19</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, md: 3 }}>
                                            <Typography variant="caption" color="text.secondary">AV. VISAS/CLUSTER</Typography>
                                            <Typography variant="h5" fontWeight="bold">161</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, md: 3 }}>
                                            <Typography variant="caption" color="text.secondary">TOTAL STATIC PAGES</Typography>
                                            <Typography variant="h5" fontWeight="bold" color="primary">3,059</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, md: 3 }}>
                                            <Typography variant="caption" color="text.secondary">GLOBAL HEALTH</Typography>
                                            <Typography variant="h5" fontWeight="bold" color="success.main">100%</Typography>
                                        </Grid>
                                    </Grid>

                                    <Typography variant="subtitle2" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>Active Cluster Locations (Click to View Live)</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {['Bali', 'Jakarta', 'Lombok', 'Jogja', 'Surabaya', 'Medan', 'Batam', 'Australia', 'Germany', 'USA', 'UK', 'China', 'India', 'Japan'].map(city => (
                                            <Chip 
                                                key={city} 
                                                label={city} 
                                                onClick={() => window.open(`/en/services/${city}`, '_blank')}
                                                icon={<ViewIcon sx={{ fontSize: '1rem !important' }} />}
                                                clickable
                                                variant="outlined"
                                                color="primary"
                                                sx={{ borderRadius: '8px' }}
                                            />
                                        ))}
                                        <Chip label="+5 more" variant="outlined" size="small" />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card variant="outlined" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                                <CardContent>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Intelligence Feed</Typography>
                                    <Stack spacing={2}>
                                        <Alert icon={false} severity="success" variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                                            <Typography variant="caption" display="block" fontWeight="bold">SEO INDEXING COMPLETE</Typography>
                                            <Typography variant="caption">All 3,059 cluster pages successfully pre-rendered in static build.</Typography>
                                        </Alert>
                                        <Alert icon={false} severity="info" variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                                            <Typography variant="caption" display="block" fontWeight="bold">GEOLOCATION MAPPING</Typography>
                                            <Typography variant="caption">Canonical roots verified. No 404s detected in sitemap generation.</Typography>
                                        </Alert>
                                    </Stack>
                                    <Button fullWidth variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => fetchData()}>
                                        Force Sync All Clusters
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* --- INTELLIGENCE REVIEW MODAL --- */}
            <Dialog 
                open={reviewOpen} 
                onClose={() => !loadingAction && setReviewOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3, bgcolor: 'background.paper', backgroundImage: 'none' }
                }}
            >
                <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h6" fontWeight="bold">Intelligence Review</Typography>
                            <Typography variant="caption" color="text.secondary">RequestId: {selectedRequest?.requestId}</Typography>
                        </Box>
                        {selectedRequest?.proposedChanges?.qualityScore && (
                            <Chip 
                                icon={<AIHeroIcon />} 
                                label={`Quality: ${selectedRequest.proposedChanges.qualityScore}%`} 
                                color={selectedRequest.proposedChanges.qualityScore > 80 ? 'success' : 'warning'}
                                variant="outlined"
                            />
                        )}
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ p: 0, minHeight: 400 }}>
                    {selectedRequest && (
                        <Box>
                            <Tabs 
                                value={tabValue === 99 ? 0 : tabValue === 98 ? 1 : tabValue === 97 ? 2 : 0} 
                                onChange={(_, v) => {
                                    if (v === 0) setTabValue(99);
                                    if (v === 1) setTabValue(98);
                                    if (v === 2) setTabValue(97);
                                }}
                                sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
                            >
                                <Tab label="Article Content" />
                                <Tab label="Sources & Metadata" />
                                <Tab label="Quality Metrics" />
                            </Tabs>

                            <Box sx={{ p: 3 }}>
                                {/* Content Tab */}
                                {(tabValue >= 99 || tabValue <= 5) && (
                                    <Box>
                                        <Typography variant="h5" gutterBottom fontWeight="bold">
                                            {selectedRequest.proposedChanges?.title}
                                        </Typography>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ 
                                            maxHeight: 500, 
                                            overflow: 'auto',
                                            '& p': { mb: 2, lineHeight: 1.8 }
                                        }}>
                                            {selectedRequest.changeType === 'knowledge_article' ? (
                                                Array.isArray(selectedRequest.proposedChanges?.content) ? (
                                                    selectedRequest.proposedChanges.content.map((sec: any, idx: number) => (
                                                        <Box key={idx} sx={{ mb: 4 }}>
                                                            <Typography variant="h6" color="primary">{sec.title}</Typography>
                                                            <MarkdownContent content={sec.content} />
                                                        </Box>
                                                    ))
                                                ) : (
                                                    <MarkdownContent content={selectedRequest.proposedChanges?.content || ''} />
                                                )
                                            ) : (
                                                <MarkdownContent content={selectedRequest.proposedChanges?.content || ''} />
                                            )}
                                        </Box>
                                    </Box>
                                )}

                                {/* Sources Tab */}
                                {tabValue === 98 && (
                                    <Stack spacing={3}>
                                        <Box>
                                            <Typography variant="subtitle2" gutterBottom fontWeight="bold">Official Sources Cited</Typography>
                                            <List dense>
                                                {(selectedRequest.proposedChanges?.sourcesUsed || []).length > 0 ? (
                                                    selectedRequest.proposedChanges.sourcesUsed.map((s: string, i: number) => (
                                                        <ListItem key={i}>
                                                            <ListItemIcon>< LawIcon color="primary" fontSize="small" /></ListItemIcon>
                                                            <ListItemText primary={s} />
                                                        </ListItem>
                                                    ))
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary">No external sources cited statically in payload.</Typography>
                                                )}
                                            </List>
                                        </Box>
                                        <Divider />
                                        <Box>
                                            <Typography variant="subtitle2" gutterBottom fontWeight="bold">SEO Metadata</Typography>
                                            <Paper variant="outlined" sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                                                <Typography variant="caption" display="block" color="text.secondary">META DESCRIPTION</Typography>
                                                <Typography variant="body2" gutterBottom>{selectedRequest.proposedChanges?.metadata?.description || 'N/A'}</Typography>
                                                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>AUTHOR ENTITY</Typography>
                                                <Typography variant="body2">{selectedRequest.proposedChanges?.authorName || 'Indonesian Visas Research Team'}</Typography>
                                            </Paper>
                                        </Box>
                                    </Stack>
                                )}

                                {/* Metrics Tab */}
                                {tabValue === 97 && (
                                    <Grid container spacing={2}>
                                        {[
                                            { label: 'SEO Efficiency', value: selectedRequest.impactForecast?.qualityMetrics?.seoScore || 0 },
                                            { label: 'Readability', value: selectedRequest.impactForecast?.qualityMetrics?.readabilityScore || 0 },
                                            { label: 'Semantic Breadth', value: selectedRequest.impactForecast?.qualityMetrics?.semanticScore || 0 },
                                            { label: 'Uniqueness', value: selectedRequest.impactForecast?.qualityMetrics?.uniquenessScore || 0 }
                                        ].map((m, i) => (
                                            <Grid key={i} size={{ xs: 6 }}>
                                                <Typography variant="caption" color="text.secondary">{m.label.toUpperCase()}</Typography>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <LinearProgress variant="determinate" value={m.value} sx={{ flexGrow: 1, height: 6, borderRadius: 3 }} />
                                                    <Typography variant="body2" fontWeight="bold">{Math.round(m.value)}%</Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                                            <Alert icon={<AuditIcon />} severity="info">
                                                <Typography variant="caption">
                                                    Word Count: <strong>{selectedRequest.impactForecast?.qualityMetrics?.wordCount || 'Unknown'}</strong> words.
                                                    Cluster Affinity: <strong>{selectedRequest.proposedChanges?.cluster || 'General'}</strong>.
                                                </Typography>
                                            </Alert>
                                        </Grid>
                                    </Grid>
                                )}
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
                    <Button variant="outlined" onClick={() => setReviewOpen(false)} disabled={loadingAction}>Cancel</Button>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button 
                        color="error" 
                        variant="outlined" 
                        onClick={() => handleManagementAction('REJECT_REQUEST', { requestId: selectedRequest?.requestId })}
                        disabled={loadingAction}
                    >
                        Reject & Archive
                    </Button>
                    <Button 
                        color="success" 
                        variant="contained" 
                        startIcon={loadingAction ? <CircularProgress size={20} color="inherit" /> : <SuccessIcon />}
                        onClick={() => handleManagementAction('APPROVE_REQUEST', { requestId: selectedRequest?.requestId })}
                        disabled={loadingAction}
                    >
                        Approve & Publish LIVE
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    </>
    );
}
