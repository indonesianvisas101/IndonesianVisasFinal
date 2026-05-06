import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { KNOWLEDGE_TEMPLATES } from './knowledgeTemplates';
import { QUALITY_ENGINE } from './qualityEngine';

const internalOpenAI = createOpenAI({ apiKey: process.env.OPENAI_API_KEY_INTERNAL });

export type ContentType = 'knowledge' | 'news' | 'viral';

export async function generateKnowledgeArticle(
  topic: string, 
  author: { name: string, title: string },
  sources: { name: string, url: string }[],
  type: ContentType = 'knowledge'
) {
  const baseRequirements = `
- Author: ${author.name} (${author.title})
- Available Sources: ${sources.map(s => `${s.name} (${s.url})`).join(', ')}
- Legal: NO guarantees of visa approval. Must include a disclaimer that we are a private administrative agency.
- Tone: Professional, authoritative, and Expat-friendly.
- Internal Linking: Include natural links to /indonesia-visa-guide-2026, /visa-types/b211a-visa-indonesia, /visa-types/kitas-indonesia, /apply.
  `;

  const typeSpecificPrompts: Record<ContentType, string> = {
    knowledge: `
TYPE: KNOWLEDGE ARTICLE
FOCUS: Hard Facts, Official Regulations, and Internal Site Data.
REQUIREMENTS:
- Wajib menggunakan data fakta dari internet dengan sumber Official (Imigrasi Indonesia).
- Wajib menggunakan data dari dalam website IndonesianVisas.com (Cek sitemap context).
- Length: 1500-3000 words.
- Structure: Deep analysis, step-by-step guides, and technical requirements.
    `,
    news: `
TYPE: IMMIGRATION NEWS
FOCUS: New or Existing Regulations, Visa Policy Changes.
REQUIREMENTS:
- Berita Regulasi terbaru atau Regulasi Lama tentang ke immigrasian Indonesia.
- Kebijakan tentang visa, atau Info resmi dari Indonesianvisas.com.
- Length: 800-1500 words.
- Structure: Clear headlines, impact analysis for travelers/expats, and validity dates.
    `,
    viral: `
TYPE: VIRAL TREND
FOCUS: Social Media Trends, Expat Cases, Trending Immigration News.
REQUIREMENTS:
- Berita Viral di Internet, News, Social Media tentang keimmigratian indonesia.
- Fokus pada kasus-kasus bule/expat di Bali, Jakarta, dan Indonesia secara umum.
- Length: 1000-2000 words.
- Structure: Engaging hook, narrative style, community reaction summary, and legal perspective/consequence.
    `
  };

  const systemPrompt = `You are the AI_MASTER_CONTENT_GENERATOR for IndonesianVisas.com.
Your goal is to generate a "${type.toUpperCase()}" post for the topic: "${topic}".

${typeSpecificPrompts[type]}

${baseRequirements}

OUTPUT FORMAT (JSON):
{
  "title": "Full SEO Title",
  "slug": "url-friendly-slug",
  "summary": "Brief summary/meta description (150-160 chars)",
  "category": "Matching existing category (e.g., Bali News, Visa Guide, etc.)",
  "metadata": {
    "description": "Meta description",
    "keywords": ["keyword1", "keyword2"],
    "schema": {
      "type": "Article",
      "author": { "name": "${author.name}" },
      "faq": [{ "question": "...", "answer": "..." }]
    }
  },
  "sources_used": ["Name of source 1"],
  "sections": [
    { "id": "section-id", "type": "section", "title": "Section Title", "content": "Markdown content" }
  ]
}`;

  const { text } = await generateText({
    model: internalOpenAI('gpt-4o'),
    system: systemPrompt,
    prompt: `Generate the full ${type} article for: ${topic}. Output strictly valid JSON.`,
  });

  try {
    const article = JSON.parse(text);
    const qualityMetrics = QUALITY_ENGINE.evaluateContent(text, topic);
    
    return {
      ...article,
      content: article.sections, 
      qualityMetrics
    };
  } catch (e) {
    console.error("Failed to parse AI article JSON", e);
    throw new Error("CONTENT_GENERATION_FAILED");
  }
}
