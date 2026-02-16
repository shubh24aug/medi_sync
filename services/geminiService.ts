
import { GoogleGenAI, Type } from "@google/genai";

// Initialize AI right before use as per guidelines to ensure current API key
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const cleanJsonResponse = (text: string) => {
  // Remove markdown code blocks if present
  return text.replace(/```json\n?|```/g, '').trim();
};

export const analyzeMedicalRecord = async (content: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following medical record and provide a concise summary and key findings in JSON format. 
    Content: ${content}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: 'A 2-3 sentence summary of the medical condition.' },
          keyFindings: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: 'A list of critical health markers or diagnoses mentioned.' 
          }
        },
        required: ["summary", "keyFindings"]
      }
    }
  });

  try {
    const rawText = response.text || '{}';
    return JSON.parse(cleanJsonResponse(rawText));
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    return { summary: "Analysis complete, but formatting was unexpected.", keyFindings: ["Data saved"] };
  }
};

export const translateText = async (text: string, targetLanguage: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate the following medical note into ${targetLanguage}. Keep the tone professional and accurate.
    Note: ${text}`,
  });

  return response.text || text;
};

export const generateCumulativeSummary = async (records: string[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `You are a specialized medical AI. Based on the following set of patient medical records, generate a cumulative patient history summary that highlight trends, chronic issues, and recent changes.
    Records:
    ${records.join('\n---\n')}`,
  });

  return response.text;
};
