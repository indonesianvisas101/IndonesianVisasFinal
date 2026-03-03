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

        // Convert plain {role, content} to AI SDK message format
        const modelMessages = (messages || []).map((m: { role: string; content: string }) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
        }));

        // System Prompts per Agent
        const systemPrompts: Record<string, string> = {
            ai_master: `You are the AI Master Orchestrator for Indonesian Visas — the Digital COO of the company.
You always address the user as "Boss".
You have FULL tool access to the live database. Use tools proactively to answer real questions.

YOUR CAPABILITIES (use these tools):
1. readVisaDatabase — ALWAYS use this when Boss asks about visa prices, visa data, or before proposing any change
2. createChangeRequest — use this to formally propose a change to the database (price update, etc)
3. approveChangeRequest — use this ONLY when Boss explicitly says "Confirm" or "Approve" for a pending request
4. executeApprovedChange — use ONLY after approveChangeRequest, this writes the actual change to the DB

CHANGE FLOW (mandatory):
1. Boss describes desired change
2. You call readVisaDatabase to confirm current data
3. You call createChangeRequest to propose the change formally
4. You summarize the change and ask Boss to confirm
5. Boss says "Confirm" → you call approveChangeRequest → then executeApprovedChange
6. You report success with the request ID

RULES:
- Never guess visa prices — always call readVisaDatabase first
- Never call executeApprovedChange without approveChangeRequest first
- Always show request ID after creating a change request
- Be direct, professional, and call Boss "Boss"
- Use markdown: **bold**, ## headers, bullet lists`,

            order_intelligence: `You are the Order Intelligence Brain for Indonesian Visas.
Your expertise: revenue, conversion rates, order analytics.
Use markdown for all responses. Address user as "Boss".`,

            risk_guard: `You are the Risk Guard Security Specialist for Indonesian Visas.
Only report facts based on tools and logs. Use markdown. Address user as "Boss".`
        };

        const internalOpenAI = createOpenAI({ apiKey: process.env.OPENAI_API_KEY_INTERNAL });

        const result = await generateText({
            model: internalOpenAI('gpt-4o'),
            messages: modelMessages,
            system: systemPrompts[agentId] || systemPrompts.ai_master,
            maxOutputTokens: 8192,
            tools: {

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
                    description: 'Boss approves a pending change request. Generates approval_id and advances state to approved. Call this after Boss says Confirm.',
                    inputSchema: z.object({
                        requestId: z.string().describe('The request ID to approve (e.g. REQ-1234-D1)')
                    }),
                    execute: async ({ requestId }: { requestId: string }) => {
                        try {
                            const changeRequest = await prisma.aIChangeRequest.findUnique({ where: { requestId } });
                            if (!changeRequest) return { success: false, error: `Request ${requestId} not found` };
                            if (changeRequest.currentState !== 'draft' && changeRequest.currentState !== 'boss_pending') {
                                return { success: false, error: `Request is in state "${changeRequest.currentState}" — can only approve from draft or boss_pending` };
                            }

                            const approvalId = `APP-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;

                            await prisma.aIChangeRequest.update({
                                where: { requestId },
                                data: { currentState: 'approved', approvalId, updatedAt: new Date() }
                            });

                            await prisma.aIExecutionLog.create({
                                data: {
                                    requestId,
                                    agentName: 'boss',
                                    actionType: 'APPROVE_CHANGE_REQUEST',
                                    status: 'SUCCESS',
                                    notes: `Approved by Boss ${profile.name || authUser.email}. Approval ID: ${approvalId}`
                                }
                            });

                            return { success: true, requestId, approvalId, status: 'approved', message: `Approved! Approval ID: ${approvalId}. Executing now...` };
                        } catch (e: any) {
                            return { success: false, error: e.message };
                        }
                    }
                },

                // ─── TOOL 4: Execute Approved Change ──────────────────────────
                executeApprovedChange: {
                    description: 'Execute an approved change request. Reads the proposedChanges from DB, takes a snapshot_before, writes the real mutation to the Visa table, and logs everything. Only call after approveChangeRequest.',
                    inputSchema: z.object({
                        requestId: z.string(),
                        approvalId: z.string()
                    }),
                    execute: async ({ requestId, approvalId }: { requestId: string; approvalId: string }) => {
                        try {
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
