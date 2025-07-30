const ExcelJS = require("exceljs");

async function analyzeExcelFile() {
  try {
    // Создаем новый объект workbook
    const workbook = new ExcelJS.Workbook();

    // Читаем Excel файл
    await workbook.xlsx.readFile("HAUS_FAQ_Russian.xlsx");

    console.log("📊 Анализ файла HAUS_FAQ_Russian.xlsx");
    console.log("=====================================");

    // Получаем все листы
    const worksheets = workbook.worksheets;
    console.log(`📄 Количество листов: ${worksheets.length}`);

    worksheets.forEach((worksheet, index) => {
      console.log(`\n📋 Лист ${index + 1}: "${worksheet.name}"`);
      console.log(
        `   Размер: ${worksheet.rowCount} строк × ${worksheet.columnCount} столбцов`
      );

      // Получаем заголовки (первая строка)
      if (worksheet.rowCount > 0) {
        const headerRow = worksheet.getRow(1);
        const headers = [];
        headerRow.eachCell((cell, colNumber) => {
          headers.push(`Столбец ${colNumber}: "${cell.value}"`);
        });
        console.log("   Заголовки:");
        headers.forEach((header) => console.log(`     - ${header}`));

        // Показываем первые 3-5 строк данных
        console.log("   Первые строки данных:");
        for (
          let rowNum = 2;
          rowNum <= Math.min(6, worksheet.rowCount);
          rowNum++
        ) {
          const row = worksheet.getRow(rowNum);
          const rowData = [];
          row.eachCell((cell, colNumber) => {
            if (colNumber <= 3) {
              // Показываем только первые 3 столбца для краткости
              rowData.push(`"${cell.value || ""}"`);
            }
          });
          if (rowData.length > 0) {
            console.log(`     Строка ${rowNum}: ${rowData.join(" | ")}`);
          }
        }
      }
    });

    console.log("\n✅ Анализ завершен!");
  } catch (error) {
    console.error("❌ Ошибка при анализе файла:", error.message);
  }
}

// Запускаем анализ
analyzeExcelFile();
