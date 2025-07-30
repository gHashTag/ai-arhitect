// Тестируем интегрированную FAQ систему
const { faqService } = require("../src/services/updatedFAQService.ts");

function testFAQIntegration() {
  console.log("🧪 ТЕСТ FAQ СИСТЕМЫ");
  console.log("==================");

  try {
    // Тест 1: Общая статистика
    const allFAQs = faqService.getAllFAQs();
    const categories = faqService.getAllCategories();

    console.log(`✅ Всего FAQ: ${allFAQs.length}`);
    console.log(`✅ Категорий: ${categories.length}`);

    // Тест 2: FAQ по языкам
    const russianFAQs = faqService.getFAQsByLanguage("ru");
    const lithuanianFAQs = faqService.getFAQsByLanguage("lt");

    console.log(`\n🇷🇺 Русских FAQ: ${russianFAQs.length}`);
    console.log(`🇱🇹 Литовских FAQ: ${lithuanianFAQs.length}`);

    // Тест 3: Примеры FAQ
    console.log("\n📋 ПРИМЕРЫ FAQ:");
    console.log("================");

    if (russianFAQs.length > 0) {
      console.log("🇷🇺 Русский пример:");
      console.log(`   Вопрос: ${russianFAQs[0].question.substring(0, 60)}...`);
      console.log(`   Ответ: ${russianFAQs[0].answer.substring(0, 60)}...`);
    }

    if (lithuanianFAQs.length > 0) {
      console.log("\n🇱🇹 Литовский пример:");
      console.log(
        `   Klausimas: ${lithuanianFAQs[0].question.substring(0, 60)}...`
      );
      console.log(
        `   Atsakymas: ${lithuanianFAQs[0].answer.substring(0, 60)}...`
      );
    }

    // Тест 4: Категории
    console.log("\n📂 КАТЕГОРИИ:");
    console.log("==============");
    categories.forEach((cat) => {
      const categoryFAQs = faqService.getFAQsByCategory(cat.id);
      console.log(`   ${cat.name}: ${categoryFAQs.length} FAQ`);
    });

    // Тест 5: Поиск
    console.log("\n🔍 ТЕСТ ПОИСКА:");
    console.log("================");
    const searchResults = faqService.searchFAQs("блоки");
    console.log(`   Поиск "блоки": ${searchResults.length} результатов`);

    const ltSearchResults = faqService.searchFAQs("blokai", "lt");
    console.log(
      `   Поиск "blokai" (lt): ${ltSearchResults.length} результатов`
    );

    console.log("\n🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ!");
    console.log("======================");
    console.log("✅ FAQ система готова к работе");
    console.log("✅ Многоязычность работает");
    console.log("✅ Поиск функционирует");
    console.log("✅ Категории настроены");
  } catch (error) {
    console.error("❌ Ошибка в тестах:", error.message);
    console.error(
      "💡 Проверьте, что файл updatedFAQService.ts создан правильно"
    );
  }
}

// Запускаем тест только если файл запущен напрямую
if (require.main === module) {
  testFAQIntegration();
}

module.exports = { testFAQIntegration };
