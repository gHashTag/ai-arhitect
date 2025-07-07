import { ZepClient } from '@getzep/zep-js';
import { CreateSessionRequest, Session, MemoryListSessionsRequest, SessionSearchQuery, Memory as ZepMemory, MemoryGetSessionMessagesRequest } from '@getzep/zep-js/dist/api';

// Создаем клиента Zep с API ключом из окружения
const apiKey = process.env.ZEP_API_KEY;
if (!apiKey) {
  throw new Error('ZEP_API_KEY is required');
}

const zepClient = new ZepClient({ apiKey, baseUrl: 'https://api.zep.ai' });

// Название коллекции для хранения истории разговоров
const COLLECTION_NAME = 'ai-architect-chat-history';

interface IMemoryContent {
  role: string;
  content: string;
  metadata?: Record<string, any>;
}

/**
 * Сервис для работы с памятью через Zep
 */
export class ZepMemoryService {
  private static instance: ZepMemoryService;
  private memory = zepClient.memory;

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
    console.log('🔄 Инициализация Zep памяти...');
    try {
      // Проверяем соединение, пытаясь получить список сессий
      try {
        await this.memory.listSessions();
        console.log('✅ Соединение с Zep установлено');
      } catch (err) {
        console.error('❌ Ошибка соединения с Zep:', err);
        throw err;
      }

      // Создаем новую сессию
      const sessionRequest: CreateSessionRequest = {
        sessionId: COLLECTION_NAME,
        metadata: {
          description: 'История разговоров AI Architect бота',
          source: 'telegram',
          type: 'chat_history'
        }
      };

      await this.memory.addSession(sessionRequest);
      console.log(`✅ Zep память инициализирована: ${COLLECTION_NAME}`);
    } catch (error) {
      // Если коллекция уже существует, это нормально
      if ((error as Error).message?.includes('already exists')) {
        console.log(`✅ Используем существующую коллекцию: ${COLLECTION_NAME}`);
        return;
      }
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
      
      await this.memory.add(sessionId, {
        messages: [{
          role: message.role,
          content: message.content,
          metadata: {
            ...message.metadata,
            timestamp: new Date().toISOString(),
            userId: userId
          }
        }]
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
  public async getRecentMessages(userId: number, limit: number = 10): Promise<IMemoryContent[]> {
    try {
      const sessionId = `user_${userId}`;
      const request: MemoryGetSessionMessagesRequest = { limit };
      const response = await this.memory.getSessionMessages(sessionId, request);

      if (!response.messages) {
        return [];
      }

      return response.messages.map(m => ({
        role: m.role || 'unknown',
        content: m.content || '',
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
  public async searchSimilarMessages(userId: number, query: string, limit: number = 5): Promise<Array<IMemoryContent & { similarity: number }>> {
    try {
      const sessionId = `user_${userId}`;
      
      const response = await this.memory.getSessionMessages(sessionId, { limit });

      if (!response.messages?.length) {
        return [];
      }

      // Сортируем сообщения по релевантности к запросу
      const messages = response.messages
        .map(m => ({
          message: m,
          similarity: this.calculateSimilarity(query, m.content || '')
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      return messages.map(({ message: m, similarity }) => ({
        role: m.role || 'unknown',
        content: m.content || '',
        metadata: m.metadata,
        similarity
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
      await this.memory.delete(sessionId);
      console.log(`✅ История пользователя ${userId} очищена`);
    } catch (error) {
      console.error('❌ Ошибка очистки истории в Zep:', error);
      throw error;
    }
}

  /**
   * Вспомогательный метод для расчета релевантности
   * В реальном приложении здесь можно использовать более сложные алгоритмы
   */
  private calculateSimilarity(query: string, content: string): number {
    const queryWords = new Set(query.toLowerCase().split(' '));
    const contentWords = new Set(content.toLowerCase().split(' '));

    let matches = 0;
    for (const word of queryWords) {
      if (contentWords.has(word)) matches++;
    }

    return matches / queryWords.size || 0;
  }
}
