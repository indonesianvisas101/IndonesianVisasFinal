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
    ListItemIcon
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
    Forum as ForumIcon
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
    createdAt: string;
}

interface RiskLog {
    id: string;
    scanType: string;
    riskLevel: string;
    createdAt: string;
    findings: any;
}

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
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

    // Data States
    const [systemState, setSystemState] = useState<SystemState | null>(null);
    const [pendingRequests, setPendingRequests] = useState<ChangeRequest[]>([]);
    const [riskLogs, setRiskLogs] = useState<RiskLog[]>([]);
    const [intelligence, setIntelligence] = useState<any>(null);
    const [strategicReport, setStrategicReport] = useState<any>(null);

    // Seller Conversations State
    const [sellerConversations, setSellerConversations] = useState<any[]>([]);
    const [sellerStats, setSellerStats] = useState<{ todayCount: number; masterCmdCount: number }>({ todayCount: 0, masterCmdCount: 0 });
    const [sellerCmdInput, setSellerCmdInput] = useState('');
    const [sellerCmdLoading, setSellerCmdLoading] = useState(false);
    const [selectedConv, setSelectedConv] = useState<any | null>(null);

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

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch Management Data
            const mgmtRes = await fetch('/api/ai-master/management');
            if (mgmtRes.ok) {
                const data = await mgmtRes.json();
                setSystemState(data.systemState);
                setPendingRequests(data.pendingRequests);
                setRiskLogs(data.riskLogs);
            }

            // Fetch Seller Conversations
            const convRes = await fetch('/api/chat/conversations?limit=30');
            if (convRes.ok) {
                const convData = await convRes.json();
                setSellerConversations(convData.conversations || []);
                setSellerStats(convData.stats || { todayCount: 0, masterCmdCount: 0 });
            }

            // Fetch Intelligence
            const intelRes = await fetch('/api/ai-master/order-intelligence');
            if (intelRes.ok) {
                const data = await intelRes.json();
                setIntelligence(data.metrics);
            }

            // Fetch Strategic Report (Requires elevated auth or sim)
            // Note: In real production, this might need a specific header
            // For now, we attempt to fetch if session allows
            const strategyRes = await fetch('/api/ai-master/strategic-report');
            if (strategyRes.ok) {
                const data = await strategyRes.json();
                setStrategicReport(data.metrics);
            }

        } catch (err) {
            console.error("Dashboard Sync Error:", err);
            setError("Failed to synchronize with Antigravity Neutral Engine.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        // Background polling every 30s
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleModeSwitch = async (newMode: string) => {
        try {
            const res = await fetch('/api/ai-master/management', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'TOGGLE_MODE', data: { mode: newMode } })
            });
            if (res.ok) {
                const updated = await res.json();
                setSystemState(updated);
            }
        } catch (err) {
            alert("Failed to update system mode");
        }
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
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
                                label={`SYSTEM MODE: ${systemState?.mode?.toUpperCase() || 'NORMAL'}`}
                                color={systemState?.mode === 'normal' ? 'success' : 'warning'}
                                size="small"
                                icon={systemState?.mode === 'normal' ? <SuccessIcon /> : <WarningIcon />}
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
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ bgcolor: 'background.paper', borderLeft: '6px solid', borderColor: 'primary.main' }}>
                        <CardContent>
                            <Typography variant="overline" color="text.secondary">Engine Accuracy</Typography>
                            <Typography variant="h4" fontWeight="bold">98.4%</Typography>
                            <LinearProgress variant="determinate" value={98.4} sx={{ mt: 1, height: 8, borderRadius: 4 }} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ bgcolor: 'background.paper', borderLeft: '6px solid', borderColor: 'warning.main' }}>
                        <CardContent>
                            <Typography variant="overline" color="text.secondary">System Status</Typography>
                            <Typography variant="h4" fontWeight="bold" color={systemState?.systemHealthStatus === 'healthy' ? 'success.main' : 'error.main'}>
                                {systemState?.systemHealthStatus?.toUpperCase() || 'UNKNOWN'}
                            </Typography>
                            <Typography variant="caption">Last risk scan: {systemState?.lastRiskScan ? new Date(systemState.lastRiskScan).toLocaleTimeString() : 'Never'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* --- MAIN TABS --- */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} variant="scrollable" scrollButtons="auto">
                    <Tab label="Interactive Command Center" icon={<ChatIcon />} iconPosition="start" />
                    <Tab label={<Badge badgeContent={pendingRequests.length} color="error" sx={{ px: 2 }}>Approval Queue</Badge>} />
                    <Tab label="Risk Intelligence" />
                    <Tab label="Strategic Advisories" />
                    <Tab label="System Orchestration" />
                    <Tab label="AI Seller Brain" icon={<SellerIcon />} iconPosition="start" />
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
                                <TableCell>Risk Score</TableCell>
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
                                    <TableCell>{req.initiatedBy}</TableCell>
                                    <TableCell><Chip label={req.changeType} size="small" variant="outlined" /></TableCell>
                                    <TableCell>
                                        <Chip
                                            label={req.riskScore}
                                            size="small"
                                            color={Number(req.riskScore) > 70 ? 'error' : Number(req.riskScore) > 30 ? 'warning' : 'success'}
                                        />
                                    </TableCell>
                                    <TableCell>{new Date(req.createdAt).toLocaleString()}</TableCell>
                                    <TableCell align="right">
                                        <Button size="small" variant="contained">Review</Button>
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
                                        control={<Switch checked={systemState?.mode === 'normal'} onChange={() => handleModeSwitch('normal')} />}
                                        label="Normal Mode (Standard Operations)"
                                    />
                                    <FormControlLabel
                                        control={<Switch checked={systemState?.mode === 'emergency'} onChange={() => handleModeSwitch('emergency')} color="error" />}
                                        label="Emergency Mode (Strict Scan & Freeze)"
                                    />
                                    <FormControlLabel
                                        control={<Switch checked={systemState?.mode === 'maintenance'} onChange={() => handleModeSwitch('maintenance')} color="warning" />}
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
                                                                {conv.isMasterCmd ? '🔐 Boss Command' : `${Array.isArray(conv.messages) ? conv.messages.length : 0} messages`} · {new Date(conv.updatedAt).toLocaleTimeString()}
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
        </Stack>
    );
}
