const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function listAssistants() {
  try {
    console.log('🔍 Checking available assistants...');
    const assistants = await openai.beta.assistants.list();
    
    console.log(`\n✅ Found ${assistants.data.length} assistants:`);
    
    if (assistants.data.length === 0) {
      console.log('❌ No assistants found. Let\'s create one!');
      return;
    }
    
    assistants.data.forEach((assistant, index) => {
      console.log(`\n${index + 1}. ID: ${assistant.id}`);
      console.log(`   Name: ${assistant.name || 'Unnamed'}`);
      console.log(`   Model: ${assistant.model}`);
      console.log(`   Created: ${new Date(assistant.created_at * 1000).toISOString()}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking assistants:', error.message);
  }
}

async function createArchitectAssistant() {
  try {
    console.log('\n🛠️ Creating new AI Architect Assistant...');
    
    const assistant = await openai.beta.assistants.create({
      name: "AI Architect Consultant",
      instructions: `Вы - специализированный ИИ-консультант по строительным блокам и архитектурным решениям.

Ваша роль:
- Эксперт по строительным блокам HAUS, особенно P6-20
- Консультант по техническим характеристикам блоков  
- Специалист по строительным нормам и стандартам
- Помощник в расчете материалов и объемов

База знаний включает:
- HAUS P6-20 блоки-опалубка из бетона
- Размеры: 498×198×250 мм (M) и 508×198×250 мм (K)
- Расход бетона: 0.015 м³ на блок
- Применение: фундаменты, ростверки, подпорные стены, перемычки
- Контакты: +37064608801, haus@vbg.lt

Формат ответа:
- Используйте **жирный текст** для выделения важного
- Используйте *курсив* для пояснений
- Создавайте списки с - или *
- Добавляйте строительные эмодзи 🏗️ 🧱 📐 💧 для лучшего восприятия
- Давайте конкретные практические советы с расчетами
- Упоминайте нормативные требования при необходимости

Всегда отвечайте профессионально, но доступно, обращаясь к пользователю по имени.`,
      model: "gpt-4o-mini",
      tools: []
    });
    
    console.log('✅ Assistant created successfully!');
    console.log(`📱 Assistant ID: ${assistant.id}`);
    console.log(`📝 Name: ${assistant.name}`);
    
    console.log('\n🔧 Update your .env file:');
    console.log(`OPENAI_ASSISTANT_ID=${assistant.id}`);
    
  } catch (error) {
    console.error('❌ Error creating assistant:', error.message);
  }
}

async function main() {
  await listAssistants();
  
  console.log('\n❓ Do you want to create a new AI Architect Assistant? (y/n)');
  // For automatic creation, uncomment the next line:
  await createArchitectAssistant();
}

main();
