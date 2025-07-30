const ExcelJS = require("exceljs");

async function analyzeWhatNeedsTranslation() {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(
      "HAUS_FAQ_Russian_with_Lithuanian_Improved.xlsx"
    );

    console.log("🔍 ДЕТАЛЬНЫЙ АНАЛИЗ СОДЕРЖИМОГО ЛИТОВСКОЙ ВКЛАДКИ");
    console.log("=================================================");

    // Находим литовскую вкладку
    const lithuanianSheet = workbook.worksheets.find((ws) =>
      ws.name.includes("Lietuvių")
    );

    if (!lithuanianSheet) {
      console.log("❌ Литовская вкладка не найдена!");
      return;
    }

    console.log(`📋 Анализируем лист: "${lithuanianSheet.name}"`);
    console.log(
      `📏 Размер: ${lithuanianSheet.rowCount} строк × ${lithuanianSheet.columnCount} столбцов`
    );

    // Анализируем заголовки (первая строка)
    console.log("\n📝 ЗАГОЛОВКИ (строка 1):");
    for (let col = 1; col <= lithuanianSheet.columnCount; col++) {
      const cell = lithuanianSheet.getCell(1, col);
      console.log(`   Столбец ${col}: "${cell.value}"`);
    }

    // Анализируем несколько первых строк данных
    console.log("\n📊 СОДЕРЖИМОЕ (первые 5 строк данных):");
    for (let row = 2; row <= Math.min(7, lithuanianSheet.rowCount); row++) {
      console.log(`\n--- СТРОКА ${row} ---`);

      for (let col = 1; col <= lithuanianSheet.columnCount; col++) {
        const cell = lithuanianSheet.getCell(row, col);
        const cellValue = cell.value ? String(cell.value) : "";

        // Определяем, содержит ли текст кириллицу (русский текст)
        const containsCyrillic = /[а-яё]/i.test(cellValue);
        const status = containsCyrillic ? "❌ НЕ ПЕРЕВЕДЕНО" : "✅ ОК";

        console.log(`   Столбец ${col}: ${status}`);
        if (cellValue.length > 0) {
          console.log(
            `      Текст: "${cellValue.substring(0, 100)}${cellValue.length > 100 ? "..." : ""}"`
          );
        }
      }
    }

    // Подсчитаем сколько ячеек содержат русский текст
    let totalCells = 0;
    let russianCells = 0;

    console.log("\n📈 СТАТИСТИКА ПЕРЕВОДА:");

    for (let row = 2; row <= lithuanianSheet.rowCount; row++) {
      for (let col = 1; col <= lithuanianSheet.columnCount; col++) {
        const cell = lithuanianSheet.getCell(row, col);
        const cellValue = cell.value ? String(cell.value) : "";

        if (cellValue.length > 0) {
          totalCells++;
          if (/[а-яё]/i.test(cellValue)) {
            russianCells++;
          }
        }
      }
    }

    console.log(`📊 Всего ячеек с содержимым: ${totalCells}`);
    console.log(`❌ Ячеек с русским текстом: ${russianCells}`);
    console.log(`✅ Ячеек переведенных: ${totalCells - russianCells}`);
    console.log(
      `📈 Процент перевода: ${(((totalCells - russianCells) / totalCells) * 100).toFixed(1)}%`
    );

    if (russianCells > 0) {
      console.log("\n🚨 ТРЕБУЕТСЯ ПОЛНЫЙ ПЕРЕВОД СОДЕРЖИМОГО!");
    } else {
      console.log("\n🎉 Все содержимое уже переведено!");
    }
  } catch (error) {
    console.error("❌ Ошибка анализа:", error.message);
  }
}

analyzeWhatNeedsTranslation();
