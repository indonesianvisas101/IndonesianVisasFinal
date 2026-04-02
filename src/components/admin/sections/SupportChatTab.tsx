"use client";

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthContext';
import { useApplication } from '@/components/application/ApplicationContext';
import {
    Send,
    MessageCircle,
    User,
    Search,
    Loader2,
    Trash2,
    Edit2,
    Clock
} from 'lucide-react';
import {
    Box,
    Paper,
    Grid,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    TextField,
    IconButton,
    Divider,
    Chip,
    ListItemButton,
    Tooltip,
    LinearProgress
} from '@mui/material';
import { useSearchParams } from 'next/navigation';

interface Conversation {
    id: string;
    user_id: string;
    status: 'open' | 'assigned' | 'closed';
    updated_at: string;
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    lastMessage?: string;
    unreadCount?: number;
}

interface Message {
    id: string;
    senderType: 'user' | 'admin' | 'system' | string;
    message: string;
    created_at: string;
}

export default function SupportChatTab() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const targetConvId = searchParams.get('conversationId');

    // Fetch Conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch('/api/admin/chat/conversations');
                if (!res.ok) throw new Error(`API returned ${res.status}`);
                const convs = await res.json();
                
                if (convs.error) {
                    console.error("Error fetching conversations:", convs.error);
                    setConversations([]);
                } else {
                    setConversations(convs || []);
                    // Deep Linking: Auto-select if in URL
                    if (targetConvId) {
                        setSelectedConvId(targetConvId);
                    }
                }
            } catch (err: any) {
                console.error("Error fetching conversations:", err);
                setConversations([]);
            }
            setLoading(false);
        };

        fetchConversations();

        // Subscribe to NEW Conversations
        const channel = supabase
            .channel('admin_conversations')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'conversations' },
                () => fetchConversations()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Fetch Messages for Selected
    useEffect(() => {
        if (!selectedConvId) return;

        const fetchMessages = async () => {
            setMessagesLoading(true);
            try {
                const res = await fetch(`/api/admin/chat/messages?conversationId=${selectedConvId}`);
                if (!res.ok) throw new Error(`API returned ${res.status}`);
                const data = await res.json();
                if (data.error) {
                    console.error("Error fetching messages:", data.error);
                } else {
                    setMessages(data || []);
                }
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
            setMessagesLoading(false);
        };

        fetchMessages();

        // Realtime Messages
        console.log("Subscribing to realtime messages for:", selectedConvId);
        const channel = supabase
            .channel(`admin_chat:${selectedConvId}`)
            .on(
                'postgres_changes',
                { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'messages', 
                    filter: `conversation_id=eq.${selectedConvId}` 
                },
                (payload) => {
                    console.log("Realtime INSERT received:", payload);
                    const newMsg = payload.new as Message;
                    // Prevent duplicates
                    setMessages(prev => {
                        if (prev.find(m => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg];
                    });
                    scrollToBottom();
                }
            )
            .on(
                'postgres_changes',
                { 
                    event: 'DELETE', 
                    schema: 'public', 
                    table: 'messages', 
                    filter: `conversation_id=eq.${selectedConvId}` 
                },
                (payload) => {
                    const deletedId = payload.old.id;
                    setMessages(prev => prev.filter(m => m.id !== deletedId));
                }
            )
            .subscribe((status) => {
                console.log(`Realtime subscription status for ${selectedConvId}:`, status);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [selectedConvId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    useEffect(() => scrollToBottom(), [messages]);

    const { allNotifications, deleteNotification } = useApplication();

    // Clear notifications when viewing a conversation
    useEffect(() => {
        if (!selectedConvId || !allNotifications) return;

        // Find notifications related to this conversation (by actionLink containing conversationId)
        const relatedNotifs = allNotifications.filter(n =>
            n.actionLink && n.actionLink.includes(`conversationId=${selectedConvId}`)
        );

        if (relatedNotifs.length > 0) {
            console.log("Clearing notifications for conversation:", selectedConvId, relatedNotifs);
            // Delete them
            relatedNotifs.forEach(n => deleteNotification(n.id));
        }
    }, [selectedConvId, allNotifications, deleteNotification]);

    // NEW: Resolve "Guest" names using System Identity Messages (Fallback for missing/syncing User profiles)
    useEffect(() => {
        const resolveGuestNames = async () => {
            // Find conversations that don't have a user profile linked yet
            const guestConvs = conversations.filter(c => !c.user || !c.user.name);
            if (guestConvs.length === 0) return;

            let hasUpdates = false;
            const updatedConversations = [...conversations];

            for (const conv of guestConvs) {
                // Fetch the identity message securely
                try {
                    const res = await fetch(`/api/admin/chat/messages?conversationId=${conv.id}&senderType=system&ilike=New%20chat%20started%20by%25&limit=1`);
                    if (!res.ok) continue;
                    const messages = await res.json();
                    const data = messages && messages.length > 0 ? messages[0] : null;

                    if (data && data.message) {
                    // Parse: "New chat started by: Name (Email)"
                    // Regex handles optional email part just in case
                    const match = data.message.match(/New chat started by: (.*?)(?: \((.*)\))?$/);
                    if (match) {
                        const name = match[1];
                        const email = match[2] || "No Email";

                        // Update the specific conversation in the array
                        const index = updatedConversations.findIndex(c => c.id === conv.id);
                        if (index !== -1) {
                            updatedConversations[index] = {
                                ...updatedConversations[index],
                                user: {
                                    ...(updatedConversations[index].user || {}),
                                    name: name,
                                    email: email,
                                    avatar: '' // Keep empty or generate placeholder
                                }
                            };
                            hasUpdates = true;
                        }
                    }
                }
                } catch (e) {
                    console.error("Failed to parse guest name", e);
                }
            }

            if (hasUpdates) {
                setConversations(updatedConversations);
            }
        };

        resolveGuestNames();
    }, [conversations]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || !selectedConvId) return;

        try {
            const res = await fetch('/api/admin/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversation_id: selectedConvId,
                    message: input.trim()
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to send");
            }

            setInput('');
        } catch (error: any) {
            console.error("Send failed", error);
            alert("Failed to send: " + error.message);
        }
    };

    const selectedConv = conversations.find(c => c.id === selectedConvId);

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleString('en-US', {
                timeZone: 'Asia/Makassar',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch {
            return dateStr;
        }
    };

    const handleCleanupDB = async () => {
        if (!confirm("Start Auto-Cleanup? This will remove duplicate conversation copies from the database and preserve only the latest active one for each user.")) return;
        try {
            const res = await fetch('/api/admin/fix-chat-db', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                alert(`Cleanup Successful! Removed ${data.deleted_count || 'duplicate'} copies.`);
                window.location.reload();
            } else {
                alert("Cleanup failed: " + (data.error || 'Unknown error'));
            }
        } catch (e: any) {
            alert("Error during cleanup: " + e.message);
        }
    };

    const handleDeleteConversation = async () => {
        if (!selectedConvId || !confirm("Are you sure you want to delete this ENTIRE conversation? This cannot be undone.")) return;

        try {
            const res = await fetch('/api/chat/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedConvId, type: 'conversation' })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Delete failed");
            }

            // UI Update
            setConversations(prev => prev.filter(c => c.id !== selectedConvId));
            setSelectedConvId(null);
            setMessages([]);
        } catch (err) {
            console.error("Delete failed", err);
            alert("Failed to delete conversation");
        }
    };

    const handleDeleteMessage = async (msgId: string) => {
        if (!confirm("Delete this message?")) return;
        try {
            const res = await fetch('/api/chat/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: msgId, type: 'message' })
            });

            if (!res.ok) throw new Error("Delete failed");

            setMessages(prev => prev.filter(m => m.id !== msgId));
        } catch (err) {
            console.error("Delete msg failed", err);
            alert("Failed to delete message");
        }
    };

    // Filter? No, let's show all so Admin can debug. Use a safe fallback for name.
    // Deduplicate by user_id (keep latest) to fix "Multiple Copy" issue from manual SQL inserts
    const displayConversations = React.useMemo(() => {
        const uniqueMap = new Map();
        conversations.forEach(c => {
            const existing = uniqueMap.get(c.user_id);
            if (!existing || new Date(c.updated_at) > new Date(existing.updated_at)) {
                uniqueMap.set(c.user_id, c);
            }
        });
        return Array.from(uniqueMap.values()).sort((a: any, b: any) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
    }, [conversations]);

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: 'calc(100vh - 150px)', minHeight: 600, gap: 2 }}>
            {/* Sidebar: Conversations List */}
            <Box sx={{ width: { xs: '100%', md: 350 }, flexShrink: 0 }}>
                <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <Box p={2} borderBottom={1} borderColor="divider">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="h6" fontWeight="bold">Inbox</Typography>
                            <Tooltip title="Run Auto-Cleanup (Fix Duplicates)">
                                <IconButton size="small" onClick={handleCleanupDB} color="warning">
                                    <Trash2 size={16} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search user..."
                            InputProps={{ startAdornment: <Search size={18} className="mr-2 text-gray-400" /> }}
                        />
                    </Box>
                    <List sx={{ flex: 1, overflowY: 'auto' }}>
                        {loading ? (
                            <Box display="flex" justifyContent="center" p={4}><Loader2 className="animate-spin" /></Box>
                        ) : displayConversations.length === 0 ? (
                            <Box p={4} textAlign="center" color="text.secondary">No conversations yet.</Box>
                        ) : (
                            displayConversations.map((conv) => (
                                <React.Fragment key={conv.id}>
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            selected={selectedConvId === conv.id}
                                            onClick={() => setSelectedConvId(conv.id)}
                                            alignItems="flex-start"
                                        >
                                            <ListItemAvatar>
                                                <Avatar src={conv.user?.avatar} alt={conv.user?.name}>
                                                    {conv.user?.name?.[0] || <User />}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" justifyContent="space-between">
                                                        <Typography variant="subtitle2" fontWeight="bold">
                                                            {conv.user?.name || `Guest (${conv.user_id.slice(0, 4)})`}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {formatDate(conv.updated_at)}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Typography variant="body2" color="text.secondary" noWrap>
                                                        {conv.status === 'open' ? <span className="text-green-600 font-bold mr-1">●</span> : null}
                                                        {conv.user?.email || "No email linked"}
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                    <Divider component="li" />
                                </React.Fragment>
                            ))
                        )}
                    </List>
                </Paper>
            </Box>

            {/* Main Chat Area */}
            <Box sx={{ flex: 1, height: '100%', position: 'relative' }}>
                {loading && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }} />}
                <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {selectedConv ? (
                        <>
                            {/* Chat Header */}
                            <Box p={2} borderBottom={1} borderColor="divider" display="flex" justifyContent="space-between" alignItems="center" bgcolor="white">
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar src={selectedConv.user?.avatar}>{selectedConv.user?.name?.[0]}</Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">{selectedConv.user?.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{selectedConv.user?.email}</Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Box display="flex" alignItems="center" gap={0.5} color="text.secondary" sx={{ opacity: 0.7 }}>
                                        <Clock size={14} />
                                        <Typography variant="caption">Bali Time (WITA)</Typography>
                                    </Box>
                                    <Chip
                                        label={selectedConv.status.toUpperCase()}
                                        color={selectedConv.status === 'open' ? 'success' : 'default'}
                                        size="small"
                                    />
                                    <Tooltip title="Delete Conversation">
                                        <IconButton size="small" onClick={handleDeleteConversation} color="error">
                                            <Trash2 size={18} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>

                            {/* Chat Messages */}
                            <Box sx={{ flex: 1, overflowY: 'auto', p: 3, bgcolor: '#f5f7fa' }}>
                                {messagesLoading ? (
                                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                        <Loader2 className="animate-spin text-primary" size={40} />
                                    </Box>
                                ) : messages.length === 0 ? (
                                    <Box display="flex" justifyContent="center" alignItems="center" height="100%" flexDirection="column" color="text.secondary">
                                        <MessageCircle size={48} className="mb-2 opacity-20" />
                                        <Typography variant="body2">No messages in this conversation.</Typography>
                                    </Box>
                                ) : messages.map((msg) => {
                                    const isSystem = msg.senderType === 'system';
                                    const isAdmin = msg.senderType === 'admin' || 
                                                    msg.senderType === 'ADMIN' ||
                                                    msg.senderType === user?.id;
                                    const isCustomer = !isAdmin && !isSystem;

                                    if (isSystem) {
                                        return (
                                            <Box key={msg.id} display="flex" justifyContent="center" mb={2}>
                                                <Typography variant="caption" sx={{ bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1, color: 'text.secondary' }}>
                                                    {msg.message}
                                                </Typography>
                                            </Box>
                                        );
                                    }

                                    const isFile = msg.message.startsWith('[FILE]');

                                    // Parse File Message
                                    let fileUrl = '';
                                    let fileName = 'Attachment';
                                    if (isFile) {
                                        const parts = msg.message.replace('[FILE]', '').trim().split('|');
                                        fileUrl = parts[0].trim();
                                        fileName = parts[1]?.trim() || 'Download File';
                                    }

                                    return (
                                        <Box key={msg.id} display="flex" justifyContent={isAdmin ? 'flex-end' : 'flex-start'} mb={2}>
                                            <Box display="flex" alignItems="end" gap={1} flexDirection={isAdmin ? 'row' : 'row-reverse'}>
                                                {/* Actions */}
                                                <Box className="msg-actions" sx={{ opacity: 0, transition: 'opacity 0.2s', mb: 1 }}>
                                                    <IconButton size="small" onClick={() => handleDeleteMessage(msg.id)}>
                                                        <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                                                    </IconButton>
                                                </Box>

                                                <Box sx={{
                                                    maxWidth: '600px',
                                                    p: 2,
                                                    borderRadius: 2,
                                                    bgcolor: isAdmin ? 'primary.main' : 'white',
                                                    color: isAdmin ? 'white' : 'text.primary',
                                                    boxShadow: 1,
                                                    borderTopLeftRadius: !isAdmin ? 0 : 2,
                                                    borderTopRightRadius: isAdmin ? 0 : 2
                                                }}>
                                                    {isFile ? (
                                                        <a
                                                            href={fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                color: isAdmin ? 'white' : '#1976d2',
                                                                textDecoration: 'none',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '4px', borderRadius: '4px' }}><Typography variant="body2">📎</Typography></div>
                                                            {fileName}
                                                        </a>
                                                    ) : (
                                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.message}</Typography>
                                                    )}

                                                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 1, opacity: 0.7, fontSize: '0.7rem' }}>
                                                        {new Date(msg.created_at).toLocaleString('en-US', {
                                                            timeZone: 'Asia/Makassar',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: true
                                                        })}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </Box>

                            {/* Chat Input */}
                            <Box p={2} borderTop={1} borderColor="divider" component="form" onSubmit={handleSend}>
                                <Box display="flex" gap={2}>
                                    {/* File Upload Button */}
                                    <input
                                        type="file"
                                        id="chat-file-upload"
                                        hidden
                                        onChange={async (e) => {
                                            if (e.target.files && e.target.files[0] && selectedConvId) {
                                                const file = e.target.files[0];
                                                try {
                                                    // 1. Upload via Server Proxy (Bypasses Client RLS complex setup)
                                                    const formData = new FormData();
                                                    formData.append('file', file);
                                                    formData.append('bucket', 'documents');
                                                    formData.append('folder', 'admin-chat');

                                                    const uploadRes = await fetch('/api/upload', {
                                                        method: 'POST',
                                                        body: formData
                                                    });

                                                    const uploadData = await uploadRes.json();

                                                    if (!uploadRes.ok) throw new Error(uploadData.error || uploadData.message || "Upload failed");

                                                    const publicUrl = uploadData.url;

                                                    // 2. Send as Message via API (Bypass RLS)
                                                    const sendRes = await fetch('/api/admin/chat/send', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({
                                                            conversation_id: selectedConvId,
                                                            message: `[FILE] ${publicUrl} | ${file.name}`
                                                        })
                                                    });

                                                    if (!sendRes.ok) {
                                                        const sendData = await sendRes.json();
                                                        throw new Error(sendData.error || "Failed to send message");
                                                    }

                                                    // Optimistic UI Update (optional, or rely on realtime)
                                                } catch (err: any) {
                                                    console.error("Admin Upload Error:", err);
                                                    alert("Upload failed: " + (err.message || "Server Error"));
                                                }
                                            }
                                        }}
                                    />
                                    <Tooltip title="Attach File">
                                        <IconButton component="label" htmlFor="chat-file-upload" color="primary">
                                            {/* Paperclip icon wasn't imported in original snippet, assuming reuse or using a text char if needed, but looks like Lucide icons were available */}
                                            <span style={{ fontSize: 20 }}>📎</span>
                                        </IconButton>
                                    </Tooltip>

                                    <TextField
                                        fullWidth
                                        placeholder="Type a reply..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        size="small"
                                        multiline
                                        maxRows={4}
                                    />
                                    <IconButton type="submit" color="primary" disabled={!input.trim()}>
                                        <Send />
                                    </IconButton>
                                </Box>
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'text.secondary' }}>
                            <MessageCircle size={64} style={{ opacity: 0.2, marginBottom: 16 }} />
                            <Typography>Select a conversation to start chatting</Typography>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Box>
    );
}
