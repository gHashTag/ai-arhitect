#!/usr/bin/env node

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeNewAssistant() {
  try {
    console.log('🔍 Анализируем нового Assistant (o3-mini) с Vector Store...');
    
    // Создаем тестовый thread
    const thread = await openai.beta.threads.create();
    console.log('📝 Thread создан:', thread.id);
    
    // Отправляем запрос на полный каталог
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: "Покажи полный каталог всех строительных блоков, которые есть в базе данных. Хочу увидеть все товары с названиями, размерами, характеристиками и применением. Сделай подробный список всех доступных типов блоков."
    });
    
    // Запускаем Assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID
    });
    
    console.log('⏳ Ожидаем ответ Assistant...');
    
    // Ждем завершения
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
      await new Promise(resolve => setTimeout(resolve, 1500));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      console.log(`Status: ${runStatus.status}`);
    }
    
    if (runStatus.status === 'completed') {
      // Получаем ответ
      const messages = await openai.beta.threads.messages.list(thread.id);
      const assistantMessage = messages.data[0];
      
      if (assistantMessage.role === 'assistant') {
        const content = assistantMessage.content[0].text.value;
        console.log('\n📋 Каталог товаров от нового Assistant:');
        console.log('═══════════════════════════════════════════════════════════');
        console.log(content);
        console.log('═══════════════════════════════════════════════════════════');
        
        // Анализируем товары
        const productPatterns = [
          /HAUS\s+[A-Z0-9-]+/gi,
          /P\d+-\d+/gi,
          /S\d+/gi,
          /SM\d+/gi,
          /KL-\d+/gi,
          /SP\s*\d*/gi
        ];
        
        let foundProducts = new Set();
        productPatterns.forEach(pattern => {
          const matches = content.match(pattern);
          if (matches) {
            matches.forEach(match => foundProducts.add(match.trim()));
          }
        });
        
        console.log('\n🔍 Анализ каталога:');
        console.log(`✅ Найдено уникальных товаров: ${foundProducts.size}`);
        console.log('📝 Список товаров:');
        Array.from(foundProducts).sort().forEach((product, index) => {
          console.log(`   ${index + 1}. ${product}`);
        });
        
        // Проверяем на размеры и характеристики
        const hasSpecs = content.includes('×') || content.includes('мм') || content.includes('размер');
        const hasQuantity = content.includes('шт') || content.includes('паллет') || content.includes('поддон');
        const hasUsage = content.includes('применение') || content.includes('фундамент') || content.includes('стена');
        
        console.log('\n📊 Качество каталога:');
        console.log(`${hasSpecs ? '✅' : '❌'} Технические характеристики (размеры)`);
        console.log(`${hasQuantity ? '✅' : '❌'} Информация о количестве в упаковке`);
        console.log(`${hasUsage ? '✅' : '❌'} Описание применения`);
        
        return {
          products: Array.from(foundProducts),
          hasSpecs,
          hasQuantity,
          hasUsage,
          content
        };
      }
    } else {
      console.log('❌ Ошибка выполнения:', runStatus.last_error);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Ошибка анализа:', error);
    return null;
  }
}

analyzeNewAssistant().then(result => {
  if (result) {
    console.log('\n🎯 Готов к созданию листаемого каталога с найденными товарами!');
  }
});
