import { Context } from 'telegraf';
import { SupportedLanguage, determineLanguage } from './i18n';

// Интерфейс для хранения языковых предпочтений пользователя
interface UserLanguagePreference {
  userId: number;
  language: SupportedLanguage;
  updatedAt: Date;
}

// Хранилище языковых предпочтений (в продакшене можно заменить на БД)
class UserLanguageStorage {
  private preferences: Map<number, UserLanguagePreference> = new Map();

  // Получить язык пользователя
  getLanguage(userId: number): SupportedLanguage | null {
    const preference = this.preferences.get(userId);
    return preference ? preference.language : null;
  }

  // Сохранить язык пользователя
  setLanguage(userId: number, language: SupportedLanguage): void {
    this.preferences.set(userId, {
      userId,
      language,
      updatedAt: new Date()
    });
  }

  // Удалить предпочтение пользователя
  removeLanguage(userId: number): void {
    this.preferences.delete(userId);
  }

  // Получить все предпочтения (для отладки/статистики)
  getAllPreferences(): UserLanguagePreference[] {
    return Array.from(this.preferences.values());
  }
}

// Создаем единственный экземпляр хранилища
const storage = new UserLanguageStorage();

/**
 * Менеджер языковых предпочтений пользователя
 */
export class UserLanguageManager {
  /**
   * Получить язык для пользователя с учетом его предпочтений
   */
  static getUserLanguage(ctx: Context): SupportedLanguage {
    const userId = ctx.from?.id;
    
    if (!userId) {
      // Если нет ID пользователя, используем язык из Telegram
      return determineLanguage(ctx.from?.language_code);
    }

    // Сначала проверяем сохраненные предпочтения
    const savedLanguage = storage.getLanguage(userId);
    if (savedLanguage) {
      return savedLanguage;
    }

    // Если нет сохраненных предпочтений, определяем по языку Telegram
    const detectedLanguage = determineLanguage(ctx.from?.language_code);
    
    // Сохраняем автоматически определенный язык
    storage.setLanguage(userId, detectedLanguage);
    
    return detectedLanguage;
  }

  /**
   * Установить язык для пользователя
   */
  static setUserLanguage(userId: number, language: SupportedLanguage): void {
    storage.setLanguage(userId, language);
  }

  /**
   * Переключить язык на следующий в списке
   */
  static toggleUserLanguage(ctx: Context): SupportedLanguage {
    const userId = ctx.from?.id;
    if (!userId) {
      return 'lt';
    }

    const currentLanguage = this.getUserLanguage(ctx);
    const languages: SupportedLanguage[] = ['lt', 'ru', 'en'];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    const nextLanguage = languages[nextIndex];

    storage.setLanguage(userId, nextLanguage);
    return nextLanguage;
  }

  /**
   * Получить эмодзи флага для языка
   */
  static getLanguageFlag(language: SupportedLanguage): string {
    switch (language) {
      case 'lt': return '🇱🇹';
      case 'ru': return '🇷🇺';
      case 'en': return '🇬🇧';
      default: return '🌐';
    }
  }

  /**
   * Получить название языка на том же языке
   */
  static getLanguageName(language: SupportedLanguage): string {
    switch (language) {
      case 'lt': return 'Lietuvių';
      case 'ru': return 'Русский';
      case 'en': return 'English';
      default: return language;
    }
  }

  /**
   * Получить кнопку для выбора языка
   */
  static getLanguageButton(currentLanguage: SupportedLanguage): string {
    const flag = this.getLanguageFlag(currentLanguage);
    const name = this.getLanguageName(currentLanguage);
    return `${flag} ${name}`;
  }

  /**
   * Очистить предпочтения пользователя
   */
  static clearUserLanguage(userId: number): void {
    storage.removeLanguage(userId);
  }

  /**
   * Получить статистику использования языков
   */
  static getLanguageStats(): Record<SupportedLanguage, number> {
    const stats: Record<SupportedLanguage, number> = {
      lt: 0,
      ru: 0,
      en: 0
    };

    storage.getAllPreferences().forEach(pref => {
      stats[pref.language]++;
    });

    return stats;
  }
}
