import { GoogleGenAI } from "@google/genai";

// Initialize the API client
// Note: In a real environment, this should be guarded or handled via a backend proxy
// if the key cannot be exposed. For this demo, we assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'dummy_key_for_demo' });

export const generateProductDescription = async (productName: string, productType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a compelling, short marketing description (max 2 sentences) for a ${productType} named "${productName}". focus on benefits.`,
    });
    
    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please check your API key.";
  }
};

export const generateMarketingEmail = async (customerName: string, productName: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a short, friendly email to ${customerName} thanking them for purchasing ${productName} and offering a 10% discount on their next order.`,
        });
        return response.text || "Could not generate email.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error generating email.";
    }
}