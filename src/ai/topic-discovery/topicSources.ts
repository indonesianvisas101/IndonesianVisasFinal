/**
 * AI Topic Discovery Utils & Sources
 * Defines potential signals for new immigration topics.
 */

export interface TopicSignal {
  id: string;
  query: string;
  source: 'google_trends' | 'visa_faq' | 'expat_relocation' | 'travel_regulatory';
  relevance: number; // 0-1
  intent: string;
}

export const TOPIC_SOURCES = {
  getRegulatorySignals: (): TopicSignal[] => [
    { id: 'reg-01', query: "Indonesia digital nomad visa news 2026", source: 'travel_regulatory', relevance: 0.95, intent: "Information seeking" },
    { id: 'reg-02', query: "New Bali immigration rules for overstay", source: 'travel_regulatory', relevance: 0.9, intent: "Compliance" },
    { id: 'reg-03', query: "Electronic Visa on Arrival Bali guide", source: 'travel_regulatory', relevance: 0.85, intent: "Process" }
  ],

  getExpatSignals: (): TopicSignal[] => [
    { id: 'exp-01', query: "Cost of living in Bali for remote workers 2026", source: 'expat_relocation', relevance: 0.8, intent: "Planning" },
    { id: 'exp-02', query: "How to open bank account in Bali for foreigners", source: 'expat_relocation', relevance: 0.75, intent: "Relocation" },
    { id: 'exp-03', query: "Living in Bali vs Thailand for expats", source: 'expat_relocation', relevance: 0.7, intent: "Comparison" }
  ],

  getSearchSignals: (): TopicSignal[] => [
    { id: 'sea-01', query: "Indonesia visa for UK citizens", source: 'google_trends', relevance: 1.0, intent: "Visa requirement" },
    { id: 'sea-02', query: "Bali visa for Indian passport holders", source: 'google_trends', relevance: 1.0, intent: "Visa requirement" },
    { id: 'sea-03', query: "How to apply for investor visa Indonesia", source: 'google_trends', relevance: 0.9, intent: "Investment" }
  ],

  getNewsSignals: (): TopicSignal[] => [
    { id: 'news-01', query: "Directorate General of Immigration Indonesia latest announcement", source: 'travel_regulatory', relevance: 1.0, intent: "News" },
    { id: 'news-02', query: "Indonesia visa fee changes 2026", source: 'travel_regulatory', relevance: 1.0, intent: "News" },
    { id: 'news-03', query: "Bali entry requirements update March 2026", source: 'travel_regulatory', relevance: 0.95, intent: "News" }
  ]
};
