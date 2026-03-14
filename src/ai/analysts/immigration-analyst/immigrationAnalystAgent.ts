import prisma from '@/lib/prisma';
import { randomUUID } from 'crypto';
import { TOPIC_MEMORY, TopicCluster } from '../../topic-discovery/topicMemory';
import { AUTHORITY_CONTROL, SOURCE_REGISTRY } from './authorityControl';
import { QUALITY_ENGINE } from './qualityEngine';

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

    const changeRequest = await prisma.aIChangeRequest.create({
      data: {
        requestId,
        initiatedBy: 'analyst',
        changeType: 'knowledge_article',
        pageCategory: 'normal',
        targetPage: `/visa-knowledge/${articleData.slug}`,
        proposedChanges: {
          slug: articleData.slug,
          title: articleData.title,
          content: articleData.sections,
          metadata: articleData.metadata,
          pageType: 'knowledge_article',
          // Intelligence Extension
          cluster,
          authorName: author.name,
          qualityScore: quality.overallScore,
          sourcesUsed: articleData.sources_used || []
        },
        riskScore: quality.overallScore > 80 ? 'low' : 'medium',
        impactForecast: { 
          summary: `Scales SEO cluster "${cluster}" for "${articleData.title}". Quality: ${quality.overallScore}/100.`,
          type: 'SEO_EXPANSION',
          qualityMetrics: quality
        },
        modeStatus: 'normal',
        currentState: 'draft',
      }
    });

    // 3. Record in Topic History
    await TOPIC_MEMORY.recordTopic({
      title: articleData.title,
      cluster,
      sourceAgent: 'analyst',
      status: 'draft',
      confidenceScore: quality.overallScore
    });

    await prisma.aIExecutionLog.create({
      data: {
        requestId,
        agentName: this.name,
        actionType: 'PROPOSE_INTELLIGENT_KNOWLEDGE',
        status: 'SUCCESS',
        notes: `Proposed intelligent article: ${articleData.title} in cluster ${cluster}`
      }
    });

    return requestId;
  },

  /**
   * Proposes a new immigration update (News).
   */
  async proposeImmigrationUpdate(newsData: any) {
    const requestId = `NEWS-INTEL-${Date.now()}-${randomUUID().slice(0, 4).toUpperCase()}`;
    
    const quality = QUALITY_ENGINE.evaluateContent(newsData.content, newsData.title);

    const changeRequest = await prisma.aIChangeRequest.create({
      data: {
        requestId,
        initiatedBy: 'analyst',
        changeType: 'immigration_update',
        pageCategory: 'normal',
        targetPage: `/en/indonesia-visa-updates/${newsData.slug}`,
        proposedChanges: {
          title: newsData.title,
          content: newsData.content,
          category: newsData.category || 'Immigration',
          summary: newsData.summary,
          image: newsData.image,
          slug: newsData.slug,
          published: false,
          cluster: 'immigration-news',
          qualityScore: quality.overallScore
        },
        riskScore: 'low',
        impactForecast: { 
          summary: `Intelligence-graded news: "${newsData.title}". Quality: ${quality.overallScore}.`,
          type: 'REGULATORY_UPDATE'
        },
        modeStatus: 'normal',
        currentState: 'draft',
      }
    });

    // Record in Topic History
    await TOPIC_MEMORY.recordTopic({
      title: newsData.title,
      cluster: 'immigration-news',
      sourceAgent: 'news_agent',
      status: 'draft'
    });

    await prisma.aIExecutionLog.create({
      data: {
        requestId,
        agentName: this.name,
        actionType: 'PROPOSE_INTELLIGENT_NEWS',
        status: 'SUCCESS',
        notes: `Proposed intelligent news: ${newsData.title}`
      }
    });

    return requestId;
  },

  /**
   * Checks for topic opportunities with clusters
   */
  async identifyTopics(): Promise<{topic: string, cluster: TopicCluster}[]> {
    return [
      { topic: "What is B211A Visa Indonesia", cluster: "visa-types" },
      { topic: "How to Move to Bali legally as a Digital Nomad", cluster: "expat-guides" },
      { topic: "Indonesia Visa rules for Australian Citizens", cluster: "visa-country-guides" }
    ];
  }
};
