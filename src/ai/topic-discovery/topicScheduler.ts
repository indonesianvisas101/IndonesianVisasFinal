import { AI_IMMIGRATION_ANALYST } from '../analysts/immigration-analyst/immigrationAnalystAgent';
import { generateKnowledgeArticle } from '../analysts/immigration-analyst/knowledgeGenerator';
import { SOURCE_REGISTRY, AUTHORITY_CONTROL } from '../analysts/immigration-analyst/authorityControl';
import prisma from '@/lib/prisma';

/**
 * AI Topic Scheduler
 * Manages the orchestration of discovery and generation.
 */
export const TOPIC_SCHEDULER = {
  /**
   * Daily cycle to discover topics and propose articles.
   */
  async runDailyOrchestration() {
    console.log("[TOPIC_SCHEDULER] Starting intelligence-hardened orchestration...");

    // 0. Seed Source Registry
    await SOURCE_REGISTRY.seedSourceRegistry();

    // 1. Discover New Topics with Clusters
    const opportunities = await AI_IMMIGRATION_ANALYST.identifyTopics();
    console.log(`[TOPIC_SCHEDULER] Discovered ${opportunities.length} potential topics.`);

    // 2. Filter by Rate Limits (2/day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const generatedToday = await prisma.aIChangeRequest.count({
      where: {
        initiatedBy: 'analyst',
        createdAt: { gte: today }
      }
    });

    if (generatedToday >= 2) {
      console.log("[TOPIC_SCHEDULER] Rate limit reached (2/day). Skipping generation.");
      return;
    }

    // 3. Propose Articles for the top opportunities
    const toProcess = opportunities.slice(0, 2 - generatedToday);
    const author = await AUTHORITY_CONTROL.getDefaultAuthor();
    const sources = await SOURCE_REGISTRY.getOfficialSources();

    for (const opp of toProcess) {
      console.log(`[TOPIC_SCHEDULER] Generating article for: ${opp.topic} [Cluster: ${opp.cluster}]`);
      try {
        const article = await generateKnowledgeArticle(opp.topic, author, sources);
        
        // Pass to analyst for proposal (analyst handles memory validation)
        const requestId = await AI_IMMIGRATION_ANALYST.proposeKnowledgePage(article, opp.cluster);
        
        if (requestId) {
          console.log(`[TOPIC_SCHEDULER] Proposed article ${opp.topic} with Request ID: ${requestId}`);
        }
      } catch (err) {
        console.error(`[TOPIC_SCHEDULER] Failed to generate/propose topic: ${opp.topic}`, err);
      }
    }

    console.log("[TOPIC_SCHEDULER] Intelligence orchestration complete.");
  }
};
