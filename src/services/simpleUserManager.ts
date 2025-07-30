import { SupportedLanguage, detectLanguageFromText } from "./simpleI18n";

class SimpleUserManager {
  private userLanguages = new Map<string, SupportedLanguage>();

  setUserLanguage(userId: string, language: SupportedLanguage): void {
    this.userLanguages.set(userId, language);
  }

  getUserLanguage(userId: string): SupportedLanguage {
    return this.userLanguages.get(userId) || "ru";
  }

  detectAndSetLanguage(userId: string, text: string): SupportedLanguage {
    const detectedLanguage = detectLanguageFromText(text);
    this.setUserLanguage(userId, detectedLanguage);
    return detectedLanguage;
  }

  getAllUsers(): string[] {
    return Array.from(this.userLanguages.keys());
  }

  getUsersCount(): number {
    return this.userLanguages.size;
  }

  getUsersByLanguage(language: SupportedLanguage): string[] {
    return Array.from(this.userLanguages.entries())
      .filter(([_, lang]) => lang === language)
      .map(([userId, _]) => userId);
  }

  getLanguageStats(): Record<SupportedLanguage, number> {
    const stats: Record<SupportedLanguage, number> = {
      lt: 0,
      ru: 0,
      en: 0,
    };

    for (const language of this.userLanguages.values()) {
      stats[language]++;
    }

    return stats;
  }
}

export const userLanguageManager = new SimpleUserManager();
