import OpenAI from 'openai';

// Проверка наличия API ключа
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

// Создание экземпляра OpenAI клиента
export const openai = new OpenAI({
  apiKey: apiKey,
});

// Проверка соединения с OpenAI
export async function testOpenAIConnection(): Promise<boolean> {
  try {
    // Простой тест - получение списка моделей
    await openai.models.list();
    console.log('✅ OpenAI connection successful');
    return true;
  } catch (error) {
    console.error('❌ OpenAI connection failed:', error);
    return false;
  }
}

export default openai;
