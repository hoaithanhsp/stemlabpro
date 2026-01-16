import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = async () => {
  const ai = getClient();
  
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
  
  chatSession = chat;
  return chat;
};

export const sendMessageToGemini = async (
  message: string, 
  imageBase64?: string
): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }

  if (!chatSession) {
    throw new Error("Failed to initialize chat session");
  }

  try {
    let result;
    
    if (imageBase64) {
        // Correct usage of parts for multimodal message
        const parts = [
            { text: message },
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: imageBase64
                }
            }
        ];
        
        // Pass parts array to message property
        result = await chatSession.sendMessage({ message: parts });
    } else {
        result = await chatSession.sendMessage({ message });
    }

    return result.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Explicitly re-throw so the UI can catch it
    throw error;
  }
};

export const resetChat = () => {
  chatSession = null;
};
