import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface BattleQuestion {
  text: string;
  options: string[];
  answer: string;
}

export async function generateBattleQuestion(topic: string): Promise<BattleQuestion> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a multiple choice question about ${topic} for a YouTube creator learning platform. The question should be challenging but fun.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING, description: "The question text" },
          options: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Four possible answers"
          },
          answer: { type: Type.STRING, description: "The correct answer (must be one of the options)" }
        },
        required: ["text", "options", "answer"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as BattleQuestion;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    // Fallback question
    return {
      text: "What is the best way to grow a YouTube channel?",
      options: ["Consistency", "Luck", "Buying views", "Posting once a year"],
      answer: "Consistency"
    };
  }
}
