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

export async function handler(event) {
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

    // Check for common questions and provide mock responses to avoid quota overages
    const lowerQuestion = question.toLowerCase();
    
    const mockResponses = {
      "what does your project do": "AgroNIS - bu IoT sensorlar va sun'iy intellekt asosida ishlaydigan aqlli qishloq xo'jaligi platformasi. U real vaqt rejimida tuproq namligi, harorat va elektr o'tkazuvchanligini kuzatib, fermerlarga aniq sug'orish tavsiyalari beradi.",
      "who is this product for": "Bu mahsulot O'zbekistondagi kichik va o'rta fermerlar, qishloq xo'jaligi kooperativlari va agrotexnika kompaniyalari uchun mo'ljallangan. Ular tuproq namligi, harorat va o'g'itlash bo'yicha aniq tavsiyalardan foydalanishlari mumkin.",
      "what technologies": "Texnologiyalar: React + TypeScript (frontend), Google Gemini AI, IoT (ESP32 + sensorlar), Netlify (deployment), Google Maps API.",
      "how does it work": "AgroNIS fermalarning o'tkazilgan IoT sensorlaridan real vaqt rejimidagi ma'lumotlarni oladi. Keyin ushbu ma'lumotlarni sun'iy intellekt (Google Gemini) orqali tahlil qilib, aniq sug'orish va o'g'itlash bo'yicha tavsiyalar beradi.",
      "roadmap": "Roadmap: Idea ✓, Prototype ✓, MVP/MLP ✓ (hozirgi bosqich). Keyingi qadamlar: IoT sensorlarni sinov, mobil ilova, ko'proq ekin turlari uchun AI modellar.",
    };

    // Check if question matches a mock response
    for (const [key, value] of Object.entries(mockResponses)) {
      if (lowerQuestion.includes(key)) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            answer: value,
            model: "gemini-2.0-flash-lite",
            project: "AgroNIS",
            cached: true
          })
        };
      }
    }

    // For other questions, try to call the API
    try {
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
        // Fallback to generic response if quota exceeded
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            answer: "AgroNIS haqida savollaringiz bo'lsa, qo'shimcha ma'lumot uchun https://agronis.netlify.app ni ziyorat qiling.",
            model: "gemini-2.0-flash-lite",
            project: "AgroNIS",
            fallback: true
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
    } catch (apiError) {
      console.error("API Call Error:", apiError);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          answer: "API chaqirishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",
          project: "AgroNIS",
          fallback: true
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
