import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { requestId, approvalId, agentInitiator } = body;

        if (!requestId || !approvalId) {
            return NextResponse.json(
                { error: "AI Constitution Violation: Execution requires both requestId and approvalId" },
                { status: 400 }
            );
        }

        if (agentInitiator !== "worker" && agentInitiator !== "master") {
            return NextResponse.json(
                { error: "AI Constitution Violation: Only allowed agents can trigger execution" },
                { status: 403 }
            );
        }

        // 1. Fetch the change request
        const changeRequest = await prisma.aIChangeRequest.findUnique({
            where: { requestId }
        });

        if (!changeRequest) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        // Rate limit: max 5 executions per minute per agent
        const oneMinuteAgo = new Date(Date.now() - 60000);
        const executionCount = await prisma.aIExecutionLog.count({
            where: {
                agentName: agentInitiator,
                executionTimestamp: { gte: oneMinuteAgo }
            }
        });

        if (executionCount >= 5) {
            await prisma.aIExecutionLog.create({
                data: {
                    requestId,
                    agentName: agentInitiator || "unknown_worker",
                    actionType: "RATE_LIMIT_BREACH",
                    status: "BLOCKED",
                    notes: "Worker execution rate limit exceeded (5/min). Halting."
                }
            });
            return NextResponse.json({ error: "AI Constitution Violation: Rate limit breached." }, { status: 429 });
        }

        // 2. Validate Approval ID
        if (changeRequest.approvalId !== approvalId) {
            await prisma.aIExecutionLog.create({
                data: {
                    requestId,
                    agentName: agentInitiator || "unknown_worker",
                    actionType: "ILLEGAL_EXECUTION_ATTEMPT",
                    status: "BLOCKED",
                    notes: `Invalid approvalId. Expected: ${changeRequest.approvalId}, Got: ${approvalId}`
                }
            });
            return NextResponse.json(
                { error: "AI Constitution Violation: Invalid approval_id." },
                { status: 403 }
            );
        }

        // 3. Mode Control Check
        const sysState = await prisma.aISystemState.findUnique({ where: { id: "singleton" } });
        if (sysState && sysState.mode === "maintenance") {
            await prisma.aIExecutionLog.create({
                data: {
                    requestId,
                    agentName: agentInitiator || "unknown_worker",
                    actionType: "MAINTENANCE_MODE_BLOCK",
                    status: "BLOCKED",
                    notes: "System is in MAINTENANCE mode. Executions blocked."
                }
            });
            return NextResponse.json({ error: "System is in MAINTENANCE mode. Executions halted." }, { status: 403 });
        }

        // 4. Financial Hard Lock
        const targetString = (changeRequest.targetPage || "").toLowerCase();
        let payloadString = "";
        try { payloadString = JSON.stringify(changeRequest.proposedChanges).toLowerCase(); } catch { }

        const restrictedTargets = ["payment", "invoice", "users", "auth.", "auditlog"];
        const isHardLocked = restrictedTargets.some(t => targetString.includes(t) || payloadString.includes(t));

        if (isHardLocked) {
            await prisma.aIExecutionLog.create({
                data: {
                    requestId,
                    agentName: agentInitiator || "unknown_worker",
                    actionType: "HARD_LOCK_BREACH_ATTEMPT",
                    status: "BLOCKED",
                    notes: "FINANCIAL_HARD_LOCK_EXCEPTION: AI attempted to touch restricted tables."
                }
            });
            return NextResponse.json({ error: "FINANCIAL_HARD_LOCK_EXCEPTION" }, { status: 403 });
        }

        // 5. Validate state
        if (changeRequest.currentState !== 'approved') {
            return NextResponse.json({ error: `Cannot execute: request is in state "${changeRequest.currentState}"` }, { status: 400 });
        }

        // 6. Execution Branching based on Page Category
        const changes = changeRequest.proposedChanges as any;

        // --- BRANCH A: Knowledge Page Publishing ---
        if (changeRequest.pageCategory === "knowledge" || changeRequest.changeType === "knowledge_article") {
            const { slug, title, content, metadata, authorName, qualityScore, sourcesUsed } = changes;
            
            if (!slug || !title) return NextResponse.json({ error: "Missing slug or title in knowledge payload" }, { status: 400 });

            // 1. Fetch Author ID if exists
            const author = await (prisma as any).knowledgeAuthor.findFirst({ where: { name: authorName || 'Indonesian Visas Research Team' } });

            // 2. Snapshot BEFORE (if exists)
            const existingPage = await (prisma as any).knowledgePage.findUnique({ where: { slug } });
            const snapBefore = await prisma.aISnapshot.create({
                data: {
                    requestId,
                    pagePath: changeRequest.targetPage,
                    snapshotData: (existingPage || {}) as any
                }
            });
            
            // 3. Upsert the knowledge page with Intelligence Extensions
            const publishedPage = await (prisma as any).knowledgePage.upsert({
                where: { slug },
                create: {
                  slug,
                  title,
                  content: content as any,
                  metadata: metadata as any,
                  published: true,
                  authorId: author?.id
                },
                update: {
                  title,
                  content: content as any,
                  metadata: metadata as any,
                  published: true,
                  authorId: author?.id,
                  updatedAt: new Date()
                }
            });

            const snapAfter = await prisma.aISnapshot.create({
                data: {
                    requestId,
                    pagePath: changeRequest.targetPage,
                    snapshotData: publishedPage as any
                }
            });

            // 4. Upsert Quality Metrics
            if (changes.qualityMetrics) {
              const q = changes.qualityMetrics;
              await (prisma as any).aIContentQuality.upsert({
                where: { knowledgePageId: publishedPage.id },
                create: {
                  knowledgePageId: publishedPage.id,
                  wordCount: q.wordCount,
                  readability: q.readabilityScore,
                  seoScore: q.seoScore,
                  semanticScore: q.semanticScore,
                  uniqueness: q.uniquenessScore,
                  overallScore: q.overallScore
                },
                update: {
                  wordCount: q.wordCount,
                  readability: q.readabilityScore,
                  seoScore: q.seoScore,
                  semanticScore: q.semanticScore,
                  uniqueness: q.uniquenessScore,
                  overallScore: q.overallScore
                }
              });
            }

            // 5. Update Topic History status
            await (prisma as any).aITopicHistory.updateMany({
              where: { topicSlug: slug },
              data: { status: 'published', publishedAt: new Date() }
            });

            // Commit state change
            await prisma.$transaction([
                prisma.aIChangeRequest.update({
                    where: { requestId },
                    data: { currentState: "executed", updatedAt: new Date() }
                }),
                prisma.aIExecutionLog.create({
                    data: {
                        requestId,
                        agentName: agentInitiator,
                        actionType: "EXECUTE_INTEL_KNOWLEDGE_PUBLISH",
                        snapshotBeforeId: snapBefore.id,
                        snapshotAfterId: snapAfter.id,
                        status: "SUCCESS",
                        notes: `Intelligent Knowledge page "${slug}" published/updated.`
                    }
                })
            ]);

            return NextResponse.json({
                success: true,
                message: `Intelligence-hardened article "${title}" is now LIVE at /visa-knowledge/${slug}`,
                slug
            });

            // --- BRANCH B: Immigration News Updates ---
        } else if (changeRequest.changeType === "immigration_update") {
            const { title, content, category, summary, image, slug } = changes;
            
            if (!slug || !title) return NextResponse.json({ error: "Missing slug or title in news payload" }, { status: 400 });

            // Snapshot BEFORE (N/A for new post, but for parity)
            const snapBefore = await prisma.aISnapshot.create({
                data: {
                    requestId,
                    pagePath: changeRequest.targetPage,
                    snapshotData: {}
                }
            });

            // Create the news entry
            const newsPage = await prisma.immigrationUpdate.create({
                data: {
                  title,
                  content,
                  category,
                  summary,
                  image,
                  slug,
                  published: true // Executing means publishing
                }
            });

            const snapAfter = await prisma.aISnapshot.create({
                data: {
                    requestId,
                    pagePath: changeRequest.targetPage,
                    snapshotData: newsPage as any
                }
            });

            await prisma.$transaction([
                prisma.aIChangeRequest.update({
                    where: { requestId },
                    data: { currentState: "executed", updatedAt: new Date() }
                }),
                prisma.aIExecutionLog.create({
                    data: {
                        requestId,
                        agentName: agentInitiator,
                        actionType: "EXECUTE_NEWS_PUBLISH",
                        snapshotBeforeId: snapBefore.id,
                        snapshotAfterId: snapAfter.id,
                        status: "SUCCESS",
                        notes: `Immigration news "${slug}" published.`
                    }
                })
            ]);

            return NextResponse.json({
                success: true,
                message: `Immigration news "${title}" is now LIVE at /en/indonesia-visa-updates`,
                slug
            });
        }

        // --- BRANCH B: Standard Visa Update (Original Logic) ---
        const visaId = changes._meta?.visaId;
        if (!visaId) {
            return NextResponse.json({ error: "No visaId in proposedChanges metadata" }, { status: 400 });
        }

        const currentVisa = await prisma.visa.findUnique({ where: { id: visaId } });
        if (!currentVisa) {
            return NextResponse.json({ error: `Visa "${visaId}" not found` }, { status: 404 });
        }

        const snapBefore = await prisma.aISnapshot.create({
            data: {
                requestId,
                pagePath: changeRequest.targetPage,
                snapshotData: { ...currentVisa } as any
            }
        });

        // 7. Build real update payload
        const { _meta, ...actualChanges } = changes;
        const updatePayload: Record<string, any> = {};
        for (const [key, value] of Object.entries(actualChanges)) {
            if (key === 'price' || key === 'fee') {
                updatePayload[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
            } else if (key === 'requirements' && Array.isArray(value)) {
                updatePayload[key] = JSON.stringify(value);
            } else {
                updatePayload[key] = value;
            }
        }

        // 8. Execute the REAL DB mutation
        const updatedVisa = await prisma.visa.update({
            where: { id: visaId },
            data: updatePayload
        });

        // 9. Snapshot AFTER
        const snapAfter = await prisma.aISnapshot.create({
            data: {
                requestId,
                pagePath: changeRequest.targetPage,
                snapshotData: { ...updatedVisa } as any
            }
        });

        // 10. Immutable log + state update
        await prisma.$transaction([
            prisma.aIChangeRequest.update({
                where: { requestId },
                data: { currentState: "executed", updatedAt: new Date() }
            }),
            prisma.aIExecutionLog.create({
                data: {
                    requestId,
                    agentName: agentInitiator,
                    actionType: "EXECUTE_CHANGE",
                    snapshotBeforeId: snapBefore.id,
                    snapshotAfterId: snapAfter.id,
                    status: "SUCCESS",
                    notes: `Visa "${visaId}" updated. Fields: ${Object.keys(updatePayload).join(', ')}`
                }
            })
        ]);

        // 11. Post-execution risk scan entry
        await prisma.aIRiskLog.create({
            data: {
                scanType: 'post_execution',
                riskLevel: 'nominal',
                findings: { requestId, visaId, fieldsChanged: Object.keys(updatePayload) }
            }
        });

        return NextResponse.json({
            success: true,
            message: `Visa "${visaId}" updated successfully. Execution logged.`,
            fieldsChanged: Object.keys(updatePayload)
        });

    } catch (error: any) {
        console.error("AI Worker Execution Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error during AI execution" },
            { status: 500 }
        );
    }
}
