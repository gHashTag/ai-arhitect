import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';
import { openai } from './services/openai';
import { getAiFeedbackFromSupabase } from './services/getAiFeedbackFromOpenAI';

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

// Middleware для логирования
bot.use((ctx, next) => {
  console.log(`[${new Date().toISOString()}] Update:`, ctx.update);
  return next();
});

// Команда /start
bot.start(async (ctx) => {
  const userName = ctx.from?.first_name || 'Коллега';
  const welcomeMessage = `🏗️ **Добро пожаловать, ${userName}!**

Я **ИИ-Архитект** — ваш персональный консультант по строительным блокам и архитектурным решениям.

🤖 **Что я умею:**
• 📐 Консультировать по техническим характеристикам
• 🧮 Помогать с расчетами материалов
• 📚 Отвечать на вопросы по строительным нормам
• 💡 Предлагать оптимальные решения

👇 **Выберите действие:**`;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('🧱 Каталог блоков', 'catalog')],
    [Markup.button.callback('👨‍💼 Консультация эксперта', 'consult')],
    [Markup.button.callback('❓ Частые вопросы', 'faq')],
    [Markup.button.callback('📚 Справка', 'help')]
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

**HAUS P6-20** - Блоки-опалубка из бетона

📏 **Технические характеристики:**
• 📐 Размеры: 498×198×250 мм
• 💧 Расход бетона: 0.015 м³/блок
• 📦 В паллете: 50 шт (40M + 10K)

🏗️ **Применение:**
• Ленточные фундаменты
• Ростверки на сваях
• Подпорные стены
• Перемычки

📞 **Контакты:** +37064608801
🌐 **Сайт:** www.vbg.lt`;
        
        const catalogKeyboard = Markup.inlineKeyboard([
          [Markup.button.callback('📋 Подробные расчеты', 'calculations')],
          [Markup.button.callback('📡 Задать вопрос', 'ask_question')],
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
        
      case 'back_to_menu':
        // Возвращаемся к главному меню
        const userName = ctx.from?.first_name || 'Коллега';
        const backMessage = `🏗️ **Добро пожаловать, ${userName}!**

Я **ИИ-Архитект** — ваш персональный консультант по строительным блокам и архитектурным решениям.

🤖 **Что я умею:**
• 📐 Консультировать по техническим характеристикам
• 🧮 Помогать с расчетами материалов
• 📚 Отвечать на вопросы по строительным нормам
• 💡 Предлагать оптимальные решения

👇 **Выберите действие:**`;
        
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
        
      default:
        await ctx.answerCbQuery('Неизвестная команда');
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
  console.log('🛑 Shutting down bot...');
  bot.stop('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down bot...');
  bot.stop('SIGTERM');
  process.exit(0);
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

export default bot;
