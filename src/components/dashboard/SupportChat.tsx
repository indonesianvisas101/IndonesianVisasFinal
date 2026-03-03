"use client";

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthContext';
import Image from 'next/image';
import {
    Send,
    MessageCircle,
    User as UserIcon,
    Bot,
    Paperclip,
    Loader2
} from 'lucide-react';

interface Message {
    id: string;
    senderType: 'user' | 'admin' | 'system';
    message: string;
    created_at: string;
}

export default function SupportChat() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [isOnline, setIsOnline] = useState(true); // Default to Online
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize Chat
    useEffect(() => {
        if (!user) return;

        const initChat = async () => {
            try {
                // 1. Get or Create Conversation
                // 1. Get or Create Conversation
                // We use limit(1) instead of single() to handle cases where duplicates might already exist (legacy data)
                let { data: convs, error } = await supabase
                    .from('conversations')
                    .select('id')
                    .eq('user_id', user.id)
                    .order('updated_at', { ascending: false })
                    .limit(1);

                let conv = convs?.[0];

                if (!conv) {
                    // Create if not exists
                    const { data: newConv, error: createError } = await supabase
                        .from('conversations')
                        .insert([{ user_id: user.id, status: 'open', updated_at: new Date().toISOString() }])
                        .select()
                        .single();

                    if (createError) throw createError;
                    conv = newConv;
                } else if (error) {
                    throw error;
                }

                if (conv) {
                    setConversationId(conv.id);

                    // 2. Fetch Messages
                    const { data: msgData, error: msgError } = await supabase
                        .from('messages')
                        .select('*')
                        .eq('conversation_id', conv.id)
                        .order('created_at', { ascending: true });

                    if (msgError) throw msgError;

                    // NEW: Identity Context for Admin (If new chat)
                    if (!msgData || msgData.length === 0) {
                        const identityMsg = `New chat started by: ${user.name} (${user.email || 'No Email'})`;
                        await supabase.from('messages').insert([{
                            conversation_id: conv.id,
                            senderType: 'system',
                            message: identityMsg,
                            is_read: false // Notify admin
                        }]);
                        // Add to local state immediately
                        const { data: newSysMsg } = await supabase
                            .from('messages')
                            .select('*')
                            .eq('conversation_id', conv.id)
                            .order('created_at', { ascending: false })
                            .limit(1)
                            .single();

                        if (newSysMsg) setMessages([newSysMsg]);
                    } else {
                        setMessages(msgData || []);
                    }

                    // 3. Subscribe to Realtime
                    const channel = supabase
                        .channel(`chat:${conv.id}`)
                        .on(
                            'postgres_changes',
                            {
                                event: '*',
                                schema: 'public',
                                table: 'messages',
                                filter: `conversation_id=eq.${conv.id}`
                            },
                            (payload) => {
                                if (payload.eventType === 'INSERT') {
                                    const newMsg = payload.new as Message;
                                    setMessages(prev => {
                                        if (prev.some(m => m.id === newMsg.id)) return prev;
                                        return [...prev, newMsg];
                                    });
                                } else if (payload.eventType === 'DELETE') {
                                    const deletedId = payload.old.id;
                                    setMessages(prev => prev.filter(m => m.id !== deletedId));
                                }
                            }
                        )
                        .subscribe();

                    return () => {
                        supabase.removeChannel(channel);
                    };
                }
            } catch (err) {
                console.error("Chat Init Error:", err);
            } finally {
                setLoading(false);
            }
        };

        initChat();
    }, [user]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || !conversationId || sending) return;

        setSending(true);
        const msgContent = input.trim();

        try {
            // Track activity
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
                fetch('/api/user/activity', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                }).catch(() => { });
            }

            const { error: msgError } = await supabase
                .from('messages')
                .insert([{
                    conversation_id: conversationId, // Note: Variable name might be conversationId based on previous view
                    senderType: 'user',
                    message: msgContent,
                    is_read: false
                }]);

            if (msgError) throw msgError;

            // Update Conversation Timestamp for sorting
            await supabase
                .from('conversations')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', conversationId);

            setInput('');

            // NEW: Send Admin Notification (Persist) via API
            // We do this non-blocking so chat feels fast
            fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: null, // Admin Target
                    title: 'New Support Message',
                    message: msgContent.substring(0, 100),
                    type: 'info',
                    actionLink: '/admin?tab=support'
                })
            }).catch(e => console.error("Notification Failed", e));

            // Offline Auto-Reply
            if (!isOnline) {
                setTimeout(async () => {
                    await supabase
                        .from('messages')
                        .insert([{
                            conversation_id: conversationId,
                            senderType: 'system',
                            message: "Support is currently offline. We will reach you ASAP via email or WhatsApp.",
                            is_read: true
                        }]);
                }, 1000);
            }

        } catch (err: any) {
            console.error("Send Error:", err);
            // Show real error details
            alert(`Message failed: ${err.message || err.error_description || "Database Error"}`);
        } finally {
            setSending(false);

            // Analytics: Track Support Interaction
            try {
                // @ts-ignore
                if (window.gtag && !sending) {
                    // @ts-ignore
                    window.gtag('event', 'support_chat_sent', {
                        event_category: 'engagement',
                        event_label: conversationId
                    });
                }
            } catch (e) { }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Loader2 className="animate-spin mb-2" />
                <p>Connecting to support...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12">
                        <Image
                            src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&q=80"
                            alt="Support Team"
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">Support Team</h3>
                        <p className={`text-xs flex items-center gap-1 ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            {isOnline ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>
                <div className={`text-xs px-3 py-1 rounded-full border ${isOnline ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {isOnline ? 'Realtime Chat' : 'Leave a message'}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50" ref={chatContainerRef}>
                {/* System Warning */}
                <div className="flex justify-center my-4">
                    <div className="bg-blue-50 text-blue-800 text-xs px-4 py-2 rounded-lg max-w-[80%] text-center border border-blue-100 shadow-sm">
                        Welcome to Support! Our team is here to help you with your visa application.
                    </div>
                </div>

                {/* Empty State */}
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-10">
                        <p>No messages yet.</p>
                        <p className="text-sm">Type below to start a conversation.</p>
                    </div>
                )}

                {messages.map((msg) => {
                    const isUser = msg.senderType === 'user';
                    const isSystem = msg.senderType === 'system';
                    const isFile = msg.message.startsWith('[FILE]');

                    if (isSystem) {
                        return (
                            <div key={msg.id} className="flex justify-center my-2">
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{msg.message}</span>
                            </div>
                        );
                    }

                    // Parse File Message
                    let fileUrl = '';
                    let fileName = 'Attachment';
                    if (isFile) {
                        const parts = msg.message.replace('[FILE]', '').trim().split('|');
                        fileUrl = parts[0].trim();
                        fileName = parts[1]?.trim() || 'Download File';
                    }

                    return (
                        <div key={msg.id} className={`group flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                            {/* Actions (Left for User) */}
                            {isUser && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 mb-2">
                                    <button
                                        onClick={() => {
                                            const newText = prompt("Edit your message:", msg.message);
                                            if (newText && newText !== msg.message) {
                                                supabase.from('messages').update({ message: newText }).eq('id', msg.id).then(({ error }) => {
                                                    if (!error) {
                                                        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, message: newText } : m));
                                                    }
                                                });
                                            }
                                        }}
                                        className="p-1 text-gray-400 hover:text-blue-500 bg-white rounded-full shadow-sm"
                                        title="Edit"
                                        type="button"
                                    >
                                        <div className="w-3 h-3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm("Delete this message?")) {
                                                fetch('/api/chat/delete', {
                                                    method: 'DELETE',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ id: msg.id, type: 'message' })
                                                }).then(res => {
                                                    if (res.ok) {
                                                        setMessages(prev => prev.filter(m => m.id !== msg.id));
                                                    } else {
                                                        alert("Could not delete message");
                                                    }
                                                });
                                            }
                                        }}
                                        className="p-1 text-gray-400 hover:text-red-500 bg-white rounded-full shadow-sm"
                                        title="Delete"
                                        type="button"
                                    >
                                        <div className="w-3 h-3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></div>
                                    </button>
                                </div>
                            )}

                            <div className={`
                                max-w-[80%] rounded-2xl px-4 py-3 shadow-sm text-sm
                                ${isUser
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                }
                            `}>
                                {isFile ? (
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-2 p-2 rounded ${isUser ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-gray-100 text-blue-600 hover:bg-gray-200'} transition-colors no-underline`}
                                    >
                                        <Paperclip size={16} />
                                        <span className="underline decoration-dotted block truncate max-w-[150px]">{fileName}</span>
                                    </a>
                                ) : (
                                    <p className="whitespace-pre-wrap">{msg.message}</p>
                                )}

                                <p className={`text-[10px] mt-1 text-right ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Makassar' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2">
                    {/* File Upload Trigger */}
                    <input
                        type="file"
                        id="user-chat-upload"
                        className="hidden"
                        onChange={async (e) => {
                            if (e.target.files && e.target.files[0] && conversationId) {
                                const file = e.target.files[0];
                                setSending(true);
                                try {
                                    // 1. Upload via Server Proxy (Bypasses Client RLS complex setup)
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    formData.append('bucket', 'documents');
                                    formData.append('folder', 'chat-uploads');

                                    const uploadRes = await fetch('/api/upload', {
                                        method: 'POST',
                                        body: formData
                                    });

                                    const uploadData = await uploadRes.json();

                                    if (!uploadRes.ok) throw new Error(uploadData.error || uploadData.message || "Upload failed");

                                    const publicUrl = uploadData.url;

                                    // 2. Send as Message
                                    // Format: [FILE] URL | OriginalName
                                    const msgContent = `[FILE] ${publicUrl} | ${file.name}`;

                                    const { error: msgError } = await supabase
                                        .from('messages')
                                        .insert([{
                                            conversation_id: conversationId,
                                            senderType: 'user',
                                            message: msgContent,
                                            is_read: false
                                        }]);

                                    if (msgError) throw msgError;

                                    // 3. Notify Admin
                                    fetch('/api/notifications', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            userId: null,
                                            title: 'New File from User',
                                            message: `Sent a file: ${file.name}`,
                                            type: 'info',
                                            actionLink: '/admin?tab=support'
                                        })
                                    }).catch(console.error);

                                } catch (err: any) {
                                    console.error("Upload/Send Error:", err);
                                    alert("File upload failed: " + (err.message || "Server Error"));
                                } finally {
                                    setSending(false);
                                    // Reset input
                                    e.target.value = '';
                                }
                            }
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => document.getElementById('user-chat-upload')?.click()}
                        disabled={sending}
                        className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        title="Upload File"
                    >
                        <Paperclip size={20} />
                    </button>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || sending}
                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20"
                    >
                        {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                </div>
            </form>
        </div>
    );
}
