import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import { VISA_DATABASE } from '@/constants/visas';
import { COUNTRY_DATA } from '@/constants/countries';
import prisma from '@/lib/prisma';
import { getKnowledgeForAI } from '@/utils/siteKnowledge';

export async function HEAD(req: Request) {
   return new Response(null, { status: 200 });
}

export const maxDuration = 30;

// Create an OpenAI provider instance with the Seller API key
const openai = createOpenAI({
   apiKey: process.env.OPENAI_API_KEY_SELLER,
});

// HELPER: Calculate Total Price (Price + Fee)
function formatPrice(v: any): string {
   try {
      if (typeof v.price === 'object' && v.price !== null) {
         let result = "";
         for (const [key, val] of Object.entries(v.price)) {
            const baseStr = String(val).replace(/[^0-9]/g, '');
            const feeVal = v.fee && typeof v.fee === 'object' ? (v.fee as any)[key] : 0;
            const base = parseInt(baseStr || '0');
            const fee = parseInt(String(feeVal).replace(/[^0-9]/g, '') || '0');
            const total = base + fee;
            result += `[${key}: IDR ${total.toLocaleString('id-ID')} (Base ${base.toLocaleString()} + Fee ${fee.toLocaleString()})] `;
         }
         return result;
      }
      const priceStr = String(v.price).replace(/[^0-9]/g, '');
      const feeStr = String(v.fee).replace(/[^0-9]/g, '');
      const base = parseInt(priceStr || '0');
      const fee = parseInt(feeStr || '0');
      const total = base + fee;
      return `IDR ${total.toLocaleString('id-ID')} (Includes Base IDR ${base.toLocaleString()} + Fee IDR ${fee.toLocaleString()})`;
   } catch (e) {
      return `Base: ${JSON.stringify(v.price)} + Fee: ${JSON.stringify(v.fee)}`;
   }
}

export async function POST(req: Request) {
   const body = await req.json();
   const { messages, sessionId: rawSessionId } = body;
   const sessionId = rawSessionId || `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

   // Sanitize messages
   const coreMessages = (messages as any[])
      .map(m => ({
         role: m.role,
         content: m.content || m.text || ''
      }))
      .filter(m =>
         ['user', 'assistant', 'system'].includes(m.role) &&
         typeof m.content === 'string' &&
         m.content.trim() !== ''
      );

   // ─── @BossBayu2026 Orchestration & Redirection ────────────────
   const lastUserMessage = [...coreMessages].reverse().find(m => m.role === 'user');
   const userText = lastUserMessage?.content || '';
   
   const isBossAccess = userText.includes("@BossBayu2026") || userText.includes("@BayuBoss2026");
   
   // Unified Detection: If user starts with Code + @TargetAgent + "command"
   const bossModeMatch = userText.match(/(@BossBayu2026|@BayuBoss2026)\s+@(Ai_Master|Ai_Seller|Master|Seller)\s+"([^"]+)"/i);
   
   let targetAgent = 'seller'; 
   let activeCommand = '';
   
   if (bossModeMatch) {
      const target = bossModeMatch[1].toLowerCase();
      activeCommand = bossModeMatch[2];
      
      if (target.includes('master')) targetAgent = 'master';
      else targetAgent = 'seller_expert';
      
      // Inject the command as the last message for immediate action
      coreMessages[coreMessages.length - 1].content = activeCommand;
   } else if (isBossAccess) {
      targetAgent = userText.match(/@(Ai_Master|Master)/i) ? 'master' : 'seller_expert';
   }

   // ─── Fetch Live Database Context (Visa Prices) ────────────────
   let visaContext = "";
   try {
      const liveVisas = await prisma.visa.findMany();
      visaContext = liveVisas.map(v => {
         const priceObj = (() => { try { return typeof v.price === 'string' && v.price.startsWith('{') ? JSON.parse(v.price) : v.price; } catch { return v.price; } })();
         const feeObj = (() => { try { return typeof v.fee === 'string' && v.fee.startsWith('{') ? JSON.parse(v.fee) : v.fee; } catch { return v.fee; } })();
         const formatted = formatPrice({ price: priceObj, fee: feeObj });
         return `- [${v.id}] ${v.name}: TOTAL: ${formatted}. Validity: ${v.validity}. Status: Active.`;
      }).join('\n');
   } catch (e) {
      visaContext = VISA_DATABASE.map(v => `- [${v.id}] ${v.name}: ${formatPrice(v)}.`).join('\n');
   }

   // Prepare SPECIAL COUNTRIES Context (Calling Visa)
   const callingVisaCountries = COUNTRY_DATA
      .filter(c => c.isSpecial)
      .map(c => c.name)
      .join(', ');

   // ─── Personality Addressing Logic (BOSS MODE) ───────────────
   let addressRule = "";
   if (isBossAccess) {
      addressRule = `RULE: You are talking to "Boss Bayu". Address the user as "Boss" or "Boss Bayu". Use a loyal, respectful, and highly efficient "COO" tone. Use phrases like "Eye eye Boss", "Right away Boss".`;
   } else {
      addressRule = `RULE: Address the user politely as a customer. DO NOT use the term "Boss".`;
   }

   const WEBPAGE_KNOWLEDGE = getKnowledgeForAI();

   const systemPrompts: Record<string, string> = {
      seller: `You are "Ai_Seller", the voice of Indonesian Visas. 
      ${addressRule}
      Goal: Convert inquiries into visa applications.`,
      
      seller_expert: `You are "Ai_Seller (Expert Mode)". 
      ${addressRule}
      Goal: Provide strategic technical immigration advice directly to the Boss.`,
      
      master: `You are "Ai_Master", the high-level orchestrator. 
      ${addressRule}
      Goal: Monitor ecosystem health, status reports, and execute system commands.
      NOTE: You can report on Orders and Status if prompted.`
   };

   try {
      const result = streamText({
         model: openai('gpt-4o'),
         messages: coreMessages,
         system: `
    ${systemPrompts[targetAgent] || systemPrompts.seller}
    
    KNOWLEDGE:
    VISAS: ${visaContext}
    PAGES: ${WEBPAGE_KNOWLEDGE}
    CALLING VISAS: ${callingVisaCountries}
    
    BEHAVIOR:
    - Auto-detect language.
    - If talking to Boss: Be professional, direct, and elite. No fluff.
    - If talking to Customer: Be helpful, encouraging, and redirect to /apply.
    - If command detected in Boss Mode: Focus purely on that command action.
    - Use [BTN:Label|Path] for action buttons.
    `,
         onFinish: async ({ text }) => {
            try {
               const messagesJson = JSON.stringify([...coreMessages, { role: 'assistant', content: text }]);
               await prisma.$executeRaw`
                  INSERT INTO chat_conversations (id, session_id, messages, topic, is_master_cmd, created_at, updated_at)
                  VALUES (gen_random_uuid(), ${sessionId}, ${messagesJson}::jsonb, 'Boss Interaction', ${isBossAccess}, NOW(), NOW())
                  ON CONFLICT (session_id) DO UPDATE SET messages = ${messagesJson}::jsonb, updated_at = NOW()
               `;
            } catch (e) { console.error(e); }
         }
      });

      return result.toTextStreamResponse();

   } catch (error: any) {
      console.error("AI Chat Error:", error);
      return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
   }
}
