import { ZepClient, Zep } from "@getzep/zep-cloud";

// Клиент Zep будет создан при инициализации сервиса
let zepClient: ZepClient | null = null;

interface IMemoryContent {
  role: string;
  content: string;
  metadata?: Record<string, any>;
}

/**
 * Сервис для работы с памятью через Zep Cloud
 */
export class ZepMemoryService {
  private static instance: ZepMemoryService;

  private constructor() {}

  /**
   * Получить единственный экземпляр сервиса (Singleton)
   */
  public static async getInstance(): Promise<ZepMemoryService> {
    if (!ZepMemoryService.instance) {
      ZepMemoryService.instance = new ZepMemoryService();
      await ZepMemoryService.instance.initialize();
    }
    return ZepMemoryService.instance;
  }

  /**
   * Инициализация клиента
   */
  private async initialize() {
    console.log("🔄 Инициализация Zep памяти...");

    try {
      // Проверяем и получаем API ключ
      const apiKey = process.env.ZEP_API_KEY;
      if (!apiKey) {
        throw new Error("ZEP_API_KEY is required");
      }

      // Создаем клиента Zep Cloud
      zepClient = new ZepClient({
        apiKey,
      });

      console.log("✅ Zep клиент инициализирован");
    } catch (error) {
      console.error("❌ Ошибка инициализации Zep памяти:", error);
      throw error;
    }
  }

  /**
   * Создать или получить пользователя в Zep
   */
  private async ensureUser(userId: number): Promise<void> {
    if (!zepClient) {
      throw new Error("Zep client not initialized");
    }

    try {
      const userIdStr = `user_${userId}`;

      // Проверяем, существует ли пользователь
      try {
        await zepClient.user.get(userIdStr);
        // Пользователь уже существует
        return;
      } catch (error: any) {
        // Пользователь не найден, создаем нового
        if (
          error.message?.includes("not found") ||
          error.message?.includes("404")
        ) {
          await zepClient.user.add({
            userId: userIdStr,
            email: `user_${userId}@telegram.bot`,
            firstName: `User`,
            lastName: `${userId}`,
            metadata: {
              source: "telegram_bot",
              created_at: new Date().toISOString(),
            },
          });
          console.log(`✅ Пользователь ${userIdStr} создан в Zep`);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error(`❌ Ошибка создания пользователя ${userId} в Zep:`, error);
      throw error;
    }
  }

  /**
   * Создать или получить сессию для пользователя
   */
  private async ensureSession(userId: number): Promise<string> {
    if (!zepClient) {
      throw new Error("Zep client not initialized");
    }

    const userIdStr = `user_${userId}`;
    const sessionId = `session_${userId}_${Date.now()}`;

    try {
      // Убедимся, что пользователь существует
      await this.ensureUser(userId);

      // Создаем новую сессию для каждого взаимодействия
      // В реальном приложении вы можете использовать постоянную сессию
      await zepClient.memory.addSession({
        sessionId,
        userId: userIdStr,
        metadata: {
          source: "telegram_bot",
          created_at: new Date().toISOString(),
        },
      });

      console.log(
        `✅ Сессия ${sessionId} создана для пользователя ${userIdStr}`
      );
      return sessionId;
    } catch (error) {
      console.error(
        `❌ Ошибка создания сессии для пользователя ${userId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Получить или создать активную сессию для пользователя
   */
  private async getActiveSession(userId: number): Promise<string> {
    // Для простоты будем использовать одну сессию на пользователя
    // В продакшене можно сделать более сложную логику
    const sessionId = `session_${userId}`;
    const userIdStr = `user_${userId}`;

    if (!zepClient) {
      throw new Error("Zep client not initialized");
    }

    try {
      // Убедимся, что пользователь существует
      await this.ensureUser(userId);

      // Попробуем получить существующую сессию
      try {
        await zepClient.memory.getSession(sessionId);
        return sessionId;
      } catch (error: any) {
        // Сессия не найдена, создаем новую
        if (
          error.message?.includes("not found") ||
          error.message?.includes("404")
        ) {
          await zepClient.memory.addSession({
            sessionId,
            userId: userIdStr,
            metadata: {
              source: "telegram_bot",
              persistent: true,
              created_at: new Date().toISOString(),
            },
          });
          console.log(
            `✅ Постоянная сессия ${sessionId} создана для пользователя ${userIdStr}`
          );
          return sessionId;
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error(
        `❌ Ошибка получения активной сессии для пользователя ${userId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Сохранить сообщение в истории
   */
  public async addMessage(
    userId: number,
    message: {
      role: "user" | "assistant";
      content: string;
      metadata?: Record<string, any>;
    }
  ) {
    if (!zepClient) {
      throw new Error("Zep client not initialized");
    }

    try {
      const sessionId = await this.getActiveSession(userId);

      const zepMessage: Zep.Message = {
        roleType: message.role as Zep.RoleType,
        content: message.content,
        metadata: {
          ...message.metadata,
          timestamp: new Date().toISOString(),
          userId: userId,
          source: "telegram_bot",
        },
      };

      await zepClient.memory.add(sessionId, {
        messages: [zepMessage],
      });

      console.log(`✅ Сообщение сохранено в Zep для пользователя ${userId}`);
    } catch (error) {
      console.error("❌ Ошибка сохранения сообщения в Zep:", error);
      // В случае ошибки не прерываем работу бота
    }
  }

  /**
   * Получить последние сообщения из истории
   */
  public async getRecentMessages(
    userId: number,
    limit: number = 10
  ): Promise<IMemoryContent[]> {
    if (!zepClient) {
      throw new Error("Zep client not initialized");
    }

    try {
      const sessionId = await this.getActiveSession(userId);

      const memory = await zepClient.memory.get(sessionId, {
        lastn: limit,
      });

      if (!memory.messages) {
        return [];
      }

      return memory.messages.map((m: any) => ({
        role: m.roleType || m.role || "unknown",
        content: m.content || "",
        metadata: m.metadata,
      }));
    } catch (error) {
      console.error("❌ Ошибка получения истории из Zep:", error);
      return [];
    }
  }

  /**
   * Поиск сообщений по запросу
   */
  public async searchMessages(
    userId: number,
    query: string,
    limit: number = 5
  ): Promise<IMemoryContent[]> {
    if (!zepClient) {
      throw new Error("Zep client not initialized");
    }

    try {
      const userIdStr = `user_${userId}`;

      const searchResults = await zepClient.memory.searchSessions({
        userId: userIdStr,
        text: query,
        limit,
      });

      if (!searchResults || !searchResults.results) {
        return [];
      }

      return searchResults.results.map((result: any) => ({
        role: result.message?.roleType || result.message?.role || "unknown",
        content: result.message?.content || "",
        metadata: result.message?.metadata,
      }));
    } catch (error) {
      console.error("❌ Ошибка поиска в Zep:", error);
      return [];
    }
  }

  /**
   * Получить факты о пользователе
   */
  public async getUserFacts(userId: number): Promise<string[]> {
    if (!zepClient) {
      throw new Error("Zep client not initialized");
    }

    try {
      const userIdStr = `user_${userId}`;

      const facts = await zepClient.user.getFacts(userIdStr);

      if (!facts || !facts.facts) {
        return [];
      }

      return facts.facts.map(
        (fact: any) => fact.fact || fact.content || String(fact)
      );
    } catch (error) {
      console.error("❌ Ошибка получения фактов пользователя из Zep:", error);
      return [];
    }
  }

  /**
   * Получить контекст для пользователя (факты + последние сообщения)
   */
  public async getUserContext(userId: number): Promise<string> {
    try {
      const sessionId = await this.getActiveSession(userId);

      if (!zepClient) {
        throw new Error("Zep client not initialized");
      }

      const memory = await zepClient.memory.get(sessionId);

      let context = "";

      // Добавляем факты
      if (memory.relevantFacts && memory.relevantFacts.length > 0) {
        context += "Факты о пользователе:\n";
        memory.relevantFacts.forEach((fact: any) => {
          context += `- ${fact.fact || fact.content}\n`;
        });
        context += "\n";
      }

      // Добавляем последние сообщения
      if (memory.messages && memory.messages.length > 0) {
        context += "Последние сообщения:\n";
        memory.messages.forEach((msg: any) => {
          context += `${msg.roleType === "user" ? "Пользователь" : "Ассистент"}: ${msg.content}\n`;
        });
      }

      return context;
    } catch (error) {
      console.error(
        "❌ Ошибка получения контекста пользователя из Zep:",
        error
      );
      return "";
    }
  }

  /**
   * Очистить историю пользователя
   */
  public async clearUserHistory(userId: number) {
    if (!zepClient) {
      throw new Error("Zep client not initialized");
    }

    try {
      const sessionId = `session_${userId}`;

      // Удаляем сессию (это удалит все сообщения)
      await zepClient.memory.delete(sessionId);

      console.log(`✅ История пользователя ${userId} очищена`);
    } catch (error) {
      console.error("❌ Ошибка очистки истории Zep:", error);
    }
  }
}
