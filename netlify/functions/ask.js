// Project knowledge base for answering questions
const PROJECT_CONTEXT = `
AgroNIS - Aqlli Qishloq Xo'jaligi Tizimi (Smart Farming System)

MUAMMO (Problem):
O'zbekistondagi fermerlar sug'orish va o'g'itlash uchun aniq ma'lumotlarga ega emas. Bu suv isrofgarchiligiga, past hosildorlikka va resurslarning noto'g'ri sarflanishiga olib keladi.

YECHIM (Solution):
AgroNIS - bu IoT sensorlar va sun'iy intellekt asosida ishlaydigan aqlli qishloq xo'jaligi platformasi. U real vaqt rejimida tuproq namligi, harorat va elektr o'tkazuvchanligini kuzatib, fermerlarga aniq tavsiyalar beradi.

TEXNOLOGIYALAR (Tech Stack):
- Frontend: React + TypeScript + Tailwind CSS
- AI: Google Gemini 2.5 Flash (tavsiyalar uchun), Gemini Flash-Lite (tezkor holat uchun)
- IoT: ESP32 mikrokontroller + tuproq sensorlari
- Deployment: Netlify (frontend), Netlify Functions (API)
- Map Integration: Google Maps API (resurslarni topish uchun)

ASOSIY FUNKSIYALAR (Key Features):
1. Real-time sensor monitoring (tuproq namligi, harorat, EC)
2. AI-powered irrigation recommendations (sug'orish tavsiyalari)
3. Weather forecast integration (ob-havo ma'lumotlari)
4. AI Chatbot for farmers (fermerlar uchun yordamchi)
5. Analytics dashboard (tahlil paneli)
6. Local resources finder (mahalliy resurslar)

MAQSADLI AUDITORIYA (Target Audience):
O'zbekistondagi kichik va o'rta fermerlar, qishloq xo'jaligi kooperativlari, agrotexnika kompaniyalari.

ROADMAP STAGE: MLP (Minimum Lovable Product) / MVP
- Idea ✓
- Prototype ✓  
- MVP/MLP ✓ (hozirgi bosqich)
- Launched (keyingi qadam)

KEYINGI QADAMLAR (Next Steps):
1. IoT sensorlarni ishlab chiqarish va fermerlar bilan sinov
2. Mobil ilova yaratish
3. Qo'shimcha ekin turlari uchun AI modellarni o'rgatish
4. Agrobank va boshqa hamkorlar bilan integratsiya
`;

export async function handler(event, context) {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed. Use POST." })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const question = body.question;

    if (!question) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing 'question' field in request body." })
      };
    }

    const apiKey = process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "API key not configured" })
      };
    }

    // Call Gemini API via HTTP
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are AgroNIS assistant. Answer questions about the AgroNIS smart farming project.
      
Project Information:
${PROJECT_CONTEXT}

User Question: ${question}

Instructions:
- Answer concisely and accurately based on the project information above
- If asked in Uzbek, respond in Uzbek (Latin script)
- If asked in English, respond in English
- Keep answers under 100 words
- Be helpful and professional`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: "Failed to generate response",
          details: data.error?.message || "Unknown error"
        })
      };
    }

    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Uzr, javob berolmadim.";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        answer: answer,
        model: "gemini-2.0-flash-lite",
        project: "AgroNIS"
      })
    };

  } catch (error) {
    console.error("API Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "Failed to process request",
        message: error.message 
      })
    };
  }
}
