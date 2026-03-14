import { AI_IMMIGRATION_ANALYST } from '../analysts/immigration-analyst/immigrationAnalystAgent';
import { generateImmigrationNews } from '../analysts/immigration-analyst/newsGenerator';
import { TOPIC_SOURCES } from './topicSources';
import prisma from '@/lib/prisma';

/**
 * AI News Scheduler
 * Manages the orchestration of news discovery and generation.
 */
export const NEWS_SCHEDULER = {
  /**
   * Weekly cycle to discover regulatory news and propose updates.
   */
  async runWeeklyNewsOrchestration() {
    console.log("[NEWS_SCHEDULER] Starting weekly news orchestration...");

    // 1. Check if news was proposed in the last 7 days
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentNews = await prisma.aIChangeRequest.count({
      where: {
        changeType: 'immigration_update',
        createdAt: { gte: last7Days }
      }
    });

    if (recentNews > 0) {
      console.log("[NEWS_SCHEDULER] News already proposed this week. Skipping.");
      return;
    }

    // 2. Get News Signals
    const newsSignals = TOPIC_SOURCES.getNewsSignals();
    
    // Pick the highest relevance signal that hasn't been used
    // (In a real system, we'd check for existing slugs in ImmigrationUpdate table)
    const topSignal = newsSignals[0];

    if (!topSignal) {
      console.log("[NEWS_SCHEDULER] No high-impact news signals found.");
      return;
    }

    console.log(`[NEWS_SCHEDULER] Generating news update for: ${topSignal.query}`);
    
    try {
      const newsData = await generateImmigrationNews(topSignal.query);
      const requestId = await AI_IMMIGRATION_ANALYST.proposeImmigrationUpdate(newsData);
      console.log(`[NEWS_SCHEDULER] Proposed news "${newsData.title}" with Request ID: ${requestId}`);
    } catch (err) {
      console.error(`[NEWS_SCHEDULER] Failed to generate/propose news: ${topSignal.query}`, err);
    }

    console.log("[NEWS_SCHEDULER] Weekly news orchestration complete.");
  }
};
