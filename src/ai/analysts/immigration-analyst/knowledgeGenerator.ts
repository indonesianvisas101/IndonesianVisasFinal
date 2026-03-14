import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { KNOWLEDGE_TEMPLATES } from './knowledgeTemplates';
import { QUALITY_ENGINE } from './qualityEngine';

const internalOpenAI = createOpenAI({ apiKey: process.env.OPENAI_API_KEY_INTERNAL });

export async function generateKnowledgeArticle(
  topic: string, 
  author: { name: string, title: string },
  sources: { name: string, url: string }[],
  templateType: keyof typeof KNOWLEDGE_TEMPLATES = 'visa_knowledge'
) {
  const systemPrompt = `You are the AI_IMMIGRATION_ANALYST for IndonesianVisas.com.
Your goal is to generate a comprehensive, SEO-optimized, 1200-3000 word knowledge article on the topic: "${topic}".

AUTHORITY CONTEXT:
- Author: ${author.name} (${author.title})
- Available Sources: ${sources.map(s => `${s.name} (${s.url})`).join(', ')}

CORE REQUIREMENTS:
- Length: 1200 - 3000 words.
- Sections: Minimum 8, Maximum 20.
- Tone: Professional, authoritative, yet approachable (Expat-friendly).
- Legal: NO guarantees of visa approval. Must include a disclaimer that we are a private administrative agency.
- Source Referencing: You MUST cite at least one of the available sources naturally in the text.
- Internal Linking: You MUST include natural internal links to:
    - /indonesia-visa-guide-2026 (The Ultimate Guide)
    - /visa-types/b211a-visa-indonesia
    - /visa-types/kitas-indonesia
    - /apply
- Schema.org: Generate SEO metadata including breadcrumb titles and FAQ structured data. Include the author metadata.

You must return a JSON object with the following structure:
{
  "title": "Full SEO Title",
  "slug": "url-friendly-slug",
  "metadata": {
    "description": "Meta description (150-160 chars)",
    "keywords": ["keyword1", "keyword2"],
    "schema": {
      "type": "Article",
      "author": { "name": "${author.name}" },
      "faq": [{ "question": "...", "answer": "..." }]
    }
  },
  "sources_used": ["Name of source 1", "Name of source 2"],
  "sections": [
    { "id": "section-id", "type": "section-type", "title": "Section Title", "content": "Markdown content" }
  ]
}`;

  const { text } = await generateText({
    model: internalOpenAI('gpt-4o'),
    system: systemPrompt,
    prompt: `Generate a full article for the topic: ${topic}. Output strictly valid JSON.`,
  });

  try {
    const article = JSON.parse(text);
    
    // Perform Quality Evaluation
    const qualityMetrics = QUALITY_ENGINE.evaluateContent(text, topic);
    
    return {
      ...article,
      qualityMetrics
    };
  } catch (e) {
    console.error("Failed to parse AI article JSON", e);
    throw new Error("KNOWLEDGE_GENERATION_FAILED");
  }
}
