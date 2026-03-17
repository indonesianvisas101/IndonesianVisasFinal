"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, ShieldAlert, ExternalLink, Phone } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

// ─── Types ─────────────────────────────────────────────────────────────────
interface ActionButton {
    label: string;
    url: string;
    type?: 'link' | 'whatsapp' | 'primary';
}

interface Message {
    id: string;
    role: 'system' | 'user' | 'assistant' | 'data';
    content: string;
    buttons?: ActionButton[];
    isMasterMode?: boolean;
}

// ─── Button Parser ──────────────────────────────────────────────────────────
// AI Seller can embed buttons using format: [BTN:label|url] anywhere in response
function parseButtons(text: string): { cleanText: string; buttons: ActionButton[] } {
    const buttons: ActionButton[] = [];
    const btnRegex = /\[BTN:([^\|]+)\|([^\]]+)\]/g;
    let match;
    while ((match = btnRegex.exec(text)) !== null) {
        const label = match[1].trim();
        const url = match[2].trim();
        const type = url.includes('wa.me') || url.includes('whatsapp') ? 'whatsapp'
            : label.toLowerCase().includes('contact') ? 'primary' : 'link';
        buttons.push({ label, url, type });
    }
    const cleanText = text.replace(btnRegex, '').trim();
    return { cleanText, buttons };
}

// ─── Session ID generator ───────────────────────────────────────────────────
function generateSessionId() {
    return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function ChatBot() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const sessionId = useRef<string>(generateSessionId());

    // AI Master Mode — switches entire widget to AI Master
    const [isMasterMode, setIsMasterMode] = useState(false);
    const [masterModeLabel, setMasterModeLabel] = useState('');

    const [messages, setMessages] = useState<Message[]>([
        { id: 'welcome-1', role: 'assistant', content: 'Hi! I\'m the AI assistant for Indonesian Visas. How can I help you today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [localInput, setLocalInput] = useState('');
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const dismissed = sessionStorage.getItem('chat_dismissed') === 'true';
        if (dismissed) setIsDismissed(true);
    }, []);

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation();
        sessionStorage.setItem('chat_dismissed', 'true');
        setIsDismissed(true);
    };

    // AI Master Mode — switches entire widget to AI Master
    // Support two formats: 
    // 1. @AI_Master [passphrase] (Legacy)
    // 2. @BossBayu2026 @Ai_Master "command" (New / Advanced)
    const MASTER_TRIGGER_LEGACY = /^@AI_Master\s+(\S+)\s*$/i;
    const BOSS_MODE_TRIGGER = /(@BossBayu2026|@BayuBoss2026)\s+@Ai_Master\s+"([^"]+)"/i;

    const handleSend = async () => {
        if (!localInput || !localInput.trim()) return;
        const userMsgText = localInput.trim();
        setLocalInput('');
        setIsLoading(true);

        // 1. Advanced Boss Mode Trigger (@BossBayu2026 @Ai_Master "command")
        const bossMatch = userMsgText.match(BOSS_MODE_TRIGGER);
        if (bossMatch) {
            const command = bossMatch[2];
            setIsMasterMode(true);
            setMasterModeLabel('🔐 BOSS MODE ACTIVE');
            setMessages(prev => [...prev,
                { id: Date.now().toString(), role: 'user', content: userMsgText },
                {
                    id: (Date.now() + 1).toString(), role: 'assistant', content:
                        '🔐 **Boss Mode activated via Secret Code.**\n\nGreetings, Boss. Redirecting your command to AI Master...',
                    isMasterMode: true
                }
            ]);
            
            // Immediately send the command as if it were a follow-up
            setTimeout(() => {
                sendChatMessageAsAI(command);
            }, 500);
            setIsLoading(false);
            return;
        }

        // 2. Legacy Check for @AI_Master [passphrase] mode switch
        const modeMatch = userMsgText.match(MASTER_TRIGGER_LEGACY);
        if (modeMatch) {
            const pass = modeMatch[1];
            // Verify passphrase with server
            try {
                const checkRes = await fetch('/api/ai-master/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ passphrase: pass })
                });
                if (checkRes.ok) {
                    setIsMasterMode(true);
                    setMasterModeLabel('🔐 AI MASTER MODE ACTIVE');
                    setMessages(prev => [...prev,
                        { id: Date.now().toString(), role: 'user', content: userMsgText },
                        {
                            id: (Date.now() + 1).toString(), role: 'assistant', content:
                                '🔐 **AI Master Mode activated.**\n\nGreetings, Boss. I am now in direct communication mode. All subsequent messages will be routed to AI Master. Type `exit` to return to normal mode.',
                            isMasterMode: true
                        }
                    ]);
                } else {
                    setMessages(prev => [...prev,
                        { id: Date.now().toString(), role: 'user', content: userMsgText },
                        { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Hi! How can I assist you with Indonesian visas today?' }
                    ]);
                }
            } catch { }
            setIsLoading(false);
            return;
        }

        // Check for exit from master mode
        if (isMasterMode && userMsgText.toLowerCase() === 'exit') {
            setIsMasterMode(false);
            setMasterModeLabel('');
            setMessages(prev => [...prev,
            { id: Date.now().toString(), role: 'user', content: userMsgText },
            { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Returning to normal seller mode. How can I help your customers today?' }
            ]);
            setIsLoading(false);
            return;
        }

        // Add user message
        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userMsgText };
        const assistantMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, userMsg, { id: assistantMsgId, role: 'assistant', content: '' }]);

        try {
            const apiEndpoint = isMasterMode ? '/api/ai-master/chat' : '/api/chat';
            const historyForAPI = messages.filter(m => m.role === 'user' || m.role === 'assistant')
                .map(m => ({ role: m.role, content: m.content }));

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...historyForAPI, { role: 'user', content: userMsgText }],
                    sessionId: sessionId.current,
                    ...(isMasterMode && { agentId: 'ai_master' })
                })
            });

            if (!response.ok) throw new Error(response.statusText);

            if (isMasterMode) {
                // AI Master returns JSON, not a stream
                const data = await response.json();
                const aiText = data.text || '✅ Command received.';
                setMessages(prev => prev.map(m => m.id === assistantMsgId
                    ? { ...m, content: aiText, isMasterMode: true }
                    : m
                ));
            } else {
                // Seller returns a stream — read it and parse buttons at end
                if (!response.body) throw new Error('No response body');
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let accumulatedContent = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    accumulatedContent += decoder.decode(value, { stream: true });
                    setMessages(prev => prev.map(m => m.id === assistantMsgId
                        ? { ...m, content: accumulatedContent }
                        : m
                    ));
                }

                // Parse out any [BTN:...] action buttons
                const { cleanText, buttons } = parseButtons(accumulatedContent);
                if (buttons.length > 0) {
                    setMessages(prev => prev.map(m => m.id === assistantMsgId
                        ? { ...m, content: cleanText, buttons }
                        : m
                    ));
                }
            }

            // Analytics
            try { (window as any).gtag?.('event', 'ai_chat_query', { event_category: 'engagement' }); } catch { }

        } finally {
            setIsLoading(false);
        }
    };

    // Helper to send message as AI Master (Internal)
    const sendChatMessageAsAI = async (content: string) => {
        setIsLoading(true);
        const assistantMsgId = Date.now().toString();
        setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '', isMasterMode: true }]);

        try {
            const historyForAPI = messages.filter(m => m.role === 'user' || m.role === 'assistant')
                .map(m => ({ role: m.role, content: m.content }));

            const response = await fetch('/api/ai-master/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...historyForAPI, { role: 'user', content }],
                    agentId: 'ai_master',
                    sessionId: sessionId.current
                })
            });

            if (!response.ok) throw new Error(response.statusText);

            const data = await response.json();
            const aiText = data.text || '✅ Command executed.';
            setMessages(prev => prev.map(m => m.id === assistantMsgId
                ? { ...m, content: aiText, isMasterMode: true }
                : m
            ));
        } catch (error) {
            console.error("Master Mode error:", error);
            setMessages(prev => prev.map(m => m.id === assistantMsgId
                ? { ...m, content: "Master System Error. Please check logs.", isMasterMode: true }
                : m
            ));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); handleSend(); }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    if (isDismissed) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end print:hidden group">
            {!isOpen && (
                <button 
                    onClick={handleDismiss}
                    className="absolute -top-2 -left-2 bg-gray-900/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-white/20"
                    title="Hide for this session"
                >
                    <X size={10} />
                </button>
            )}
            {isOpen && (
                <div className="bg-white dark:bg-gray-900 w-80 h-[480px] rounded-2xl shadow-2xl mb-4 border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden animate-fade-in-up">

                    {/* Header */}
                    <div className={`p-4 flex items-center justify-between text-white shadow-md transition-all ${isMasterMode
                        ? 'bg-gradient-to-r from-purple-900 to-indigo-900'
                        : 'bg-[#0f172a]'}`}>
                        <div className="flex items-center gap-2">
                            {isMasterMode
                                ? <ShieldAlert size={20} className="text-purple-300" />
                                : <Bot size={20} className="text-white" />}
                            <div>
                                <span className="font-bold text-sm block">
                                    {isMasterMode ? 'AI MASTER' : 'Indonesian Visas AI'}
                                </span>
                                {isMasterMode && (
                                    <span className="text-[10px] text-purple-300 font-mono">SECURE CHANNEL ACTIVE</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isMasterMode && (
                                <button
                                    onClick={() => { setIsMasterMode(false); setMasterModeLabel(''); }}
                                    className="text-[10px] text-purple-300 hover:text-white border border-purple-500 rounded px-2 py-0.5"
                                >exit</button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full text-white transition-colors" aria-label="Close Chat">
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50" role="log" aria-live="polite">
                        {messages.map((msg: any) => (
                            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${msg.role === 'user'
                                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-br-none font-medium'
                                    : msg.isMasterMode
                                        ? 'bg-gradient-to-br from-purple-900 to-indigo-800 text-purple-100 border border-purple-700 rounded-bl-none shadow-sm font-mono text-xs'
                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none shadow-sm'
                                    }`}>
                                    {msg.content}
                                </div>

                                {/* Action Buttons rendered below the message */}
                                {msg.buttons && msg.buttons.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[88%]">
                                        {msg.buttons.map((btn: ActionButton, i: number) => (
                                            <a
                                                key={i}
                                                href={btn.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 ${btn.type === 'whatsapp'
                                                    ? 'bg-green-500 text-white border-green-600 hover:bg-green-600'
                                                    : btn.type === 'primary'
                                                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white border-orange-400'
                                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {btn.type === 'whatsapp' ? <Phone size={11} /> : <ExternalLink size={11} />}
                                                {btn.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className={`rounded-2xl px-4 py-3 rounded-bl-none shadow-sm flex gap-1 ${isMasterMode ? 'bg-purple-900/50' : 'bg-white dark:bg-gray-800'}`}>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75" />
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className={`p-3 border-t flex gap-2 ${isMasterMode
                        ? 'bg-purple-950 border-purple-800'
                        : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'}`}>
                        <input
                            className={`flex-1 text-sm px-3 py-2 rounded-xl outline-none focus:ring-2 ${isMasterMode
                                ? 'bg-purple-900 text-purple-100 placeholder-purple-400 focus:ring-purple-500 font-mono'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-orange-500'}`}
                            placeholder={isMasterMode ? 'Command AI Master...' : 'Ask me anything...'}
                            value={localInput}
                            onChange={(e) => setLocalInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            aria-label="Chat message input"
                        />
                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={isLoading || !localInput.trim()}
                            className={`p-2 rounded-xl text-white transition-all shadow-md active:scale-95 disabled:opacity-50 ${isMasterMode
                                ? 'bg-purple-600 hover:bg-purple-500'
                                : 'bg-gradient-to-br from-amber-400 to-orange-500 hover:scale-105'}`}
                            aria-label="Send Message"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        </button>
                    </div>
                </div>
            )}

            {/* Launcher Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white h-14 px-6 rounded-full flex items-center gap-3 shadow-[0_8px_30px_rgb(251,191,36,0.4)] hover:scale-105 transition-all bg-gradient-to-br from-amber-400 to-orange-500"
                aria-label={isOpen ? "Close Chatbot" : "Open Chatbot"}
                aria-expanded={isOpen}
            >
                {isOpen ? <X size={24} /> : (
                    <>
                        <span className="font-bold text-sm tracking-wide">Visas</span>
                        <MessageCircle size={24} />
                    </>
                )}
            </button>
        </div>
    );
}
