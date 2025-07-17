import { openai } from "./openai";

interface AssistantRequest {
  message: string;
  userName: string;
  userLanguage: string;
}

interface AssistantResponse {
  ai_response: string;
}

export class AssistantService {
  private assistantId: string;

  constructor(assistantId: string) {
    this.assistantId = assistantId;
  }

  /**
   * Получить ответ от OpenAI Assistant
   */
  async getResponse({
    message,
    userName,
    userLanguage,
  }: AssistantRequest): Promise<string | null> {
    try {
      console.log(`[Assistant] Creating thread for user: ${userName}`);

      // Шаг 1: Создаем новый thread
      const thread = await openai.beta.threads.create();
      console.log(`[Assistant] Thread created: ${thread.id}`);

      // Шаг 2: Добавляем сообщение пользователя в thread
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: message,
      });
      console.log(`[Assistant] Message added to thread`);

      // Шаг 3: Запускаем ассистента с инструкциями
      const instructions = this.generateInstructions(userName, userLanguage);

      const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: this.assistantId,
        instructions: instructions,
      });
      console.log(`[Assistant] Run created with status: ${run.status}`);

      // Шаг 4: Проверяем статус выполнения
      if (run.status === "completed") {
        const messages = await openai.beta.threads.messages.list(run.thread_id);

        // Находим ответ ассистента
        for (const msg of messages.data.reverse()) {
          if (msg.role === "assistant") {
            const content = msg.content[0];

            if (content && content.type === "text" && content.text) {
              const responseText = this.cleanResponse(content.text.value);
              console.log(`[Assistant] Response generated for ${userName}`);
              return responseText;
            }
          }
        }
      } else {
        console.error(`[Assistant] Run failed with status: ${run.status}`);
        if (run.last_error) {
          console.error(`[Assistant] Error details:`, run.last_error);
        }
      }

      return null;
    } catch (error) {
      console.error("[Assistant] Error in getResponse:", error);
      throw error;
    }
  }

  /**
   * Генерация инструкций для ассистента
   */
  private generateInstructions(userName: string, userLanguage: string): string {
    // Определяем название языка для инструкций
    const getLanguageName = (lang: string): string => {
      switch (lang) {
        case "ru":
          return "русский";
        case "en":
          return "английский";
        case "lt":
          return "литовский";
        default:
          return "английский";
      }
    };

    const languageName = getLanguageName(userLanguage);

    return `
Вы - специализированный ИИ-консультант по строительным блокам и архитектурным решениям.

КОНТЕКСТ:
- Пользователь: ${userName}
- Язык ответа: ${languageName}

ВАША РОЛЬ:
Вы эксперт по строительным блокам HAUS, особенно P6-20, с глубокими знаниями:
• Технических характеристик блоков
• Строительных норм и стандартов
• Применения в различных типах конструкций
• Расчета материалов и объемов
• Узлов примыканий и соединений

СТИЛЬ ОТВЕТА:
• Профессиональный, но доступный
• Структурированный с использованием маркдауна
• Включайте конкретные цифры и расчеты
• Используйте эмодзи для лучшего восприятия
• Обращайтесь к пользователю по имени

БАЗА ЗНАНИЙ:
У вас есть доступ к техническим данным блоков HAUS P6-20:
- Размеры: 498×198×250 мм (M) и 508×198×250 мм (K)
- Расход бетона: 0.015 м³ на блок
- Применение: фундаменты, ростверки, подпорные стены, перемычки
- Контакты: +37064608801, haus@vbg.lt

КРИТИЧЕСКИ ВАЖНО:
1. ВСЕГДА отвечайте исключительно на языке "${languageName}" (код: ${userLanguage})
2. Если пользователь пишет на русском - отвечайте на русском
3. Если пользователь пишет на английском - отвечайте на английском
4. Если пользователь пишет на литовском - отвечайте на литовском
5. НЕ переводите язык ответа без явного запроса пользователя

ИНСТРУКЦИИ:
1. Определите язык сообщения пользователя и отвечайте на том же языке
2. Давайте конкретные практические советы
3. При необходимости предлагайте расчеты
4. Упоминайте нормативные требования
5. Предлагайте альтернативные решения

Обращайтесь к пользователю ${userName} и отвечайте исключительно на ${languageName} языке.
    `.trim();
  }

  /**
   * Очистка ответа от аннотаций
   */
  private cleanResponse(text: string): string {
    // Удаляем аннотации вида 【число:число†source】
    const annotationPattern = /【\d+:\d+†source】/g;
    return text.replace(annotationPattern, "").trim();
  }

  /**
   * Проверка доступности ассистента
   */
  async checkAssistantAvailability(): Promise<boolean> {
    try {
      const assistant = await openai.beta.assistants.retrieve(this.assistantId);
      console.log(`✅ Assistant available: ${assistant.name || "Unnamed"}`);
      return true;
    } catch (error) {
      console.error(
        `❌ Assistant not available (ID: ${this.assistantId}):`,
        error
      );
      return false;
    }
  }
}

export default AssistantService;
