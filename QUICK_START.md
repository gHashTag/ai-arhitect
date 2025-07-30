# 🚀 Быстрый запуск HAUS FAQ System

## 📋 Требования

- Node.js 18+
- TypeScript
- Telegram Bot Token
- OpenAI API Key

## ⚡ Быстрый старт

### 1. Настройка переменных окружения

```bash
export TELEGRAM_BOT_TOKEN="your_bot_token_here"
export OPENAI_API_KEY="your_openai_api_key_here"
```

### 2. Компиляция TypeScript

```bash
npx tsc
```

### 3. Запуск Telegram бота

```bash
node dist/index.js
```

### 4. Запуск HTTP API (опционально)

```bash
node dist/server.js
```

## 🧪 Тестирование

### Проверить FAQ API

```bash
curl http://localhost:3001/api/faq/stats
```

### Скачать Excel с FAQ

```bash
curl -O http://localhost:3001/api/faq/export/excel
```

### Telegram бот команды

- `/start` - Главное меню
- `/faq` - Быстрый доступ к FAQ
- `/blocks` - Каталог блоков

## 📊 Статистика системы

- ✅ **30+ FAQ** загружено
- 📂 **6 категорий** настроено
- 🌍 **3 языка** поддержки
- 📦 **8+ продуктов** в каталоге

Полная документация: [FAQ_SYSTEM_README.md](./FAQ_SYSTEM_README.md)
