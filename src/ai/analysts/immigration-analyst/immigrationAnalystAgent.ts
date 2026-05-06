import prisma from '@/lib/prisma';
import { randomUUID } from 'crypto';
import { TOPIC_MEMORY, TopicCluster } from '../../topic-discovery/topicMemory';
import { AUTHORITY_CONTROL, SOURCE_REGISTRY } from './authorityControl';
import { QUALITY_ENGINE } from './qualityEngine';
import { slugify } from '@/utils/slugify';

/**
 * AI Immigration Analyst Agent
 * Responsible for proposing new knowledge pages via the AI Master.
 */
export const AI_IMMIGRATION_ANALYST = {
  name: "AI_IMMIGRATION_ANALYST",
  role: "Immigration Intelligence & SEO Knowledge Generator",
  
  /**
   * Proposes a new knowledge article as a Change Request.
   */
  async proposeKnowledgePage(articleData: any, cluster: TopicCluster) {
    const requestId = `KNOWLEDGE-INTEL-${Date.now()}-${randomUUID().slice(0, 4).toUpperCase()}`;
    
    // 1. Topic Memory Validation
    const validation = await TOPIC_MEMORY.validateTopic(articleData.title);
    if (!validation.isUnique) {
      console.warn(`[ANALYST] Topic rejected: ${validation.reason}`);
      return null;
    }

    // 2. Intelligence Metadata
    const author = await AUTHORITY_CONTROL.getDefaultAuthor();
    const quality = articleData.qualityMetrics;

    const sanitizedSlug = slugify(articleData.slug || articleData.title);

    const isPriority = cluster === 'master_priority' || cluster === 'admin-priority';

    const changeRequest = await prisma.aIChangeRequest.create({
      data: {
        requestId,
        initiatedBy: isPriority ? 'admin' : 'analyst',
        changeType: articleData.type === 'news' || articleData.type === 'viral' ? 'immigration_update' : 'knowledge_article',
        pageCategory: isPriority ? 'priority' : 'normal',
        targetPage: articleData.type === 'news' || articleData.type === 'viral' 
            ? `/en/indonesia-visa-updates/${sanitizedSlug}`
            : `/visa-knowledge/${sanitizedSlug}`,
        proposedChanges: {
          slug: sanitizedSlug,
          title: articleData.title,
          content: articleData.type === 'news' || articleData.type === 'viral' ? articleData.content : articleData.sections,
          metadata: articleData.metadata,
          category: articleData.category || (articleData.type === 'viral' ? 'Viral News' : 'Immigration'),
          summary: articleData.summary || '',
          image: articleData.image || '',
          pageType: articleData.type === 'news' || articleData.type === 'viral' ? 'news' : 'knowledge_article',
          // Intelligence Extension
          cluster,
          authorName: author.name,
          qualityScore: quality.overallScore,
          sourcesUsed: articleData.sources_used || []
        },
        riskScore: quality.overallScore > 80 ? 'low' : 'medium',
        impactForecast: { 
          summary: `Scales cluster "${cluster}" for "${articleData.title}". Type: ${articleData.type}.`,
          type: isPriority ? 'PRIORITY_UPDATE' : 'SEO_EXPANSION',
          qualityMetrics: quality
        },
        modeStatus: 'normal',
        currentState: isPriority ? 'approved' : 'draft',
      }
    });

    // 3. Record in Topic History
    await TOPIC_MEMORY.recordTopic({
      title: articleData.title,
      cluster,
      sourceAgent: isPriority ? 'master_admin' : 'analyst',
      status: isPriority ? 'published' : 'draft',
      confidenceScore: quality.overallScore
    });

    await prisma.aIExecutionLog.create({
      data: {
        requestId,
        agentName: this.name,
        actionType: isPriority ? 'PROPOSE_PRIORITY_CONTENT' : 'PROPOSE_INTELLIGENT_KNOWLEDGE',
        status: 'SUCCESS',
        notes: `Proposed ${articleData.type} article: ${articleData.title} in cluster ${cluster}`
      }
    });

    return requestId;
  },

  /**
   * Proposes a new immigration update (News).
   */
  async proposeImmigrationUpdate(newsData: any) {
    // This is now partially merged into proposeKnowledgePage for unified handling, 
    // but kept for legacy/specific news hooks.
    return this.proposeKnowledgePage({ ...newsData, type: 'news' }, 'immigration-news');
  },

  /**
   * Checks for topic opportunities with clusters
   * PRIORITIZES: Manual Admin Topics
   */
  async identifyTopics(): Promise<{topic: string, cluster: TopicCluster}[]> {
    console.log("[ANALYST] Identifying topics with 40-40-20 orchestration...");

    // 1. CHECK FOR MANUAL ADMIN TOPICS (Priority 1)
    const manualTopics = await prisma.aITopicHistory.findMany({
      where: { status: 'vvip_queued' },
      take: 5
    });

    if (manualTopics.length > 0) {
      return manualTopics.map(t => ({ 
        topic: t.topicTitle, 
        cluster: 'admin-priority' as TopicCluster 
      }));
    }

    // 2. AUTOMATIC ORCHESTRATION
    const { TOPIC_SOURCES } = await import('../../topic-discovery/topicSources');
    
    const productSignals = await (TOPIC_SOURCES as any).getInternalSignals(); 
    const knowledgeSignals = TOPIC_SOURCES.getRegulatorySignals(); 
    const newsSignals = TOPIC_SOURCES.getNewsSignals(); 

    const finalTopics = [
      ...productSignals.slice(0, 2).map((s: any) => ({ topic: s.query, cluster: 'visa-types' as TopicCluster })),
      ...knowledgeSignals.slice(0, 2).map(s => ({ topic: s.query, cluster: 'regulatory' as TopicCluster })),
      ...newsSignals.slice(0, 1).map(s => ({ topic: s.query, cluster: 'viral-news' as TopicCluster }))
    ];

    return finalTopics;
  }
};
