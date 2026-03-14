import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { KNOWLEDGE_TEMPLATES, ContentSection } from './knowledgeTemplates';

const internalOpenAI = createOpenAI({ apiKey: process.env.OPENAI_API_KEY_INTERNAL });

export async function generateKnowledgeArticle(topic: string, templateType: keyof typeof KNOWLEDGE_TEMPLATES = 'visa_knowledge') {
  const template = KNOWLEDGE_TEMPLATES[templateType];
  
  const systemPrompt = `You are the AI_IMMIGRATION_ANALYST for IndonesianVisas.com.
Your goal is to generate a comprehensive, SEO-optimized, 1200-3000 word knowledge article on the topic: "${topic}".

CORE REQUIREMENTS:
- Length: 1200 - 3000 words.
- Sections: Minimum 8, Maximum 20.
- Tone: Professional, authoritative, yet approachable (Expat-friendly).
- Legal: NO guarantees of visa approval. Must include a disclaimer that we are a private administrative agency.
- Internal Linking: You MUST include natural internal links to:
    - /indonesia-visa-guide-2026 (The Ultimate Guide)
    - /visa-types/b211a-visa-indonesia
    - /visa-types/kitas-indonesia
    - /apply
    - /visa-glossary
- Schema.org: Generate SEO metadata including breadcrumb titles and FAQ structured data if applicable.

You must return a JSON object with the following structure:
{
  "title": "Full SEO Title",
  "slug": "url-friendly-slug",
  "metadata": {
    "description": "Meta description (150-160 chars)",
    "keywords": ["keyword1", "keyword2"],
    "schema": {
      "type": "Article",
      "faq": [{ "question": "...", "answer": "..." }]
    }
  },
  "sections": [
    { "id": "section-id", "type": "section-type", "title": "Section Title", "content": "Markdown or Object content" }
  ]
}`;

  const { text } = await generateText({
    model: internalOpenAI('gpt-4o'),
    system: systemPrompt,
    prompt: `Generate a full article for the topic: ${topic}. Follow the section IDs from the ${templateType} template. Output strictly valid JSON.`,
  });

  try {
    const article = JSON.parse(text);
    return article;
  } catch (e) {
    console.error("Failed to parse AI article JSON", e);
    // Fallback or retry logic here
    throw new Error("KNOWLEDGE_GENERATION_FAILED");
  }
}
