import { ZepClient } from '@getzep/zep-js';

// Создаем клиента Zep с API ключом из окружения
const zepClient = new ZepClient(process.env.ZEP_API_KEY);

// Название коллекции для хранения истории разговоров
const COLLECTION_NAME = 'ai-architect-chat-history';

/**
 * Сервис для работы с памятью через Zep
 */
export class ZepMemoryService {
  private static instance: ZepMemoryService;
  private collection: any;

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
   * Инициализация коллекции
   */
  private async initialize() {
    try {
      // Проверяем существование коллекции
      const collections = await zepClient.listCollections();
      const existingCollection = collections.find(c => c.name === COLLECTION_NAME);

      if (!existingCollection) {
        // Создаем новую коллекцию, если не существует
        this.collection = await zepClient.createCollection({
          name: COLLECTION_NAME,
          description: 'История разговоров AI Architect бота',
          metadata: {
            source: 'telegram',
            type: 'chat_history'
          }
        });
      } else {
        this.collection = existingCollection;
      }

      console.log(`✅ Zep память инициализирована: ${COLLECTION_NAME}`);
    } catch (error) {
      console.error('❌ Ошибка инициализации Zep памяти:', error);
      throw error;
    }
  }

  /**
   * Сохранить сообщение в истории
   */
  public async addMessage(userId: number, message: {
    role: 'user' | 'assistant';
    content: string;
    metadata?: Record<string, any>;
  }) {
    try {
      const sessionId = `user_${userId}`;
      
      await zepClient.addMemory(COLLECTION_NAME, sessionId, {
        role: message.role,
        content: message.content,
        metadata: {
          ...message.metadata,
          timestamp: new Date().toISOString(),
          userId: userId
        }
      });

      console.log(`✅ Сообщение сохранено в Zep для пользователя ${userId}`);
    } catch (error) {
      console.error('❌ Ошибка сохранения сообщения в Zep:', error);
      // В случае ошибки не прерываем работу бота
    }
  }

  /**
   * Получить последние сообщения из истории
   */
  public async getRecentMessages(userId: number, limit: number = 10): Promise<Array<{
    role: string;
    content: string;
    metadata?: Record<string, any>;
  }>> {
    try {
      const sessionId = `user_${userId}`;
      const messages = await zepClient.searchMemory(COLLECTION_NAME, sessionId, {
        limit
      });

      return messages.map(m => ({
        role: m.role,
        content: m.content,
        metadata: m.metadata
      }));
    } catch (error) {
      console.error('❌ Ошибка получения истории из Zep:', error);
      return [];
    }
  }

  /**
   * Поиск похожих сообщений по контексту
   */
  public async searchSimilarMessages(userId: number, query: string, limit: number = 5): Promise<Array<{
    role: string;
    content: string;
    metadata?: Record<string, any>;
    similarity: number;
  }>> {
    try {
      const sessionId = `user_${userId}`;
      const results = await zepClient.searchMemory(COLLECTION_NAME, sessionId, {
        text: query,
        limit
      });

      return results.map(r => ({
        role: r.role,
        content: r.content,
        metadata: r.metadata,
        similarity: r.similarity || 0
      }));
    } catch (error) {
      console.error('❌ Ошибка поиска в Zep:', error);
      return [];
    }
  }

  /**
   * Удалить историю пользователя
   */
  public async clearUserHistory(userId: number) {
    try {
      const sessionId = `user_${userId}`;
      await zepClient.deleteMemory(COLLECTION_NAME, sessionId);
      console.log(`✅ История пользователя ${userId} очищена`);
    } catch (error) {
      console.error('❌ Ошибка очистки истории в Zep:', error);
      throw error;
    }
  }
}
