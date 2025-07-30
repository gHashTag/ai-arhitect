export type SupportedLanguage = "lt" | "ru" | "en";

// Полные переводы для системы FAQ на всех языках
const translations = {
  lt: {
    welcome:
      "Sveiki, {name}! 🏗️ Aš esu HAUS konsultantas. Turime {totalFAQs} atsakymų į dažniausiai užduodamus klausimus.",
    btn_catalog: "📋 Katalogas",
    btn_consult: "💬 Konsultacija",
    btn_help: "❓ Pagalba",
    btn_back: "« Atgal",
    catalog_intro:
      "🧱 **HAUS statybos blokų katalogas**\n\nPasirinkite kategoriją:",
    consult_intro:
      "💬 **AI konsultantas**\n\nParašykite savo klausimą apie HAUS blokus, ir aš jums padėsiu!",
    help: "❓ **Pagalba**\n\n• /start - Pradėti iš naujo\n• /faq - Dažniausi klausimai\n• /blocks - Blokų katalogas\n• /consult - AI konsultacija\n\n📞 Specialistų kontaktai:\n+37064608801 | haus@vbg.lt",
    ai_error:
      "😔 Atsiprašau, įvyko klaida. Pabandykite dar kartą arba kreipkitės į specialistus: +37064608801",
    faq_menu_title: "📋 Dažniausi klausimai",
    faq_menu_desc: "Pasirinkite kategoriją arba naudokite paiešką:",
    faq_search: "🔍 Paieška pagal DUK",
    faq_stats: "📊 DUK statistika",
    faq_back_to_categories: "« Į kategorijas",
    faq_contact_manager: "📞 Susisiekti su vadybininku",
    faq_back_to_category: "« Į kategoriją",
    contact_title: "📞 HAUS vadybininkų kontaktai:",
    contact_phone: "🇱🇹 Telefonas: +37064608801",
    contact_email: "📧 El. paštas: haus@vbg.lt",
    contact_website: "🌐 Svetainė: www.vbg.lt",
    contact_hours: "⏰ Darbo laikas: Pr-Pn 8:00-17:00",
    contact_help_with: "💬 Vadybininkai padės su:",
    contact_calculations: "• Tiksliu medžiagų kiekio apskaičiavimu",
    contact_solutions: "• Optimalaus sprendimo parinkimu",
    contact_orders: "• Užsakymo formalizavimu",
    contact_delivery: "• Pristatymo konsultacija",
    btn_call: "📞 Skambinti",
    btn_email: "📧 Rašyti laišką",
    category_not_found: "❌ Kategorija nerasta",
    faq_not_found: "❌ DUK nerastas",
    stats_title: "📊 DUK statistika",
    stats_total: "📋 Iš viso klausimų: ",
    stats_categories: "📂 Kategorijų: ",
    stats_by_category: "Pagal kategorijas:",
    stats_by_language: "Pagal kalbas:",
    lang_lithuanian: "🇱🇹 Lietuvių",
    lang_russian: "🇷🇺 Rusų",
    lang_english: "🇬🇧 Anglų",
  },
  ru: {
    welcome:
      "Привет, {name}! 🏗️ Я консультант HAUS. У нас есть {totalFAQs} ответов на часто задаваемые вопросы.",
    btn_catalog: "📋 Каталог",
    btn_consult: "💬 Консультация",
    btn_help: "❓ Помощь",
    btn_back: "« Назад",
    catalog_intro:
      "🧱 **Каталог строительных блоков HAUS**\n\nВыберите категорию:",
    consult_intro:
      "💬 **AI консультант**\n\nНапишите свой вопрос о блоках HAUS, и я вам помогу!",
    help: "❓ **Помощь**\n\n• /start - Начать заново\n• /faq - Часто задаваемые вопросы\n• /blocks - Каталог блоков\n• /consult - AI консультация\n\n📞 Контакты специалистов:\n+37064608801 | haus@vbg.lt",
    ai_error:
      "😔 Извините, произошла ошибка. Попробуйте ещё раз или обратитесь к специалистам: +37064608801",
    faq_menu_title: "📋 Часто задаваемые вопросы",
    faq_menu_desc: "Выберите категорию или воспользуйтесь поиском:",
    faq_search: "🔍 Поиск по FAQ",
    faq_stats: "📊 Статистика FAQ",
    faq_back_to_categories: "« К категориям",
    faq_contact_manager: "📞 Связаться с менеджером",
    faq_back_to_category: "« К категории",
    contact_title: "📞 Контакты менеджеров HAUS:",
    contact_phone: "🇱🇹 Телефон: +37064608801",
    contact_email: "📧 Email: haus@vbg.lt",
    contact_website: "🌐 Сайт: www.vbg.lt",
    contact_hours: "⏰ Режим работы: Пн-Пт 8:00-17:00",
    contact_help_with: "💬 Менеджеры помогут с:",
    contact_calculations: "• Расчетом точного количества материалов",
    contact_solutions: "• Подбором оптимального решения",
    contact_orders: "• Оформлением заказа",
    contact_delivery: "• Консультацией по доставке",
    btn_call: "📞 Позвонить",
    btn_email: "📧 Написать письмо",
    category_not_found: "❌ Категория не найдена",
    faq_not_found: "❌ FAQ не найден",
    stats_title: "📊 Статистика FAQ",
    stats_total: "📋 Всего вопросов: ",
    stats_categories: "📂 Категорий: ",
    stats_by_category: "По категориям:",
    stats_by_language: "По языкам:",
    lang_lithuanian: "🇱🇹 Литовский",
    lang_russian: "🇷🇺 Русский",
    lang_english: "🇬🇧 Английский",
  },
  en: {
    welcome:
      "Hello, {name}! 🏗️ I am HAUS consultant. We have {totalFAQs} answers to frequently asked questions.",
    btn_catalog: "📋 Catalog",
    btn_consult: "💬 Consultation",
    btn_help: "❓ Help",
    btn_back: "« Back",
    catalog_intro: "🧱 **HAUS Building Blocks Catalog**\n\nSelect category:",
    consult_intro:
      "💬 **AI Consultant**\n\nWrite your question about HAUS blocks, and I will help you!",
    help: "❓ **Help**\n\n• /start - Start over\n• /faq - Frequently asked questions\n• /blocks - Blocks catalog\n• /consult - AI consultation\n\n📞 Specialists contacts:\n+37064608801 | haus@vbg.lt",
    ai_error:
      "😔 Sorry, an error occurred. Please try again or contact specialists: +37064608801",
    faq_menu_title: "📋 Frequently Asked Questions",
    faq_menu_desc: "Select category or use search:",
    faq_search: "🔍 Search FAQ",
    faq_stats: "📊 FAQ Statistics",
    faq_back_to_categories: "« To categories",
    faq_contact_manager: "📞 Contact manager",
    faq_back_to_category: "« To category",
    contact_title: "📞 HAUS managers contacts:",
    contact_phone: "🇱🇹 Phone: +37064608801",
    contact_email: "📧 Email: haus@vbg.lt",
    contact_website: "🌐 Website: www.vbg.lt",
    contact_hours: "⏰ Working hours: Mon-Fri 8:00-17:00",
    contact_help_with: "💬 Managers will help with:",
    contact_calculations: "• Accurate material quantity calculation",
    contact_solutions: "• Optimal solution selection",
    contact_orders: "• Order processing",
    contact_delivery: "• Delivery consultation",
    btn_call: "📞 Call",
    btn_email: "📧 Send email",
    category_not_found: "❌ Category not found",
    faq_not_found: "❌ FAQ not found",
    stats_title: "📊 FAQ Statistics",
    stats_total: "📋 Total questions: ",
    stats_categories: "📂 Categories: ",
    stats_by_category: "By categories:",
    stats_by_language: "By languages:",
    lang_lithuanian: "🇱🇹 Lithuanian",
    lang_russian: "🇷🇺 Russian",
    lang_english: "🇬🇧 English",
  },
};

export class SimpleI18nService {
  getMessage(
    key: string,
    language: SupportedLanguage,
    replacements?: Record<string, string>
  ): string {
    let message =
      translations[language]?.[
        key as keyof (typeof translations)[typeof language]
      ] ||
      translations["ru"][key as keyof (typeof translations)["ru"]] ||
      key;

    // Заменяем плейсхолдеры
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        message = message.replace(new RegExp(`{${placeholder}}`, "g"), value);
      });
    }

    return message;
  }

  getSupportedLanguages(): SupportedLanguage[] {
    return ["lt", "ru", "en"];
  }

  getAllTranslations(language: SupportedLanguage): Record<string, string> {
    return translations[language] || translations["ru"];
  }
}

// Функция определения языка по тексту (улучшенная)
export function detectLanguageFromText(text: string): SupportedLanguage {
  if (!text) return "ru";

  const lowerText = text.toLowerCase();

  // Русский язык - кириллица
  if (/[а-яё]/i.test(text)) {
    return "ru";
  }

  // Литовский язык - специфические символы и слова
  if (
    /[ąčęėįšųūž]/i.test(text) ||
    /\b(ir|yra|kad|bet|taip|ne|su|be|per|už|ant|po|prie|nuo|iki|dėl|apie|kaip|kas|kur|kada|kodėl|kiek|kuris|kokis|kuriam|kurią|kurie|kurios|kuriuos|kurias|sveiki|ačiū|labas|gerai|bloga|didelis|mažas|naujas|senas)\b/i.test(
      lowerText
    )
  ) {
    return "lt";
  }

  // Английский язык - специфические слова
  if (
    /\b(the|and|or|but|with|for|from|what|where|when|why|how|this|that|these|those|hello|thank|good|bad|big|small|new|old)\b/i.test(
      lowerText
    )
  ) {
    return "en";
  }

  // По умолчанию русский
  return "ru";
}

export const i18n = new SimpleI18nService();
