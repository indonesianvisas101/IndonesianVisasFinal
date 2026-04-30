import prisma from '@/lib/prisma';
import { SITE_KNOWLEDGE } from './siteKnowledge';

export const getKnowledgeForAI = () => {
    return SITE_KNOWLEDGE.map(entry => `- [${entry.title}] (${entry.link}): ${entry.description}`).join('\n');
};

/**
 * HARDENED Dynamic Knowledge Fetcher
 * Fetches knowledge with safety limits to prevent LLM token overflow.
 */
export const getKnowledgeForAIAsync = async () => {
    const staticKnowledge = getKnowledgeForAI();
    
    try {
        // 1. Fetch with specific limits and ordering to get freshest content first
        const [pages, updates] = await Promise.all([
            prisma.knowledgePage.findMany({
                where: { published: true },
                select: { title: true, slug: true, category: true, metadata: true, content: true },
                orderBy: { createdAt: 'desc' },
                take: 15 // Limit to 15 freshest articles to stay within token context
            }),
            prisma.immigrationUpdate.findMany({
                where: { 
                    published: true,
                    category: { contains: 'KNOWLEDGE' }
                },
                select: { title: true, slug: true, category: true, summary: true, content: true },
                orderBy: { createdAt: 'desc' },
                take: 10 // Limit to 10 freshest news refs
            })
        ]);

        // 2. Format with truncation safety
        const dynamicPages = pages.map(p => {
            const desc = (p.metadata as any)?.description || '';
            const rawContent = typeof p.content === 'string' ? p.content : JSON.stringify(p.content);
            // Truncate individual content to 800 chars to allow more articles in context
            const preview = rawContent.length > 800 ? rawContent.slice(0, 800) + '...' : rawContent;
            return `ARTICLE: [${p.title}] (/visa-knowledge/${p.slug})\nDESC: ${desc}\nCONTEXT: ${preview}\n---`;
        });

        const dynamicUpdates = updates.map(u => {
            const rawContent = u.content || '';
            const preview = rawContent.length > 600 ? rawContent.slice(0, 600) + '...' : rawContent;
            return `LATEST_NEWS: [${u.title}] (/indonesia-visa-updates/${u.slug})\nCONTEXT: ${preview}\n---`;
        });

        // 3. Construct final hardened payload
        const header = "### DYNAMIC EXPERT KNOWLEDGE BASE ###";
        const footer = "### END OF KNOWLEDGE BASE ###";

        return `
${staticKnowledge}

${header}
${dynamicPages.length > 0 ? dynamicPages.join('\n') : 'No additional expert articles available.'}

${dynamicUpdates.length > 0 ? dynamicUpdates.join('\n') : 'No high-priority news updates available.'}
${footer}
`.trim();

    } catch (e) {
        console.error("[HARDENING] Failed to fetch dynamic knowledge safely:", e);
        // Always fallback to static to prevent AI from losing ALL context
        return `${staticKnowledge}\n\n[SYSTEM NOTE: Dynamic database link temporarily unavailable. Relying on core service data.]`;
    }
};
