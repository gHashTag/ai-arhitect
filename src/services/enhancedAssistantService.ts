import { openai } from "./openai";
import { faqService } from "./faqService";

interface EnhancedAssistantRequest {
  message: string;
  userName: string;
  userLanguage: string;
  useFAQContext?: boolean;
}

export class EnhancedAssistantService {
  private assistantId: string;

  constructor(assistantId: string) {
    this.assistantId = assistantId;
  }

  /**
   * Получить ответ от OpenAI Assistant с контекстом FAQ
   */
  async getResponse({
    message,
    userName,
    userLanguage,
    useFAQContext = true,
  }: EnhancedAssistantRequest): Promise<string | null> {
    try {
      console.log(`[Enhanced Assistant] Creating thread for user: ${userName}`);

      // Шаг 1: Создаем новый thread
      const thread = await openai.beta.threads.create();
      console.log(`[Enhanced Assistant] Thread created: ${thread.id}`);

      // Шаг 2: Добавляем сообщение пользователя в thread
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: message,
      });
      console.log(`[Enhanced Assistant] Message added to thread`);

      // Шаг 3: Запускаем ассистента с улучшенными инструкциями
      const instructions = this.generateEnhancedInstructions(
        userName,
        userLanguage,
        message,
        useFAQContext
      );

      const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: this.assistantId,
        instructions: instructions,
      });
      console.log(
        `[Enhanced Assistant] Run created with status: ${run.status}`
      );

      // Шаг 4: Проверяем статус выполнения
      if (run.status === "completed") {
        const messages = await openai.beta.threads.messages.list(run.thread_id);

        // Находим ответ ассистента
        for (const msg of messages.data.reverse()) {
          if (msg.role === "assistant") {
            const content = msg.content[0];

            if (content && content.type === "text" && content.text) {
              const responseText = this.cleanResponse(content.text.value);
              console.log(
                `[Enhanced Assistant] Response generated for ${userName}`
              );
              return responseText;
            }
          }
        }
      } else {
        console.error(
          `[Enhanced Assistant] Run failed with status: ${run.status}`
        );
        if (run.last_error) {
          console.error(`[Enhanced Assistant] Error details:`, run.last_error);
        }
      }

      return null;
    } catch (error) {
      console.error("[Enhanced Assistant] Error in getResponse:", error);
      throw error;
    }
  }

  private generateEnhancedInstructions(
    userName: string,
    userLanguage: string,
    userQuery: string,
    useFAQContext: boolean
  ): string {
    const languageNames = {
      ru: "русский",
      en: "английский",
      lt: "литовский",
    };

    const languageName =
      languageNames[userLanguage as keyof typeof languageNames] || "русский";

    let faqContext = "";
    if (useFAQContext) {
      faqContext = faqService.getContextForAI(userQuery);
    }

    return `Привет! Ты - профессиональный консультант по строительным материалам компании HAUS.

${faqContext ? `\n🔍 КОНТЕКСТ ИЗ БАЗЫ ЗНАНИЙ FAQ:\n${faqContext}\n` : ""}

🏗️ РАСШИРЕННЫЙ КАТАЛОГ СТРОИТЕЛЬНЫХ БЛОКОВ:

1. **HAUS P6-20** - Блоки-опалубка из бетона
   📐 Размеры: 498×198×250 мм (M), 508×198×250 мм (K)
   💧 Расход бетона: 0.015 м³/блок  
   📦 В паллете: 50 шт (40М + 10К)
   🔧 Применение: Фундаменты, ростверки, подпорные стены, перемычки

2. **HAUS P6-15** - Блоки-опалубка облегченные
   📐 Размеры: 498×148×250 мм
   💧 Расход бетона: 0.012 м³/блок
   📦 В паллете: 60 шт (48М + 12К)
   🔧 Применение: Внутренние стены, перегородки

3. **HAUS P8-20** - Блоки-опалубка усиленные
   📐 Размеры: 498×198×300 мм
   💧 Расход бетона: 0.018 м³/блок
   📦 В паллете: 40 шт (32М + 8К)
   🔧 Применение: Несущие стены, высокие нагрузки

4. **HAUS S25** - Стеновые блоки
   📐 Размеры: 498×248×250 мм
   💧 Расход бетона: 0.020 м³/блок
   📦 В паллете: 40 шт
   🔧 Применение: Наружные стены, несущие конструкции

5. **HAUS S6** - Стеновые блоки стандарт
   📐 Размеры: 498×148×250 мм
   💧 Расход бетона: 0.012 м³/блок
   📦 В паллете: 60 шт
   🔧 Применение: Внутренние несущие стены

6. **HAUS SM6** - Стеновые блоки модифицированные
   📐 Размеры: 498×148×250 мм
   💧 Расход бетона: 0.012 м³/блок
   📦 В паллете: 60 шт
   🔧 Применение: Стены с повышенными требованиями

7. **HAUS SP** - Стеновые блоки премиум
   📐 Размеры: 498×198×250 мм
   💧 Расход бетона: 0.015 м³/блок
   📦 В паллете: 50 шт
   🔧 Применение: Элитное строительство

8. **HAUS KL-28** - Блоки специальные
   📐 Размеры: 280×198×250 мм
   💧 Расход бетона: 0.010 м³/блок
   📦 В паллете: 70 шт
   🔧 Применение: Узкие конструкции, доборные элементы

🎯 ТВОЯ ГЛАВНАЯ ЗАДАЧА:
1. Предотвращать галлюцинации - используй ТОЛЬКО информацию из каталога и FAQ
2. При неуверенности говори: "Я проверю эту информацию у специалистов"
3. Всегда ссылайся на конкретные характеристики из каталога
4. Используй контекст FAQ для точных ответов
5. Направляй сложные вопросы к менеджерам: +37064608801

📞 КОНТАКТЫ:
Телефон: +37064608801
Email: haus@vbg.lt  
Сайт: www.vbg.lt

КРИТИЧЕСКИ ВАЖНО:
1. ВСЕГДА отвечай исключительно на языке "${languageName}" (код: ${userLanguage})
2. Используй ТОЛЬКО проверенную информацию из каталога и FAQ
3. При сомнениях - отправляй к специалистам
4. Никогда не придумывай характеристики или цены
5. Обращайся к пользователю "${userName}"

${faqContext ? "\n💡 ВАЖНО: В контексте FAQ выше есть проверенные ответы на похожие вопросы. Используй их как основу для ответа." : ""}

Отвечай профессионально, используй эмодзи для наглядности, предоставляй конкретные данные из каталога.`;
  }

  private cleanResponse(response: string): string {
    // Удаляем лишние аннотации и форматируем ответ
    return response
      .replace(/【\d+†source】/g, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .trim();
  }

  /**
   * Анализ вопроса для определения релевантности FAQ
   */
  analyzeQuery(query: string): {
    needsFAQ: boolean;
    categories: string[];
    products: string[];
    confidence: number;
  } {
    const lowerQuery = query.toLowerCase();

    // Ключевые слова для определения категорий
    const categoryKeywords = {
      technical: [
        "размер",
        "вес",
        "прочность",
        "характеристик",
        "параметр",
        "спецификац",
      ],
      application: [
        "применение",
        "использование",
        "где использовать",
        "для чего",
        "назначение",
      ],
      installation: [
        "монтаж",
        "установка",
        "сборка",
        "строительство",
        "как строить",
      ],
      calculation: ["расчет", "количество", "сколько нужно", "объем", "расход"],
      pricing: ["цена", "стоимость", "сколько стоит", "цены", "прайс"],
      delivery: ["доставка", "поставка", "доставить", "привезти", "транспорт"],
    };

    // Продукты
    const productKeywords = {
      "P6-20": ["p6-20", "p6 20", "п6-20", "п6 20"],
      "P6-15": ["p6-15", "p6 15", "п6-15", "п6 15"],
      "P8-20": ["p8-20", "p8 20", "п8-20", "п8 20"],
      S25: ["s25", "s 25", "с25", "с 25"],
      S6: ["s6", "s 6", "с6", "с 6"],
      SM6: ["sm6", "sm 6", "см6", "см 6"],
      SP: ["sp", "с п", "сп"],
      "KL-28": ["kl-28", "kl 28", "кл-28", "кл 28"],
    };

    const detectedCategories: string[] = [];
    const detectedProducts: string[] = [];

    // Анализ категорий
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((keyword) => lowerQuery.includes(keyword))) {
        detectedCategories.push(category);
      }
    }

    // Анализ продуктов
    for (const [product, keywords] of Object.entries(productKeywords)) {
      if (keywords.some((keyword) => lowerQuery.includes(keyword))) {
        detectedProducts.push(product);
      }
    }

    const needsFAQ =
      detectedCategories.length > 0 || detectedProducts.length > 0;
    const confidence =
      (detectedCategories.length + detectedProducts.length) / 10;

    return {
      needsFAQ,
      categories: detectedCategories,
      products: detectedProducts,
      confidence: Math.min(confidence, 1),
    };
  }
}

export const enhancedAssistantService = new EnhancedAssistantService(
  process.env.OPENAI_ASSISTANT_ID || "asst_YXwdoG87dnMLe95mbvmDGIMb"
);
