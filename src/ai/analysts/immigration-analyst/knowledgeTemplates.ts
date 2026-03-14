export interface ContentSection {
  id: string;
  type: 'hero' | 'text' | 'list' | 'faq' | 'cta' | 'disclaimer';
  title?: string;
  content: any;
}

export const KNOWLEDGE_TEMPLATES = {
  visa_knowledge: {
    sections: [
      { id: 'hero', type: 'hero', title: '{{topic_name}}' },
      { id: 'overview', type: 'text', title: 'What is {{topic_name}}?' },
      { id: 'eligibility', type: 'list', title: 'Eligibility Requirements' },
      { id: 'documents', type: 'list', title: 'Required Documents' },
      { id: 'process', type: 'text', title: 'Application Process' },
      { id: 'cost', type: 'text', title: 'Cost Estimates' },
      { id: 'mistakes', type: 'list', title: 'Common Mistakes to Avoid' },
      { id: 'faq', type: 'faq', title: 'Frequently Asked Questions' },
      { id: 'advice', type: 'text', title: 'Expert Immigration Advice' },
      { id: 'disclaimer', type: 'disclaimer', title: 'Legal Disclaimer' },
    ]
  },
  expat_guide: {
    sections: [
      { id: 'introduction', type: 'hero', title: '{{topic_name}}' },
      { id: 'lifestyle', type: 'text', title: 'Lifestyle & Community' },
      { id: 'logistics', type: 'list', title: 'Logistics & Settling In' },
      { id: 'cost_of_living', type: 'text', title: 'Cost of Living Breakdown' },
      { id: 'legal', type: 'text', title: 'Legal Considerations' },
      { id: 'faq', type: 'faq', title: 'Expat FAQ' },
      { id: 'cta', type: 'cta', title: 'Get Started' },
    ]
  }
};
