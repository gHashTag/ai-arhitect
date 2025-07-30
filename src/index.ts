import { Telegraf, Markup } from "telegraf";
import { message } from "telegraf/filters";
import express from "express";
import { i18n, detectLanguageFromText } from "./services/simpleI18n";
import { catalog } from "./services/simpleCatalog";
import { userLanguageManager } from "./services/simpleUserManager";
import { enhancedAssistantService } from "./services/enhancedAssistantService";
import { faqService } from "./services/updatedFAQService";
import { loadExpandedFAQs } from "./services/expandedFAQData";

// Проверяем переменные окружения
if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN не найден в переменных окружения");
  process.exit(1);
}

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY не найден в переменных окружения");
  process.exit(1);
}

// Загружаем расширенные FAQ при старте бота
loadExpandedFAQs(faqService);

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Middleware для логирования
bot.use((ctx, next) => {
  const user = ctx.from;
  const chatType = ctx.chat?.type;
  const messageText = "text" in ctx.message! ? ctx.message.text : "non-text";

  console.log(
    `📨 ${user?.first_name} (${user?.id}) в ${chatType}: ${messageText}`
  );
  return next();
});

// Команда /start
bot.start(async (ctx) => {
  const user = ctx.from;
  const userId = user.id.toString();

  // Определяем язык пользователя
  const detectedLanguage = detectLanguageFromText(
    `${user.first_name} ${user.last_name || ""} ${user.language_code || ""}`
  );
  userLanguageManager.setUserLanguage(userId, detectedLanguage);

  const lang = userLanguageManager.getUserLanguage(userId);
  const welcome = i18n.getMessage("welcome", lang, {
    name: user.first_name,
    totalFAQs: faqService.getAllFAQs().length.toString(),
  });

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback(i18n.getMessage("btn_catalog", lang), "catalog")],
    [Markup.button.callback(i18n.getMessage("btn_consult", lang), "consult")],
    [Markup.button.callback("📋 Часто задаваемые вопросы", "faq_menu")],
    [Markup.button.callback(i18n.getMessage("btn_help", lang), "help")],
  ]);

  await ctx.reply(welcome, keyboard);
});

// Команда /faq - быстрый доступ к FAQ
bot.command("faq", async (ctx) => {
  await handleFAQMenu(ctx);
});

// Обработчик FAQ меню
async function handleFAQMenu(ctx: any) {
  const userId = ctx.from.id.toString();
  const lang = userLanguageManager.getUserLanguage(userId);

  // Получаем категории и FAQ на языке пользователя
  const allCategories = faqService.getAllCategories();
  const userFAQs = faqService.getFAQsByLanguage(lang as "lt" | "ru" | "en");

  // Показываем только категории, в которых есть FAQ на языке пользователя
  const categoriesWithFAQs = allCategories.filter((cat) =>
    userFAQs.some((faq) => faq.category === cat.id)
  );

  const keyboard = Markup.inlineKeyboard([
    ...categoriesWithFAQs.map((cat) => {
      const categoryFAQs = faqService
        .getFAQsByCategory(cat.id)
        .filter((faq) => faq.language === lang);
      return [
        Markup.button.callback(
          `${cat.name} (${categoryFAQs.length})`,
          `faq_cat_${cat.id}`
        ),
      ];
    }),
    [
      Markup.button.callback(
        lang === "lt" ? "🔍 Paieška FAQ" : "🔍 Поиск по FAQ",
        "faq_search"
      ),
    ],
    [
      Markup.button.callback(
        lang === "lt" ? "📊 FAQ statistika" : "📊 Статистика FAQ",
        "faq_stats"
      ),
    ],
    [Markup.button.callback("« Назад", "main_menu")],
  ]);

  const message =
    lang === "lt"
      ? `📋 **Dažnai užduodami klausimai**\n\nPasirinkite kategoriją arba naudokite paiešką:\n\n📊 Iš viso FAQ: ${userFAQs.length}`
      : `📋 **Часто задаваемые вопросы**\n\nВыберите категорию или воспользуйтесь поиском:\n\n📊 Всего FAQ: ${userFAQs.length}`;

  if (ctx.callbackQuery) {
    await ctx.editMessageText(message, { parse_mode: "Markdown", ...keyboard });
  } else {
    await ctx.reply(message, { parse_mode: "Markdown", ...keyboard });
  }
}

// Обработчик категорий FAQ
bot.action(/faq_cat_(.+)/, async (ctx) => {
  const categoryId = ctx.match[1];
  const userId = ctx.from.id.toString();
  const lang = userLanguageManager.getUserLanguage(userId);

  const category = faqService.getCategoryById(categoryId);
  const allFaqs = faqService.getFAQsByCategory(categoryId);

  // Фильтруем FAQ по языку пользователя
  const faqs = allFaqs.filter((faq) => faq.language === lang);

  if (!category || faqs.length === 0) {
    await ctx.answerCbQuery(
      lang === "lt" ? "❌ Kategorija nerasta" : "❌ Категория не найдена"
    );
    return;
  }

  const keyboard = Markup.inlineKeyboard([
    ...faqs
      .slice(0, 10)
      .map((faq) => [
        Markup.button.callback(
          faq.question.length > 40
            ? faq.question.substring(0, 40) + "..."
            : faq.question,
          `faq_show_${faq.id}`
        ),
      ]),
    [
      Markup.button.callback(
        lang === "lt" ? "« Į kategorijas" : "« К категориям",
        "faq_menu"
      ),
    ],
  ]);

  const message =
    lang === "lt"
      ? `📂 **${category.name}**\n${category.description}\n\n📋 Klausimų kategorijoje: ${faqs.length}`
      : `📂 **${category.name}**\n${category.description}\n\n📋 Вопросов в категории: ${faqs.length}`;

  await ctx.editMessageText(message, { parse_mode: "Markdown", ...keyboard });
});

// Показ конкретного FAQ
bot.action(/faq_show_(.+)/, async (ctx) => {
  const faqId = ctx.match[1];
  const faq = faqService.getFAQById(faqId);

  if (!faq) {
    await ctx.answerCbQuery("❌ FAQ не найден");
    return;
  }

  const category = faqService.getCategoryById(faq.category);
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("📞 Связаться с менеджером", "contact_manager")],
    [Markup.button.callback("« К категории", `faq_cat_${faq.category}`)],
  ]);

  const message = `❓ **${faq.question}**\n\n✅ ${faq.answer}\n\n🏷️ Теги: ${faq.tags.join(", ")}\n📦 Продукт: ${faq.product}\n📂 Категория: ${category?.name}`;

  await ctx.editMessageText(message, { parse_mode: "Markdown", ...keyboard });
});

// Статистика FAQ
bot.action("faq_stats", async (ctx) => {
  const allFAQs = faqService.getAllFAQs();
  const categories = faqService.getAllCategories();

  const statsByCategory = categories.map((cat) => ({
    name: cat.name,
    count: faqService.getFAQsByCategory(cat.id).length,
  }));

  const statsByLanguage = {
    ru: faqService.getFAQsByLanguage("ru").length,
    lt: faqService.getFAQsByLanguage("lt").length,
    en: faqService.getFAQsByLanguage("en").length,
  };

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("« К FAQ", "faq_menu")],
  ]);

  let message = `📊 **Статистика FAQ**\n\n`;
  message += `📋 Всего вопросов: ${allFAQs.length}\n`;
  message += `📂 Категорий: ${categories.length}\n\n`;
  message += `**По категориям:**\n`;
  statsByCategory.forEach((stat) => {
    message += `• ${stat.name}: ${stat.count}\n`;
  });
  message += `\n**По языкам:**\n`;
  message += `🇷🇺 Русский: ${statsByLanguage.ru}\n`;
  message += `🇱🇹 Литовский: ${statsByLanguage.lt}\n`;
  message += `🇬🇧 Английский: ${statsByLanguage.en}`;

  await ctx.editMessageText(message, { parse_mode: "Markdown", ...keyboard });
});

// Команда /blocks - быстрый доступ к каталогу
bot.command("blocks", async (ctx) => {
  const userId = ctx.from.id.toString();
  const lang = userLanguageManager.getUserLanguage(userId);

  const catalogText = i18n.getMessage("catalog_intro", lang);
  const keyboard = catalog.getMainCatalogKeyboard(lang);

  await ctx.reply(catalogText, keyboard);
});

// Команда /consult - консультация с AI
bot.command("consult", async (ctx) => {
  const userId = ctx.from.id.toString();
  const lang = userLanguageManager.getUserLanguage(userId);

  const consultText = i18n.getMessage("consult_intro", lang);
  await ctx.reply(consultText);
});

// Обработка callback queries для каталога
bot.action("catalog", async (ctx) => {
  const userId = ctx.from.id.toString();
  const lang = userLanguageManager.getUserLanguage(userId);

  const catalogText = i18n.getMessage("catalog_intro", lang);
  const keyboard = catalog.getMainCatalogKeyboard(lang);

  await ctx.editMessageText(catalogText, keyboard);
});

bot.action("consult", async (ctx) => {
  const userId = ctx.from.id.toString();
  const lang = userLanguageManager.getUserLanguage(userId);

  const consultText = i18n.getMessage("consult_intro", lang);
  await ctx.editMessageText(consultText);
});

bot.action("help", async (ctx) => {
  const userId = ctx.from.id.toString();
  const lang = userLanguageManager.getUserLanguage(userId);

  const helpText = i18n.getMessage("help", lang);
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback(i18n.getMessage("btn_back", lang), "main_menu")],
  ]);

  await ctx.editMessageText(helpText, keyboard);
});

bot.action("faq_menu", async (ctx) => {
  await handleFAQMenu(ctx);
});

bot.action("main_menu", async (ctx) => {
  const userId = ctx.from.id.toString();
  const lang = userLanguageManager.getUserLanguage(userId);

  const welcome = i18n.getMessage("welcome", lang, {
    name: ctx.from.first_name,
    totalFAQs: faqService.getAllFAQs().length.toString(),
  });

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback(i18n.getMessage("btn_catalog", lang), "catalog")],
    [Markup.button.callback(i18n.getMessage("btn_consult", lang), "consult")],
    [Markup.button.callback("📋 Часто задаваемые вопросы", "faq_menu")],
    [Markup.button.callback(i18n.getMessage("btn_help", lang), "help")],
  ]);

  await ctx.editMessageText(welcome, keyboard);
});

// Обработка остальных callback queries для каталога
// Заменено новым обработчиком /^cat_(.+)$/ ниже

// Обработчики для каталога блоков
bot.action(/^cat_(.+)$/, async (ctx) => {
  const category = ctx.match[1] as "foundation" | "wall" | "special";
  const lang = userLanguageManager.getUserLanguage(ctx.from.id.toString());

  try {
    const keyboard = catalog.getCategoryBlocks(category, lang);
    const categoryNames = {
      foundation: {
        ru: "🏗️ Фундаментные блоки",
        lt: "🏗️ Pamatų blokai",
        en: "🏗️ Foundation blocks",
      },
      wall: {
        ru: "🧱 Стеновые блоки",
        lt: "🧱 Sienų blokai",
        en: "🧱 Wall blocks",
      },
      special: {
        ru: "⚙️ Специальные блоки",
        lt: "⚙️ Specialūs blokai",
        en: "⚙️ Special blocks",
      },
    };

    await ctx.editMessageText(categoryNames[category][lang], keyboard);
  } catch (error) {
    console.error("Error showing category:", error);
    await ctx.answerCbQuery(i18n.getMessage("ai_error", lang));
  }
});

bot.action(/^block_(.+)$/, async (ctx) => {
  const blockId = ctx.match[1];
  const lang = userLanguageManager.getUserLanguage(ctx.from.id.toString());

  try {
    const blockInfo = catalog.getBlockDetails(blockId, lang);
    if (blockInfo) {
      await ctx.editMessageText(blockInfo.details, {
        parse_mode: "Markdown",
        ...blockInfo.keyboard,
      });
    } else {
      await ctx.editMessageText(i18n.getMessage("category_not_found", lang));
    }
  } catch (error) {
    console.error("Error showing block details:", error);
    await ctx.answerCbQuery(i18n.getMessage("ai_error", lang));
  }
});

bot.action("back_to_catalog", async (ctx) => {
  const userId = ctx.from.id.toString();
  const lang = userLanguageManager.getUserLanguage(userId);

  const catalogText = i18n.getMessage("catalog_intro", lang);
  const keyboard = catalog.getMainCatalogKeyboard(lang);

  await ctx.editMessageText(catalogText, keyboard);
});

// Заменено новым обработчиком cat_ ниже

// Обработка текстовых сообщений (AI консультации)
bot.on(message("text"), async (ctx) => {
  const userId = ctx.from.id.toString();
  const userLanguage = userLanguageManager.getUserLanguage(userId);
  const messageText = ctx.message.text;

  // Показываем индикатор "печатает"
  await ctx.sendChatAction("typing");

  try {
    console.log(
      `🤖 Обращение к AI: ${ctx.from.first_name} спросил: "${messageText}"`
    );

    // Анализируем запрос для определения релевантности FAQ
    const queryAnalysis = enhancedAssistantService.analyzeQuery(messageText);
    console.log(`📊 Анализ запроса:`, queryAnalysis);

    const response = await enhancedAssistantService.getResponse({
      message: messageText,
      userName: ctx.from.first_name,
      userLanguage: userLanguage,
      useFAQContext: queryAnalysis.needsFAQ,
    });

    if (response) {
      console.log(`✅ AI ответил: ${response.substring(0, 100)}...`);

      // Добавляем кнопки с релевантными FAQ если есть совпадения
      let keyboard;
      if (queryAnalysis.needsFAQ && queryAnalysis.confidence > 0.3) {
        const suggestedFAQs = faqService.searchFAQs(messageText).slice(0, 3);
        if (suggestedFAQs.length > 0) {
          keyboard = Markup.inlineKeyboard([
            ...suggestedFAQs.map((faq) => [
              Markup.button.callback(
                `📋 ${faq.question.length > 35 ? faq.question.substring(0, 35) + "..." : faq.question}`,
                `faq_show_${faq.id}`
              ),
            ]),
            [
              Markup.button.callback(
                "📞 Связаться с менеджером",
                "contact_manager"
              ),
            ],
          ]);
        }
      }

      await ctx.reply(response, keyboard || undefined);
    } else {
      const errorMessage = i18n.getMessage("ai_error", userLanguage);
      await ctx.reply(errorMessage);
    }
  } catch (error) {
    console.error("❌ Ошибка AI:", error);
    const errorMessage = i18n.getMessage("ai_error", userLanguage);
    await ctx.reply(errorMessage);
  }
});

// Обработка контакта с менеджером
bot.action("contact_manager", async (ctx) => {
  const userId = ctx.from.id.toString();
  const lang = userLanguageManager.getUserLanguage(userId);

  const contactText =
    `📞 **Контакты менеджеров HAUS:**\n\n` +
    `🇱🇹 Телефон: +37064608801\n` +
    `📧 Email: haus@vbg.lt\n` +
    `🌐 Сайт: www.vbg.lt\n\n` +
    `⏰ Режим работы: Пн-Пт 8:00-17:00\n\n` +
    `💬 Менеджеры помогут с:\n` +
    `• Расчетом точного количества материалов\n` +
    `• Подбором оптимального решения\n` +
    `• Оформлением заказа\n` +
    `• Консультацией по доставке`;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.url("📞 Позвонить", "tel:+37064608801")],
    [Markup.button.url("📧 Написать письмо", "mailto:haus@vbg.lt")],
    [Markup.button.callback("« Назад", "main_menu")],
  ]);

  await ctx.editMessageText(contactText, {
    parse_mode: "Markdown",
    ...keyboard,
  });
});

// Graceful shutdown
process.once("SIGINT", () => {
  console.log("\n🛑 Получен сигнал SIGINT, завершаем работу бота...");
  bot.stop("SIGINT");
  process.exit(0);
});

process.once("SIGTERM", () => {
  console.log("\n🛑 Получен сигнал SIGTERM, завершаем работу бота...");
  bot.stop("SIGTERM");
  process.exit(0);
});

// HTTP сервер для Railway healthcheck
const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint для Railway
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    bot: "AI Architect Bot",
    faqs: faqService.getAllFAQs().length,
    categories: faqService.getAllCategories().length,
  });
});

// Основная страница
app.get("/", (req, res) => {
  res.json({
    message: "🤖 AI Architect Bot is running!",
    telegram: "@ai_architect_haus_bot",
    faqs: {
      total: faqService.getAllFAQs().length,
      russian: faqService.getFAQsByLanguage("ru").length,
      lithuanian: faqService.getFAQsByLanguage("lt").length,
    },
  });
});

// Запуск HTTP сервера
app.listen(PORT, () => {
  console.log(`🌐 HTTP сервер запущен на порту ${PORT}`);
});

// Запуск бота
console.log("🚀 Запуск Telegram бота AI-Архитектор...");
console.log(`📊 Загружено FAQ: ${faqService.getAllFAQs().length}`);
console.log(`📂 Категорий FAQ: ${faqService.getAllCategories().length}`);

bot
  .launch()
  .then(() => {
    console.log("✅ Бот успешно запущен!");
    console.log(`🇷🇺 Русских FAQ: ${faqService.getFAQsByLanguage("ru").length}`);
    console.log(
      `🇱🇹 Литовских FAQ: ${faqService.getFAQsByLanguage("lt").length}`
    );
  })
  .catch((error) => {
    console.error("❌ Ошибка запуска бота:", error);
    process.exit(1);
  });

// Graceful stop
process.once("SIGINT", () => {
  bot.stop("SIGINT");
  process.exit(0);
});
process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
  process.exit(0);
});

export default bot;
