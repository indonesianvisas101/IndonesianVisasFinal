import prisma from '@/lib/prisma';

/**
 * AI Topic Filter System
 * Ensures topics are relevant and unique.
 */

export const TOPIC_FILTERS = {
  /**
   * Filters out topics that aren't immigration/visa/expat related.
   */
  async filterByRelevance(topic: string): Promise<boolean> {
    const keywords = [
      'visa', 'immigration', 'bali', 'indonesia', 'expat', 
      'relocation', 'kitas', 'passport', 'overstay', 'travel',
      'digital nomad', 'investor', 'resident', 'work permit'
    ];
    
    const lowerTopic = topic.toLowerCase();
    return keywords.some(k => lowerTopic.includes(k));
  },

  /**
   * Prevents duplication by checking existing KnowledgePage slugs.
   */
  async filterByUniqueness(slug: string): Promise<boolean> {
    const existing = await (prisma as any).knowledgePage.findUnique({
      where: { slug }
    });
    return !existing;
  }
};
