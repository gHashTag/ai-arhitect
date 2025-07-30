const ExcelJS = require("exceljs");
const { translate } = require("@vitalets/google-translate-api");

async function translateText(text, delay = 100) {
  // Добавляем задержку между запросами, чтобы избежать блокировки
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (!text || text.trim() === "") {
    return text;
  }

  try {
    console.log(
      `🔄 Переводим: "${text.substring(0, 50)}${text.length > 50 ? "..." : ""}"`
    );
    const result = await translate(text, { from: "ru", to: "lt" });
    console.log(
      `✅ Переведено: "${result.text.substring(0, 50)}${result.text.length > 50 ? "..." : ""}"`
    );
    return result.text;
  } catch (error) {
    console.error(
      `❌ Ошибка перевода текста: "${text.substring(0, 30)}...". Ошибка:`,
      error.message
    );
    return text; // Возвращаем оригинальный текст, если перевод не удался
  }
}

async function addLithuanianSheet() {
  const inputFile = "HAUS_FAQ_Russian.xlsx";
  const outputFile = "HAUS_FAQ_Russian_with_Lithuanian.xlsx";

  try {
    console.log("📖 Читаем исходный Excel файл...");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(inputFile);

    // Получаем исходный лист
    const originalSheet = workbook.worksheets[0];
    console.log(`📋 Исходный лист: "${originalSheet.name}"`);

    // Создаем новый лист для литовского перевода
    const lithuanianSheet = workbook.addWorksheet("FAQ Возражения (Lietuvių)");
    console.log("📄 Создан новый лист для литовского перевода");

    // Копируем структуру заголовков
    const headerRow = originalSheet.getRow(1);
    const newHeaderRow = lithuanianSheet.getRow(1);

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
    headerRow.eachCell((cell, colNumber) => {
      const originalValue = cell.value;
      const translatedValue =
        headerTranslations[originalValue] || originalValue;
      newHeaderRow.getCell(colNumber).value = translatedValue;

      // Копируем стиль заголовка
      newHeaderRow.getCell(colNumber).style = cell.style;
    });

    console.log("📝 Заголовки переведены и скопированы");

    // Копируем и переводим данные
    const totalRows = originalSheet.rowCount;
    console.log(`📊 Начинаем перевод ${totalRows - 1} строк данных...`);

    let translatedCount = 0;

    for (let rowNum = 2; rowNum <= totalRows; rowNum++) {
      const originalRow = originalSheet.getRow(rowNum);
      const newRow = lithuanianSheet.getRow(rowNum);

      if (rowNum % 10 === 0) {
        console.log(
          `📈 Прогресс: ${rowNum - 1}/${totalRows - 1} строк обработано`
        );
      }

      // Копируем и переводим каждую ячейку
      await Promise.all(
        originalRow.values.map(async (cellValue, colIndex) => {
          if (colIndex === 0) return; // Пропускаем первый элемент (undefined)

          const cell = newRow.getCell(colIndex);
          const originalCell = originalRow.getCell(colIndex);

          if (cellValue === null || cellValue === undefined) {
            cell.value = cellValue;
            return;
          }

          // Определяем, какие столбцы нужно переводить
          const columnsToTranslate = [3, 5, 6, 7]; // Категория, Возражение клиента, Отработка возражения, Ключевые слова

          if (
            columnsToTranslate.includes(colIndex) &&
            typeof cellValue === "string"
          ) {
            // Переводим текст
            cell.value = await translateText(cellValue, 200);
          } else if (colIndex === 8) {
            // Столбец "Язык" - меняем на "lt"
            cell.value = "lt";
          } else {
            // Для остальных столбцов просто копируем значение
            cell.value = cellValue;
          }

          // Копируем стиль ячейки
          cell.style = originalCell.style;
        })
      );

      translatedCount++;
    }

    // Копируем ширину столбцов
    originalSheet.columns.forEach((column, index) => {
      if (column.width) {
        lithuanianSheet.getColumn(index + 1).width = column.width;
      }
    });

    console.log(`✅ Переведено ${translatedCount} строк данных`);

    // Сохраняем файл
    console.log("💾 Сохраняем обновленный файл...");
    await workbook.xlsx.writeFile(outputFile);

    console.log("🎉 Готово!");
    console.log(`📁 Исходный файл: ${inputFile}`);
    console.log(`📁 Новый файл с литовским переводом: ${outputFile}`);
    console.log(`📋 Добавлен лист: "${lithuanianSheet.name}"`);
  } catch (error) {
    console.error("❌ Произошла ошибка:", error);
    throw error;
  }
}

// Запускаем скрипт
console.log("🚀 Начинаем добавление литовской вкладки...");
addLithuanianSheet()
  .then(() => {
    console.log("✨ Процесс завершен успешно!");
  })
  .catch((error) => {
    console.error("💥 Ошибка при выполнении:", error.message);
    process.exit(1);
  });
