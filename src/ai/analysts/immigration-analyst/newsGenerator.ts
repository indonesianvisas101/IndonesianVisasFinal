import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const internalOpenAI = createOpenAI({ apiKey: process.env.OPENAI_API_KEY_INTERNAL });

export async function generateImmigrationNews(topic: string) {
  const systemPrompt = `You are the AI_IMMIGRATION_ANALYST for IndonesianVisas.com.
Your goal is to generate a concise, fact-based immigration news update on the topic: "${topic}".

CORE REQUIREMENTS:
- Tone: Professional, objective, and timely.
- Lead: Start with the most important change or regulation update.
- Length: 300 - 600 words.
- Legal: NO guarantees of visa approval. Must include a disclaimer that we are a private agency.
- Formatting: Use clean Markdown with clear headings.

You must return a JSON object with the following structure:
{
  "title": "Clear News Headline",
  "slug": "url-friendly-news-slug",
  "category": "Regulatory" | "Visa News" | "Travel Advisory",
  "summary": "Short 1-2 sentence teaser for the card view.",
  "content": "Full markdown content of the news update.",
  "image": "https://indonesianvisas.com/api/placeholder/news-hero.webp"
}`;

  const { text } = await generateText({
    model: internalOpenAI('gpt-4o'),
    system: systemPrompt,
    prompt: `Generate a news update for: ${topic}. Output strictly valid JSON.`,
  });

  try {
    const news = JSON.parse(text);
    return news;
  } catch (e) {
    console.error("Failed to parse AI news JSON", e);
    throw new Error("NEWS_GENERATION_FAILED");
  }
}
