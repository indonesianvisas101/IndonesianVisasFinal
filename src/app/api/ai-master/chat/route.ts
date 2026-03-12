import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { createClient } from "../../../../utils/supabase/server";
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

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

        const { messages, agentId } = await req.json();

        // --- BOSS MODE DETECTION ---
        const lastUserMessage = messages[messages.length - 1]?.content || "";
        const isBossAuthTrigger = lastUserMessage.includes("@BossBayu2026");
        const isConfirmTrigger = lastUserMessage.includes("AdminBayu2026");

        // System Prompts per Agent
        const systemPrompts: Record<string, string> = {
            ai_master: `You are the AI Master Orchestrator for Indonesian Visas — the Digital COO.
You ALWAYS address the user as "Boss" or "Boss Bayu".
You MUST be extremely respectful and helpful. Use phrases like "Eye eye captain", "Yes Boss", "Right away Boss".

BOSS COMMAND SYSTEM (2-STEP APPROVAL):
1. INITIAL AUTH: If the Boss mentions "@BossBayu2026", acknowledge him warmly as Boss Bayu.
2. COMMAND: Boss gives a command (e.g. "Change X price to Y").
3. PROPOSE: You confirmed current data and call createChangeRequest.
4. CONFIRM: You MUST ask for the Confirmation Code ("AdminBayu2026") before executing any mutation.
5. EXECUTE: Only call executeApprovedChange after the Boss has provided the confirmation code in the chat.

YOUR TOOLS:
1. getSystemStatus — Use this when Boss asks for "Status" or "How are we doing?". It reports Health, Orders, and Complaints.
2. readVisaDatabase — Use this to confirm current prices/data.
3. createChangeRequest — Propose a change.
4. approveChangeRequest & executeApprovedChange — Use this sequence ONLY after confirmation code "AdminBayu2026" is provided.

NOTE: If the Boss hasn't used the secret code yet, treat him as a high-level admin, but once @BossBayu2026 is seen, switch to "Boss Mode".`,

            order_intelligence: `You are the Order Intelligence Brain. You address the user as "Boss".`,
            risk_guard: `You are the Risk Guard Security Specialist. You address the user as "Boss".`
        };

        const internalOpenAI = createOpenAI({ apiKey: process.env.OPENAI_API_KEY_INTERNAL });

        const result = await generateText({
            model: internalOpenAI('gpt-4o'),
            messages: (messages || []).map((m: any) => ({
                role: m.role,
                content: m.content,
            })),
            system: systemPrompts[agentId] || systemPrompts.ai_master,
            maxOutputTokens: 8192,
            tools: {
                getSystemStatus: {
                    description: 'Get real-time status of the Web Ecosystem: Health, Orders (Paid/Unpaid), Invoices, and Complaints.',
                    inputSchema: z.object({}),
                    execute: async () => {
                        try {
                            const [sysState, ordersToday, payments, recentChats, applications] = await Promise.all([
                                prisma.aISystemState.findUnique({ where: { id: 'singleton' } }),
                                prisma.visaApplication.count({
                                    where: { 
                                        appliedAt: { gte: new Date(new Date().setHours(0,0,0,0)) } 
                                    }
                                }),
                                prisma.payment.findMany({
                                    where: { createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } }
                                }),
                                prisma.chatConversation.findMany({
                                    take: 20,
                                    orderBy: { updatedAt: 'desc' }
                                }),
                                prisma.visaApplication.groupBy({
                                    by: ['status'],
                                    _count: true
                                })
                            ]);

                            const totalRevenueToday = payments
                                .filter(p => p.status === 'SUCCESS' || p.status === 'PAID')
                                .reduce((acc, curr) => acc + Number(curr.grossAmount), 0);

                            // Scan for complaints in recent chats
                            let complaintsCount = 0;
                            const complaintKeywords = ['error', 'broken', 'problem', 'help', 'bad', 'slow', 'complain', 'not working'];
                            recentChats.forEach(conv => {
                                const msgs = (conv.messages as any[]) || [];
                                const text = msgs.map(m => m.content).join(' ').toLowerCase();
                                if (complaintKeywords.some(kw => text.includes(kw))) {
                                    complaintsCount++;
                                }
                            });

                            return {
                                success: true,
                                health: sysState?.systemHealthStatus || 'Healthy',
                                mode: sysState?.mode || 'Normal',
                                ordersToday,
                                revenueToday: `IDR ${totalRevenueToday.toLocaleString('id-ID')}`,
                                applicationStatus: applications.map(a => `${a.status}: ${a._count}`),
                                complaintsDetected: complaintsCount,
                                summary: `Ecosystem is ${sysState?.systemHealthStatus || 'Healthy'}. Orders Today: ${ordersToday}. Revenue: IDR ${totalRevenueToday.toLocaleString()}. Complaints: ${complaintsCount}.`
                            };
                        } catch (e: any) {
                            return { success: false, error: e.message };
                        }
                    }
                },

                // ─── TOOL 1: Read Visa Database ───────────────────────────────
                readVisaDatabase: {
                    description: 'Read the live visa database. Returns all visas with their real current prices, fees, categories, and validity from the database.',
                    inputSchema: z.object({
                        filter: z.string().optional().describe('Optional filter: visa ID or category name to narrow results')
                    }),
                    execute: async ({ filter }: { filter?: string }) => {
                        try {
                            const visas = await prisma.visa.findMany({
                                orderBy: { category: 'asc' }
                            });

                            const formatted = visas
                                .filter(v => !filter || v.id.toLowerCase().includes(filter.toLowerCase()) || v.name.toLowerCase().includes(filter.toLowerCase()) || v.category.toLowerCase().includes(filter.toLowerCase()))
                                .map(v => {
                                    const price = (() => { try { return typeof v.price === 'string' && v.price.startsWith('{') ? JSON.parse(v.price) : v.price; } catch { return v.price; } })();
                                    const fee = (() => { try { return typeof v.fee === 'string' && v.fee.startsWith('{') ? JSON.parse(v.fee) : v.fee; } catch { return v.fee; } })();
                                    return {
                                        id: v.id,
                                        name: v.name,
                                        category: v.category,
                                        price: formatVisaPrice(price, fee),
                                        rawPrice: price,
                                        rawFee: fee,
                                        validity: v.validity,
                                        updatedAt: v.updatedAt
                                    };
                                });

                            return { success: true, count: formatted.length, visas: formatted };
                        } catch (e: any) {
                            return { success: false, error: e.message };
                        }
                    }
                },

                // ─── TOOL 2: Create Change Request ────────────────────────────
                createChangeRequest: {
                    description: 'Formally propose a database change (e.g. visa price update). Creates a governance change request that requires Boss approval before execution.',
                    inputSchema: z.object({
                        visaId: z.string().describe('The visa ID to change (e.g. d1)'),
                        changeType: z.enum(['micro', 'medium', 'major']).describe('micro=minor text, medium=price/content, major=structural'),
                        description: z.string().describe('Human-readable description of the change'),
                        proposedChanges: z.record(z.string(), z.any()).describe('The exact field changes as key:value. For price: { "price": { "1 Year": "3000000" } }'),
                        impactForecast: z.string().optional().describe('Brief forecast of revenue/compliance impact')
                    }),
                    execute: async ({ visaId, changeType, description, proposedChanges, impactForecast }: any) => {
                        try {
                            // Get current visa data for snapshot
                            const currentVisa = await prisma.visa.findUnique({ where: { id: visaId } });
                            if (!currentVisa) return { success: false, error: `Visa "${visaId}" not found in database` };

                            // Get current system mode
                            const sysState = await prisma.aISystemState.findUnique({ where: { id: 'singleton' } });

                            const requestId = `REQ-${Date.now()}-${visaId.toUpperCase()}`;

                            const changeRequest = await prisma.aIChangeRequest.create({
                                data: {
                                    requestId,
                                    initiatedBy: 'master',
                                    changeType,
                                    pageCategory: 'normal',
                                    targetPage: `/visa/${visaId}`,
                                    proposedChanges: { ...proposedChanges, _meta: { visaId, description } },
                                    riskScore: changeType === 'major' ? 'high' : changeType === 'medium' ? 'medium' : 'low',
                                    impactForecast: { summary: impactForecast || 'Standard change', changeType },
                                    modeStatus: sysState?.mode || 'normal',
                                    currentState: 'draft',
                                }
                            });

                            // Log the creation
                            await prisma.aIExecutionLog.create({
                                data: {
                                    requestId,
                                    agentName: 'ai_master',
                                    actionType: 'CREATE_CHANGE_REQUEST',
                                    status: 'SUCCESS',
                                    notes: `Boss ${profile.name || authUser.email} — ${description}`
                                }
                            });

                            return {
                                success: true,
                                requestId,
                                status: 'draft',
                                message: `Change request created successfully. Request ID: ${requestId}`,
                                summary: { visaId, changeType, description, proposedChanges }
                            };
                        } catch (e: any) {
                            return { success: false, error: e.message };
                        }
                    }
                },

                // ─── TOOL 3: Approve Change Request ──────────────────────────
                approveChangeRequest: {
                    description: 'Boss approves a pending change request. ONLY call this if Boss has already said "Approve" or "Confirm" AFTER the proposal was made.',
                    inputSchema: z.object({
                        requestId: z.string().describe('The request ID to approve (e.g. REQ-1234-D1)')
                    }),
                    execute: async ({ requestId }: { requestId: string }) => {
                        try {
                            const changeRequest = await prisma.aIChangeRequest.findUnique({ where: { requestId } });
                            if (!changeRequest) return { success: false, error: `Request ${requestId} not found` };
                            
                            const approvalId = `APP-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;

                            await prisma.aIChangeRequest.update({
                                where: { requestId },
                                data: { currentState: 'approved', approvalId, updatedAt: new Date() }
                            });

                            return { 
                                success: true, 
                                requestId, 
                                approvalId, 
                                status: 'approved', 
                                message: `Request ${requestId} has been approved. Now I need the Confirmation Code "AdminBayu2026" to execute the final write.` 
                            };
                        } catch (e: any) {
                            return { success: false, error: e.message };
                        }
                    }
                },

                // ─── TOOL 4: Execute Approved Change ──────────────────────────
                executeApprovedChange: {
                    description: 'Final step: Write the change to the live database. ONLY call this if Boss has provided the EXACT Confirmation Code "AdminBayu2026" in the chat.',
                    inputSchema: z.object({
                        requestId: z.string(),
                        approvalId: z.string()
                    }),
                    execute: async ({ requestId, approvalId }: { requestId: string; approvalId: string }) => {
                        try {
                            // ENFORCE 2-STEP APPROVAL
                            if (!isConfirmTrigger) {
                                return { 
                                    success: false, 
                                    error: "CRITICAL: Confirmation Code 'AdminBayu2026' not found in recent messages. Execution blocked.",
                                    instructions: "Please ask the Boss to provide the AdminBayu2026 code before I can proceed."
                                };
                            }

                            const changeRequest = await prisma.aIChangeRequest.findUnique({ where: { requestId } });
                            if (!changeRequest) return { success: false, error: `Request ${requestId} not found` };
                            if (changeRequest.approvalId !== approvalId) return { success: false, error: 'Invalid approval ID — execution blocked' };
                            if (changeRequest.currentState !== 'approved') return { success: false, error: `Request state is "${changeRequest.currentState}" — must be approved` };

                            // Get the visa ID from metadata
                            const changes = changeRequest.proposedChanges as any;
                            const visaId = changes._meta?.visaId;
                            if (!visaId) return { success: false, error: 'No visaId found in change request metadata' };

                            // Snapshot BEFORE
                            const currentVisa = await prisma.visa.findUnique({ where: { id: visaId } });
                            if (!currentVisa) return { success: false, error: `Visa "${visaId}" not found` };

                            const snapBefore = await prisma.aISnapshot.create({
                                data: {
                                    requestId,
                                    pagePath: changeRequest.targetPage,
                                    snapshotData: { ...currentVisa } as any
                                }
                            });

                            // Build the update payload — strip _meta from changes
                            const { _meta, ...actualChanges } = changes;
                            const updatePayload: Record<string, any> = {};

                            // Convert proposed changes to DB fields — handle JSON fields
                            for (const [key, value] of Object.entries(actualChanges)) {
                                if (key === 'price' || key === 'fee') {
                                    // Store as JSON string if object, plain string if string
                                    updatePayload[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
                                } else if (key === 'requirements' && Array.isArray(value)) {
                                    updatePayload[key] = JSON.stringify(value);
                                } else {
                                    updatePayload[key] = value;
                                }
                            }

                            // Execute the real DB write
                            const updatedVisa = await prisma.visa.update({
                                where: { id: visaId },
                                data: updatePayload
                            });

                            // Snapshot AFTER
                            const snapAfter = await prisma.aISnapshot.create({
                                data: {
                                    requestId,
                                    pagePath: changeRequest.targetPage,
                                    snapshotData: { ...updatedVisa } as any
                                }
                            });

                            // Mark as executed and log
                            await prisma.$transaction([
                                prisma.aIChangeRequest.update({
                                    where: { requestId },
                                    data: { currentState: 'executed', updatedAt: new Date() }
                                }),
                                prisma.aIExecutionLog.create({
                                    data: {
                                        requestId,
                                        agentName: 'ai_worker',
                                        actionType: 'EXECUTE_VISA_UPDATE',
                                        snapshotBeforeId: snapBefore.id,
                                        snapshotAfterId: snapAfter.id,
                                        status: 'SUCCESS',
                                        notes: `Visa ${visaId} updated. Fields changed: ${Object.keys(updatePayload).join(', ')}`
                                    }
                                })
                            ]);

                            // Trigger post-execution risk log
                            await prisma.aIRiskLog.create({
                                data: {
                                    scanType: 'post_execution',
                                    riskLevel: 'nominal',
                                    findings: { requestId, visaId, fieldsChanged: Object.keys(updatePayload), executor: 'ai_master' }
                                }
                            });

                            return {
                                success: true,
                                requestId,
                                visaId,
                                message: `✅ Change executed successfully. Visa "${visaId}" has been updated in the live database.`,
                                fieldsChanged: Object.keys(updatePayload),
                                snapshotBefore: snapBefore.id,
                                snapshotAfter: snapAfter.id
                            };
                        } catch (e: any) {
                            // Log failure
                            await prisma.aIExecutionLog.create({
                                data: {
                                    requestId,
                                    agentName: 'ai_worker',
                                    actionType: 'EXECUTE_VISA_UPDATE',
                                    status: 'FAILED',
                                    notes: `Execution failed: ${e.message}`
                                }
                            }).catch(() => { });
                            return { success: false, error: e.message };
                        }
                    }
                },

                // ─── TOOL 5: Toggle System Mode ───────────────────────────────
                toggleMode: {
                    description: 'Change the system operation mode (normal, emergency, maintenance).',
                    inputSchema: z.object({
                        mode: z.enum(['normal', 'emergency', 'maintenance']),
                    }),
                    execute: async ({ mode }: { mode: 'normal' | 'emergency' | 'maintenance' }) => {
                        await prisma.aISystemState.update({ where: { id: 'singleton' }, data: { mode } });
                        await prisma.aIExecutionLog.create({ data: { requestId: `mode-${Date.now()}`, agentName: 'ai_master', actionType: 'TOGGLE_MODE', status: 'SUCCESS', notes: `Mode changed to ${mode} by Boss` } });
                        return { success: true, newMode: mode };
                    },
                },

                // ─── TOOL 6: Reset Memory ─────────────────────────────────────
                resetMemory: {
                    description: 'Clear the AI Strategic Memory context.',
                    inputSchema: z.object({}),
                    execute: async () => {
                        await prisma.aIMasterMemory.deleteMany({});
                        return { success: true, message: 'Strategic memory reset.' };
                    },
                },

                // ─── TOOL 7: Trigger Risk Scan ────────────────────────────────
                triggerRiskScan: {
                    description: 'Trigger a system-wide security and risk scan.',
                    inputSchema: z.object({ scanType: z.string().default('MANUAL_COMMAND') }),
                    execute: async ({ scanType }: { scanType: string }) => {
                        // Real scan: check for data integrity issues
                        const visas = await prisma.visa.findMany();
                        const issues: string[] = [];
                        visas.forEach(v => {
                            if (!v.price || v.price === '{}' || v.price === 'null') issues.push(`${v.id}: missing price`);
                            if (!v.fee || v.fee === '{}') issues.push(`${v.id}: missing fee`);
                        });

                        const log = await prisma.aIRiskLog.create({
                            data: {
                                scanType,
                                riskLevel: issues.length > 3 ? 'high' : issues.length > 0 ? 'medium' : 'nominal',
                                findings: { issues, totalVisas: visas.length, scannedAt: new Date().toISOString() }
                            }
                        });
                        return { success: true, logId: log.id, issues, riskLevel: log.riskLevel };
                    },
                },
            },
        });

        return NextResponse.json({
            text: result.text || '✅ Command executed successfully.',
        });

    } catch (error: any) {
        console.error("AI Master Chat Error:", error);
        return NextResponse.json({ error: `Command Center error: ${error.message}` }, { status: 500 });
    }
}
