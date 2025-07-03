#!/usr/bin/env node

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testAssistantCatalog() {
  try {
    console.log('🔍 Тестируем новый Assistant с полным каталогом...');
    
    // Создаем тестовый thread
    const thread = await openai.beta.threads.create();
    console.log('📝 Thread создан:', thread.id);
    
    // Отправляем запрос на показ каталога
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: "Покажи весь каталог строительных блоков с полным списком товаров"
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
        console.log('\n📋 Ответ Assistant:');
        console.log('═══════════════════════════════════════');
        console.log(content);
        console.log('═══════════════════════════════════════');
        
        // Проверяем, упоминает ли он несколько товаров
        const mentionedProducts = [
          'P6-20', 'P6-15', 'P8-20', 'Corner-L', 'Corner-R', 
          'End-Cap', 'Ventilation', 'Insulation'
        ];
        
        const foundProducts = mentionedProducts.filter(product => 
          content.includes(product)
        );
        
        console.log('\n🔍 Анализ каталога:');
        console.log(`✅ Найдено товаров: ${foundProducts.length}/8`);
        console.log(`📝 Упомянутые товары: ${foundProducts.join(', ')}`);
        
        if (foundProducts.length >= 5) {
          console.log('🎯 УСПЕХ! Assistant знает о расширенном каталоге!');
        } else {
          console.log('⚠️  Assistant все еще показывает ограниченный каталог');
        }
      }
    } else {
      console.log('❌ Ошибка выполнения:', runStatus.last_error);
    }
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

testAssistantCatalog();
