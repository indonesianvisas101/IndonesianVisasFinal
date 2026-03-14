import prisma from '@/lib/prisma';
import { AI_IMMIGRATION_ANALYST } from './immigrationAnalystAgent';
import { generateKnowledgeArticle } from './knowledgeGenerator';

/**
 * Knowledge Generation Scheduler
 * Prevents SEO spam by enforcing strict limits.
 */
export async function runKnowledgeGenerationCycle() {
  const now = new Date();
  
  // 1. Check daily limit (Max 2)
  const dayStart = new Date(now.setHours(0,0,0,0));
  const dailyCount = await prisma.aIExecutionLog.count({
    where: {
      agentName: 'AI_IMMIGRATION_ANALYST',
      actionType: 'PROPOSE_KNOWLEDGE_PAGE',
      executionTimestamp: { gte: dayStart }
    }
  });

  if (dailyCount >= 2) {
    console.log("[KnowledgeScheduler] Daily limit reached (2/2). Skipping cycle.");
    return { success: false, reason: "DAILY_LIMIT_REACHED" };
  }

  // 2. Identify a topic
  const topics = await AI_IMMIGRATION_ANALYST.identifyTopics();
  
  // Check which topics aren't already in change requests or live
  // For brevity, we just pick the first one not already "drafted" today.
  const selectedTopic = topics[dailyCount]; 

  if (!selectedTopic) return { success: false, reason: "NO_OPPORTUNITIES" };

  // 3. Generate Content
  console.log(`[KnowledgeScheduler] Generating content for: ${selectedTopic}...`);
  const article = await generateKnowledgeArticle(selectedTopic);

  // 4. Propose
  const requestId = await AI_IMMIGRATION_ANALYST.proposeKnowledgePage(article);

  return { success: true, requestId, topic: selectedTopic };
}
