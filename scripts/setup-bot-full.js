const { Telegraf } = require('telegraf');
require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is required');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

async function setupBot() {
  try {
    console.log('🔧 Setting up AI Architect Bot...');
    
    // 1. Устанавливаем команды
    await bot.telegram.setMyCommands([
      { 
        command: 'start', 
        description: '🏗️ Главное меню и приветствие' 
      },
      { 
        command: 'help', 
        description: '📚 Справка по использованию бота' 
      },
      { 
        command: 'blocks', 
        description: '🧱 Каталог строительных блоков HAUS' 
      },
      { 
        command: 'consult', 
        description: '👨‍💼 Экспертная консультация архитектора' 
      }
    ]);
    console.log('✅ Commands configured');
    
    // 2. Устанавливаем описание бота
    const description = `🏗️ ИИ-Архитект — ваш персональный консультант по строительным блокам и архитектурным решениям.

🤖 Специализация:
• Консультации по блокам HAUS P6-20
• Технические характеристики и расчеты
• Строительные нормы и стандарты
• Рекомендации по применению

💬 Просто напишите ваш вопрос о строительстве, и получите экспертную консультацию!

📞 Техподдержка: +37064608801`;

    await bot.telegram.setMyDescription(description);
    console.log('✅ Description configured');
    
    // 3. Устанавливаем краткое описание (макс 120 символов)
    const shortDescription = "🏗️ ИИ-консультант по строительным блокам HAUS. Экспертные ответы и расчеты.";
    
    await bot.telegram.setMyShortDescription(shortDescription);
    console.log('✅ Short description configured');
    
    // 4. Проверяем установленные настройки
    console.log('\n🔍 Verifying bot configuration...');
    
    const commands = await bot.telegram.getMyCommands();
    console.log('\n📋 Commands:', commands);
    
    const botInfo = await bot.telegram.getMe();
    console.log('\n🤖 Bot info:', {
      username: botInfo.username,
      first_name: botInfo.first_name,
      can_join_groups: botInfo.can_join_groups,
      can_read_all_group_messages: botInfo.can_read_all_group_messages,
      supports_inline_queries: botInfo.supports_inline_queries
    });
    
    console.log('\n✅ AI Architect Bot fully configured!');
    console.log(`\n🔗 Bot link: https://t.me/${botInfo.username}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up bot:', error);
    process.exit(1);
  }
}

setupBot();
