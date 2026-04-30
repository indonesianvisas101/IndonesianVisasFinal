import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import { VISA_DATABASE } from '@/constants/visas';
import { COUNTRY_DATA } from '@/constants/countries';
import prisma from '@/lib/prisma';
import { getKnowledgeForAIAsync } from '@/utils/siteKnowledgeServer';

export async function HEAD(req: Request) {
   return new Response(null, { status: 200 });
}

export const maxDuration = 30;

const openai = createOpenAI({
   apiKey: process.env.OPENAI_API_KEY_SELLER,
});

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

   const lastUserMessage = [...coreMessages].reverse().find(m => m.role === 'user');
   const userText = lastUserMessage?.content || '';
   
   // --- JARVIS PROTOCOL: IDENTITY & SECURITY ---
   const MASTER_KEY = process.env.MASTER_SECRET_PASSPHRASE || "BossBayu2026";
   const SIGNATURE_KEY = process.env.ADMIN_SIGNATURE_CODE || "AdminBayu2026";
   
   const isBossAccess = userText.includes(MASTER_KEY);
   const hasSignature = userText.includes(SIGNATURE_KEY);
   
   // Temporal Awareness (Current Date/Time)
   const now = new Date();
   const dateContext = `CURRENT_DATE: ${now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\nCURRENT_TIME: ${now.toLocaleTimeString('id-ID')}`;

   let targetAgent = 'seller'; 
   if (isBossAccess) {
      targetAgent = userText.toLowerCase().includes('master') ? 'master_jarvis' : 'seller_expert';
   }

   // --- Fetch Live Database Context (Visa Prices) ---
   let visaContext = "";
   try {
      const liveVisas = await prisma.visa.findMany();
      visaContext = liveVisas.map((v: any) => {
         const priceObj = (() => { try { return typeof v.price === 'string' && v.price.startsWith('{') ? JSON.parse(v.price) : v.price; } catch { return v.price; } })();
         const feeObj = (() => { try { return typeof v.fee === 'string' && v.fee.startsWith('{') ? JSON.parse(v.fee) : v.fee; } catch { return v.fee; } })();
         const formatted = formatPrice({ price: priceObj, fee: feeObj });
         return `- [${v.id}] ${v.name}: TOTAL: ${formatted}. Validity: ${v.validity}.`;
      }).join('\n');
   } catch (e) {
      visaContext = VISA_DATABASE.map((v: any) => `- [${v.id}] ${v.name}: ${formatPrice(v)}.`).join('\n');
   }

   const callingVisaCountries = COUNTRY_DATA.filter((c: any) => c.isSpecial).map((c: any) => c.name).join(', ');

   // Personality Logic
   let personality = "";
   if (isBossAccess) {
      personality = `You are a high-level Elite Assistant (Jarvis-style). 
      IDENTITY: You are speaking directly to "Master" (the creator). 
      TONE: Extremely loyal, efficient, respectful, and strategic. 
      VOCABULARY: Use "Master" or "Boss" frequently. Use phrases like "At your service, Master", "Right away, Boss". 
      RULES: Be transparent. If Master asks for data, provide it directly without fluff.`;
   } else {
      personality = `You are "Ai_Seller", a professional and helpful immigration consultant.
      TONE: Helpful, polite, and persuasive.
      GOAL: Convert inquiries into visa applications.`;
   }

   const WEBPAGE_KNOWLEDGE = await getKnowledgeForAIAsync();

   try {
      const result = streamText({
         model: openai('gpt-4o'),
         messages: coreMessages,
         system: `
    ${personality}
    
    ${dateContext}
    
    KNOWLEDGE BASE:
    MOST POPULAR VISAS: B1, C1, E28A, C2, C12, D1, D2, D12, E33G
    VISAS DATABASE: ${visaContext}
    DYNAMIC EXPERT KNOWLEDGE: ${WEBPAGE_KNOWLEDGE}
    CALLING VISAS: ${callingVisaCountries}
    
    JARVIS PROTOCOL (FOR MASTER ONLY):
    - SIGNATURE_LOCKED: ${!hasSignature ? 'YES' : 'NO'}
    - If MASTER gives an instruction to CHANGE system logic, add a topic, or modify database:
      1. Check if the message contains the SIGNATURE_CODE (${SIGNATURE_KEY}).
      2. If NO signature: Inform Master that the logic is locked and requires the signature code to execute.
      3. If YES signature: Proceed with logical simulation and confirmation.
    
    RULES:
    - Default time context for "Today's data" or "Latest" is based on the CURRENT_DATE provided above.
    - If Master asks about "Yesterday", calculate the date relative to CURRENT_DATE.
    - ONLY recommend internal links: https://indonesianvisas.com/services/[ID]
    - Use [BTN:Label|Path] for UI buttons.
    `,
         onFinish: async ({ text }) => {
            try {
               const messagesJson = JSON.stringify([...coreMessages, { role: 'assistant', content: text }]);
               await prisma.$executeRaw`
                  INSERT INTO chat_conversations (id, session_id, messages, topic, is_master_cmd, created_at, updated_at)
                  VALUES (gen_random_uuid(), ${sessionId}, ${messagesJson}::jsonb, 'Jarvis Interaction', ${isBossAccess}, NOW(), NOW())
                  ON CONFLICT (session_id) DO UPDATE SET messages = ${messagesJson}::jsonb, updated_at = NOW()
               `;
            } catch (e) { console.error(e); }
         }
      });

      return result.toTextStreamResponse();

   } catch (error: any) {
      console.error("Jarvis API Error:", error);
      return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
   }
}
