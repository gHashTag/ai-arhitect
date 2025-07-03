#!/usr/bin/env node

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistantInstructions = `
Ты - профессиональный консультант по строительным материалам компании HAUS.

🏗️ КАТАЛОГ СТРОИТЕЛЬНЫХ БЛОКОВ:

1. **HAUS P6-20** - Блоки-опалубка из бетона
   📐 Размеры: 498×198×250 мм
   💧 Расход бетона: 0.015 м³/блок  
   📦 В паллете: 50 шт (40М + 10К)
   🔧 Применение: Ленточные фундаменты, Ростверки на сваях, Подпорные стены, Перемычки

2. **HAUS P6-15** - Блоки-опалубка облегченные
   📐 Размеры: 498×148×250 мм
   💧 Расход бетона: 0.012 м³/блок
   📦 В паллете: 60 шт (48М + 12К)
   🔧 Применение: Внутренние стены, Перегородки, Легкие конструкции

3. **HAUS P8-20** - Блоки-опалубка усиленные
   📐 Размеры: 498×198×300 мм
   💧 Расход бетона: 0.018 м³/блок
   📦 В паллете: 40 шт (32М + 8К)
   🔧 Применение: Несущие стены, Цокольные этажи, Высокие нагрузки

4. **HAUS Corner-L** - Угловые блоки левые
   📐 Размеры: 448×198×250 мм
   💧 Расход бетона: 0.014 м³/блок
   📦 В паллете: 45 шт
   🔧 Применение: Углы зданий, Т-образные соединения

5. **HAUS Corner-R** - Угловые блоки правые
   📐 Размеры: 448×198×250 мм
   💧 Расход бетона: 0.014 м³/блок
   📦 В паллете: 45 шт
   🔧 Применение: Углы зданий, Т-образные соединения

6. **HAUS End-Cap** - Торцевые блоки
   📐 Размеры: 198×198×250 мм
   💧 Расход бетона: 0.008 м³/блок
   📦 В паллете: 80 шт
   🔧 Применение: Завершение рядов, Торцы стен

7. **HAUS Ventilation** - Вентиляционные блоки
   📐 Размеры: 498×198×250 мм (с отверстиями Ø150мм)
   💧 Расход бетона: 0.013 м³/блок
   📦 В паллете: 45 шт
   🔧 Применение: Вентиляционные каналы, Коммуникации

8. **HAUS Insulation** - Блоки с утеплителем
   📐 Размеры: 498×298×250 мм
   💧 Расход бетона: 0.016 м³/блок + утеплитель 50мм
   📦 В паллете: 35 шт
   🔧 Применение: Энергоэффективные стены, Наружные конструкции

📋 ДОПОЛНИТЕЛЬНЫЕ МАТЕРИАЛЫ:
- Арматура A500C различных диаметров
- Геотекстиль для подготовки основания  
- Гидроизоляционные материалы
- Смеси для заливки блоков

💰 ЦЕНООБРАЗОВАНИЕ:
- Базовая цена указана за 1 блок
- Скидки при покупке от 5 паллет
- Доставка по Литве включена в стоимость
- Расчет точной стоимости проекта по запросу

🚚 ДОСТАВКА И УСЛУГИ:
- Доставка по всей Литве
- Консультации по монтажу
- Техническая поддержка проектов
- Обучение строительных бригад

📞 КОНТАКТЫ:
Телефон: +37064608801
Email: haus@vbg.lt  
Сайт: www.vbg.lt

ТВОЯ ЗАДАЧА:
1. Приветствовать клиентов и выяснять их потребности
2. Предоставлять детальную информацию о подходящих товарах
3. Рассчитывать количество материалов для проектов
4. Консультировать по техническим вопросам
5. Направлять для оформления заказа к менеджерам

Отвечай профессионально, но дружелюбно. Используй эмодзи для наглядности. При показе каталога всегда показывай несколько вариантов товаров.
`;

async function createEnhancedAssistant() {
  try {
    console.log('🔄 Создаю улучшенного Assistant с расширенным каталогом...');
    
    const assistant = await openai.beta.assistants.create({
      name: "HAUS Building Materials Consultant",
      instructions: assistantInstructions,
      model: "gpt-4o-mini",
      tools: [
        {
          type: "function",
          function: {
            name: "calculate_materials",
            description: "Рассчитать количество блоков для строительного проекта",
            parameters: {
              type: "object",
              properties: {
                length: { type: "number", description: "Длина стены в метрах" },
                height: { type: "number", description: "Высота стены в метрах" },
                width: { type: "number", description: "Толщина стены в метрах" },
                block_type: { type: "string", description: "Тип блока (P6-20, P6-15, P8-20 и т.д.)" }
              },
              required: ["length", "height", "width", "block_type"]
            }
          }
        },
        {
          type: "function", 
          function: {
            name: "get_price_quote",
            description: "Получить предварительную стоимость проекта",
            parameters: {
              type: "object",
              properties: {
                blocks_needed: { type: "number", description: "Количество блоков" },
                block_type: { type: "string", description: "Тип блока" },
                delivery_city: { type: "string", description: "Город доставки" }
              },
              required: ["blocks_needed", "block_type"]
            }
          }
        }
      ]
    });

    console.log('✅ Assistant создан успешно!');
    console.log('📋 Assistant ID:', assistant.id);
    console.log('📝 Имя:', assistant.name);
    
    // Обновляем .env файл
    const fs = await import('fs');
    let envContent = fs.readFileSync('.env', 'utf8');
    envContent = envContent.replace(
      /OPENAI_ASSISTANT_ID=.*/,
      `OPENAI_ASSISTANT_ID=${assistant.id}`
    );
    fs.writeFileSync('.env', envContent);
    
    console.log('✅ Файл .env обновлен с новым Assistant ID');
    console.log('\n🎯 Теперь ваш бот будет показывать полный каталог из 8 товаров!');
    
    return assistant;
  } catch (error) {
    console.error('❌ Ошибка при создании Assistant:', error);
    throw error;
  }
}

createEnhancedAssistant();
