const { Telegraf } = require('telegraf');
require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is required');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

async function setupBotCommands() {
  try {
    console.log('🔧 Setting up bot commands...');
    
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
    
    console.log('✅ Bot commands configured successfully!');
    console.log('\n📋 Available commands:');
    console.log('• /start - 🏗️ Главное меню и приветствие');
    console.log('• /help - 📚 Справка по использованию бота');
    console.log('• /blocks - 🧱 Каталог строительных блоков HAUS');
    console.log('• /consult - 👨‍💼 Экспертная консультация архитектора');
    
    // Проверяем, что команды установлены
    const commands = await bot.telegram.getMyCommands();
    console.log('\n🔍 Verified commands:', commands);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting bot commands:', error);
    process.exit(1);
  }
}

setupBotCommands();
