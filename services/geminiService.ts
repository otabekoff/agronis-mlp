import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { SensorData, WeatherData } from "../types";

// Initialize Gemini Client
// The API key must be obtained exclusively from the environment variable.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

/**
 * Uses Gemini Flash-Lite for high-speed, low-latency status summaries in Uzbek.
 */
export const getQuickFieldStatus = async (sensors: SensorData): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite-preview-02-05',
      contents: `System Role: You are a strict agricultural monitoring system.
Task: Analyze this sensor data: Soil Moisture ${sensors.moisture}%, Temp ${sensors.temp}°C, EC ${sensors.ec} dS/m.
Constraint: Return specific, informative status in Uzbek (Lotin).
Format: Exactly two short sentences.
1. State the condition (e.g., Moisture is critical).
2. State the immediate risk or implication (e.g., Root stress is likely).
No greetings. No technical jargon.`,
    });
    return response.text || "Holat: Monitoring faol. Ma'lumotlar tahlil qilinmoqda.";
  } catch (error) {
    console.error("Gemini Lite Error:", error);
    return "Holat: Monitoring faol";
  }
};

/**
 * Uses Gemini Pro/Flash for detailed agronomy advice in Uzbek.
 */
export const getAgronomyAdvice = async (sensors: SensorData, weather: WeatherData): Promise<string> => {
  try {
    const prompt = `
      Act as an expert agronomist speaking Uzbek (Lotin).
      Data: Moisture ${sensors.moisture}% (Low), Temp ${sensors.temp}°C, EC ${sensors.ec} dS/m, Rain Forecast: ${weather.forecast}.
      
      Task: Provide a recommendation in this specific format:
      1. Action: [Direct instruction, e.g., "Sug'orishni boshlang"]
      2. Reason: [Specific data point explanation, e.g., "Namlik 30% dan tushib ketdi, bu ekin uchun xavfli."]
      3. Benefit: [Savings or Yield impact]
      
      Constraint: Keep the entire response under 50 words. Be direct and helpful.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Tavsiya: Namlik darajasini kuzatib boring. Aniqroq ma'lumot olish uchun kuting.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Hozircha tahlil qilib bo'lmadi.";
  }
};

/**
 * Creates a chat session for the specialized Agronomist chatbot.
 */
export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: "Siz AgroNIS, O'zbekistondagi fermerlar uchun aqlli qishloq xo'jaligi yordamchisisiz. Sizning vazifangiz fermerlarga tuproq namligi, harorat va o'g'itlash bo'yicha aniq, lo'nda va foydali maslahatlar berishdir. Har doim o'zbek tilida (lotin yozuvida) muloyim va professional javob bering. Javoblaringiz qisqa va tushunarli bo'lsin.",
    },
  });
};

/**
 * Uses Gemini with Google Maps Grounding to find local resources.
 */
export const findLocalResources = async (query: string, location: string): Promise<{ text: string; places: any[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find ${query} near ${location}. Answer in Uzbek.`,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const text = response.text || "Natija topilmadi.";
    
    // Extract grounding chunks for maps or web
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const places = groundingChunks
      .map((chunk: any) => {
         // Support both web and maps grounding chunks
         return chunk.maps || chunk.web || null;
      })
      .filter((item: any) => item !== null && (item.uri || item.title));

    return { text, places };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return { text: "Xarita ma'lumotlarini yuklab bo'lmadi.", places: [] };
  }
};