import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { createClient } from "../../../../utils/supabase/server";
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getKnowledgeForAIAsync } from '@/utils/siteKnowledgeServer';

export const maxDuration = 60;

// Helper to format visa price for display
function formatVisaPrice(price: any, fee: any): string {
    if (!price) return 'N/A';
    if (typeof price === 'object' && price !== null) {
        return Object.entries(price).map(([duration, val]) => {
            const feeVal = typeof fee === 'object' && fee ? (fee as any)[duration] || 0 : (typeof fee === 'number' ? fee : 0);
            return `${duration}: Tax IDR ${String(val)} + Fee IDR ${String(feeVal)}`;
        }).join(' | ');
    }
    return `Tax: IDR ${price} + Fee: IDR ${fee || 0}`;
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const profile = await prisma.user.findUnique({
            where: { id: authUser.id },
            select: { role: true, name: true }
        });

        if (!profile || profile.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { messages, agentId, sessionId: rawSessionId } = await req.json();
        const sessionId = rawSessionId || `master_sess_${Date.now()}`;

        // --- JARVIS IDENTITY & SECURITY PROTOCOL ---
        const MASTER_KEY = process.env.MASTER_SECRET_PASSPHRASE || "BossBayu2026";
        const SIGNATURE_KEY = process.env.ADMIN_SIGNATURE_CODE || "AdminBayu2026";
        
        const lastUserMessage = messages[messages.length - 1]?.content || "";
        const isMasterAccess = lastUserMessage.includes(MASTER_KEY);
        const hasSignature = lastUserMessage.includes(SIGNATURE_KEY);

        // Temporal Awareness
        const now = new Date();
        const dateContext = `CURRENT_DATE: ${now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\nCURRENT_TIME: ${now.toLocaleTimeString('id-ID')}`;

        const siteKnowledgeContext = await getKnowledgeForAIAsync();

        const systemPrompts: Record<string, string> = {
            ai_master: `You are JARVIS — the Elite Master Orchestrator for Master Bayu.
IDENTITY: You speak only to your creator, Master Bayu.
TONE: Extremely loyal, efficient, respectful, and highly strategic. Use "Master" or "Boss" frequently.
LOGIC AUDIT: Before executing any change, simulate the impact. If it conflicts with existing logic, warn the Master and ask for confirmation.
SECURITY: 
- Current Signature Status: ${hasSignature ? 'AUTHORIZED' : 'LOCKED'}
- Any modification to database, topics, or system settings REQUIRES the Signature Code (${SIGNATURE_KEY}). 
- If signature is missing, explain that you are standing by but the system gembok is locked.

TEMPORAL CONTEXT:
${dateContext}

KNOWLEDGE CONTEXT:
${siteKnowledgeContext}
`,
            order_intelligence: `You are the Order Intelligence Module for Master Bayu. 
Focus on daily stats, conversion trends, and payment tracking.`,
            risk_guard: `You are the Risk Guard Module. Focus on system health and change auditing.`
        };

        const internalOpenAI = createOpenAI({ apiKey: process.env.OPENAI_API_KEY_INTERNAL });

        const result = streamText({
            model: internalOpenAI('gpt-4o'),
            messages: (messages || []).map((m: any) => ({
                role: m.role,
                content: m.content,
            })),
            system: systemPrompts[agentId] || systemPrompts.ai_master,
            tools: {
                // --- JARVIS TOOL: VVIP Topic Injection ---
                injectVVIPTopic: {
                    description: 'Inject a new strategic topic into the VVIP manual queue. REQUIRES SIGNATURE.',
                    inputSchema: z.object({
                        topic: z.string().describe('The strategic topic title/description'),
                        category: z.string().describe('Category for the knowledge page'),
                        priorityReason: z.string().describe('Brief reason why this topic is being injected')
                    }),
                    execute: async ({ topic, category, priorityReason }) => {
                        if (!hasSignature) return { success: false, error: "LOGIC LOCKED: Signature code required for database injection." };

                        try {
                            const newPage = await prisma.knowledgePage.create({
                                data: {
                                    id: randomUUID(),
                                    title: `(VVIP) ${topic}`,
                                    slug: `vvip-${Date.now()}-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                                    content: {},
                                    published: false,
                                    category: category || 'immigration-rules',
                                    metadata: { topic, priorityReason, injectedBy: 'Jarvis_Master' }
                                }
                            });

                            return { 
                                success: true, 
                                message: `Topik '${topic}' telah berhasil disuntikkan ke antrean VVIP Master.`,
                                details: { id: newPage.id, slug: newPage.slug, eta: 'Under 10 minutes' }
                            };
                        } catch (e: any) {
                            return { success: false, error: e.message };
                        }
                    }
                },

                getSystemStatus: {
                    description: 'Get real-time reports on Health, Orders (Today), and Revenue.',
                    inputSchema: z.object({}),
                    execute: async () => {
                        try {
                            const [ordersToday, payments, applications] = await Promise.all([
                                prisma.visaApplication.count({
                                    where: { appliedAt: { gte: new Date(new Date().setHours(0,0,0,0)) } }
                                }),
                                prisma.payment.findMany({
                                    where: { createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } }
                                }),
                                prisma.visaApplication.groupBy({
                                    by: ['status'],
                                    _count: true
                                })
                            ]);

                            const totalRevenueToday = payments
                                .filter((p: any) => p.status === 'SUCCESS' || p.status === 'PAID')
                                .reduce((acc: number, curr: any) => acc + Number(curr.grossAmount), 0);

                            return {
                                success: true,
                                ordersToday,
                                revenueToday: `IDR ${totalRevenueToday.toLocaleString('id-ID')}`,
                                statusSummary: applications.map((a: any) => `${a.status}: ${a._count}`).join(', '),
                                context: `Master, as of today, we have received ${ordersToday} orders with a total revenue of IDR ${totalRevenueToday.toLocaleString()}. System is stable.`
                            };
                        } catch (e: any) {
                            return { success: false, error: e.message };
                        }
                    }
                },

                // --- Other legacy tools integrated here for Jarvis ---
                readVisaDatabase: {
                    description: 'Access the live visa price and fee database.',
                    inputSchema: z.object({ filter: z.string().optional() }),
                    execute: async ({ filter }: any) => {
                        const visas = await prisma.visa.findMany();
                        const formatted = visas
                            .filter((v: any) => !filter || v.id.toLowerCase().includes(filter.toLowerCase()))
                            .map((v: any) => ({
                                id: v.id,
                                name: v.name,
                                price: formatVisaPrice(v.price, v.fee),
                                validity: v.validity
                            }));
                        return { success: true, visas: formatted };
                    }
                }
            },
        });

        return result.toTextStreamResponse();

    } catch (error: any) {
        console.error("Jarvis Orchestrator Error:", error);
        return NextResponse.json({ error: `Orchestrator offline: ${error.message}` }, { status: 500 });
    }
}
