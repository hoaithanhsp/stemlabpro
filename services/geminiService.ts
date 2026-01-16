import { GoogleGenAI, Content } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { ChatMessage } from "../types";

// Cấu hình các model AI theo yêu cầu
export const MODELS = [
    { id: "gemini-3-flash-preview", name: "Gemini 3 Flash (Preview)", isDefault: true },
    { id: "gemini-3-pro-preview", name: "Gemini 3 Pro (Preview)", isDefault: false },
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", isDefault: false },
];

export const MODEL_OPTIONS = [
    { id: "gemini-3-flash-preview", label: "Gemini 3 Flash (Preview)" },
    { id: "gemini-3-pro-preview", label: "Gemini 3 Pro (Preview)" },
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" }
];

export const USER_MODELS = [
    { id: "gemini-3-flash-preview", label: "Gemini 3 Flash", description: "Mặc định, Nhanh" },
    { id: "gemini-3-pro-preview", label: "Gemini 3 Pro", description: "Phân tích phức tạp" },
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", description: "Tốc độ cao, Chi phí thấp" }
];

export const AVAILABLE_MODELS = [
    { id: "gemini-3-flash-preview", name: "Gemini 3 Flash (Mặc định)" },
    { id: "gemini-3-pro-preview", name: "Gemini 3 Pro" },
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" }
];

// Hàm reset chat session
export const resetChat = () => {
    // Reset any stateful chat state if needed
    // Currently no global state to reset
    console.log("Chat session reset");
};

// Helper to get client
const getClient = (apiKey: string) => {
    if (!apiKey) throw new Error("API Key is missing. Please enter your API key in Settings.");
    return new GoogleGenAI({ apiKey });
};

export const sendMessageToGemini = async (
    apiKey: string,
    modelId: string,
    message: string,
    history: ChatMessage[] = [],
    imageBase64?: string
): Promise<{ text: string; modelUsed: string }> => {

    // Cơ chế fallback tự động theo thứ tự ưu tiên:
    // 1. gemini-3-flash-preview (Model mặc định)
    // 2. gemini-3-pro-preview (Model dự phòng 1)
    // 3. gemini-2.5-flash (Model dự phòng 2)
    const FALLBACK_CHAIN = [
        "gemini-3-flash-preview",
        "gemini-3-pro-preview",
        "gemini-2.5-flash"
    ];

    // Tạo danh sách model để thử: bắt đầu từ model được yêu cầu, sau đó là các model dự phòng
    const tryModels = Array.from(new Set([modelId, ...FALLBACK_CHAIN]));

    let lastError: any = null;

    for (const currentModel of tryModels) {
        try {
            console.log(`Attempting with model: ${currentModel}`);
            const ai = getClient(apiKey);

            // Prepare history
            // Gemini SDK yêu cầu history phải:
            // 1. Bắt đầu bằng tin nhắn từ user (không phải model)
            // 2. Không có tin nhắn lỗi hoặc loading
            // 3. Các parts không được rỗng
            const validHistory = history.filter(msg =>
                !msg.isError &&
                !msg.isLoading &&
                msg.text &&
                msg.text.trim() !== ''
            );

            // Tìm index của tin nhắn user đầu tiên
            const firstUserIndex = validHistory.findIndex(msg => msg.role === 'user');

            // Chỉ lấy history từ tin nhắn user đầu tiên trở đi
            const trimmedHistory = firstUserIndex >= 0
                ? validHistory.slice(firstUserIndex)
                : [];

            // Chuyển đổi sang format Content của Gemini
            const historyContent: Content[] = trimmedHistory.map(msg => ({
                role: msg.role as 'user' | 'model',
                parts: [{ text: msg.text }]
            }));

            const chat = ai.chats.create({
                model: currentModel,
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    temperature: 0.7,
                },
                history: historyContent
            });

            // Prepare message parts
            let result;
            if (imageBase64) {
                // Với image, truyền array của parts
                result = await chat.sendMessage([
                    { text: message },
                    { inlineData: { mimeType: "image/jpeg", data: imageBase64 } }
                ]);
            } else {
                // Với text, truyền string trực tiếp
                result = await chat.sendMessage(message);
            }

            const responseText = result.text || "";
            return { text: responseText, modelUsed: currentModel };

        } catch (error: any) {
            console.error(`Error with model ${currentModel}:`, error);
            lastError = error;

            // Check for specific error types that warrant retry
            // e.g. 429 (Quota), 503 (Overloaded)
            // If it's a 400 (Bad Request), maybe don't retry? 
            // User said "Retry if API error". I'll retry all.
            continue;
        }
    }

    // If we get here, all models failed
    // Throw a formatted error
    const errorMsg = lastError?.message || "Unknown error";
    if (errorMsg.includes("429")) {
        throw new Error(`429 RESOURCE_EXHAUSTED: Hết hạn ngạch. Vui lòng kiểm tra API Key hoặc thử lại sau.`);
    }
    throw new Error(`Đã thử tất cả các models nhưng thất bại. Lỗi cuối cùng: ${errorMsg}`);
};
