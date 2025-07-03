#!/usr/bin/env node

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function checkCatalogCount() {
  try {
    console.log('🔍 Проверяем каталог товаров с новым Assistant...');
    console.log(`📋 Assistant ID: ${process.env.OPENAI_ASSISTANT_ID}`);
    
    // Создаем тестовый thread
    const thread = await openai.beta.threads.create();
    
    // Отправляем простой запрос на каталог
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: "Покажи каталог строительных блоков - все доступные товары"
    });
    
    // Запускаем Assistant с более простой моделью
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID,
      model: "gpt-4o-mini"  // Используем более стабильную модель
    });
    
    console.log('⏳ Ожидаем ответ...');
    
    // Ждем завершения
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    let attempts = 0;
    
    while ((runStatus.status === 'queued' || runStatus.status === 'in_progress') && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      attempts++;
      console.log(`Status: ${runStatus.status} (${attempts}/30)`);
    }
    
    if (runStatus.status === 'completed') {
      // Получаем ответ
      const messages = await openai.beta.threads.messages.list(thread.id);
      const assistantMessage = messages.data[0];
      
      if (assistantMessage.role === 'assistant') {
        const content = assistantMessage.content[0].text.value;
        
        console.log('\n📋 Ответ каталога:');
        console.log('═'.repeat(60));
        console.log(content);
        console.log('═'.repeat(60));
        
        // Подсчитываем товары
        const productLines = content.split('\n').filter(line => {
          const cleanLine = line.trim().toLowerCase();
          return (
            cleanLine.includes('haus') || 
            cleanLine.match(/^\d+\./) ||  // нумерованные списки
            cleanLine.includes('блок') ||
            cleanLine.includes('p6') ||
            cleanLine.includes('s25') ||
            cleanLine.includes('sm6')
          );
        });
        
        // Более точный подсчет уникальных товаров
        const productNames = new Set();
        const patterns = [
          /HAUS\s+[A-Z0-9-]+/gi,
          /P\d+-\d+/gi,
          /S\d+(?!\d)/gi,
          /SM\d+/gi,
          /KL-\d+/gi
        ];
        
        patterns.forEach(pattern => {
          const matches = content.match(pattern);
          if (matches) {
            matches.forEach(match => productNames.add(match.trim().toUpperCase()));
          }
        });
        
        console.log('\n🔢 Анализ каталога:');
        console.log(`📦 Найдено уникальных товаров: ${productNames.size}`);
        console.log(`📝 Строк с товарами: ${productLines.length}`);
        
        if (productNames.size > 0) {
          console.log('\n🏷️ Список товаров:');
          Array.from(productNames).sort().forEach((product, index) => {
            console.log(`   ${index + 1}. ${product}`);
          });
        }
        
        // Проверяем качество информации
        const hasDetails = content.includes('размер') || content.includes('×') || content.includes('мм');
        const hasQuantity = content.includes('шт') || content.includes('паллет');
        const hasUsage = content.includes('применение') || content.includes('фундамент');
        
        console.log('\n📊 Качество каталога:');
        console.log(`${hasDetails ? '✅' : '❌'} Технические характеристики`);
        console.log(`${hasQuantity ? '✅' : '❌'} Информация о количестве`);
        console.log(`${hasUsage ? '✅' : '❌'} Описание применения`);
        
        return productNames.size;
        
      }
    } else {
      console.log('❌ Ошибка выполнения:', runStatus.status);
      if (runStatus.last_error) {
        console.log('Детали ошибки:', runStatus.last_error);
      }
      return 0;
    }
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
    return 0;
  }
}

checkCatalogCount().then(count => {
  console.log(`\n🎯 ИТОГО: ${count} товаров в каталоге`);
  if (count === 0) {
    console.log('⚠️  Каталог пуст или недоступен');
  } else if (count === 1) {
    console.log('⚠️  Показывается только один товар');
  } else {
    console.log('✅ Каталог содержит несколько товаров');
  }
});
