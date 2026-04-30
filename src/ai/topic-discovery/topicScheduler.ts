import { AI_IMMIGRATION_ANALYST } from '../analysts/immigration-analyst/immigrationAnalystAgent';
import { generateKnowledgeArticle } from '../analysts/immigration-analyst/knowledgeGenerator';
import { SOURCE_REGISTRY, AUTHORITY_CONTROL } from '../analysts/immigration-analyst/authorityControl';
import prisma from '@/lib/prisma';

/**
 * AI Topic Scheduler - JARVIS VVIP EDITION
 * Frequency: Every 10-15 minutes (via worker)
 */
export const TOPIC_SCHEDULER = {
  /**
   * Main orchestration cycle.
   */
  async runDailyOrchestration() {
    console.log("[JARVIS_SCHEDULER] Initiating VVIP orchestration cycle...");

    try {
      await SOURCE_REGISTRY.seedSourceRegistry().catch(() => {});

      // --- TRACK 1: MANUAL VVIP PRIORITY (Target: < 10 mins execution) ---
      await this.processVVIPManualQueue();

      // --- TRACK 2: AI AUTOMATED RESEARCH (3-day cycle) ---
      const now = new Date();
      const hour = now.getHours();
      if (hour === 2) {
         await this.processAIAutomatedCycle();
      }

      // --- TRACK 3: AUTO-PUBLISH GUARDIAN (Target: Publish if idle > 10 mins) ---
      await this.handleAutoPublishWatcher();

    } catch (globalErr) {
      console.error("[JARVIS_SCHEDULER] Global Error:", globalErr);
    }
  },

  /**
   * Processes the VVIP manual queue.
   * Logic: Executes 1 per cycle if available. No 24h limit, only 10-min spacing.
   */
  async processVVIPManualQueue() {
    console.log("[JARVIS_SCHEDULER] Scanning VVIP Manual Stack...");

    // 1. Spacing Protection (Ensure at least 10 mins between any manual posts)
    const recentManual = await prisma.aIChangeRequest.findFirst({
      where: { 
        initiatedBy: 'admin',
        createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) }
      }
    });

    if (recentManual) {
      console.log("[JARVIS_SCHEDULER] VVIP slot occupied. Cooling down.");
      return;
    }

    // 2. Fetch queue
    const manualQueue = await prisma.knowledgePage.findMany({
      where: {
        published: false,
        metadata: { path: ['topic'], not: '' }
      },
      orderBy: { createdAt: 'asc' },
      take: 1
    });

    if (!manualQueue.length) return;

    const target = manualQueue[0];
    const topic = (target.metadata as any)?.topic;

    console.log(`[JARVIS_SCHEDULER] Executing Master Instruction: ${topic}`);
    const author = await AUTHORITY_CONTROL.getDefaultAuthor();
    const sources = await SOURCE_REGISTRY.getOfficialSources();
    
    const article = await generateKnowledgeArticle(topic, author, sources);
    const requestId = await AI_IMMIGRATION_ANALYST.proposeKnowledgePage(article, (target.category as any) || 'immigration-rules');
    
    if (requestId) {
      await prisma.aIChangeRequest.update({
        where: { requestId },
        data: { initiatedBy: 'admin' }
      });
      console.log(`[JARVIS_SCHEDULER] VVIP SUCCESS: Article proposed for Master.`);
    }
  },

  /**
   * AI cycle (Runs 1 article every 3 days)
   */
  async processAIAutomatedCycle() {
    console.log("[JARVIS_SCHEDULER] Running Deep Discovery...");

    const recentAI = await prisma.aIChangeRequest.findFirst({
      where: { 
        initiatedBy: 'analyst',
        createdAt: { gte: new Date(Date.now() - 70 * 60 * 60 * 1000) }
      }
    });

    if (recentAI) return;

    const opportunities = await AI_IMMIGRATION_ANALYST.identifyTopics().catch(() => []);
    if (!opportunities.length) return;

    const opp = opportunities[0];
    const author = await AUTHORITY_CONTROL.getDefaultAuthor();
    const sources = await SOURCE_REGISTRY.getOfficialSources();
    
    const article = await generateKnowledgeArticle(opp.topic, author, sources);
    await AI_IMMIGRATION_ANALYST.proposeKnowledgePage(article, opp.cluster);
  },

  /**
   * Auto-Publish Watcher
   * Ensures content is published if Master forgets for > 10 minutes.
   */
  async handleAutoPublishWatcher() {
    console.log("[JARVIS_SCHEDULER] Running Auto-Publish Guardian...");
    const threshold = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes ago

    // 1. Auto-publish Knowledge Pages
    const pendingKnowledge = await prisma.knowledgePage.updateMany({
      where: {
        published: false,
        updatedAt: { lt: threshold }
      },
      data: { published: true }
    });

    if (pendingKnowledge.count > 0) {
      console.log(`[JARVIS_SCHEDULER] AUTO-PUBLISHED: ${pendingKnowledge.count} Knowledge articles.`);
    }

    // 2. Auto-publish Immigration News
    const pendingNews = await prisma.immigrationUpdate.updateMany({
      where: {
        published: false,
        updatedAt: { lt: threshold }
      },
      data: { published: true }
    });

    if (pendingNews.count > 0) {
      console.log(`[JARVIS_SCHEDULER] AUTO-PUBLISHED: ${pendingNews.count} News updates.`);
    }
  }
};
