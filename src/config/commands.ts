import { BotCommand } from 'telegraf/typings/core/types/typegram';
import { SupportedLanguage } from '../services/i18n';

// Описание команд для каждого языка
const commandDescriptions: Record<SupportedLanguage, Record<string, string>> = {
  lt: {
    start: '🏗️ Pagrindinis meniu ir pasisveikinimas',
    help: '📚 Pagalba kaip naudotis botu',
    blocks: '🧱 HAUS statybinių blokų katalogas',
    consult: '👨‍💼 Architekto eksperto konsultacija',
    language: '🌐 Kalbos pasirinkimas / Language / Язык'
  },
  ru: {
    start: '🏗️ Главное меню и приветствие',
    help: '📚 Справка по использованию бота',
    blocks: '🧱 Каталог строительных блоков HAUS',
    consult: '👨‍💼 Экспертная консультация архитектора',
    language: '🌐 Выбор языка / Language / Kalba'
  },
  en: {
    start: '🏗️ Main menu and welcome',
    help: '📚 Bot usage help',
    blocks: '🧱 HAUS construction blocks catalog',
    consult: '👨‍💼 Expert architect consultation',
    language: '🌐 Language selection / Kalba / Язык'
  }
};

// Список всех команд
const commandList = ['start', 'help', 'blocks', 'consult', 'language'] as const;
type CommandName = typeof commandList[number];

/**
 * Получить команды для указанного языка
 */
export function getBotCommands(language: SupportedLanguage): BotCommand[] {
  const descriptions = commandDescriptions[language];
  return commandList.map(command => ({
    command,
    description: descriptions[command]
  }));
}

/**
 * Получить описание команды на указанном языке
 */
export function getCommandDescription(command: CommandName, language: SupportedLanguage): string {
  return commandDescriptions[language][command];
}

/**
 * Установить команды бота для конкретного языка
 */
export async function setupBotCommands(bot: any, language: SupportedLanguage = 'lt'): Promise<void> {
  try {
    // Устанавливаем команды для конкретного языка с языковым параметром
    await bot.telegram.setMyCommands(
      getBotCommands(language),
      { language_code: language }
    );
    console.log(`✅ Bot commands configured for language: ${language}`);
  } catch (error) {
    console.error(`❌ Error setting bot commands for ${language}:`, error);
    throw error;
  }
}
