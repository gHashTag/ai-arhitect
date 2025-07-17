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

  return "lt"; // Литовский по умолчанию
}

// Автоматическое определение языка по содержимому текста
export function detectLanguageFromText(text: string): SupportedLanguage {
  const cleanText = text.toLowerCase().trim();

  // Ключевые слова для русского языка
  const russianKeywords = [
    "привет",
    "пока",
    "спасибо",
    "да",
    "нет",
    "как",
    "что",
    "где",
    "когда",
    "почему",
    "блоки",
    "бетон",
    "фундамент",
    "стена",
    "дом",
    "строительство",
    "здание",
    "мне",
    "тебе",
    "это",
    "так",
    "или",
    "для",
    "можно",
    "нужно",
    "хочу",
    "скажи",
    "какой",
    "сколько",
    "расчет",
    "материал",
    "проект",
    "размер",
    "цена",
    "посоветуй",
    "помоги",
    "расскажи",
    "объясни",
    "покажи",
    "сравни",
  ];

  // Ключевые слова для английского языка
  const englishKeywords = [
    "hello",
    "hi",
    "bye",
    "thank",
    "yes",
    "no",
    "how",
    "what",
    "where",
    "when",
    "why",
    "blocks",
    "concrete",
    "foundation",
    "wall",
    "house",
    "construction",
    "building",
    "me",
    "you",
    "this",
    "that",
    "or",
    "for",
    "can",
    "need",
    "want",
    "tell",
    "which",
    "much",
    "calculation",
    "material",
    "project",
    "size",
    "price",
    "suggest",
    "help",
    "explain",
    "show",
    "compare",
    "recommend",
  ];

  // Ключевые слова для литовского языка
  const lithuanianKeywords = [
    "labas",
    "ačiū",
    "taip",
    "ne",
    "kaip",
    "kas",
    "kur",
    "kada",
    "kodėl",
    "blokai",
    "betonas",
    "pamatai",
    "siena",
    "namas",
    "statyba",
    "pastatas",
    "man",
    "tau",
    "tai",
    "arba",
    "galiu",
    "noriu",
    "pasakyk",
    "kiek",
    "skaičiavimas",
    "medžiaga",
    "projektas",
    "dydis",
    "kaina",
    "patark",
    "padėk",
    "paaiškink",
    "parodyk",
    "palygink",
  ];

  // Проверяем кириллические символы (русский)
  const cyrillicPattern = /[а-яё]/i;
  if (cyrillicPattern.test(cleanText)) {
    return "ru";
  }

  // Проверяем литовские диакритики
  const lithuanianPattern = /[ąčęėįšųūž]/i;
  if (lithuanianPattern.test(cleanText)) {
    return "lt";
  }

  // Подсчитываем совпадения ключевых слов
  const words = cleanText.split(/\s+/);
  let ruScore = 0;
  let enScore = 0;
  let ltScore = 0;

  words.forEach((word) => {
    if (russianKeywords.includes(word)) ruScore++;
    if (englishKeywords.includes(word)) enScore++;
    if (lithuanianKeywords.includes(word)) ltScore++;
  });

  // Определяем язык по наибольшему количеству совпадений
  if (ruScore > enScore && ruScore > ltScore) {
    return "ru";
  } else if (enScore > ruScore && enScore > ltScore) {
    return "en";
  } else if (ltScore > ruScore && ltScore > enScore) {
    return "lt";
  }

  // Если совпадений нет или они равны, используем эвристики
  // Английский: много коротких слов, артикли
  const englishArticles = [
    "the",
    "a",
    "an",
    "is",
    "are",
    "was",
    "were",
    "and",
    "or",
    "but",
  ];
  const englishArticleCount = words.filter((word) =>
    englishArticles.includes(word)
  ).length;

  if (englishArticleCount > 0) {
    return "en";
  }

  // По умолчанию возвращаем литовский (язык по умолчанию)
  return "lt";
}

// Быстрая функция для получения переводов
export function t(
  language: SupportedLanguage,
  key: string,
  options?: Record<string, any>
): string {
  return i18next.t(key, { lng: language, ...options });
}
