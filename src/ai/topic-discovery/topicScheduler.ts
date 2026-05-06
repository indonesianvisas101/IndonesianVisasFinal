import { AI_IMMIGRATION_ANALYST } from '../analysts/immigration-analyst/immigrationAnalystAgent';
import { generateKnowledgeArticle, ContentType } from '../analysts/immigration-analyst/knowledgeGenerator';
import { AUTHORITY_CONTROL, SOURCE_REGISTRY } from '../analysts/immigration-analyst/authorityControl';
import prisma from '@/lib/prisma';
import { randomUUID } from 'crypto';
import { TopicCluster } from './topicMemory';

/**
 * AI Topic Scheduler - MASTER ORCHESTRATOR v2
 * Handles: VVIP Manual Priority (Instant), AI Daily Discovery, and Auto-Publishing.
 */
export const TOPIC_SCHEDULER = {
  /**
   * Main orchestration cycle.
   * Target: Run every hour via Cron, but only triggers research at 7 AM.
   */
  async runDailyOrchestration(force: boolean = false) {
    const now = new Date();
    const hour = now.getHours();
    
    console.log(`[MASTER_SCHEDULER] Heartbeat at ${now.toISOString()}. Hour: ${hour}`);

    try {
      await SOURCE_REGISTRY.seedSourceRegistry().catch(() => {});

      // 1. ALWAYS process VVIP Manual Queue (Instant Priority)
      await this.processVVIPManualQueue();

      // 2. DAILY AUTOMATION (7 AM) or Forced
      // Checks if we already posted in the last 20 hours to prevent double-posting
      const lastExecution = await prisma.aIExecutionLog.findFirst({
        where: { actionType: 'DAILY_AUTO_POST', status: 'SUCCESS' },
        orderBy: { executionTimestamp: 'desc' }
      });

      const hoursSinceLast = lastExecution 
        ? (now.getTime() - new Date(lastExecution.executionTimestamp).getTime()) / (1000 * 60 * 60)
        : 99;

      if (force || (hour === 7 && hoursSinceLast > 20)) {
        console.log("[MASTER_SCHEDULER] Triggering Mandatory Daily 7 AM Post...");
        await this.processAIAutomatedCycle();
      }

      // 3. AUTO-PUBLISH WATCHER
      await this.handleAutoPublishWatcher();

    } catch (globalErr) {
      console.error("[MASTER_SCHEDULER] Critical Orchestration Failure:", globalErr);
    }
  },

  /**
   * Processes the VVIP manual queue with INSTANT EXECUTION.
   */
  async processVVIPManualQueue() {
    console.log("[MASTER_SCHEDULER] Checking VVIP Priority Stack...");

    // 1. Find topics from AI Master Tab or Jarvis
    // Status: 'vvip_queued' means it was added but no content generated yet
    const manualQueue = await prisma.aITopicHistory.findMany({
      where: { status: 'vvip_queued' },
      orderBy: { createdAt: 'asc' },
      take: 3 // Process up to 3 at a time if backed up
    });

    if (manualQueue.length === 0) {
      // Also check the "Empty KnowledgePage" entries created by Jarvis
      const emptyPages = await prisma.knowledgePage.findMany({
        where: { 
          published: false,
          content: { equals: {} }
        },
        take: 3
      });

      if (emptyPages.length > 0) {
        for (const page of emptyPages) {
            const topic = (page.metadata as any)?.topic || page.title;
            await this.generateAndAutoPublish(topic, 'knowledge', page.id);
        }
      }
      return;
    }

    for (const item of manualQueue) {
      console.log(`[MASTER_SCHEDULER] MASTER COMMAND DETECTED: ${item.topicTitle}`);
      
      // Determine type from notes or metadata (default to knowledge)
      const type = (item.notes?.includes('viral') ? 'viral' : 
                   (item.notes?.includes('news') ? 'news' : 'knowledge')) as any;

      await this.generateAndAutoPublish(item.topicTitle, type, item.id);
    }
  },

  /**
   * Helper to generate and immediately publish content (Master Mode).
   */
  async generateAndAutoPublish(topic: string, type: ContentType, sourceId: string) {
    try {
      console.log(`[MASTER_SCHEDULER] Generating ${type.toUpperCase()} for Master: ${topic}`);
      
      const author = await AUTHORITY_CONTROL.getDefaultAuthor();
      const sources = await SOURCE_REGISTRY.getOfficialSources();
      
      // Enhance sources for 'viral' if needed (placeholder for future expansion)
      const content = await generateKnowledgeArticle(topic, author, sources, type);
      
      // Propose change
      const requestId = await AI_IMMIGRATION_ANALYST.proposeKnowledgePage(content, 'master_priority' as TopicCluster);
      
      if (requestId) {
        // AUTO-APPROVE for Master Topics
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const internalKey = process.env.OPENAI_API_KEY_INTERNAL;
        
        console.log(`[MASTER_SCHEDULER] Auto-Approving VVIP Request: ${requestId}`);
        
        const execRes = await fetch(`${appUrl}/api/ai-worker/execute`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${internalKey}`
            },
            body: JSON.stringify({ 
                requestId, 
                approvalId: `master-auto-${Date.now()}`,
                agentInitiator: 'master' 
            })
        });

        if (execRes.ok) {
            // Update topic history status
            await prisma.aITopicHistory.updateMany({
                where: { OR: [{ id: sourceId }, { topicTitle: topic }] },
                data: { status: 'published', publishedAt: new Date() }
            });
            console.log(`[MASTER_SCHEDULER] VVIP SUCCESS: ${topic} is LIVE.`);
        }
      }
    } catch (err) {
      console.error(`[MASTER_SCHEDULER] VVIP Execution Failed for ${topic}:`, err);
    }
  },

  /**
   * AI cycle (Ensures 1 high-quality post every 24h at 7 AM)
   */
  async processAIAutomatedCycle() {
    console.log("[MASTER_SCHEDULER] Running Deep Discovery for Daily Post...");

    const author = await AUTHORITY_CONTROL.getDefaultAuthor();
    const sources = await SOURCE_REGISTRY.getOfficialSources();
    
    // 1. Identify high-intent topics
    const opportunities = await AI_IMMIGRATION_ANALYST.identifyTopics().catch(() => []);
    if (!opportunities.length) return;

    // Pick the best one (or random from top 3)
    const opp = opportunities[0];
    const type: ContentType = (opp.cluster?.includes('viral') ? 'viral' : 'knowledge') as ContentType;
    
    const article = await generateKnowledgeArticle(opp.topic, author, sources, type);
    const requestId = await AI_IMMIGRATION_ANALYST.proposeKnowledgePage(article, (opp.cluster || 'auto_discovery') as TopicCluster);

    if (requestId) {
        await prisma.aIExecutionLog.create({
            data: {
                requestId,
                agentName: 'orchestrator',
                actionType: 'DAILY_AUTO_POST',
                status: 'PENDING_APPROVAL',
                notes: `Daily 7 AM post proposed: ${opp.topic}`
            }
        });
    }
  },

  /**
   * Auto-Publish Watcher
   */
  async handleAutoPublishWatcher() {
    const threshold = new Date(Date.now() - 30 * 60 * 1000); // 30 mins
    
    // Auto-publish if Master hasn't responded to AI proposal within 24 hours
    // This ensures the site always stays fresh
    const autoPublishThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const pendingRequests = await prisma.aIChangeRequest.findMany({
        where: { 
            currentState: 'pending',
            createdAt: { lt: autoPublishThreshold }
        }
    });

    for (const req of pendingRequests) {
        console.log(`[MASTER_SCHEDULER] Auto-Publishing neglected request: ${req.requestId}`);
        // Implementation of auto-approval would go here
    }
  }
};
