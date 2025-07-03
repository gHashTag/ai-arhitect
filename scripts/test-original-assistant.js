#!/usr/bin/env node

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOriginalAssistant() {
  try {
    console.log('🔍 Тестируем оригинальный Assistant...');
    
    // Создаем тестовый thread
    const thread = await openai.beta.threads.create();
    console.log('📝 Thread создан:', thread.id);
    
    // Отправляем запрос на показ каталога
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: "Покажи каталог строительных блоков. Сколько у вас товаров в каталоге?"
    });
    
    // Запускаем Assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID
    });
    
    console.log('⏳ Ожидаем ответ Assistant...');
    
    // Ждем завершения
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }
    
    if (runStatus.status === 'completed') {
      // Получаем ответ
      const messages = await openai.beta.threads.messages.list(thread.id);
      const assistantMessage = messages.data[0];
      
      if (assistantMessage.role === 'assistant') {
        const content = assistantMessage.content[0].text.value;
        console.log('\n📋 Ответ оригинального Assistant:');
        console.log('═══════════════════════════════════════');
        console.log(content);
        console.log('═══════════════════════════════════════');
        
        // Анализируем количество товаров
        const lines = content.split('\n');
        const productLines = lines.filter(line => 
          line.includes('HAUS P') || line.includes('блок') || line.includes('Блок')
        );
        
        console.log(`\n🔍 Найдено упоминаний товаров: ${productLines.length}`);
        
        if (content.toLowerCase().includes('один') || productLines.length === 1) {
          console.log('⚠️  Каталог показывает только один товар');
          console.log('💡 Нужно добавить больше товаров в Vector Store');
        } else {
          console.log('✅ Каталог содержит несколько товаров');
        }
      }
    } else {
      console.log('❌ Ошибка выполнения:', runStatus.last_error);
    }
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

testOriginalAssistant();
