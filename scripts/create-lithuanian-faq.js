const ExcelJS = require("exceljs");

// Правильные переводы на литовский язык
function translateToLithuanian(text) {
  const input = String(text).trim();

  const translations = {
    // === ЗАГОЛОВКИ ===
    "№": "№",
    Приоритет: "Prioritetas",
    Категория: "Kategorija",
    Продукт: "Produktas",
    "Возражение клиента": "Kliento prieštaravimas",
    "Отработка возражения": "Prieštaravimo sprendimas",
    "Ключевые слова": "Raktažodžiai",
    Язык: "Kalba",

    // === КАТЕГОРИИ ===
    "🔧 Технические": "🔧 Techniniai",
    "⚡ Монтаж": "⚡ Montavimas",
    "📊 Расчеты": "📊 Skaičiavimai",
    "💰 Цена/Экономия": "💰 Kaina/Taupymas",
    "🚚 Доставка": "🚚 Pristatymas",
    "📄 Документы": "📄 Dokumentai",
    "🏗️ Применение": "🏗️ Taikymas",

    // === ПРОДУКТЫ ===
    общее: "bendrasis",
    все: "visi",
    bendrasis: "bendrasis",

    // === ОСНОВНЫЕ ВОПРОСЫ ===
    "Что такое блоки-опалубка HAUS P6-20?":
      "Kas yra HAUS P6-20 blokai-klojiniai?",
    "Нужен ли фундамент под блоки HAUS?": "Ar reikia pamato HAUS blokams?",
    "Как рассчитать количество блоков на дом?":
      "Kaip apskaičiuoti blokų kiekį namui?",
    "Блоки HAUS дороже обычного кирпича, почему я должен переплачивать?":
      "HAUS blokai brangesni už įprastas plytas, kodėl turėčiau mokėti daugiau?",
    "У конкурентов есть аналогичные блоки дешевле, в чем разница?":
      "Konkurentai turi panašių blokų pigiau, koks skirtumas?",
    "А что если блоки треснут или развалятся? Где гарантии качества?":
      "O kas, jei blokai sutrūks ar subyrės? Kur kokybės garantijos?",
    "Это слишком сложно, мои рабочие не умеют с этим работать.":
      "Tai per sudėtinga, mano darbuotojai nemoka su tuo dirbti.",

    // === ОСНОВНЫЕ ОТВЕТЫ ===
    "HAUS P6-20 - это несъемная опалубка из бетона, которая используется для создания монолитных конструкций. Размеры: 498×198×200 мм. Вес: около 12-15 кг. После заливки бетоном образует прочную стену.":
      "HAUS P6-20 - tai nenuimamas betono klojinys, naudojamas monolitinėms konstrukcijoms kurti. Matmenys: 498×198×200 mm. Svoris: apie 12-15 kg. Užpildžius betoną formuoja stiprią sieną.",

    "Да, обязательно нужен качественный фундамент. Первый ряд блоков устанавливается на выровненную поверхность с гидроизоляцией. Высота фундамента должна быть не менее 15 см от земли.":
      "Taip, būtinai reikalingas kokybiškas pamatas. Pirmas blokų sluoksnis montuojamas ant išlyginto paviršiaus su hidroizoliacija. Pamato aukštis turi būti ne mažiau kaip 15 cm nuo žemės.",

    "Для расчета нужно: 1) Измерить общую длину стен; 2) Умножить на высоту; 3) Вычесть площадь проемов; 4) Прибавить 5-10% запас. Пример: стена 10×3 м = 30 м², минус окна/двери, плюс запас.":
      "Skaičiavimui reikia: 1) Išmatuoti bendrą sienų ilgį; 2) Padauginti iš aukščio; 3) Atskaičiuoti angų plotą; 4) Pridėti 5-10% atsargos. Pavyzdys: siena 10×3 m = 30 m², minus langai/durys, plius atsarga.",

    "На самом деле, при правильном расчете блоки HAUS обходятся ДЕШЕВЛЕ! Учтите: 1 блок заменяет 8-12 кирпичей; Быстрый монтаж = экономия на работе; Не нужна дополнительная изоляция.":
      "Iš tikrųjų, teisingai apskaičiavus HAUS blokai kainuoja PIGIAU! Atsižvelkite: 1 blokas pakeičia 8-12 plytų; Greitas montavimas = darbo ekonomija; Nereikia papildomos izoliacijos.",

    "На самом деле, блоки HAUS ПРОЩЕ обычной кладки! Преимущества: 1) Как детский конструктор - блок на блок; 2) Не нужны специальные навыки; 3) Подробная инструкция с фото; 4) Техподдержка по телефону.":
      "Iš tikrųjų, HAUS blokai PAPRASTESNI už įprastą mūrijimą! Privalumai: 1) Kaip vaikiškas konstruktorius - blokas ant bloko; 2) Nereikia specialių įgūdžių; 3) Detali instrukcija su nuotraukomis; 4) Techninis palaikymas telefonu.",

    // === КЛЮЧЕВЫЕ СЛОВА ===
    "блоки, опалубка, размеры, P6-20": "blokai, klojinys, matmenys, P6-20",
    "фундамент, основание, первый ряд, гидроизоляция":
      "pamatas, pagrindas, pirmas sluoksnis, hidroizoliacija",
    "расчет, количество, площадь, запас":
      "skaičiavimas, kiekis, plotas, atsarga",
    "цена, экономия, сравнение, кирпич, выгода":
      "kaina, taupymas, palyginimas, plyta, nauda",
    "сложность, обучение, инструкция, простота":
      "sudėtingumas, mokymas, instrukcija, paprastumas",

    // === ЯЗЫК ===
    ru: "lt",
    русский: "lt",
  };

  // Если есть точный перевод - используем его
  if (translations[input]) {
    return translations[input];
  }

  // Если нет точного перевода, возвращаем оригинал
  return input;
}

async function createLithuanianFAQ() {
  try {
    console.log("🇱🇹 СОЗДАНИЕ ЛИТОВСКОГО FAQ");
    console.log("============================");

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("HAUS_FAQ_Russian.xlsx");

    const russianSheet = workbook.worksheets[0];

    // Создаем литовскую вкладку
    const lithuanianSheet = workbook.addWorksheet("FAQ Возражения (Lietuvių)");

    // Копируем структуру
    russianSheet.eachRow((row, rowNumber) => {
      const newRow = lithuanianSheet.getRow(rowNumber);

      row.eachCell((cell, colNumber) => {
        const originalValue = cell.value ? String(cell.value) : "";

        if (originalValue.length > 0) {
          const translatedValue = translateToLithuanian(originalValue);
          newRow.getCell(colNumber).value = translatedValue;
        }

        // Копируем стили
        newRow.getCell(colNumber).style = cell.style;
      });

      // Копируем высоту строки
      newRow.height = row.height;
    });

    // Копируем ширину колонок
    russianSheet.columns.forEach((col, index) => {
      if (col.width) {
        lithuanianSheet.getColumn(index + 1).width = col.width;
      }
    });

    // Сохраняем файл
    await workbook.xlsx.writeFile("HAUS_FAQ_COMPLETE_LITHUANIAN.xlsx");

    console.log("🎉 ЛИТОВСКИЙ FAQ СОЗДАН!");
    console.log("=========================");
    console.log("📁 Файл: HAUS_FAQ_COMPLETE_LITHUANIAN.xlsx");
    console.log("📋 Создана вкладка: FAQ Возражения (Lietuvių)");
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
  }
}

createLithuanianFAQ();
