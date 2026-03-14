import { TOPIC_SOURCES, TopicSignal } from './topicSources';
import { TOPIC_FILTERS } from './topicFilters';

/**
 * AI Topic Discovery Engine
 * Core logic to discover and prioritize immigration topics.
 */

export interface DiscoveredTopic {
  title: string;
  slug: string;
  source: string;
  priority: number;
}

export const TOPIC_DISCOVERY_ENGINE = {
  async discoverNewTopics(): Promise<DiscoveredTopic[]> {
    const allSignals: TopicSignal[] = [
      ...TOPIC_SOURCES.getRegulatorySignals(),
      ...TOPIC_SOURCES.getExpatSignals(),
      ...TOPIC_SOURCES.getSearchSignals(),
    ];

    const discovered: DiscoveredTopic[] = [];

    for (const signal of allSignals) {
      // 1. Check Relevance
      const isRelevant = await TOPIC_FILTERS.filterByRelevance(signal.query);
      if (!isRelevant) continue;

      // 2. Generate Slug
      const slug = signal.query
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // 3. Check Uniqueness
      const isUnique = await TOPIC_FILTERS.filterByUniqueness(slug);
      if (!isUnique) continue;

      discovered.push({
        title: this.sanitizeTitle(signal.query),
        slug,
        source: signal.source,
        priority: signal.relevance
      });
    }

    // Sort by priority
    return discovered.sort((a, b) => b.priority - a.priority);
  },

  sanitizeTitle(query: string): string {
    return query
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
};
