import "dotenv/config";
import { Telegraf, Markup } from "telegraf";
import express from "express";
import path from "path";
import { openai } from "./services/openai";
import { initI18n, determineLanguage, t } from "./services/i18n";
import { getAiFeedbackFromSupabase } from "./services/getAiFeedbackFromOpenAI";
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
const bot = new Telegraf(BOT_TOKEN);

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
  const userLanguageCode = ctx.from?.language_code;
  if (!ctx.session) {
    ctx.session = { language: "lt" };
  }
  ctx.session.language = determineLanguage(userLanguageCode);
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

      const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback(t(lang, "menu.catalog"), "catalog")],
        [Markup.button.callback(t(lang, "menu.consult"), "consult")],
        [Markup.button.callback(t(lang, "menu.compare"), "compare_start")],
        [
          Markup.button.callback(t(lang, "menu.filters"), "filters"),
          Markup.button.callback(t(lang, "menu.faq"), "faq"),
        ],
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
      await ctx.reply(t(lang, "messages.blocks_demo"), {
        parse_mode: "Markdown",
      });
    });

    // Команда /consult
    bot.command("consult", async (ctx) => {
      const lang = ctx.session?.language || "lt";
      await ctx.reply(t(lang, "messages.consult"), { parse_mode: "Markdown" });
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
            const userName =
              ctx.from?.first_name || t(lang, "messages.colleague_fallback");
            const backMessage = t(lang, "messages.welcome", { user: userName });

            const mainKeyboard = Markup.inlineKeyboard([
              [Markup.button.callback(t(lang, "menu.catalog"), "catalog")],
              [Markup.button.callback(t(lang, "menu.consult"), "consult")],
              [Markup.button.callback(t(lang, "menu.faq"), "faq")],
              [Markup.button.callback(t(lang, "menu.help"), "help")],
            ]);

            await ctx.editMessageText(backMessage, {
              parse_mode: "Markdown",
              ...mainKeyboard,
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
                const pdfMessage = t(lang, "messages.pdf_intro", {
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

      try {
        // Показываем индикатор печати
        await ctx.sendChatAction("typing");

        const userMessage = ctx.message.text;
        const userName =
          ctx.from.first_name || t(lang, "messages.colleague_fallback");
        const userLanguage = ctx.from.language_code || "ru";

        console.log(
          `[Assistant] Processing message from ${userName}: ${userMessage}`
        );

        // Отправляем сообщение о прогрессе
        progressMessage = await ctx.reply(t(lang, "messages.processing"), {
          reply_parameters: { message_id: ctx.message.message_id },
        });

        // Получаем ответ от OpenAI Assistant
        const { ai_response } = await getAiFeedbackFromSupabase({
          assistant_id: ASSISTANT_ID!,
          report: userMessage,
          language_code: userLanguage,
          full_name: userName,
        });

        // Удаляем сообщение о прогрессе
        if (progressMessage) {
          try {
            await ctx.deleteMessage(progressMessage.message_id);
          } catch (e) {
            // Игнорируем ошибки удаления
          }
        }

        if (ai_response && ai_response.trim()) {
          // Отправляем ответ пользователю
          await ctx.reply(ai_response, {
            parse_mode: "Markdown",
          });

          // Добавляем кнопки для дополнительных действий
          const followUpKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback(t(lang, "ask_question"), "ask_question")],
            [
              Markup.button.callback(t(lang, "categories.catalog"), "catalog"),
              Markup.button.callback(t(lang, "back_to_menu"), "back_to_menu"),
            ],
          ]);

          await ctx.reply(t(lang, "messages.follow_up_prompt"), {
            ...followUpKeyboard,
          });
        } else {
          await ctx.reply(t(lang, "messages.unable_process"), {
            ...Markup.inlineKeyboard([
              [Markup.button.callback(t(lang, "help"), "help")],
              [Markup.button.callback(t(lang, "back_to_menu"), "back_to_menu")],
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

        const errorMessage = t(lang, "messages.error_generic");

        await ctx.reply(errorMessage, {
          parse_mode: "Markdown",
          ...Markup.inlineKeyboard([
            [Markup.button.callback(t(lang, "help"), "help")],
            [Markup.button.callback(t(lang, "back_to_menu"), "back_to_menu")],
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

    // Функция настройки команд бота
    async function setupBotCommands() {
      try {
        await bot.telegram.setMyCommands([
          { command: "start", description: "🏗️ Главное меню и приветствие" },
          { command: "help", description: "📚 Справка по использованию бота" },
          {
            command: "blocks",
            description: "🧱 Каталог строительных блоков HAUS",
          },
          {
            command: "consult",
            description: "👨‍💼 Экспертная консультация архитектора",
          },
        ]);
        console.log("✅ Bot commands configured successfully");
      } catch (error) {
        console.error("❌ Error setting bot commands:", error);
      }
    }

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

        // Настраиваем команды бота
        await setupBotCommands();
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
