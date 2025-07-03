import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';
import express from 'express';
import path from 'path';
import { openai } from './services/openai';
import { initI18n, determineLanguage, t } from './services/i18n';
import { getAiFeedbackFromSupabase } from './services/getAiFeedbackFromOpenAI';
import { PRODUCTS, CATEGORIES, getProductsByCategory, getProductById, formatProductCard, compareProducts, filterProducts } from './services/catalog';

// Проверка обязательных переменных окружения
const BOT_TOKEN = process.env.BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is required');
}

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required');
}

if (!ASSISTANT_ID) {
  throw new Error('OPENAI_ASSISTANT_ID is required');
}

// Создание экземпляра бота
const bot = new Telegraf(BOT_TOKEN);

// Функция проверки Assistant доступности
async function checkAssistantAvailability(): Promise<boolean> {
  try {
    const assistant = await openai.beta.assistants.retrieve(ASSISTANT_ID!);
    console.log(`✅ Assistant available: ${assistant.name || 'Unnamed'}`);
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
    ctx.session = { language: 'lt' };
  }
  ctx.session.language = determineLanguage(userLanguageCode);
  return next();
});

// Middleware для логирования
bot.use((ctx, next) => {
  console.log(`[${new Date().toISOString()}] Update:`, ctx.update);
  return next();
});

initI18n().then(() => {

// Команда /start
bot.start(async (ctx) => {
  const userName = ctx.from?.first_name || 'User';
  const lang = ctx.session?.language || 'lt';
  const welcomeMessage = `🏗️ ${t(lang, 'welcome', { name: userName })}\n\n${t(lang, 'intro')}\n\n🧠 **${t(lang, 'capabilities.advise_props')}\n• ${t(lang, 'capabilities.material_calc')}\n• ${t(lang, 'capabilities.standards_info')}\n• ${t(lang, 'capabilities.suggest_solutions')}**\n\n${t(lang, 'choose_action')}`;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'menu.catalog'), 'catalog')],
    [Markup.button.callback(t(lang, 'menu.consult'), 'consult')],
    [Markup.button.callback(t(lang, 'menu.compare'), 'compare_start')],
    [Markup.button.callback(t(lang, 'menu.filters'), 'filters'), Markup.button.callback(t(lang, 'menu.faq'), 'faq')]
  ]);

  await ctx.reply(welcomeMessage, {
    parse_mode: 'Markdown',
    ...keyboard
  });
});

// Команда /help
bot.help(async (ctx) => {
  const helpMessage = `
📚 **Справка по ИИ-Архитект**

🤖 **О боте:**
Я специализированный ИИ-консультант для архитекторов и проектировщиков.

💬 **Как пользоваться:**
Просто задайте вопрос о:
• Технических характеристиках блоков
• Выборе материалов
• Строительных нормах
• Узлах примыканий
• Расчете объемов

📋 **Команды:**
/start - главное меню
/blocks - каталог блоков
/consult - консультация эксперта

🏗️ **Примеры вопросов:**
• "Какие блоки подходят для фундамента?"
• "Сколько бетона нужно для блока P6-20?"
• "Как армировать блок P6-20?"
  `;

  await ctx.reply(helpMessage, { parse_mode: 'Markdown' });
});

// Команда /blocks
bot.command('blocks', async (ctx) => {
  const blocksMessage = `
🧱 **Каталог строительных блоков**

**HAUS P6-20** - Блоки-опалубка из бетона
📐 Размеры: 498×198×250 мм
🏗️ Применение:
• Ленточные фундаменты
• Ростверки
• Подпорные стены
• Перемычки

💧 Расход бетона: 0.015 м³ на блок

📄 Доступна техническая документация
📞 Консультации: +37064608801

Для подробной информации просто спросите меня!
  `;

  await ctx.reply(blocksMessage, { parse_mode: 'Markdown' });
});

// Команда /consult
bot.command('consult', async (ctx) => {
  const consultMessage = `
👨‍💼 **Экспертная консультация**

Задайте любой вопрос о строительных блоках, и я предоставлю подробную консультацию с учетом:

✅ Технических характеристик
✅ Строительных норм
✅ Опыта применения
✅ Рекомендаций экспертов

💡 **Пример:** "Нужно выбрать блоки для ленточного фундамента дома 10×12 м. Какие блоки посоветуете и сколько понадобится бетона?"
  `;

  await ctx.reply(consultMessage, { parse_mode: 'Markdown' });
});

// Обработка callback запросов (inline кнопки)
bot.on('callback_query', async (ctx) => {
  const callbackData = 'data' in ctx.callbackQuery ? ctx.callbackQuery.data : '';
  
  try {
    await ctx.answerCbQuery(); // Убираем индикатор загрузки
    
    switch (callbackData) {
      case 'catalog':
        const catalogMessage = `🧱 **Каталог строительных блоков**

Выберите категорию товаров для просмотра:

${Object.entries(CATEGORIES).map(([key, category]) => 
          `${category.icon} **${category.name}**\n${category.description}`
        ).join('\n\n')}

📊 **Всего товаров в каталоге:** ${PRODUCTS.length}`;
        
        const catalogKeyboard = Markup.inlineKeyboard([
          [Markup.button.callback('🏗️ Фундаментные', 'category_foundation'), Markup.button.callback('🧱 Стеновые', 'category_wall')],
          [Markup.button.callback('⚙️ Специальные', 'category_special'), Markup.button.callback('📋 Все товары', 'all_products')],
          [Markup.button.callback('⬅️ Назад в меню', 'back_to_menu')]
        ]);
        
        await ctx.editMessageText(catalogMessage, {
          parse_mode: 'Markdown',
          ...catalogKeyboard
        });
        break;
        
      case 'consult':
        const consultMessage = `👨‍💼 **Экспертная консультация**

Просто напишите ваш вопрос, и я предоставлю подробную консультацию с учетом:

✅ **Технических характеристик**
✅ **Строительных норм и стандартов**
✅ **Опыта практического применения**
✅ **Рекомендаций по оптимизации**

💡 **Пример вопроса:**
“Нужно выбрать блоки для ленточного фундамента дома 10×12 м. Какие блоки посоветуете и сколько понадобится бетона?”`;
        
        const consultKeyboard = Markup.inlineKeyboard([
          [Markup.button.callback('⬅️ Назад в меню', 'back_to_menu')]
        ]);
        
        await ctx.editMessageText(consultMessage, {
          parse_mode: 'Markdown',
          ...consultKeyboard
        });
        break;
        
      case 'faq':
        const faqMessage = `❓ **Частые вопросы**

🔹 **Какое основное применение блоков HAUS P6-20?**
→ Они используются как несъемная опалубка для монолитных железобетонных конструкций

🔹 **Нужно ли заполнять блоки бетоном?**
→ Обязательно! Блоки не могут использоваться без заполнения бетоном

🔹 **Можно ли армировать конструкцию?**
→ Да, при необходимости можно устанавливать арматуру

🔹 **Как рассчитать количество блоков?**
→ Напишите размеры фундамента, и я помогу с расчетом!`;
        
        const faqKeyboard = Markup.inlineKeyboard([
          [Markup.button.callback('📋 Подробные расчеты', 'calculations')],
          [Markup.button.callback('⬅️ Назад в меню', 'back_to_menu')]
        ]);
        
        await ctx.editMessageText(faqMessage, {
          parse_mode: 'Markdown',
          ...faqKeyboard
        });
        break;
        
      case 'help':
        const helpMessage = `📚 **Справка по ИИ-Архитект**

🤖 **О боте:**
Я специализированный ИИ-консультант для архитекторов и проектировщиков.

💬 **Как пользоваться:**
• Нажмите кнопки меню или используйте команды
• Просто напишите вопрос о строительных блоках
• Указывайте конкретные размеры для расчетов

🔨 **Команды:**
/start - главное меню
/blocks - каталог блоков
/consult - консультация

💡 **Примеры вопросов:**
• “Какие блоки подходят для фундамента?”
• “Сколько бетона нужно для блока P6-20?”
• “Как армировать блок P6-20?”`;
        
        const helpKeyboard = Markup.inlineKeyboard([
          [Markup.button.callback('⬅️ Назад в меню', 'back_to_menu')]
        ]);
        
        await ctx.editMessageText(helpMessage, {
          parse_mode: 'Markdown',
          ...helpKeyboard
        });
        break;
        
      case 'calculations':
        const calcMessage = `📋 **Подробные расчеты**

📦 **Основные параметры HAUS P6-20:**

📐 **Размеры:**
• P6-20 (M): 498×198×250 мм
• P6-20 (K): 508×198×250 мм

💧 **Расход бетона:**
• На 1 блок: 0.015 м³
• На 1 мп высотой 25 см: 0.03 м³
• На 1 м³ стены: 0.6 м³

📦 **Паллета (50 шт):**
• 40 шт P6-20 (M)
• 10 шт P6-20 (K)

💡 **Для точного расчета напишите:**
“Рассчитай количество блоков для [укажите размеры]”`;
        
        const calcKeyboard = Markup.inlineKeyboard([
          [Markup.button.callback('⬅️ Назад', 'back_to_menu')]
        ]);
        
        await ctx.editMessageText(calcMessage, {
          parse_mode: 'Markdown',
          ...calcKeyboard
        });
        break;
        
      case 'ask_question':
        await ctx.editMessageText('📡 **Задать вопрос**\n\nПросто напишите ваш вопрос о строительных блоках, и я отвечу максимально подробно!', {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [Markup.button.callback('⬅️ Назад в меню', 'back_to_menu')]
          ])
        });
        break;
        
      // Обработчики категорий товаров
      case 'category_foundation':
      case 'category_wall':
      case 'category_special':
        const category = callbackData.replace('category_', '');
        const categoryProducts = getProductsByCategory(category);
        const categoryInfo = CATEGORIES[category as keyof typeof CATEGORIES];
        
        let categoryMessage = `${categoryInfo.icon} **${categoryInfo.name}**\n\n${categoryInfo.description}\n\n📦 **Товары в категории (${categoryProducts.length}):**\n\n`;
        
        categoryProducts.forEach((product, index) => {
          categoryMessage += `${index + 1}. **${product.name}**\n   📐 ${product.dimensions}\n   ${product.description}\n\n`;
        });
        
        const categoryKeyboard = Markup.inlineKeyboard([
          ...categoryProducts.map(product => 
            [Markup.button.callback(`🔍 ${product.name}`, `product_${product.id}`)]
          ),
          [Markup.button.callback('⬅️ К категориям', 'catalog'), Markup.button.callback('🏗️ Меню', 'back_to_menu')]
        ]);
        
        await ctx.editMessageText(categoryMessage, {
          parse_mode: 'Markdown',
          ...categoryKeyboard
        });
        break;
        
      case 'all_products':
        let allProductsMessage = `📋 **Весь каталог товаров**\n\nВсего товаров: ${PRODUCTS.length}\n\n`;
        
        Object.entries(CATEGORIES).forEach(([key, categoryInfo]) => {
          const categoryProducts = getProductsByCategory(key);
          allProductsMessage += `${categoryInfo.icon} **${categoryInfo.name}** (${categoryProducts.length})\n`;
          categoryProducts.forEach(product => {
            allProductsMessage += `  • ${product.name}\n`;
          });
          allProductsMessage += '\n';
        });
        
        const allProductsKeyboard = Markup.inlineKeyboard([
          [Markup.button.callback('🏗️ Фундаментные', 'category_foundation'), Markup.button.callback('🧱 Стеновые', 'category_wall')],
          [Markup.button.callback('⚙️ Специальные', 'category_special')],
          [Markup.button.callback('⬅️ Назад', 'catalog')]
        ]);
        
        await ctx.editMessageText(allProductsMessage, {
          parse_mode: 'Markdown',
          ...allProductsKeyboard
        });
        break;
        
      case 'back_to_menu':
        // Возвращаемся к главному меню
        const userName = ctx.from?.first_name || 'Коллега';
        const backMessage = `🏗️ **Добро пожаловать, ${userName}!**\n\nЯ **ИИ-Архитект** — ваш персональный консультант по строительным блокам и архитектурным решениям.\n\n🤖 **Что я умею:**\n• 📐 Консультировать по техническим характеристикам\n• 🧮 Помогать с расчетами материалов\n• 📚 Отвечать на вопросы по строительным нормам\n• 💡 Предлагать оптимальные решения\n\n👇 **Выберите действие:**`;
        
        const mainKeyboard = Markup.inlineKeyboard([
          [Markup.button.callback('🧱 Каталог блоков', 'catalog')],
          [Markup.button.callback('👨‍💼 Консультация эксперта', 'consult')],
          [Markup.button.callback('❓ Частые вопросы', 'faq')],
          [Markup.button.callback('📚 Справка', 'help')]
        ]);
        
        await ctx.editMessageText(backMessage, {
          parse_mode: 'Markdown',
          ...mainKeyboard
        });
        break;
        
      case 'filters':
        const filtersMessage = `🔍 **Фильтры каталога**\n\nВыберите критерий для фильтрации товаров:\n\n🏷️ **По категориям:**\n• 🏗️ Фундаментные блоки\n• 🧱 Стеновые блоки\n• ⚙️ Специальные блоки\n\n🔧 **По применению:**\n• Фундаменты\n• Стены\n• Колонны\n• Вентиляция`;
        
        const filtersKeyboard = Markup.inlineKeyboard([
          [Markup.button.callback('🏗️ Фундаментные', 'filter_foundation'), Markup.button.callback('🧱 Стеновые', 'filter_wall')],
          [Markup.button.callback('⚙️ Специальные', 'filter_special'), Markup.button.callback('💧 С бетоном', 'filter_concrete')],
          [Markup.button.callback('⚖️ С весом', 'filter_weight'), Markup.button.callback('📝 Все товары', 'catalog')],
          [Markup.button.callback('⬅️ Назад', 'back_to_menu')]
        ]);
        
        await ctx.editMessageText(filtersMessage, {
          parse_mode: 'Markdown',
          ...filtersKeyboard
        });
        break;
        
      case 'compare_start':
        const compareMessage = `⚖️ **Сравнение товаров**\n\nВыберите категорию для сравнения:\n\n💡 **Популярные сравнения:**\n• P6-20 vs P25 (фундаментные)\n• S6 vs SM6 (стеновые)\n• S25 vs SP (толщина стен)\n\n🤖 **Либо напишите мне:**\n"Сравни P6-20 и P25" или любую другую пару`;
        
        const compareKeyboard = Markup.inlineKeyboard([
          [Markup.button.callback('🏗️ P6-20 vs P25', 'compare_p6-20_p25'), Markup.button.callback('🏗️ P6-20 vs P6-30', 'compare_p6-20_p6-30')],
          [Markup.button.callback('🧱 S6 vs SM6', 'compare_s6_sm6'), Markup.button.callback('🧱 S25 vs SP', 'compare_s25_sp')],
          [Markup.button.callback('⚙️ Колонны vs Вентиляция', 'compare_kl28_vb2')],
          [Markup.button.callback('⬅️ Назад', 'back_to_menu')]
        ]);
        
        await ctx.editMessageText(compareMessage, {
          parse_mode: 'Markdown',
          ...compareKeyboard
        });
        break;
        
      default:
        // Обработка фильтров
        if (callbackData.startsWith('filter_')) {
          const filterType = callbackData.replace('filter_', '');
          let filteredProducts: any[] = [];
          let filterTitle = '';
          
          switch (filterType) {
            case 'foundation':
              filteredProducts = filterProducts({ category: 'foundation' });
              filterTitle = '🏗️ Фундаментные блоки';
              break;
            case 'wall':
              filteredProducts = filterProducts({ category: 'wall' });
              filterTitle = '🧱 Стеновые блоки';
              break;
            case 'special':
              filteredProducts = filterProducts({ category: 'special' });
              filterTitle = '⚙️ Специальные блоки';
              break;
            case 'concrete':
              filteredProducts = filterProducts({ hasConcreteUsage: true });
              filterTitle = '💧 Блоки с расходом бетона';
              break;
            case 'weight':
              filteredProducts = filterProducts({ hasWeight: true });
              filterTitle = '⚖️ Блоки с указанным весом';
              break;
          }
          
          let filterMessage = `🔍 **${filterTitle}**\n\nНайдено товаров: ${filteredProducts.length}\n\n`;
          
          filteredProducts.forEach((product, index) => {
            filterMessage += `${index + 1}. **${product.name}**\n`;
            filterMessage += `   📐 ${product.dimensions}\n`;
            if (product.concreteUsage) filterMessage += `   💧 ${product.concreteUsage}\n`;
            if (product.weight) filterMessage += `   ⚖️ ${product.weight}\n`;
            filterMessage += `\n`;
          });
          
          const filterResultKeyboard = Markup.inlineKeyboard([
            ...filteredProducts.slice(0, 5).map((product: any) => 
              [Markup.button.callback(`🔍 ${product.name}`, `product_${product.id}`)]
            ),
            [Markup.button.callback('⬅️ К фильтрам', 'filters'), Markup.button.callback('🏗️ Меню', 'back_to_menu')]
          ]);
          
          await ctx.editMessageText(filterMessage, {
            parse_mode: 'Markdown',
            ...filterResultKeyboard
          });
        }
        // Обработка сравнения
        else if (callbackData.startsWith('compare_')) {
          const compareIds = callbackData.replace('compare_', '').split('_');
          const products = compareIds.map(id => getProductById(id)).filter(Boolean) as any[];
          
          if (products.length >= 2) {
            const comparisonText = compareProducts(products);
            
            const comparisonKeyboard = Markup.inlineKeyboard([
              ...products.map((product: any) => 
                [Markup.button.callback(`🔍 ${product.name}`, `product_${product.id}`)]
              ),
              [Markup.button.callback('⬅️ К сравнению', 'compare_start'), Markup.button.callback('🏗️ Меню', 'back_to_menu')]
            ]);
            
            await ctx.editMessageText(comparisonText, {
              parse_mode: 'Markdown',
              ...comparisonKeyboard
            });
          } else {
            await ctx.answerCbQuery('Не удалось найти товары для сравнения');
          }
        }
        // Обработка скачивания PDF
        else if (callbackData.startsWith('pdf_')) {
          const productId = callbackData.replace('pdf_', '');
          const product = getProductById(productId);
          
          if (product && product.pdfLink) {
            // Отправляем документ пользователю
            try {
              // Убираем /blocks-pdf/ из пути, так как product.pdfLink уже содержит полный путь
              const pdfFileName = product.pdfLink.replace('/blocks-pdf/', '');
              const pdfBasePath = process.env.NODE_ENV === 'production' 
                ? path.join(__dirname, 'blocks-pdf')
                : path.join(__dirname, '..', 'blocks-pdf');
              const pdfPath = path.join(pdfBasePath, pdfFileName);
              
              console.log(`[PDF] Attempting to send: ${pdfPath}`);
              
              // Проверяем существование файла
              const fs = require('fs');
              if (fs.existsSync(pdfPath)) {
                await ctx.replyWithDocument({
                  source: pdfPath,
                  filename: `${product.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
                }, {
                  caption: `📄 **${product.name}**\n\nТехническая документация и инструкции по применению.`,
                  parse_mode: 'Markdown'
                });
                
                await ctx.answerCbQuery('📄 PDF документ отправлен!');
              } else {
                console.error(`[PDF] File not found: ${pdfPath}`);
                await ctx.answerCbQuery('❌ PDF файл не найден');
              }
            } catch (error) {
              console.error('Error sending PDF:', error);
              await ctx.answerCbQuery('❌ Ошибка при отправке PDF');
            }
          } else {
            await ctx.answerCbQuery('❌ PDF не доступен для этого товара');
          }
        }
        // Обработка детального просмотра товаров
        else if (callbackData.startsWith('product_')) {
          const productId = callbackData.replace('product_', '');
          const product = getProductById(productId);
          
          if (product) {
            const productCard = formatProductCard(product);
            
            // Создаем кнопки для карточки товара
            const buttons = [
              [Markup.button.callback('📞 Консультация', 'consult'), Markup.button.callback('🧮 Расчеты', 'calculations')]
            ];
            
            // Добавляем кнопку PDF, если есть ссылка
            if (product.pdfLink) {
              buttons.push([Markup.button.callback('📄 Скачать PDF', `pdf_${product.id}`)]);
            }
            
            buttons.push([Markup.button.callback('⬅️ К категории', `category_${product.category}`), Markup.button.callback('🏗️ Меню', 'back_to_menu')]);
            
            const productKeyboard = Markup.inlineKeyboard(buttons);
            
            await ctx.editMessageText(productCard, {
              parse_mode: 'Markdown',
              ...productKeyboard
            });
          } else {
            await ctx.answerCbQuery('Товар не найден');
          }
        } else {
          await ctx.answerCbQuery('Неизвестная команда');
        }
    }
  } catch (error) {
    console.error('[Callback] Error:', error);
    await ctx.answerCbQuery('Произошла ошибка');
  }
});

// Обработка текстовых сообщений через OpenAI Assistant
bot.on('text', async (ctx) => {
  // Пропускаем команды
  if (ctx.message.text.startsWith('/')) {
    return;
  }
  
  let progressMessage: any = null;
  
  try {
    // Показываем индикатор печати
    await ctx.sendChatAction('typing');

    const userMessage = ctx.message.text;
    const userName = ctx.from.first_name || 'Коллега';
    const userLanguage = ctx.from.language_code || 'ru';

    console.log(`[Assistant] Processing message from ${userName}: ${userMessage}`);

    // Отправляем сообщение о прогрессе
    progressMessage = await ctx.reply('🤖 Анализирую ваш вопрос...', {
      reply_parameters: { message_id: ctx.message.message_id }
    });

    // Получаем ответ от OpenAI Assistant
    const { ai_response } = await getAiFeedbackFromSupabase({
      assistant_id: ASSISTANT_ID!,
      report: userMessage,
      language_code: userLanguage,
      full_name: userName
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
        parse_mode: 'Markdown'
      });
      
      // Добавляем кнопки для дополнительных действий
      const followUpKeyboard = Markup.inlineKeyboard([
        [Markup.button.callback('❓ Задать уточняющий вопрос', 'ask_question')],
        [Markup.button.callback('📐 Каталог блоков', 'catalog'), Markup.button.callback('🏗️ Меню', 'back_to_menu')]
      ]);
      
      await ctx.reply('💡 Надеюсь, мой ответ был полезен! Что бы вы хотели сделать дальше?', {
        ...followUpKeyboard
      });
      
    } else {
      await ctx.reply('🤔 Извините, не смог обработать ваш запрос. Попробуйте переформулировать вопрос.', {
        ...Markup.inlineKeyboard([
          [Markup.button.callback('📚 Получить помощь', 'help')],
          [Markup.button.callback('🏗️ Меню', 'back_to_menu')]
        ])
      });
    }

  } catch (error) {
    console.error('[Assistant] Error processing message:', error);
    
    // Удаляем сообщение о прогрессе при ошибке
    if (progressMessage) {
      try {
        await ctx.deleteMessage(progressMessage.message_id);
      } catch (e) {
        // Игнорируем ошибки удаления
      }
    }
    
    const errorMessage = `❌ **Ошибка обработки**

😔 Прошу прощения, произошла техническая ошибка.

🔄 **Что можно сделать:**
• Попробовать ещё раз
• Переформулировать вопрос
• Использовать меню`;

    await ctx.reply(errorMessage, { 
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('📚 Получить помощь', 'help')],
        [Markup.button.callback('🏗️ Главное меню', 'back_to_menu')]
      ])
    });
  }
});

// Обработка ошибок
bot.catch((err, ctx) => {
  console.error('[Bot] Error occurred:', err);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down bot and server...');
  bot.stop('SIGINT');
  server.close(() => {
    console.log('🌐 HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down bot and server...');
  bot.stop('SIGTERM');
  server.close(() => {
    console.log('🌐 HTTP server closed');
    process.exit(0);
  });
});

// Функция настройки команд бота
async function setupBotCommands() {
  try {
    await bot.telegram.setMyCommands([
      { command: 'start', description: '🏗️ Главное меню и приветствие' },
      { command: 'help', description: '📚 Справка по использованию бота' },
      { command: 'blocks', description: '🧱 Каталог строительных блоков HAUS' },
      { command: 'consult', description: '👨‍💼 Экспертная консультация архитектора' }
    ]);
    console.log('✅ Bot commands configured successfully');
  } catch (error) {
    console.error('❌ Error setting bot commands:', error);
  }
}

// Создание HTTP сервера для healthcheck (требуется Railway)
const app = express();
const PORT = process.env.PORT || 3000;

// Статический сервер для PDF файлов
// В production (dist) файлы будут в dist/blocks-pdf, в dev - в ../blocks-pdf
const isProduction = process.env.NODE_ENV === 'production';
const pdfPath = isProduction
  ? path.join(__dirname, 'blocks-pdf')
  : path.join(__dirname, '../blocks-pdf');

console.log(`🔍 [PDF] NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`🔍 [PDF] isProduction: ${isProduction}`);
console.log(`🔍 [PDF] __dirname: ${__dirname}`);
console.log(`🔍 [PDF] pdfPath: ${pdfPath}`);
console.log(`🔍 [PDF] Directory exists: ${require('fs').existsSync(pdfPath)}`);

app.use('/blocks-pdf', express.static(pdfPath));

// Health check endpoint для Railway
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    bot: 'AI Architect Bot',
    assistant_id: ASSISTANT_ID 
  });
});

// Корневой endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'AI Architect Bot is running', 
    timestamp: new Date().toISOString() 
  });
});

// Запуск HTTP сервера
const server = app.listen(PORT, () => {
  console.log(`🌐 HTTP server running on port ${PORT}`);
});

// Запуск бота с проверкой Assistant
console.log('🚀 Starting AI Architect Bot...');

// Проверяем доступность Assistant перед запуском
checkAssistantAvailability()
  .then((isAvailable) => {
    if (!isAvailable) {
      console.warn('⚠️  Warning: Assistant not available, but starting bot anyway');
    }
    
    return bot.launch();
  })
  .then(async () => {
    console.log('✅ Bot is running!');
    console.log(`📱 Assistant ID: ${ASSISTANT_ID}`);
    console.log('💬 Ready to assist with construction blocks and architecture!');
    
    // Настраиваем команды бота
    await setupBotCommands();
  })
  .catch((error) => {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  });

}).catch((error) => {
  console.error('Failed to initialize i18n:', error);
  process.exit(1);
});

export default bot;
