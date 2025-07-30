const ExcelJS = require("exceljs");

async function checkUntranslatedContent() {
  try {
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

    console.log("🔍 ПРОВЕРКА НЕПЕРЕВЕДЕННОГО СОДЕРЖИМОГО");
    console.log("====================================");

    let russianCells = [];

    // Найдем все ячейки с русским текстом
    for (let row = 2; row <= lithuanianSheet.rowCount; row++) {
      for (let col = 1; col <= lithuanianSheet.columnCount; col++) {
        const cell = lithuanianSheet.getCell(row, col);
        const cellValue = cell.value ? String(cell.value) : "";

        if (cellValue.length > 0 && /[а-яё]/i.test(cellValue)) {
          russianCells.push({
            row: row,
            col: col,
            content: cellValue,
          });
        }
      }
    }

    console.log(`❌ Найдено ${russianCells.length} ячеек с русским текстом`);

    // Покажем первые 10 примеров для понимания
    console.log("\n📝 ПРИМЕРЫ НЕПЕРЕВЕДЕННОГО СОДЕРЖИМОГО:");
    const examples = russianCells.slice(0, 10);

    examples.forEach((cell, index) => {
      const colName = getColumnName(cell.col);
      console.log(`\n${index + 1}. Ячейка ${colName}${cell.row}:`);
      console.log(
        `   "${cell.content.substring(0, 100)}${cell.content.length > 100 ? "..." : ""}"`
      );
    });

    if (russianCells.length > 10) {
      console.log(`\n... и еще ${russianCells.length - 10} ячеек`);
    }

    // Статистика по столбцам
    console.log("\n📊 СТАТИСТИКА ПО СТОЛБЦАМ:");
    const columnStats = {};
    russianCells.forEach((cell) => {
      const colName = getColumnName(cell.col);
      columnStats[colName] = (columnStats[colName] || 0) + 1;
    });

    Object.entries(columnStats).forEach(([col, count]) => {
      const colDescription = getColumnDescription(col);
      console.log(`   ${col} (${colDescription}): ${count} ячеек`);
    });

    console.log(
      `\n🎯 ИТОГО: Нужно перевести ${russianCells.length} ячеек вручную`
    );

    return russianCells;
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
  }
}

function getColumnName(colNumber) {
  const columns = ["", "A", "B", "C", "D", "E", "F", "G", "H"];
  return columns[colNumber] || `Col${colNumber}`;
}

function getColumnDescription(colName) {
  const descriptions = {
    A: "№",
    B: "Приоритет",
    C: "Категория",
    D: "Продукт",
    E: "Вопрос клиента",
    F: "Ответ специалиста",
    G: "Ключевые слова",
    H: "Язык",
  };
  return descriptions[colName] || "Неизвестно";
}

checkUntranslatedContent();
