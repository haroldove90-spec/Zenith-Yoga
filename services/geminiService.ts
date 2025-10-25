
import { GoogleGenAI } from "@google/genai";

export const generateClassDescription = async (className: string, keywords: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Genera una descripción atractiva de una sola oración para una clase de yoga llamada "${className}". Incorpora estas palabras clave: ${keywords}. Haz que suene acogedora y adecuada para un estudio de yoga moderno.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error al generar la descripción de la clase:", error);
        
        if (error instanceof Error && error.message.includes("API Key")) {
             return "La clave de API de Gemini no está configurada. No se pudo generar la descripción.";
        }

        return "No se pudo generar la descripción. Por favor, inténtalo de nuevo.";
    }
};