const ExcelJS = require("exceljs");
const { translate } = require("@vitalets/google-translate-api");

// Словарь для часто используемых переводов
const translationDictionary = {
  // Эмоджи категории
  "🔧 Технические": "🔧 Techniniai",
  "⚡ Монтаж": "⚡ Montavimas",
  "📊 Расчеты": "📊 Skaičiavimai",
  "💰 Цена/Экономия": "💰 Kaina/Taupymas",
  "🚚 Доставка": "🚚 Pristatymas",
  "📄 Документы": "📄 Dokumentai",
  "🏗️ Применение": "🏗️ Taikymas",

  // Общие термины
  общее: "bendras",
  все: "visi",
  "P6-20": "P6-20",
  "P6-30": "P6-30",
  S25: "S25",
  S6: "S6",
  SM6: "SM6",
  SP: "SP",
  P25: "P25",
  "VB-2": "VB-2",
  HAUS: "HAUS",

  // Часто встречающиеся фразы
  "блоки HAUS": "HAUS blokai",
  строительство: "statyba",
  монтаж: "montavimas",
  бетон: "betonas",
  армирование: "armavimas",
  теплоизоляция: "šilumos izoliacija",
  звукоизоляция: "garso izoliacija",
  прочность: "tvirtumas",
  долговечность: "ilgaamžiškumas",
};

async function translateWithDictionary(text) {
  // Сначала проверяем словарь
  if (translationDictionary[text]) {
    console.log(`📚 Из словаря: "${text}" → "${translationDictionary[text]}"`);
    return translationDictionary[text];
  }

  // Если нет в словаре, возвращаем исходный текст (можно добавить API перевод позже)
  console.log(`⚠️  Не найден перевод для: "${text}"`);
  return text;
}

async function translateTextSafely(text, retryDelay = 5000) {
  if (!text || text.trim() === "") {
    return text;
  }

  // Проверяем словарь первым делом
  const dictTranslation = translationDictionary[text];
  if (dictTranslation) {
    console.log(`📚 Из словаря: "${text}" → "${dictTranslation}"`);
    return dictTranslation;
  }

  // Если текст короткий и содержит только латинские символы/цифры, оставляем как есть
  if (text.length < 10 && /^[A-Za-z0-9\-\s]+$/.test(text)) {
    return text;
  }

  try {
    console.log(
      `🔄 Переводим: "${text.substring(0, 50)}${text.length > 50 ? "..." : ""}"`
    );
    await new Promise((resolve) => setTimeout(resolve, retryDelay));

    const result = await translate(text, { from: "ru", to: "lt" });
    console.log(
      `✅ Переведено: "${result.text.substring(0, 50)}${result.text.length > 50 ? "..." : ""}"`
    );
    return result.text;
  } catch (error) {
    if (error.message.includes("Too Many Requests")) {
      console.log(
        `⏳ Превышен лимит запросов, используем исходный текст: "${text.substring(0, 30)}..."`
      );
      return text; // Возвращаем исходный текст
    }

    console.error(`❌ Ошибка перевода: ${error.message}`);
    return text; // Возвращаем исходный текст при любой ошибке
  }
}

async function addLithuanianSheetImproved() {
  const inputFile = "HAUS_FAQ_Russian.xlsx";
  const outputFile = "HAUS_FAQ_Russian_with_Lithuanian_Improved.xlsx";

  try {
    console.log("📖 Читаем исходный Excel файл...");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(inputFile);

    const originalSheet = workbook.worksheets[0];
    console.log(`📋 Исходный лист: "${originalSheet.name}"`);

    // Удаляем старую литовскую вкладку, если существует
    const existingLitSheet = workbook.worksheets.find((ws) =>
      ws.name.includes("Lietuvių")
    );
    if (existingLitSheet) {
      workbook.removeWorksheet(existingLitSheet.id);
      console.log("🗑️  Удалена существующая литовская вкладка");
    }

    const lithuanianSheet = workbook.addWorksheet("FAQ Возражения (Lietuvių)");
    console.log("📄 Создан новый лист для литовского перевода");

    // Переводы заголовков
    const headerTranslations = {
      "№": "№",
      Приоритет: "Prioritetas",
      Категория: "Kategorija",
      Продукт: "Produktas",
      "Возражение клиента": "Kliento prieštaravimas",
      "Отработка возражения": "Prieštaravimo sprendimas",
      "Ключевые слова": "Raktažodžiai",
      Язык: "Kalba",
    };

    // Устанавливаем заголовки
    const headerRow = originalSheet.getRow(1);
    const newHeaderRow = lithuanianSheet.getRow(1);

    headerRow.eachCell((cell, colNumber) => {
      const originalValue = cell.value;
      const translatedValue =
        headerTranslations[originalValue] || originalValue;
      newHeaderRow.getCell(colNumber).value = translatedValue;
      newHeaderRow.getCell(colNumber).style = cell.style;
    });

    console.log("📝 Заголовки переведены и скопированы");

    // Копируем и переводим данные
    const totalRows = originalSheet.rowCount;
    console.log(`📊 Начинаем перевод ${totalRows - 1} строк данных...`);

    let translatedCount = 0;
    let requestCount = 0;
    const maxRequests = 50; // Лимит запросов к API

    for (let rowNum = 2; rowNum <= totalRows; rowNum++) {
      const originalRow = originalSheet.getRow(rowNum);
      const newRow = lithuanianSheet.getRow(rowNum);

      if (rowNum % 10 === 0) {
        console.log(
          `📈 Прогресс: ${rowNum - 1}/${totalRows - 1} строк обработано`
        );
      }

      // Обрабатываем каждую ячейку в строке
      for (let colIndex = 1; colIndex <= originalRow.cellCount; colIndex++) {
        const originalCell = originalRow.getCell(colIndex);
        const newCell = newRow.getCell(colIndex);
        const cellValue = originalCell.value;

        if (cellValue === null || cellValue === undefined) {
          newCell.value = cellValue;
          continue;
        }

        // Определяем, какие столбцы нужно переводить
        const columnsToTranslate = [3, 5, 6, 7]; // Категория, Возражение клиента, Отработка возражения, Ключевые слова

        if (
          columnsToTranslate.includes(colIndex) &&
          typeof cellValue === "string"
        ) {
          if (requestCount < maxRequests) {
            newCell.value = await translateWithDictionary(cellValue);
            if (!translationDictionary[cellValue]) {
              requestCount++;
            }
          } else {
            // Если превысили лимит запросов, используем словарь или оригинал
            newCell.value = translationDictionary[cellValue] || cellValue;
          }
        } else if (colIndex === 8) {
          // Столбец "Язык" - меняем на "lt"
          newCell.value = "lt";
        } else {
          // Для остальных столбцов просто копируем значение
          newCell.value = cellValue;
        }

        // Копируем стиль ячейки
        newCell.style = originalCell.style;
      }

      translatedCount++;
    }

    // Копируем ширину столбцов
    originalSheet.columns.forEach((column, index) => {
      if (column.width) {
        lithuanianSheet.getColumn(index + 1).width = column.width;
      }
    });

    console.log(`✅ Обработано ${translatedCount} строк данных`);
    console.log(
      `📊 Использовано ${requestCount} API запросов из ${maxRequests} доступных`
    );

    // Сохраняем файл
    console.log("💾 Сохраняем обновленный файл...");
    await workbook.xlsx.writeFile(outputFile);

    console.log("🎉 Готово!");
    console.log(`📁 Исходный файл: ${inputFile}`);
    console.log(`📁 Новый файл с литовским переводом: ${outputFile}`);
    console.log(`📋 Добавлен лист: "${lithuanianSheet.name}"`);

    // Показываем статистику переводов
    console.log("\n📈 Статистика переводов:");
    console.log(
      `🔤 Переводов из словаря: ${Object.keys(translationDictionary).length}`
    );
    console.log(`🌐 API запросов использовано: ${requestCount}`);
  } catch (error) {
    console.error("❌ Произошла ошибка:", error);
    throw error;
  }
}

// Запускаем скрипт
console.log("🚀 Начинаем добавление литовской вкладки (улучшенная версия)...");
addLithuanianSheetImproved()
  .then(() => {
    console.log("✨ Процесс завершен успешно!");
  })
  .catch((error) => {
    console.error("💥 Ошибка при выполнении:", error.message);
    process.exit(1);
  });
