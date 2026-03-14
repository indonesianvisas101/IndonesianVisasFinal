import { AI_IMMIGRATION_ANALYST } from '../analysts/immigration-analyst/immigrationAnalystAgent';
import { generateKnowledgeArticle } from '../analysts/immigration-analyst/knowledgeGenerator';
import { TOPIC_DISCOVERY_ENGINE } from './topicDiscoveryEngine';
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
    console.log("[TOPIC_SCHEDULER] Starting daily orchestration...");

    // 1. Discover New Topics
    const topics = await TOPIC_DISCOVERY_ENGINE.discoverNewTopics();
    console.log(`[TOPIC_SCHEDULER] Discovered ${topics.length} potential topics.`);

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

    // 3. Propose Articles for the top 2 topics
    const topicsToProcess = topics.slice(0, 2 - generatedToday);

    for (const topic of topicsToProcess) {
      console.log(`[TOPIC_SCHEDULER] Generating article for: ${topic.title}`);
      try {
        const article = await generateKnowledgeArticle(topic.title);
        const requestId = await AI_IMMIGRATION_ANALYST.proposeKnowledgePage(article);
        console.log(`[TOPIC_SCHEDULER] Proposed article ${topic.title} with Request ID: ${requestId}`);
      } catch (err) {
        console.error(`[TOPIC_SCHEDULER] Failed to generate/propose topic: ${topic.title}`, err);
      }
    }

    console.log("[TOPIC_SCHEDULER] Daily orchestration complete.");
  }
};
