import OpenAI from "openai";
import * as dotenv from "dotenv";

// Принудительно загружаем переменные окружения из .env
dotenv.config();

// Проверка наличия API ключа
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

// Для отладки
console.log("🔑 OpenAI конфигурация загружена из:", {
  source: apiKey.startsWith("sk-proj-")
    ? ".env файла (project key)"
    : ".env файла (legacy key)",
  assistant_id: process.env.OPENAI_ASSISTANT_ID,
});

// Создание экземпляра OpenAI клиента БЕЗ указания проекта
export const openai = new OpenAI({
  apiKey: apiKey,
});

// Проверка соединения с OpenAI
export async function testOpenAIConnection(): Promise<boolean> {
  try {
    // Простой тест - получение списка моделей
    await openai.models.list();
    console.log("✅ OpenAI connection successful");
    return true;
  } catch (error) {
    console.error("❌ OpenAI connection failed:", error);
    return false;
  }
}

export default openai;
