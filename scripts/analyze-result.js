const ExcelJS = require("exceljs");

async function analyzeResult() {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("HAUS_FAQ_Russian_with_Lithuanian.xlsx");

    console.log("📊 Анализ результата работы скрипта");
    console.log("=====================================");

    const worksheets = workbook.worksheets;
    console.log(`📄 Общее количество листов: ${worksheets.length}`);

    worksheets.forEach((worksheet, index) => {
      console.log(`\n📋 Лист ${index + 1}: "${worksheet.name}"`);
      console.log(
        `   Размер: ${worksheet.rowCount} строк × ${worksheet.columnCount} столбцов`
      );

      if (worksheet.name.includes("Lietuvių")) {
        console.log("   🎯 Это литовская вкладка!");

        // Проверяем заголовки
        const headerRow = worksheet.getRow(1);
        console.log("   📝 Заголовки:");
        headerRow.eachCell((cell, colNumber) => {
          console.log(`     Столбец ${colNumber}: "${cell.value}"`);
        });

        // Проверяем несколько первых строк данных
        console.log("   📊 Первые строки данных:");
        for (
          let rowNum = 2;
          rowNum <= Math.min(5, worksheet.rowCount);
          rowNum++
        ) {
          const row = worksheet.getRow(rowNum);
          const values = [];
          row.eachCell((cell, colNumber) => {
            if (colNumber <= 4) {
              // Показываем первые 4 столбца
              values.push(`"${cell.value || ""}"`);
            }
          });
          if (values.length > 0) {
            console.log(`     Строка ${rowNum}: ${values.join(" | ")}`);
          }
        }

        // Проверяем столбец "Язык" (8-й столбец)
        console.log('   🌐 Проверка столбца "Язык":');
        let langCount = { lt: 0, ru: 0, other: 0 };
        for (
          let rowNum = 2;
          rowNum <= Math.min(10, worksheet.rowCount);
          rowNum++
        ) {
          const langCell = worksheet.getRow(rowNum).getCell(8);
          const langValue = langCell.value;
          if (langValue === "lt") langCount.lt++;
          else if (langValue === "ru") langCount.ru++;
          else langCount.other++;
        }
        console.log(`     Литовский (lt): ${langCount.lt}`);
        console.log(`     Русский (ru): ${langCount.ru}`);
        console.log(`     Другое: ${langCount.other}`);
      }
    });

    console.log("\n✅ Анализ завершен!");
  } catch (error) {
    console.error("❌ Ошибка при анализе файла:", error.message);
  }
}

analyzeResult();
