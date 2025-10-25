
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateClassDescription = async (className: string, keywords: string): Promise<string> => {
    if (!API_KEY) {
        return "Gemini API key not configured. Please add it to your environment variables.";
    }

    try {
        const prompt = `Generate a compelling, one-sentence yoga class description for a class named "${className}". Incorporate these keywords: ${keywords}. Make it sound inviting and suitable for a modern yoga studio.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating class description:", error);
        return "Failed to generate description. Please try again.";
    }
};
