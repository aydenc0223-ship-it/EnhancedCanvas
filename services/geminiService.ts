import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeAssignment = async (description: string, summary: string): Promise<string> => {
  try {
    const prompt = `
      You are a helpful academic assistant. 
      I have a school assignment titled "${summary}".
      The raw description is: "${description}".
      
      Please summarize this into a concise, organized bulleted list of tasks or requirements. 
      If the description is empty or vague, just say "No specific details provided in the calendar event."
      Keep it short and actionable. Do not use markdown headers, just bullet points.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini summarization failed:", error);
    return "Failed to load AI summary. Please check your connection.";
  }
};
