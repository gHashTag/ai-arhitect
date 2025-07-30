const ExcelJS = require("exceljs");
const { translate } = require("@vitalets/google-translate-api");

// Расширенный словарь переводов для строительной тематики
const extendedTranslationDictionary = {
  // Заголовки (уже переведены, но для полноты)
  Приоритет: "Prioritetas",
  Категория: "Kategorija",
  Продукт: "Produktas",
  "Возражение клиента": "Kliento prieštaravimas",
  "Отработка возражения": "Prieštaravimo sprendimas",
  "Ключевые слова": "Raktažodžiai",
  Язык: "Kalba",

  // Категории продуктов
  общее: "bendrasis",
  все: "visi",

  // Продукты HAUS
  "P6-20": "P6-20",
  "P6-30": "P6-30",
  S25: "S25",
  S6: "S6",
  SM6: "SM6",
  SP: "SP",
  P25: "P25",
  "VB-2": "VB-2",
  HAUS: "HAUS",

  // Строительные термины
  блоки: "blokai",
  блок: "blokas",
  опалубка: "klojinys",
  "несъемная опалубка": "nenuimamas klojinys",
  фундамент: "pamatas",
  бетон: "betonas",
  арматура: "armatūra",
  стена: "siena",
  стены: "sienos",
  кирпич: "plyta",
  размер: "dydis",
  размеры: "dydžiai",
  высота: "aukštis",
  ширина: "plotis",
  длина: "ilgis",
  толщина: "storis",
  монтаж: "montavimas",
  строительство: "statyba",
  дом: "namas",
  здание: "pastatas",
  конструкция: "konstrukcija",
  изоляция: "izoliacija",
  теплоизоляция: "šilumos izoliacija",
  гидроизоляция: "hidroizoliacija",

  // Финансовые термины
  цена: "kaina",
  стоимость: "kaina",
  дорого: "brangu",
  дешево: "pigu",
  экономия: "taupymas",
  выгода: "nauda",
  затраты: "išlaidos",
  расходы: "išlaidos",
  переплата: "permoka",

  // Качество
  качество: "kokybė",
  гарантия: "garantija",
  сертификат: "sertifikatas",
  надежность: "patikimumas",
  прочность: "stiprumas",
  долговечность: "ilgaamžiškumas",

  // Часто встречающиеся фразы
  "Что такое": "Kas yra",
  "Как рассчитать": "Kaip apskaičiuoti",
  "Нужен ли": "Ar reikia",
  "В чем разница": "Koks skirtumas",
  Сколько: "Kiek",
  "Можно ли": "Ar galima",
  Где: "Kur",
  Когда: "Kada",
  Почему: "Kodėl",
  "На самом деле": "Iš tikrųjų",
  "Отличный вопрос": "Puikus klausimas",
  "Вы правы": "Jūs teisūs",
  "Да, обязательно": "Taip, būtinai",
  "Нет, не обязательно": "Ne, nebūtinai",

  // Технические характеристики
  "м²": "m²",
  "м³": "m³",
  см: "cm",
  мм: "mm",
  кг: "kg",
  тонна: "tona",
  литр: "litras",

  // Числительные и количество
  один: "vienas",
  два: "du",
  три: "trys",
  первый: "pirmas",
  второй: "antras",
  третий: "trečias",

  // Направления
  сверху: "iš viršaus",
  снизу: "iš apačios",
  слева: "iš kairės",
  справа: "iš dešinės",
  внутри: "viduje",
  снаружи: "lauke",

  // Действия
  установить: "sumontuoti",
  построить: "pastatyti",
  рассчитать: "apskaičiuoti",
  измерить: "išmatuoti",
  проверить: "patikrinti",
  купить: "pirkti",
  заказать: "užsakyti",
  доставить: "pristatyti",
};

async function translateWithFallback(text, delay = 200) {
  if (!text || text.trim() === "") {
    return text;
  }

  // Проверяем словарь сначала
  if (extendedTranslationDictionary[text]) {
    console.log(
      `📚 Используем словарь: "${text}" → "${extendedTranslationDictionary[text]}"`
    );
    return extendedTranslationDictionary[text];
  }

  // Проверяем, содержит ли текст кириллицу
  if (!/[а-яё]/i.test(text)) {
    // Если текст не содержит русских букв, возвращаем как есть
    return text;
  }

  // Задержка для API
  await new Promise((resolve) => setTimeout(resolve, delay));

  try {
    console.log(
      `🔄 API перевод: "${text.substring(0, 50)}${text.length > 50 ? "..." : ""}"`
    );
    const result = await translate(text, { from: "ru", to: "lt" });
    console.log(
      `✅ Переведено: "${result.text.substring(0, 50)}${result.text.length > 50 ? "..." : ""}"`
    );
    return result.text;
  } catch (error) {
    console.error(`❌ Ошибка API: ${error.message}. Оставляем текст как есть.`);

    // Если API не работает, попробуем базовую замену
    let result = text;
    for (const [ru, lt] of Object.entries(extendedTranslationDictionary)) {
      result = result.replace(new RegExp(ru, "gi"), lt);
    }

    return result;
  }
}

async function completeTranslation() {
  try {
    console.log("🚀 ЗАПУСК ПОЛНОГО ПЕРЕВОДА ВСЕГО СОДЕРЖИМОГО");
    console.log("=============================================");

    // Читаем существующий файл
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(
      "HAUS_FAQ_Russian_with_Lithuanian_Improved.xlsx"
    );

    // Находим литовскую вкладку
    const lithuanianSheet = workbook.worksheets.find((ws) =>
      ws.name.includes("Lietuvių")
    );

    if (!lithuanianSheet) {
      console.log("❌ Литовская вкладка не найдена!");
      return;
    }

    console.log(`📋 Переводим лист: "${lithuanianSheet.name}"`);
    console.log(
      `📏 Размер: ${lithuanianSheet.rowCount} строк × ${lithuanianSheet.columnCount} столбцов`
    );

    let translatedCells = 0;
    let totalCells = 0;
    let skippedCells = 0;

    // Переводим все содержимое, кроме заголовков (пропускаем первую строку)
    for (let row = 2; row <= lithuanianSheet.rowCount; row++) {
      console.log(
        `\n🔄 Обрабатываем строку ${row} из ${lithuanianSheet.rowCount}`
      );

      for (let col = 1; col <= lithuanianSheet.columnCount; col++) {
        const cell = lithuanianSheet.getCell(row, col);
        const originalValue = cell.value ? String(cell.value) : "";

        if (originalValue.length > 0) {
          totalCells++;

          // Пропускаем уже переведенное содержимое или числа
          if (!/[а-яё]/i.test(originalValue)) {
            skippedCells++;
            continue;
          }

          // Переводим текст
          const translatedValue = await translateWithFallback(originalValue);

          if (translatedValue !== originalValue) {
            cell.value = translatedValue;
            translatedCells++;
            console.log(`   ✅ Ячейка [${row},${col}] переведена`);
          } else {
            console.log(`   ⚠️ Ячейка [${row},${col}] оставлена без изменений`);
          }
        }
      }

      // Дополнительная пауза между строками
      if (row % 5 === 0) {
        console.log("⏳ Пауза между группами строк...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Сохраняем результат
    const outputFileName = "HAUS_FAQ_COMPLETE_LITHUANIAN.xlsx";
    await workbook.xlsx.writeFile(outputFileName);

    console.log("\n🎉 ПЕРЕВОД ЗАВЕРШЕН!");
    console.log("==================");
    console.log(`📁 Файл сохранен как: ${outputFileName}`);
    console.log(`📊 Статистика:`);
    console.log(`   • Всего ячеек с содержимым: ${totalCells}`);
    console.log(`   • Переведено ячеек: ${translatedCells}`);
    console.log(`   • Пропущено (уже переведено): ${skippedCells}`);
    console.log(
      `   • Процент новых переводов: ${((translatedCells / totalCells) * 100).toFixed(1)}%`
    );
  } catch (error) {
    console.error("❌ Критическая ошибка:", error.message);
    console.error(error.stack);
  }
}

// Запускаем перевод
completeTranslation();
