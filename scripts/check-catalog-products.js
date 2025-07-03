#!/usr/bin/env node

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function checkCatalogProducts() {
  try {
    console.log('📡 Проверяем новый ассистент с каталогом товаров...');
    // Создаем тестовый thread
    const thread = await openai.beta.threads.create();
    console.log('📝 Thread создан:', thread.id);

    // Отправляем запрос пользователю
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: "Покажи все товары в вашем каталоге."
    });

    // Запускаем ассистента
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID
    });

    console.log('⏳ Ожидаем ответ от ассистента...');

    // Ждем завершения
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      console.log('Status:', runStatus.status);
    }

    if (runStatus.status === 'completed') {
      // Получаем ответ
      const messages = await openai.beta.threads.messages.list(thread.id);
      const assistantMessage = messages.data.find(message => message.role === 'assistant');
      if (assistantMessage) {
        const content = assistantMessage.content[0].text.value;
        console.log('📋 Ответ ассистента:');
        console.log(content);
        
        // Ищем товары
        const productMatches = content.match(/\b(HAUS|P6-20|S25|SM6|KL-28|SP)\b/ig) || [];
        console.log('\n🔍 Видимые товары:', [...new Set(productMatches.map(match => match.toUpperCase()))].join(', '));
      }
    } else {
      console.log('❌ Запрос не выполнен.');
      console.log('Детали:', runStatus);
    }

  } catch (error) {
    console.error('Ошибка:', error);
  }
}

checkCatalogProducts();
