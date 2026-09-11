import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Safe directory resolution compatible with both dev and production
const serverDirname = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of Gemini GenAI client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

const BURHANI_STORE_SYSTEM_INSTRUCTION = `You are "Burhani AI", the official hardware and plumbing expert assistant for Burhani Hardware Mart, Coimbatore.
You are warm, courteous, technically knowledgeable, and highly practical.

Key Store Information:
- Business: Burhani Hardware Mart
- Address: Huzaifa Square, 14/2, Mill Rd, Sukrawar Pettai, Town Hall, Coimbatore, Tamil Nadu 641001
- Phone / Contact: 09843128546 (WhatsApp enabled)
- Hours: Mon–Sat: 9:30 AM – 7:30 PM, Sun: 10:00 AM – 12:00 PM (Public holiday/Ganesh Chaturthi notice: hours may vary, advise calling ahead)
- Delivery: Same-day express local Coimbatore delivery (RS Puram, Town Hall, Saibaba Colony, Gandhipuram, Peelamedu, Race Course, Singanallur, Saravanampatti) or in-store pickup at Huzaifa Square.
- Payment modes: UPI (Google Pay, PhonePe, Paytm, BHIM), Cards (RuPay, Visa, MasterCard), Net Banking, Cash at store counter.
- Currency: ALWAYS use Indian Rupees (₹ or INR). NEVER use dollar signs ($).

Product Categories & Expert Advice:
1. Sanitaryware & Closets: Rimless wall-hung commodes, one-piece floor-mounted closets, concealed dual-flush cisterns, anti-bacterial glazed vitreous china, soft-close hydraulic seat covers (Authorized dealer of Parryware, Hindware, Jaquar).
2. Wash Basins & Countertops: Designer tabletop ceramic basins, matte-finish basins, undermount basins, corner basins for compact bathrooms.
3. Faucets & Showers: Solid brass quarter-turn bib taps, single-lever hot/cold basin mixers, overhead rain showers with silicone nozzles, SS 304 health faucets.
4. Plumbing Pipes & Valves: UPVC schedule 40/80 pressure pipes & fittings, CPVC hot water pipes, full-bore brass ball valves (Astral, Supreme), brass non-return check valves, union valves.
5. Heavy Duty Manhole Covers & Chambers: High-grade FRP/GRP composite inspection chamber covers and recessed drain grates with airtight seals.
   - Load classes:
     * A15 (1.5 Tonne): Pedestrian walkways, home gardens, cycle paths.
     * B125 (12.5 Tonne): Domestic car parking, residential driveways.
     * C250 (25 Tonne): Commercial driveways, light delivery vehicle lanes.
     * D400 (40 Tonne): Heavy traffic carriageways, industrial godowns.
6. Plumbing Tools: Drop-forged heavy-duty pipe wrenches (10" to 24"), ratchet UPVC pipe cutters, virgin PTFE thread seal Teflon tapes, basin spud wrenches.

Behavioral Guidelines:
- Keep answers crisp, structured, and easy to read with bullet points when listing specs or recommendations.
- When recommending items, mention specific dimensions, materials, and prices in ₹ INR.
- If a customer asks about visiting or urgent plumbing parts, provide the Huzaifa Square address and phone number (09843128546).
- If asked about custom bulk pricing or contractor supply for construction projects, welcome them to share their bill of materials for wholesale contractor discounts.`;

// Rule-based fallback generator if GEMINI_API_KEY is not configured or upstream is temporarily unavailable
function generateFallbackResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes('hour') || lower.includes('time') || lower.includes('open') || lower.includes('sunday') || lower.includes('timing')) {
    return `🕒 **Burhani Hardware Mart Operating Hours:**\n\n- **Monday to Saturday:** 9:30 AM – 7:30 PM\n- **Sunday:** 10:00 AM – 12:00 PM\n\n📍 *Located at Huzaifa Square, 14/2 Mill Road, Sukrawar Pettai, Town Hall, Coimbatore 641001.*\n📞 Call us directly at **09843128546** before visiting on festival holidays like Ganesh Chaturthi!`;
  }

  if (lower.includes('location') || lower.includes('address') || lower.includes('where') || lower.includes('map') || lower.includes('reach') || lower.includes('sukrawar') || lower.includes('mill road')) {
    return `📍 **Our Showroom & Warehouse Location:**\n\n**Burhani Hardware Mart**\nHuzaifa Square, 14/2, Mill Road, Sukrawar Pettai, Town Hall, Coimbatore, Tamil Nadu 641001.\n\n- Near Town Hall & Sukrawar Pettai landmark.\n- Full parking and loading facility for contractor consignments.\n- **Direct Line:** 09843128546\n\nYou can also click the **"Location & Hours"** tab on top to view the live interactive Google Map!`;
  }

  if (lower.includes('manhole') || lower.includes('frp') || lower.includes('drain') || lower.includes('chamber') || lower.includes('cover') || lower.includes('grate')) {
    return `🛡️ **Heavy Duty FRP Manhole Covers & Chambers:**\n\nAt Burhani Hardware Mart, we stock all standard Indian standard load classes:\n\n1. **Class A15 (1.5 Tonne):** Ideal for residential footpaths, lawn inspection chambers, and pedestrian areas. (e.g. 12"×12" or 18"×18" FRP cover from ₹1,450).\n2. **Class B125 (12.5 Tonne):** Best for domestic car garages, apartment driveways, and residential parking. (e.g. 18"×24" or 24"×24" heavy duty from ₹2,850).\n3. **Class C250 (25 Tonne):** For commercial complex driveways and light delivery vehicle lanes.\n4. **Class D400 (40 Tonne):** High-load industrial corridors and main access ways.\n\nAll our FRP covers are rust-free, anti-theft, weather-resistant, and come with locking keys and rubber gaskets to eliminate sewer odors.`;
  }

  if (lower.includes('pipe') || lower.includes('valve') || lower.includes('upvc') || lower.includes('cpvc') || lower.includes('astral') || lower.includes('supreme')) {
    return `🔧 **Pipes, Valves & Fittings Guide:**\n\n- **UPVC Pipes & Valves:** Perfect for cold water potable lines, agricultural feed, and drainage. We stock genuine **Supreme & Astral UPVC Ball Valves** (1/2" to 2" starting from ₹280) with full brass stem and EPDM O-rings.\n- **CPVC Pipes & Fittings:** For hot water lines (solar water heater & geyser inlets) withstands up to 93°C.\n- **Brass Non-Return Valves (NRV):** Essential for overhead tank feeds and jet pumps to prevent backflow and air locks (₹680 for 1-inch heavy brass).\n\nNeed a plumbing bill of quantities estimate? Call our warehouse desk at **09843128546**!`;
  }

  if (lower.includes('basin') || lower.includes('sink') || lower.includes('counter') || lower.includes('vanity')) {
    return `✨ **Wash Basin Solutions for Coimbatore Homes:**\n\n- **Tabletop Countertop Ceramic Basins:** Modern minimalist designs with nano-antibacterial glaze in Alpine White or Matte Slate (starting at ₹2,650).\n- **Compact Corner Basins:** Space-saving solutions for powder rooms and compact utility areas.\n- **Wall-Hung with Half Pedestal:** Clean minimalist look where floor space is limited.\n\nAll our ceramic basins are compatible with standard 32mm pop-up waste couplings and bottle traps in stock at Mill Road.`;
  }

  if (lower.includes('closet') || lower.includes('commode') || lower.includes('toilet') || lower.includes('sanitaryware') || lower.includes('parryware') || lower.includes('hindware') || lower.includes('jaquar')) {
    return `🚽 **Sanitaryware & Closets:**\n\nWe are direct wholesale & retail dealers for **Parryware, Hindware & Jaquar** in Coimbatore:\n\n- **Rimless Wall-Hung Closets:** 360° tornado vortex wash with zero hidden rim bacteria zones. Includes soft-close hydraulic UF seat cover (from ₹6,800).\n- **One-Piece Floor-Mounted Commodes:** S-Trap / P-Trap configurations with high-efficiency 3/6 litre dual flush systems.\n- **Concealed Cisterns:** Slim 80mm pneumatic in-wall tanks with stylish dual-flush actuator plates.\n\nVisit our Huzaifa Square showroom display to view the full fixture collection!`;
  }

  if (lower.includes('tap') || lower.includes('faucet') || lower.includes('shower') || lower.includes('mixer') || lower.includes('diverter')) {
    return `🚿 **Faucets, Showers & Bathroom Fittings:**\n\n- **Quarter-Turn Brass Bib Taps:** Solid forged brass body with mirror chrome plating and ceramic disc cartridges rated for 500,000 cycles (from ₹450).\n- **Single-Lever Basin Mixers:** Smooth ceramic cartridge with hot/cold blend control (from ₹1,850).\n- **Overhead Rain Showers:** 8-inch to 12-inch SS 304 rain showers with self-cleaning silicone rub-it nozzles.\n- **Health Faucets:** Heavy brass internal core with 1.2m anti-twist flexible hose (from ₹650).\n\nBrowse these directly in the **Product Catalog** tab!`;
  }

  if (lower.includes('delivery') || lower.includes('shipping') || lower.includes('rs puram') || lower.includes('peelamedu') || lower.includes('town hall') || lower.includes('saibaba')) {
    return `🚚 **Delivery Across Coimbatore:**\n\n- **Same-Day Dispatch:** Orders placed before 3:00 PM for Town Hall, RS Puram, Saibaba Colony, Gandhipuram, Race Course, Ramanathapuram, and Peelamedu qualify for same-day delivery via Burhani Express fleet.\n- **Free Delivery:** On all hardware consignments above ₹2,000.\n- **Store Counter Pickup:** Ready in 30 minutes at Huzaifa Square, 14/2 Mill Road, Coimbatore.`;
  }

  if (lower.includes('payment') || lower.includes('upi') || lower.includes('card') || lower.includes('gpay') || lower.includes('phonepe')) {
    return `💳 **Accepted Payment Methods:**\n\n- **UPI:** Google Pay, PhonePe, Paytm, BHIM with instant dynamic QR code at checkout or counter.\n- **Cards:** RuPay, Visa, MasterCard debit & credit cards.\n- **Net Banking:** All major Indian banks supported.\n- **Cash on Store Pickup:** Huzaifa Square counter billing.\n\nAll online transactions are protected with 256-bit SSL encryption.`;
  }

  if (lower.includes('discount') || lower.includes('contractor') || lower.includes('wholesale') || lower.includes('bulk')) {
    return `🏷️ **Contractor & Bulk Project Discounts:**\n\nWe offer tiered wholesale pricing for builders, plumbing contractors, and large residential renovations across Coimbatore district.\n\n- Bring or WhatsApp your Bill of Quantities (BOQ) to **09843128546**.\n- Get direct wholesale dealer pricing on Astral/Supreme pipes, Jaquar/Parryware fixtures, and heavy FRP manhole covers!`;
  }

  if (lower.includes('contact') || lower.includes('phone') || lower.includes('call') || lower.includes('whatsapp') || lower.includes('number')) {
    return `📞 **Contact Burhani Hardware Mart:**\n\n- **Phone Hotline:** **09843128546**\n- **WhatsApp:** +91 98431 28546\n- **Email:** orders@burhanihardware.in\n- **Address:** Huzaifa Square, 14/2, Mill Rd, Sukrawar Pettai, Town Hall, Coimbatore 641001\n\nOur team is available Mon-Sat 9:30 AM – 7:30 PM to quote contractor rates and check stock.`;
  }

  return `Hello! I am **Burhani AI**, your assistant for **Burhani Hardware Mart** in Coimbatore.\n\nI can help you with:\n- **Sanitaryware & Commodes:** Wall-hung closets, concealed flush tanks, Parryware & Hindware options.\n- **Faucets & Mixers:** Jaquar brass taps, rain showers, diverters.\n- **Plumbing Pipes & Valves:** Astral / Supreme UPVC & CPVC ball valves and fittings.\n- **FRP Manhole Covers:** Heavy-duty A15, B125, and C250 inspection chamber lids for driveways.\n- **Store Location & Hours:** Huzaifa Square, Mill Road, Coimbatore (Phone: 09843128546).\n\nWhat plumbing or hardware project can I assist you with today?`;
}

// API Health route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    store: 'Burhani Hardware Mart', 
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') 
  });
});

// Candidate models in order of preference when handling high demand or 503 retries
const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Gemini AI Chatbot Handler with timeout protection, resilient multi-model failover and backoff
const handleChatRequest = async (req: express.Request, res: express.Response) => {
  try {
    const { messages, userQuery } = req.body;
    
    // Extract query or last message
    const lastUserMessage = userQuery || 
      (Array.isArray(messages) && messages.length > 0 
        ? messages[messages.length - 1]?.content || '' 
        : '');

    if (!lastUserMessage || typeof lastUserMessage !== 'string' || lastUserMessage.trim() === '') {
      return res.status(400).json({ error: 'A valid message string is required.' });
    }

    const ai = getGenAI();

    // If Gemini key is available, attempt generation with candidate models and backoff
    if (ai) {
      // Build conversation contents
      const contentsPayload: any[] = [];

      // If previous conversation history is passed, include up to 8 recent exchanges
      if (Array.isArray(messages) && messages.length > 1) {
        const recent = messages.slice(-8);
        for (const m of recent) {
          const role = m.role === 'assistant' || m.role === 'model' ? 'model' : 'user';
          contentsPayload.push({
            role: role,
            parts: [{ text: String(m.content) }],
          });
        }
      } else {
        contentsPayload.push({
          role: 'user',
          parts: [{ text: lastUserMessage }],
        });
      }

      // Try candidate models with strict timeout protection (2.8s per attempt)
      for (const modelName of CANDIDATE_MODELS) {
        try {
          const timeoutMs = 2800;
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), timeoutMs)
          );

          const generatePromise = ai.models.generateContent({
            model: modelName,
            contents: contentsPayload,
            config: {
              systemInstruction: BURHANI_STORE_SYSTEM_INSTRUCTION,
              temperature: 0.7,
              maxOutputTokens: 900,
            },
          });

          const response = (await Promise.race([generatePromise, timeoutPromise])) as any;

          if (response && response.text) {
            return res.json({
              reply: response.text,
              source: modelName,
            });
          }
        } catch (modelError: any) {
          // If timed out or failed, continue to fallback or next model
          continue;
        }
      }

      // If all upstream models timed out or were busy, provide the authoritative local knowledge reply
      const fallbackText = generateFallbackResponse(lastUserMessage);
      return res.json({
        reply: fallbackText,
        source: 'knowledge-engine',
      });
    }

    // Knowledge-engine fallback when no API key is configured
    const fallbackText = generateFallbackResponse(lastUserMessage);
    return res.json({
      reply: fallbackText,
      source: 'knowledge-engine',
    });
  } catch (error: any) {
    const fallbackText = generateFallbackResponse(typeof req.body?.userQuery === 'string' ? req.body.userQuery : '');
    return res.json({
      reply: fallbackText || "Thank you for contacting Burhani Hardware Mart. Call our desk at 09843128546 for immediate stock assistance!",
      source: 'knowledge-engine',
    });
  }
};

app.post('/api/chat', handleChatRequest);
app.post('/api/ai/chat', handleChatRequest);

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Burhani Hardware Mart server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
