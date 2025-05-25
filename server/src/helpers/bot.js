import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export const getResponse = async (prompt) => {
    try {
        const response = await genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        });
        const text = response.text;
        return text;
    } catch (error) {
        console.error('Error generating response:', error);
    }
};
