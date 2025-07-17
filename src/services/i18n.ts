import i18next from "i18next";
import path from "path";
import fs from "fs";

// Тип языков поддерживаемых приложением
export type SupportedLanguage = "lt" | "ru" | "en";

// Инициализация i18next
export async function initI18n(): Promise<void> {
  // Загружаем переводы из файлов
  const localesDir = path.join(__dirname, "../../locales");
  const ltTranslations = JSON.parse(
    fs.readFileSync(path.join(localesDir, "lt.json"), "utf8")
  );
  const ruTranslations = JSON.parse(
    fs.readFileSync(path.join(localesDir, "ru.json"), "utf8")
  );
  const enTranslations = JSON.parse(
    fs.readFileSync(path.join(localesDir, "en.json"), "utf8")
  );

  await i18next.init({
    lng: "lt", // литовский по умолчанию
    fallbackLng: "lt",
    debug: false,
    resources: {
      lt: { translation: ltTranslations },
      ru: { translation: ruTranslations },
      en: { translation: enTranslations },
    },
    interpolation: {
      escapeValue: false, // React уже экранирует значения
    },
  });
}

// Получение переводчика для конкретного языка
export function getTranslator(language: SupportedLanguage) {
  return i18next.getFixedT(language);
}

// Функция для определения языка пользователя
export function determineLanguage(
  languageCode: string | undefined
): SupportedLanguage {
  if (!languageCode) {
    return "lt"; // Литовский по умолчанию
  }

  if (languageCode.startsWith("ru")) {
    return "ru"; // Русский
  }

  if (languageCode.startsWith("en")) {
    return "en"; // Английский
  }

  return "lt"; // Другие языки также будут литовскими
}

// Функция для получения переводов для конкретного пользователя
export function t(
  language: SupportedLanguage,
  key: string,
  options?: any
): string {
  const translator = getTranslator(language);
  return String(translator(key, options));
}
