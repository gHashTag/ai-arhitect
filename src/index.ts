import * as dotenv from "dotenv";
dotenv.config();

// Проверяем, что переменные окружения загружены
console.log("🔍 Environment variables loaded:", {
  BOT_TOKEN: process.env.BOT_TOKEN ? "✅" : "❌",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "✅" : "❌",
  OPENAI_ASSISTANT_ID: process.env.OPENAI_ASSISTANT_ID ? "✅" : "❌",
  ZEP_API_KEY: process.env.ZEP_API_KEY ? "✅" : "❌",
});
import { Telegraf, Markup } from "telegraf";
import express from "express";
import path from "path";
import { openai } from "./services/openai";
import {
  initI18n,
  determineLanguage,
  detectLanguageFromText,
  t,
  SupportedLanguage,
} from "./services/i18n";
import { ZepMemoryService } from "./services/zepMemory";
import { UserLanguageManager } from "./services/userLanguageManager";
import { getAiFeedbackFromSupabase } from "./services/getAiFeedbackFromOpenAI";
import { setupBotCommands, getBotCommands } from "./config/commands";
import {
  PRODUCTS,
  CATEGORIES,
  getProductsByCategory,
  getProductById,
  formatProductCard,
  compareProducts,
  filterProducts,
} from "./services/catalog";

// Проверка обязательных переменных окружения
const BOT_TOKEN = process.env.BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is required");
}

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

if (!ASSISTANT_ID) {
  throw new Error("OPENAI_ASSISTANT_ID is required");
}

// Создание экземпляра бота
const bot: Telegraf = new Telegraf(BOT_TOKEN);

// Функция проверки Assistant доступности
async function checkAssistantAvailability(): Promise<boolean> {
  try {
    const assistant = await openai.beta.assistants.retrieve(ASSISTANT_ID!);
    console.log(`✅ Assistant available: ${assistant.name || "Unnamed"}`);
    return true;
  } catch (error) {
    console.error(`❌ Assistant not available (ID: ${ASSISTANT_ID}):`, error);
    return false;
  }
}

// Middleware для выбора языка
bot.use((ctx, next) => {
  // Используем UserLanguageManager для получения языка пользователя
  const language = UserLanguageManager.getUserLanguage(ctx);
  if (!ctx.session) {
    ctx.session = { language };
  } else {
    ctx.session.language = language;
  }
  return next();
});

// Middleware для логирования
bot.use((ctx, next) => {
  console.log(`[${new Date().toISOString()}] Update:`, ctx.update);
  return next();
});

initI18n()
  .then(() => {
    // Команда /start
    bot.start(async (ctx) => {
      const userName =
        ctx.from?.first_name ||
        t(ctx.session?.language || "lt", "messages.colleague_fallback");
      const lang = ctx.session?.language || "lt";

      // Полностью локализованное приветственное сообщение формируется одной строкой из файлов перевода
      const welcomeMessage = t(lang, "welcome", { user: userName });

      const languageButton = UserLanguageManager.getLanguageButton(lang);

      const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback(t(lang, "menu.catalog"), "catalog")],
        [Markup.button.callback(t(lang, "menu.consult"), "consult")],
        [Markup.button.callback(t(lang, "menu.compare"), "compare_start")],
        [
          Markup.button.callback(t(lang, "menu.filters"), "filters"),
          Markup.button.callback(t(lang, "menu.faq"), "faq"),
        ],
        [Markup.button.callback(languageButton, "language_menu")],
      ]);

      await ctx.reply(welcomeMessage, {
        parse_mode: "Markdown",
        ...keyboard,
      });
    });

    // Команда /help
    bot.help(async (ctx) => {
      const lang = ctx.session?.language || "lt";
      await ctx.reply(t(lang, "messages.help"), { parse_mode: "Markdown" });
    });

    // Команда /blocks
    bot.command("blocks", async (ctx) => {
      const lang = ctx.session?.language || "lt";
      const catalogMessage = `🧱 **${t(lang, "catalog.title")}**\n\n${t(lang, "catalog.select_category")}\n\n${Object.entries(
        CATEGORIES
      )
        .map(
          ([_, category]) =>
            `${category.icon} **${category.name}**\n${category.description}`
        )
        .join("\n\n")}\n\n📊 **${t(lang, "catalog.total_products", {
        count: PRODUCTS.length,
      })}**`;

      const catalogKeyboard = Markup.inlineKeyboard([
        [
          Markup.button.callback(
            t(lang, "categories.foundation"),
            "category_foundation"
          ),
          Markup.button.callback(t(lang, "categories.wall"), "category_wall"),
        ],
        [
          Markup.button.callback(
            t(lang, "categories.special"),
            "category_special"
          ),
          Markup.button.callback(t(lang, "categories.all"), "all_products"),
        ],
      ]);

      await ctx.reply(catalogMessage, {
        parse_mode: "Markdown",
        ...catalogKeyboard,
      });
    });

    // Команда /consult
    bot.command("consult", async (ctx) => {
      const lang = ctx.session?.language || "lt";
      await ctx.reply(t(lang, "messages.consult"), { parse_mode: "Markdown" });
    });

    // Команда /language
    bot.command("language", async (ctx) => {
      const lang = ctx.session?.language || "lt";
      const selectLanguageMessage = t(lang, "messages.select_language");

      const languageKeyboard = Markup.inlineKeyboard([
        [
          Markup.button.callback("🇱🇹 Lietuvių", "set_language_lt"),
          Markup.button.callback("🇷🇺 Русский", "set_language_ru"),
          Markup.button.callback("🇬🇧 English", "set_language_en"),
        ],
      ]);

      await ctx.reply(selectLanguageMessage, {
        parse_mode: "Markdown",
        ...languageKeyboard,
      });
    });

    // Обработка callback запросов (inline кнопки)
    bot.on("callback_query", async (ctx) => {
      const callbackData =
        "data" in ctx.callbackQuery ? ctx.callbackQuery.data : "";
      const lang = ctx.session?.language || "lt";

      try {
        await ctx.answerCbQuery(); // Убираем индикатор загрузки

        switch (callbackData) {
          case "catalog":
            const catalogMessage = `🧱 **${t(lang, "catalog.title")}**\n\n${t(lang, "catalog.select_category")}\n\n${Object.entries(
              CATEGORIES
            )
              .map(
                ([_, category]) =>
                  `${category.icon} **${category.name}**\n${category.description}`
              )
              .join("\n\n")}\n\n📊 **${t(lang, "catalog.total_products", {
              count: PRODUCTS.length,
            })}**`;

            const catalogKeyboard = Markup.inlineKeyboard([
              [
                Markup.button.callback(
                  t(lang, "categories.foundation"),
                  "category_foundation"
                ),
                Markup.button.callback(
                  t(lang, "categories.wall"),
                  "category_wall"
                ),
              ],
              [
                Markup.button.callback(
                  t(lang, "categories.special"),
                  "category_special"
                ),
                Markup.button.callback(
                  t(lang, "categories.all"),
                  "all_products"
                ),
              ],
              [Markup.button.callback(t(lang, "back_to_menu"), "back_to_menu")],
            ]);

            await ctx.editMessageText(catalogMessage, {
              parse_mode: "Markdown",
              ...catalogKeyboard,
            });
            break;

          case "language_menu":
            // Показываем меню выбора языка
            const selectLanguageMessage = t(lang, "messages.select_language");

            const languageKeyboard = Markup.inlineKeyboard([
              [
                Markup.button.callback("🇱🇹 Lietuvių", "set_language_lt"),
                Markup.button.callback("🇷🇺 Русский", "set_language_ru"),
                Markup.button.callback("🇬🇧 English", "set_language_en"),
              ],
              [Markup.button.callback(t(lang, "back_to_menu"), "back_to_menu")],
            ]);

            await ctx.editMessageText(selectLanguageMessage, {
              parse_mode: "Markdown",
              ...languageKeyboard,
            });
            break;

          case "set_language_lt":
          case "set_language_ru":
          case "set_language_en":
            // Устанавливаем новый язык
            const newLang = callbackData.replace(
              "set_language_",
              ""
            ) as SupportedLanguage;
            if (ctx.from?.id) {
              UserLanguageManager.setUserLanguage(ctx.from.id, newLang);
            }

            // Обновляем сессию
            if (ctx.session) {
              ctx.session.language = newLang;
            }

            // Показываем сообщение об изменении языка
            await ctx.answerCbQuery(t(newLang, "messages.language_changed"));

            // Возвращаемся в главное меню с обновленным языком
            const userName =
              ctx.from?.first_name || t(newLang, "messages.colleague_fallback");
            const welcomeMessage = t(newLang, "welcome", { user: userName });
            const newLanguageButton =
              UserLanguageManager.getLanguageButton(newLang);

            const mainKeyboard = Markup.inlineKeyboard([
              [Markup.button.callback(t(newLang, "menu.catalog"), "catalog")],
              [Markup.button.callback(t(newLang, "menu.consult"), "consult")],
              [
                Markup.button.callback(
                  t(newLang, "menu.compare"),
                  "compare_start"
                ),
              ],
              [
                Markup.button.callback(t(newLang, "menu.filters"), "filters"),
                Markup.button.callback(t(newLang, "menu.faq"), "faq"),
              ],
              [Markup.button.callback(newLanguageButton, "language_menu")],
            ]);

            await ctx.editMessageText(welcomeMessage, {
              parse_mode: "Markdown",
              ...mainKeyboard,
            });
            break;

          case "consult":
            const consultMessage = t(lang, "messages.consult");

            const consultKeyboard = Markup.inlineKeyboard([
              [Markup.button.callback(t(lang, "back_to_menu"), "back_to_menu")],
            ]);

            await ctx.editMessageText(consultMessage, {
              parse_mode: "Markdown",
              ...consultKeyboard,
            });
            break;

          case "faq":
            const faqMessage = t(lang, "messages.faq");

            const faqKeyboard = Markup.inlineKeyboard([
              [Markup.button.callback(t(lang, "calculations"), "calculations")],
              [Markup.button.callback(t(lang, "back_to_menu"), "back_to_menu")],
            ]);

            await ctx.editMessageText(faqMessage, {
              parse_mode: "Markdown",
              ...faqKeyboard,
            });
            break;

          case "help":
            const helpMessage = t(lang, "messages.help");

            const helpKeyboard = Markup.inlineKeyboard([
              [Markup.button.callback(t(lang, "back_to_menu"), "back_to_menu")],
            ]);

            await ctx.editMessageText(helpMessage, {
              parse_mode: "Markdown",
              ...helpKeyboard,
            });
            break;

          case "calculations":
            const calcMessage = t(lang, "messages.calc_intro");

            const calcKeyboard = Markup.inlineKeyboard([
              [Markup.button.callback(t(lang, "back_to_menu"), "back_to_menu")],
            ]);

            await ctx.editMessageText(calcMessage, {
              parse_mode: "Markdown",
              ...calcKeyboard,
            });
            break;

          case "ask_question":
            await ctx.editMessageText(t(lang, "messages.ask_question_intro"), {
              parse_mode: "Markdown",
              ...Markup.inlineKeyboard([
                [
                  Markup.button.callback(
                    t(lang, "back_to_menu"),
                    "back_to_menu"
                  ),
                ],
              ]),
            });
            break;

          // Обработчики категорий товаров
          case "category_foundation":
          case "category_wall":
          case "category_special":
            const category = callbackData.replace("category_", "");
            const categoryProducts = getProductsByCategory(category);
            const categoryInfo =
              CATEGORIES[category as keyof typeof CATEGORIES];

            let categoryMessage = `${categoryInfo.icon} **${categoryInfo.name}**\n\n${categoryInfo.description}\n\n📦 **${t(
              lang,
              "messages.category.products_count",
              {
                count: categoryProducts.length,
              }
            )}**\n\n`;

            categoryProducts.forEach((product, index) => {
              categoryMessage += `${index + 1}. **${product.name}**\n   📐 ${product.dimensions}\n   ${product.description}\n\n`;
            });

            const categoryProductButtons = categoryProducts.map((product) => [
              Markup.button.callback(
                `🔍 ${product.name}`,
                `product_${product.id}`
              ),
            ]);
            const categoryKeyboard = Markup.inlineKeyboard([
              ...categoryProductButtons,
              [
                Markup.button.callback(
                  t(lang, "back_to_categories"),
                  "catalog"
                ),
                Markup.button.callback(t(lang, "back_to_menu"), "back_to_menu"),
              ],
            ]);

            await ctx.editMessageText(categoryMessage, {
              parse_mode: "Markdown",
              ...categoryKeyboard,
            });
            break;

          case "all_products":
            let allProductsMessage = `📋 **${t(lang, "catalog.all_products_title")}**\n\n${t(
              lang,
              "catalog.total_products",
              {
                count: PRODUCTS.length,
              }
            )}\n\n`;

            Object.entries(CATEGORIES).forEach(([key, categoryInfo]) => {
              const categoryProducts = getProductsByCategory(key);
              allProductsMessage += `${categoryInfo.icon} **${categoryInfo.name}** (${categoryProducts.length})\n`;
              categoryProducts.forEach((product) => {
                allProductsMessage += `  • ${product.name}\n`;
              });
              allProductsMessage += "\n";
            });

            const allProductsKeyboard = Markup.inlineKeyboard([
              [
                Markup.button.callback(
                  t(lang, "categories.foundation"),
                  "category_foundation"
                ),
                Markup.button.callback(
                  t(lang, "categories.wall"),
                  "category_wall"
                ),
              ],
              [
                Markup.button.callback(
                  t(lang, "categories.special"),
                  "category_special"
                ),
              ],
              [Markup.button.callback(t(lang, "back_to_menu"), "back_to_menu")],
            ]);

            await ctx.editMessageText(allProductsMessage, {
              parse_mode: "Markdown",
              ...allProductsKeyboard,
            });
            break;

          case "back_to_menu":
            // Возвращаемся к главному меню
            const backUserName =
              ctx.from?.first_name || t(lang, "messages.colleague_fallback");
            const backWelcomeMessage = t(lang, "welcome", {
              user: backUserName,
            });
            const backLanguageButton =
              UserLanguageManager.getLanguageButton(lang);

            const backToMainKeyboard = Markup.inlineKeyboard([
              [Markup.button.callback(t(lang, "menu.catalog"), "catalog")],
              [Markup.button.callback(t(lang, "menu.consult"), "consult")],
              [
                Markup.button.callback(
                  t(lang, "menu.compare"),
                  "compare_start"
                ),
              ],
              [
                Markup.button.callback(t(lang, "menu.filters"), "filters"),
                Markup.button.callback(t(lang, "menu.faq"), "faq"),
              ],
              [Markup.button.callback(backLanguageButton, "language_menu")],
            ]);

            await ctx.editMessageText(backWelcomeMessage, {
              parse_mode: "Markdown",
              ...backToMainKeyboard,
            });
            break;

          case "filters":
            const filtersMessage = t(lang, "messages.filters_intro");

            const filtersKeyboard = Markup.inlineKeyboard([
              [
                Markup.button.callback(
                  t(lang, "filters_options.foundation"),
                  "filter_foundation"
                ),
                Markup.button.callback(
                  t(lang, "filters_options.wall"),
                  "filter_wall"
                ),
              ],
              [
                Markup.button.callback(
                  t(lang, "filters_options.special"),
                  "filter_special"
                ),
                Markup.button.callback(
                  t(lang, "filters_options.concrete"),
                  "filter_concrete"
                ),
              ],
              [
                Markup.button.callback(
                  t(lang, "filters_options.weight"),
                  "filter_weight"
                ),
                Markup.button.callback(
                  t(lang, "filters_options.all"),
                  "catalog"
                ),
              ],
              [Markup.button.callback(t(lang, "back_to_menu"), "back_to_menu")],
            ]);

            await ctx.editMessageText(filtersMessage, {
              parse_mode: "Markdown",
              ...filtersKeyboard,
            });
            break;

          case "compare_start":
            const compareMessage = t(lang, "messages.compare_intro");

            const compareKeyboard = Markup.inlineKeyboard([
              [
                Markup.button.callback(
                  t(lang, "compare_options.p6_20_vs_p25"),
                  "compare_p6-20_p25"
                ),
                Markup.button.callback(
                  t(lang, "compare_options.p6_20_vs_p6_30"),
                  "compare_p6-20_p6-30"
                ),
              ],
              [
                Markup.button.callback(
                  t(lang, "compare_options.s6_vs_sm6"),
                  "compare_s6_sm6"
                ),
                Markup.button.callback(
                  t(lang, "compare_options.s25_vs_sp"),
                  "compare_s25_sp"
                ),
              ],
              [
                Markup.button.callback(
                  t(lang, "compare_options.kl28_vs_vb2"),
                  "compare_kl28_vb2"
                ),
              ],
              [Markup.button.callback(t(lang, "back_to_menu"), "back_to_menu")],
            ]);

            await ctx.editMessageText(compareMessage, {
              parse_mode: "Markdown",
              ...compareKeyboard,
            });
            break;

          default:
            // Обработка фильтров
            if (callbackData.startsWith("filter_")) {
              const filterType = callbackData.replace("filter_", "");
              let filteredProducts: any[] = [];
              let filterTitle = "";

              switch (filterType) {
                case "foundation":
                  filteredProducts = filterProducts({ category: "foundation" });
                  filterTitle = t(lang, "messages.filter_title.foundation");
                  break;
                case "wall":
                  filteredProducts = filterProducts({ category: "wall" });
                  filterTitle = t(lang, "messages.filter_title.wall");
                  break;
                case "special":
                  filteredProducts = filterProducts({ category: "special" });
                  filterTitle = t(lang, "messages.filter_title.special");
                  break;
                case "concrete":
                  filteredProducts = filterProducts({ hasConcreteUsage: true });
                  filterTitle = t(lang, "messages.filter_title.concrete");
                  break;
                case "weight":
                  filteredProducts = filterProducts({ hasWeight: true });
                  filterTitle = t(lang, "messages.filter_title.weight");
                  break;
              }

              let filterMessage = t(lang, "messages.filter_results", {
                title: filterTitle,
                count: filteredProducts.length,
              });

              filteredProducts.forEach((product, index) => {
                filterMessage += `${index + 1}. **${product.name}**\n`;
                filterMessage += `   📐 ${product.dimensions}\n`;
                if (product.concreteUsage)
                  filterMessage += `   💧 ${product.concreteUsage}\n`;
                if (product.weight)
                  filterMessage += `   ⚖️ ${product.weight}\n`;
                filterMessage += `\n`;
              });

              const filterResultKeyboard = Markup.inlineKeyboard([
                ...filteredProducts
                  .slice(0, 5)
                  .map((product: any) => [
                    Markup.button.callback(
                      `🔍 ${product.name}`,
                      `product_${product.id}`
                    ),
                  ]),
                [
                  Markup.button.callback(
                    t(lang, "back_to_categories"),
                    "catalog"
                  ),
                  Markup.button.callback(
                    t(lang, "back_to_menu"),
                    "back_to_menu"
                  ),
                ],
              ]);

              await ctx.editMessageText(filterMessage, {
                parse_mode: "Markdown",
                ...filterResultKeyboard,
              });
            }
            // Обработка сравнения
            else if (callbackData.startsWith("compare_")) {
              const compareIds = callbackData
                .replace("compare_", "")
                .split("_");
              const products = compareIds
                .map((id) => getProductById(id))
                .filter(Boolean) as any[];

              if (products.length >= 2) {
                const comparisonText = compareProducts(products);

                const comparisonKeyboard = Markup.inlineKeyboard([
                  ...products.map((product: any) => [
                    Markup.button.callback(
                      `🔍 ${product.name}`,
                      `product_${product.id}`
                    ),
                  ]),
                  [
                    Markup.button.callback(
                      t(lang, "back_to_menu"),
                      "back_to_menu"
                    ),
                  ],
                ]);

                await ctx.editMessageText(comparisonText, {
                  parse_mode: "Markdown",
                  ...comparisonKeyboard,
                });
              } else {
                await ctx.answerCbQuery(t(lang, "messages.compare_not_found"));
              }
            }
            // Обработка скачивания PDF
            else if (callbackData.startsWith("pdf_")) {
              const productId = callbackData.replace("pdf_", "");
              const product = getProductById(productId);

              if (product && product.pdfLink) {
                // Отправляем прямую ссылку на PDF из GitHub
                const pdfMessage = t(lang, "pdf_intro", {
                  name: product.name,
                  link: product.pdfLink,
                });

                await ctx.reply(pdfMessage, {
                  parse_mode: "Markdown",
                  ...Markup.inlineKeyboard([
                    [
                      Markup.button.url(
                        t(lang, "pdf.download"),
                        product.pdfLink
                      ),
                    ],
                    [Markup.button.callback(t(lang, "consult"), "consult")],
                    [
                      Markup.button.callback(
                        t(lang, "back_to_menu"),
                        "back_to_menu"
                      ),
                    ],
                  ]),
                });

                await ctx.answerCbQuery(t(lang, "messages.pdf_sent"));
              } else {
                await ctx.answerCbQuery(t(lang, "messages.pdf_unavailable"));
              }
            }
            // Обработка детального просмотра товаров
            else if (callbackData.startsWith("product_")) {
              const productId = callbackData.replace("product_", "");
              const product = getProductById(productId);

              if (product) {
                const productCard = formatProductCard(product);

                // Создаем кнопки для карточки товара
                const buttons = [
                  [
                    Markup.button.callback(t(lang, "consult"), "consult"),
                    Markup.button.callback(
                      t(lang, "calculations"),
                      "calculations"
                    ),
                  ],
                ];

                // Добавляем кнопку PDF, если есть ссылка
                if (product.pdfLink) {
                  buttons.push([
                    Markup.button.callback(
                      t(lang, "pdf.download"),
                      `pdf_${product.id}`
                    ),
                  ]);
                }

                buttons.push([
                  Markup.button.callback(
                    t(lang, "back_to_categories"),
                    `category_${product.category}`
                  ),
                  Markup.button.callback(
                    t(lang, "back_to_menu"),
                    "back_to_menu"
                  ),
                ]);

                const productKeyboard = Markup.inlineKeyboard(buttons);

                await ctx.editMessageText(productCard, {
                  parse_mode: "Markdown",
                  ...productKeyboard,
                });
              } else {
                await ctx.answerCbQuery(t(lang, "messages.item_not_found"));
              }
            } else {
              await ctx.answerCbQuery(t(lang, "messages.unknown_command"));
            }
        }
      } catch (error) {
        console.error("[Callback] Error:", error);
        await ctx.answerCbQuery(t(lang, "messages.generic_error"));
      }
    });

    // Обработка текстовых сообщений через OpenAI Assistant
    bot.on("text", async (ctx) => {
      // Пропускаем команды
      if (ctx.message.text.startsWith("/")) {
        return;
      }

      let progressMessage: any = null;
      const lang = ctx.session?.language || "lt";

      // Объявляем detectedLanguage здесь, чтобы он был доступен в catch блоке
      let detectedLanguage: SupportedLanguage = lang;

      try {
        // Показываем индикатор печати
        await ctx.sendChatAction("typing");

        const userMessage = ctx.message.text;
        const userName =
          ctx.from.first_name || t(lang, "messages.colleague_fallback");

        // 🔄 Автоматически определяем язык по содержимому сообщения
        detectedLanguage = detectLanguageFromText(userMessage);

        // Если обнаруженный язык отличается от языка сессии, обновляем сессию
        if (detectedLanguage !== lang && ctx.from?.id) {
          UserLanguageManager.setUserLanguage(ctx.from.id, detectedLanguage);
          if (ctx.session) {
            ctx.session.language = detectedLanguage;
          }
          console.log(
            `🔄 [Language] Auto-detected and switched to: ${detectedLanguage}`
          );
        }

        const userLanguage = detectedLanguage;

        console.log(
          `[Assistant] Processing message from ${userName}: ${userMessage} (Language: ${userLanguage})`
        );

        // 🔍 Добавляем детальные логи для диагностики
        console.log("🔍 [Debug] Assistant ID:", ASSISTANT_ID);
        console.log("🔍 [Debug] User message:", userMessage);
        console.log("🔍 [Debug] User language:", userLanguage);
        console.log("🔍 [Debug] User name:", userName);

        // Отправляем сообщение о прогрессе
        progressMessage = await ctx.reply(t(lang, "messages.processing"), {
          reply_parameters: { message_id: ctx.message.message_id },
        });

        // Получаем экземпляр сервиса памяти
        const zepMemory = await ZepMemoryService.getInstance();

        // 🔧 ИСПРАВЛЯЕМ: Правильный вызов функции с объектом параметров
        console.log(
          "🔍 [Debug] Calling getAiFeedbackFromSupabase with correct parameters..."
        );
        const { ai_response: aiResponse } = await getAiFeedbackFromSupabase({
          assistant_id: ASSISTANT_ID!,
          report: userMessage,
          language_code: userLanguage,
          full_name: userName,
        });

        console.log(
          "🔍 [Debug] AI Response received:",
          aiResponse ? "✅" : "❌"
        );

        // Сохраняем сообщение пользователя и ответ в памяти
        await zepMemory.addMessage(ctx.from.id, {
          role: "user",
          content: userMessage,
          metadata: {
            language: userLanguage,
            userName: userName,
          },
        });

        await zepMemory.addMessage(ctx.from.id, {
          role: "assistant",
          content: aiResponse,
          metadata: {
            language: userLanguage,
            // 🔧 ИСПРАВЛЯЕМ: убираем threadId, так как функция его не возвращает
            timestamp: new Date().toISOString(),
          },
        });

        // Удаляем сообщение о прогрессе
        if (progressMessage) {
          try {
            await ctx.deleteMessage(progressMessage.message_id);
          } catch (e) {
            // Игнорируем ошибки удаления
          }
        }

        if (aiResponse && aiResponse.trim()) {
          // Отправляем ответ пользователю
          await ctx.reply(aiResponse, {
            parse_mode: "Markdown",
          });

          // Добавляем кнопки для дополнительных действий
          const currentLanguageButton =
            UserLanguageManager.getLanguageButton(detectedLanguage);
          const followUpKeyboard = Markup.inlineKeyboard([
            [
              Markup.button.callback(
                t(detectedLanguage, "ask_question"),
                "ask_question"
              ),
            ],
            [
              Markup.button.callback(
                t(detectedLanguage, "categories.catalog"),
                "catalog"
              ),
              Markup.button.callback(
                t(detectedLanguage, "back_to_menu"),
                "back_to_menu"
              ),
            ],
            [Markup.button.callback(currentLanguageButton, "language_menu")],
          ]);

          await ctx.reply(t(detectedLanguage, "messages.follow_up_prompt"), {
            ...followUpKeyboard,
          });
        } else {
          await ctx.reply(t(detectedLanguage, "messages.unable_process"), {
            ...Markup.inlineKeyboard([
              [Markup.button.callback(t(detectedLanguage, "help"), "help")],
              [
                Markup.button.callback(
                  t(detectedLanguage, "back_to_menu"),
                  "back_to_menu"
                ),
              ],
            ]),
          });
        }
      } catch (error) {
        console.error("[Assistant] Error processing message:", error);

        // Удаляем сообщение о прогрессе при ошибке
        if (progressMessage) {
          try {
            await ctx.deleteMessage(progressMessage.message_id);
          } catch (e) {
            // Игнорируем ошибки удаления
          }
        }

        // Используем обнаруженный язык или падаем обратно на язык сессии
        const errorLanguage = detectedLanguage || lang;
        const errorMessage = t(errorLanguage, "messages.error_generic");

        await ctx.reply(errorMessage, {
          parse_mode: "Markdown",
          ...Markup.inlineKeyboard([
            [Markup.button.callback(t(errorLanguage, "help"), "help")],
            [
              Markup.button.callback(
                t(errorLanguage, "back_to_menu"),
                "back_to_menu"
              ),
            ],
          ]),
        });
      }
    });

    // Обработка ошибок
    bot.catch((err, ctx) => {
      console.error("[Bot] Error occurred:", err);
    });

    // Graceful shutdown
    process.on("SIGINT", () => {
      console.log("🛑 Shutting down bot and server...");
      bot.stop("SIGINT");
      server.close(() => {
        console.log("🌐 HTTP server closed");
        process.exit(0);
      });
    });

    process.on("SIGTERM", () => {
      console.log("🛑 Shutting down bot and server...");
      bot.stop("SIGTERM");
      server.close(() => {
        console.log("🌐 HTTP server closed");
        process.exit(0);
      });
    });

    // Создание HTTP сервера для healthcheck (требуется Railway)
    const app = express();
    const PORT = process.env.PORT || 3000;

    // Статический сервер для PDF файлов
    // В production (dist) файлы будут в dist/blocks-pdf, в dev - в ../blocks-pdf
    const isProduction = process.env.NODE_ENV === "production";
    const pdfPath = isProduction
      ? path.join(__dirname, "blocks-pdf")
      : path.join(__dirname, "../blocks-pdf");

    console.log(`🔍 [PDF] NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`🔍 [PDF] isProduction: ${isProduction}`);
    console.log(`🔍 [PDF] __dirname: ${__dirname}`);
    console.log(`🔍 [PDF] pdfPath: ${pdfPath}`);
    console.log(
      `🔍 [PDF] Directory exists: ${require("fs").existsSync(pdfPath)}`
    );

    app.use("/blocks-pdf", express.static(pdfPath));

    // Health check endpoint для Railway
    app.get("/health", (req, res) => {
      res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        bot: "AI Architect Bot",
        assistant_id: ASSISTANT_ID,
      });
    });

    // Корневой endpoint
    app.get("/", (req, res) => {
      res.status(200).json({
        message: "AI Architect Bot is running",
        timestamp: new Date().toISOString(),
      });
    });

    // Запуск HTTP сервера
    const server = app.listen(PORT, () => {
      console.log(`🌐 HTTP server running on port ${PORT}`);
    });

    // Запуск бота с проверкой Assistant
    console.log("🚀 Starting AI Architect Bot...");

    // Проверяем доступность Assistant перед запуском
    checkAssistantAvailability()
      .then((isAvailable) => {
        if (!isAvailable) {
          console.warn(
            "⚠️  Warning: Assistant not available, but starting bot anyway"
          );
        }

        return bot.launch();
      })
      .then(async () => {
        console.log("✅ Bot is running!");
        console.log(`📱 Assistant ID: ${ASSISTANT_ID}`);
        console.log(
          "💬 Ready to assist with construction blocks and architecture!"
        );

        // Инициализируем команды бота на всех языках
        const languages: SupportedLanguage[] = ["lt", "ru", "en"];

        // Устанавливаем команды для каждого языка
        for (const lang of languages) {
          await setupBotCommands(bot, lang);
        }

        // Устанавливаем команды по умолчанию (без языкового параметра) на английском
        await bot.telegram.setMyCommands(getBotCommands("en"));
      })
      .catch((error) => {
        console.error("❌ Failed to start bot:", error);
        process.exit(1);
      });
  })
  .catch((error) => {
    console.error("Failed to initialize i18n:", error);
    process.exit(1);
  });

export default bot;
