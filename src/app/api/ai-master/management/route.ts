import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");
        const internalKey = process.env.OPENAI_API_KEY_INTERNAL;
        const isInternal = authHeader === `Bearer ${internalKey}`;

        if (!isInternal) {
            const supabase = await createClient();
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

            const profile = await prisma.user.findUnique({
                where: { id: authUser.id },
                select: { role: true }
            });
            if (!profile || profile.role !== 'admin') {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
        }

        // Fetch System State
        let systemState = await prisma.aISystemState.findUnique({ where: { id: 'singleton' } });
        if (!systemState) {
            systemState = await prisma.aISystemState.create({
                data: { id: 'singleton', mode: 'normal' }
            });
        }

        // Fetch Pending Requests
        const pendingRequests = await prisma.aIChangeRequest.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        // Fetch Recent Risk Logs
        const riskLogs = await prisma.aIRiskLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        // Fetch Recent Execution Logs
        const executionLogs = await prisma.aIExecutionLog.findMany({
            orderBy: { executionTimestamp: 'desc' },
            take: 5
        });

        // 5. Fetch Immigration Updates (News)
        const immigrationUpdates = await prisma.immigrationUpdate.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        // 6. Fetch Knowledge Pages (AI Generated Articles)
        const knowledgePages = await prisma.knowledgePage.findMany({
            include: {
                quality: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        // 7. Cluster Orchestration Summary (for transparency of 3,000+ pages)
        const clusterSummary = {
            totalClusters: 19,
            averageVisasPerCluster: 161,
            totalStaticPages: 3059,
            lastGlobalSync: systemState?.updatedAt
        };

        // 8. Fetch VVIP Manual Queue
        const vvipQueue = await prisma.aITopicHistory.findMany({
            where: { sourceAgent: 'master_admin' },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        // 9. GET_PAGE (Special retrieval for Edit Modal)
        const url = new URL(request.url);
        const action = url.searchParams.get('action');
        if (action === 'GET_PAGE') {
            const id = url.searchParams.get('id');
            const type = url.searchParams.get('type');
            if (!id || !type) return NextResponse.json({ error: "ID dan Tipe diperlukan" }, { status: 400 });

            if (type === 'KNOWLEDGE') {
                const page = await prisma.knowledgePage.findUnique({ where: { id } });
                return NextResponse.json({ success: true, page: { ...page, content: typeof page?.content === 'string' ? page.content : JSON.stringify(page?.content, null, 2) } });
            } else {
                const page = await prisma.immigrationUpdate.findUnique({ where: { id } });
                return NextResponse.json({ success: true, page });
            }
        }

        return NextResponse.json({
            systemState,
            pendingRequests,
            riskLogs,
            executionLogs,
            knowledgePages,
            immigrationUpdates,
            clusterSummary
        });

    } catch (error: any) {
        console.error("AI Master Management Error:", error);
        return NextResponse.json({ error: "Failed to fetch management data" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const profile = await prisma.user.findUnique({
            where: { id: authUser.id },
            select: { role: true }
        });
        if (!profile || profile.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { action, data } = body;

        // --- AUDIT LOG HELPER [HARDENING v1] ---
        const logAction = async (actionName: string, details: string) => {
            await prisma.auditLog.create({
                data: {
                    adminId: authUser.id,
                    action: actionName,
                    metadata: {
                        details: details,
                        ipAddress: request.headers.get("x-forwarded-for") || "unknown"
                    }
                }
            }).catch(err => console.error("Audit Logging Failed:", err));
        };

        if (action === 'TOGGLE_MODE') {
            const newState = await prisma.aISystemState.update({
                where: { id: 'singleton' },
                data: { mode: data.mode }
            });
            await logAction("AI_MODE_CHANGE", `System mode set to: ${data.mode}`);
            return NextResponse.json(newState);
        }

        if (action === 'APPROVE_REQUEST') {
            const requestId = data.requestId;

            const existing = await prisma.aIChangeRequest.findUnique({ where: { requestId } });
            if (existing?.currentState === 'approved' || existing?.currentState === 'completed') {
                return NextResponse.json({ error: "Request is already in progress or completed." }, { status: 400 });
            }

            await prisma.aIChangeRequest.update({
                where: { requestId },
                data: { currentState: 'approved' }
            });
            
            await logAction("AI_REQUEST_APPROVE", `Approved discovery ID: ${requestId}`);

            // 2. Trigger the AI Worker
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const workerRes = await fetch(`${appUrl}/api/ai-worker/execute`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY_INTERNAL}`
                },
                body: JSON.stringify({ requestId })
            });

            const workerResult = await workerRes.json();
            return NextResponse.json({ success: workerRes.ok, ...workerResult });
        }

        if (action === 'REJECT_REQUEST') {
            const requestId = data.requestId;
            await prisma.aIChangeRequest.update({
                where: { requestId },
                data: { currentState: 'rejected' }
            });
            await logAction("AI_REQUEST_REJECT", `Rejected discovery ID: ${requestId}`);
            return NextResponse.json({ success: true, message: "Request rejected" });
        }

        if (action === 'RUN_ANALYTICS') {
            const { TOPIC_SCHEDULER } = await import('@/ai/topic-discovery/topicScheduler');
            await TOPIC_SCHEDULER.runDailyOrchestration();
            return NextResponse.json({ success: true, message: "AI Analytics Orchestration triggered successfully." });
        }

        if (action === 'DELETE_PAGE') {
            const { id } = data;
            if (!id) return NextResponse.json({ error: "Page ID required" }, { status: 400 });
            
            await prisma.knowledgePage.delete({
                where: { id }
            });
            await logAction("CONTENT_DELETE", `Deleted Knowledge Page ID: ${id}`);
            return NextResponse.json({ success: true, message: "Page deleted successfully" });
        }

        if (action === 'UPDATE_TOPIC') {
            const { id, topic, type } = data;
            if (!id || !type) return NextResponse.json({ error: "Missing ID or Type" }, { status: 400 });

            if (type === 'KNOWLEDGE') {
                const existing = await prisma.knowledgePage.findUnique({ where: { id } });
                const currentMeta = (existing?.metadata as any) || {};
                
                await prisma.knowledgePage.update({
                    where: { id },
                    data: { 
                        metadata: { 
                            ...currentMeta, 
                            topic: topic 
                        } 
                    }
                });
            } else {
                await prisma.immigrationUpdate.update({
                    where: { id },
                    data: { category: topic }
                });
            }

            return NextResponse.json({ success: true, message: "Topic updated successfully" });
        }

        if (action === 'DELETE_VVIP_TOPIC') {
            const { id } = data;
            if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
            await prisma.aITopicHistory.delete({ where: { id } });
            return NextResponse.json({ success: true, message: "Topic removed from VVIP queue." });
        }

        if (action === 'ADD_MANUAL_TOPIC') {
            const { topic } = data;
            if (!topic) return NextResponse.json({ error: "Topic required" }, { status: 400 });

            // Create a unique slug for the topic
            const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

            const newTopic = await prisma.aITopicHistory.create({
                data: {
                    topicTitle: topic,
                    topicSlug: slug,
                    topicCluster: 'manual_vvip',
                    sourceAgent: 'master_admin',
                    status: 'vvip_queued'
                }
            });

            return NextResponse.json({ success: true, topic: newTopic });
        }

        if (action === 'UPDATE_PAGE_CONTENT') {
            const { id, title, content, summary, category, image, type } = data;
            if (!id || !type) return NextResponse.json({ error: "ID and Type required" }, { status: 400 });

            if (type === 'KNOWLEDGE') {
                // Try to parse content as JSON if it looks like JSON, otherwise store as raw string in content field
                let finalContent = content;
                try {
                    if (typeof content === 'string' && (content.startsWith('{') || content.startsWith('['))) {
                        finalContent = JSON.parse(content);
                    }
                } catch (e) { /* keep as string if parse fails */ }

                await prisma.knowledgePage.update({
                    where: { id },
                    data: {
                        title,
                        content: finalContent,
                        category,
                        metadata: {
                            ...(await prisma.knowledgePage.findUnique({ where: { id } }).then(p => p?.metadata as any || {})),
                            image: image, // Save featured image in metadata
                            summary: summary // Save summary in metadata
                        }
                    }
                });
            } else {
                await prisma.immigrationUpdate.update({
                    where: { id },
                    data: {
                        title,
                        content,
                        summary,
                        category,
                        image
                    }
                });
            }
            await logAction("CONTENT_UPDATE", `Updated ${type} Page ID: ${id} - Title: ${title}`);
            return NextResponse.json({ success: true, message: "Master, content updated successfully." });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error: any) {
        console.error("AI Master Management POST Error:", error);
        return NextResponse.json({ error: "Management action failed" }, { status: 500 });
    }
}
