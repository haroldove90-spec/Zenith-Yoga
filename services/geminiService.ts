
import { GoogleGenAI } from "@google/genai";

export const generateClassDescription = async (className: string, keywords: string): Promise<string> => {
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        const message = "Gemini API key not configured. Please add it to your environment variables.";
        console.warn(message);
        return message;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
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
