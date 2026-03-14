import prisma from '@/lib/prisma';

/**
 * AI Topic Memory System
 * Prevents duplicate SEO topics and keyword cannibalization.
 */
export const TOPIC_MEMORY = {
  /**
   * Normalizes a topic string into a slug.
   */
  normalizeSlug(topic: string): string {
    return topic
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  /**
   * Validates if a topic is unique or a potential duplicate.
   * Returns { isUnique: boolean, reason?: string }
   */
  async validateTopic(topic: string) {
    const slug = this.normalizeSlug(topic);
    
    // 1. Exact Slug Match
    const existing = await (prisma as any).aITopicHistory.findUnique({
      where: { topicSlug: slug }
    });

    if (existing) {
      return { 
        isUnique: false, 
        reason: `Duplicate detected: This topic already exists as a ${existing.status} entry (ID: ${existing.id}).` 
      };
    }

    // 2. Keyword Overlap / Similarity (Simple Implementation)
    // In a real system, we'd use vector search or Levenshtein distance.
    // For now, we check if the slug contains significant overlapping words.
    const words = slug.split('-').filter(w => w.length > 3);
    if (words.length > 1) {
      const similarTopics = await (prisma as any).aITopicHistory.findMany({
        where: {
          OR: words.map(word => ({ topicSlug: { contains: word } }))
        },
        take: 5
      });

      for (const t of similarTopics) {
        // Simple overlap ratio check
        const tWords = t.topicSlug.split('-');
        const intersection = words.filter(w => tWords.includes(w));
        const overlap = intersection.length / Math.min(words.length, tWords.length);
        
        if (overlap > 0.8) {
          return {
            isUnique: false,
            reason: `High similarity overlap (>80%) with existing topic: "${t.topicTitle}" (Slug: ${t.topicSlug}).`
          };
        }
      }
    }

    return { isUnique: true };
  },

  /**
   * Records a topic candidate in history.
   */
  async recordTopic(data: {
    title: string;
    cluster: string;
    sourceAgent: 'analyst' | 'news_agent' | 'manual';
    status?: 'draft' | 'published' | 'rejected';
    confidenceScore?: number;
    notes?: string;
  }) {
    const slug = this.normalizeSlug(data.title);
    return await (prisma as any).aITopicHistory.create({
      data: {
        topicTitle: data.title,
        topicSlug: slug,
        topicCluster: data.cluster,
        sourceAgent: data.sourceAgent,
        status: data.status || 'draft',
        confidenceScore: data.confidenceScore,
        notes: data.notes
      }
    });
  }
};

/**
 * Allowed Topic Clusters
 */
export const TOPIC_CLUSTERS = [
  'visa-types',
  'visa-extensions',
  'visa-country-guides',
  'immigration-rules',
  'expat-guides',
  'business-in-indonesia',
  'immigration-news',
  'visa-comparisons',
  'visa-glossary',
  'travel-regulations'
] as const;

export type TopicCluster = typeof TOPIC_CLUSTERS[number];
