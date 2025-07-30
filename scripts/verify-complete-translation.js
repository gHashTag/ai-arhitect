const ExcelJS = require("exceljs");

async function verifyCompleteTranslation() {
  try {
    console.log("🔍 ПРОВЕРКА РЕЗУЛЬТАТА ПОЛНОГО ПЕРЕВОДА");
    console.log("=====================================");

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("HAUS_FAQ_COMPLETE_LITHUANIAN.xlsx");

    // Находим литовскую вкладку
    const lithuanianSheet = workbook.worksheets.find((ws) =>
      ws.name.includes("Lietuvių")
    );

    if (!lithuanianSheet) {
      console.log("❌ Литовская вкладка не найдена!");
      return;
    }

    console.log(`📋 Проверяем лист: "${lithuanianSheet.name}"`);
    console.log(
      `📏 Размер: ${lithuanianSheet.rowCount} строк × ${lithuanianSheet.columnCount} столбцов`
    );

    // Подсчитаем статистику
    let totalCells = 0;
    let russianCells = 0;
    let translatedCells = 0;
    let emptyCells = 0;

    // Проверяем каждую ячейку (пропускаем заголовки - первую строку)
    for (let row = 2; row <= lithuanianSheet.rowCount; row++) {
      for (let col = 1; col <= lithuanianSheet.columnCount; col++) {
        const cell = lithuanianSheet.getCell(row, col);
        const cellValue = cell.value ? String(cell.value) : "";

        if (cellValue.length === 0) {
          emptyCells++;
        } else {
          totalCells++;

          // Проверяем, содержит ли кириллицу (русский текст)
          if (/[а-яё]/i.test(cellValue)) {
            russianCells++;
          } else {
            translatedCells++;
          }
        }
      }
    }

    console.log("\n📈 ФИНАЛЬНАЯ СТАТИСТИКА:");
    console.log(`📊 Всего ячеек с содержимым: ${totalCells}`);
    console.log(`❌ Ячеек с русским текстом (НЕ переведено): ${russianCells}`);
    console.log(`✅ Ячеек переведенных: ${translatedCells}`);
    console.log(`⬜ Пустых ячеек: ${emptyCells}`);
    console.log(
      `📈 Процент перевода: ${((translatedCells / totalCells) * 100).toFixed(1)}%`
    );

    // Проверим несколько конкретных примеров из разных частей файла
    console.log("\n🔍 ПРИМЕРЫ ПЕРЕВОДА (проверочная выборка):");

    const sampleRows = [2, 25, 50, 75, 100];
    for (const row of sampleRows) {
      if (row <= lithuanianSheet.rowCount) {
        console.log(`\n--- СТРОКА ${row} ---`);

        // Столбец 5 - Вопрос клиента
        const questionCell = lithuanianSheet.getCell(row, 5);
        const question = questionCell.value ? String(questionCell.value) : "";
        const questionHasRussian = /[а-яё]/i.test(question);

        console.log(
          `Вопрос: ${questionHasRussian ? "❌ НЕ ПЕРЕВЕДЕНО" : "✅ ПЕРЕВЕДЕНО"}`
        );
        console.log(
          `   "${question.substring(0, 80)}${question.length > 80 ? "..." : ""}"`
        );

        // Столбец 6 - Ответ
        const answerCell = lithuanianSheet.getCell(row, 6);
        const answer = answerCell.value ? String(answerCell.value) : "";
        const answerHasRussian = /[а-яё]/i.test(answer);

        console.log(
          `Ответ: ${answerHasRussian ? "❌ НЕ ПЕРЕВЕДЕНО" : "✅ ПЕРЕВЕДЕНО"}`
        );
        console.log(
          `   "${answer.substring(0, 80)}${answer.length > 80 ? "..." : ""}"`
        );
      }
    }

    // Общий вывод
    const translationPercentage = (translatedCells / totalCells) * 100;

    console.log("\n🎯 ИТОГОВАЯ ОЦЕНКА:");
    if (translationPercentage >= 95) {
      console.log("🎉 ОТЛИЧНО! Перевод практически завершен.");
    } else if (translationPercentage >= 80) {
      console.log("✅ ХОРОШО! Большая часть содержимого переведена.");
    } else if (translationPercentage >= 60) {
      console.log(
        "⚠️ УДОВЛЕТВОРИТЕЛЬНО. Есть существенные непереведенные части."
      );
    } else {
      console.log("❌ ТРЕБУЕТСЯ ДОРАБОТКА. Много непереведенного содержимого.");
    }

    if (russianCells > 0) {
      console.log(
        `\n💡 Рекомендация: Осталось перевести ${russianCells} ячеек с русским текстом.`
      );
      console.log("   Можно запустить скрипт повторно или перевести вручную.");
    }
  } catch (error) {
    console.error("❌ Ошибка при проверке:", error.message);
  }
}

verifyCompleteTranslation();
