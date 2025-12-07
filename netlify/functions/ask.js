// Project knowledge base for answering questions
const PROJECT_CONTEXT = `
AgroNIS - Aqlli Qishloq Xo'jaligi Tizimi (Smart Farming System)

MUAMMO (Problem):
O'zbekistondagi fermerlar sug'orish va o'g'itlash uchun aniq ma'lumotlarga ega emas. Bu suv isrofgarchiligiga, past hosildorlikka va resurslarning noto'g'ri sarflanishiga olib keladi.

YECHIM (Solution):
AgroNIS - bu IoT sensorlar va sun'iy intellekt asosida ishlayadigan aqlli qishloq xo'jaligi platformasi. U real vaqt rejimida tuproq namligi, harorat va elektr o'tkazuvchanligini kuzatib, fermerlarga aniq sug'orish tavsiyalari beradi.

TEXNOLOGIYALAR (Tech Stack):
- Frontend: React + TypeScript + Tailwind CSS
- AI: Google Gemini 2.5 Flash
- IoT: ESP32 + soil sensors
- Deployment: Netlify
- Maps: Google Maps API

ASOSIY FUNKSIYALAR:
1. Real-time sensor monitoring
2. AI-powered irrigation recommendations
3. Weather forecast integration
4. AI Chatbot for farmers
5. Analytics dashboard
6. Local resources finder

ROADMAP: Idea ✓, Prototype ✓, MVP/MLP ✓
`;

export async function handler(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed. Use POST." }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const question = body.question;

    if (!question) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Missing 'question' field in request body.",
        }),
      };
    }

    const apiKey = process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "API key not configured" }),
      };
    }

    // Check for common questions and provide mock responses
    const lowerQuestion = question.toLowerCase();

    const mockResponses = {
      "what does your project do":
        "AgroNIS - bu IoT sensorlar va sun'iy intellekt asosida ishlayadigan aqlli qishloq xo'jaligi platformasi. U real vaqt rejimida tuproq namligi, harorat va elektr o'tkazuvchanligini kuzatib, fermerlarga aniq sug'orish tavsiyalari beradi.",
      "who is this product for":
        "Bu mahsulot O'zbekistondagi kichik va o'rta fermerlar, qishloq xo'jaligi kooperativlari va agrotexnika kompaniyalari uchun mo'ljallangan.",
      "what technologies":
        "Texnologiyalar: React + TypeScript, Google Gemini AI, ESP32 IoT sensorlari, Netlify, Google Maps API.",
      "how does it work":
        "AgroNIS IoT sensorlardan real vaqt ma'lumotlarni oladi, Gemini AI orqali tahlil qiladi va sug'orish tavsiyalari beradi.",
      roadmap:
        "Roadmap: Idea ✓, Prototype ✓, MVP/MLP ✓. Keyingi: IoT sinov, mobil ilova, ko'proq ekin turlari.",
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
            cached: true,
          }),
        };
      }
    }

    // For other questions, try to call Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are AgroNIS assistant. Answer questions about the AgroNIS smart farming project in 50-100 words.

Project Info:
${PROJECT_CONTEXT}

User Question: ${question}

Respond in the same language as the question. Be helpful and accurate.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          answer:
            "AgroNIS haqida qo'shimcha ma'lumot uchun https://agronis.netlify.app ni ziyorat qiling.",
          project: "AgroNIS",
          fallback: true,
        }),
      };
    }

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Uzr, javob berolmadim.";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        answer: answer,
        model: "gemini-2.0-flash-lite",
        project: "AgroNIS",
      }),
    };
  } catch (error) {
    console.error("Handler Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to process request",
        message: error.message,
      }),
    };
  }
}
