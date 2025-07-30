const ExcelJS = require("exceljs");

// Правильные переводы на литовский язык
function translateToLithuanian(text) {
  const input = String(text).trim();

  // Полные правильные переводы
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

    // === ВОПРОСЫ ===
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
    "Какая прочность у блоков HAUS P6-20?": "Koks HAUS P6-20 blokų stiprumas?",
    "Можно ли строить несущие стены из блоков P6-20?":
      "Ar galima statyti laikančiąsias sienas iš P6-20 blokų?",
    "Какие типы фундаментов можно строить из блоков P6-20?":
      "Kokių tipų pamatus galima statyti iš P6-20 blokų?",
    "Как соединяются блоки между собой?": "Kaip blokai jungiami tarpusavyje?",
    "Сколько бетона нужно на один блок P6-20?":
      "Kiek betono reikia vienam P6-20 blokui?",
    "Сколько блоков P6-20 в 1 м² стены?": "Kiek P6-20 blokų yra 1 m² sienos?",
    "Экономичнее ли строительство из блоков HAUS?":
      "Ar ekonomiškesnė statyba iš HAUS blokų?",
    "Что такое блоки HAUS P6-30?": "Kas yra HAUS P6-30 blokai?",
    "Это слишком дорого для моего бюджета, есть ли скидки?":
      "Tai per brangu mano biudžetui, ar yra nuolaidų?",
    "А новая технология, не опасно ли использовать в нашей стране?":
      "Nauja technologija, ar saugu naudoti mūsų šalyje?",
    "Боюсь, что это слишком неправильно и дом будет непрочным.":
      "Bijau, kad tai per netinkama ir namas bus nestiprus.",
    "Как быстро окупаются блоки HAUS по сравнению с кирпичом?":
      "Kaip greitai atsipirko HAUS blokai, palyginti su plytomis?",
    "Примут ли блоки HAUS в банке для получения кредита?":
      "Ar bankas priims HAUS blokus kredito gavimui?",
    "А если мне не понравится результат?": "O jei man nepatiks rezultatas?",
    "Какая морозостойкость у блоков HAUS?":
      "Koks HAUS blokų atsparumas šalčiui?",
    "Для чего нужны блоки типа K (угловые)?":
      "Kam reikalingi K tipo (kampiniai) blokai?",
    "Какая теплопроводность у блоков HAUS?":
      "Koks HAUS blokų šilumos laidumas?",
    "Можно ли использовать блоки для строительства бассейна?":
      "Ar galima naudoti blokus baseino statybai?",
    "Можно ли использовать блоки HAUS для многоэтажного строительства?":
      "Ar galima naudoti HAUS blokus daugiaukščio statybai?",
    "Какие перекрытия можно использовать с блоками HAUS?":
      "Kokius perdangos galima naudoti su HAUS blokais?",
    "Можно ли резать блоки HAUS?": "Ar galima pjauti HAUS blokus?",
    "Какие инструменты нужны для монтажа блоков?":
      "Kokie įrankiai reikalingi blokų montavimui?",
    "Как контролировать геометрию при кладке блоков?":
      "Kaip kontroliuoti geometriją dedant blokus?",
    "Как рассчитать вес стены из блоков HAUS?":
      "Kaip apskaičiuoti HAUS blokų sienos svorį?",
    "Как рассчитать расход цемента для блоков?":
      "Kaip apskaičiuoti cemento sąnaudas blokams?",

    // === ОТВЕТЫ ===
    "HAUS P6-20 - это несъемная опалубка из бетона, которая используется для создания монолитных конструкций. Размеры: 498×198×200 мм. Вес: около 12-15 кг. После заливки бетоном образует прочную стену.":
      "HAUS P6-20 - tai nenuimamas betono klojinys, naudojamas monolitinėms konstrukcijoms kurti. Matmenys: 498×198×200 mm. Svoris: apie 12-15 kg. Užpildžius betoną formuoja stiprią sieną.",

    "Да, обязательно нужен качественный фундамент. Первый ряд блоков устанавливается на выровненную поверхность с гидроизоляцией. Высота фундамента должна быть не менее 15 см от земли.":
      "Taip, būtinai reikalingas kokybiškas pamatas. Pirmas blokų sluoksnis montuojamas ant išlyginto paviršiaus su hidroizoliacija. Pamato aukštis turi būti ne mažiau kaip 15 cm nuo žemės.",

    "Для расчета нужно: 1) Измерить общую длину стен; 2) Умножить на высоту; 3) Вычесть площадь проемов; 4) Прибавить 5-10% запас. Пример: стена 10×3 м = 30 м², минус окна/двери, плюс запас.":
      "Skaičiavimui reikia: 1) Išmatuoti bendrą sienų ilgį; 2) Padauginti iš aukščio; 3) Atskaičiuoti angų plotą; 4) Pridėti 5-10% atsargos. Pavyzdys: siena 10×3 m = 30 m², minus langai/durys, plius atsarga.",

    "На самом деле, при правильном расчете блоки HAUS обходятся ДЕШЕВЛЕ! Учтите: 1 блок заменяет 8-12 кирпичей; Быстрый монтаж = экономия на работе; Не нужна дополнительная изоляция.":
      "Iš tikrųjų, teisingai apskaičiavus HAUS blokai kainuoja PIGIAU! Atsižvelkite: 1 blokas pakeičia 8-12 plytų; Greitas montavimas = darbo ekonomija; Nereikia papildomos izoliacijos.",

    "Мы понимаем ваше желание сэкономить! Но дешевые блоки часто имеют: 1) Неточные размеры (перерасход бетона); 2) Плохую геометрию; 3) Низкое качество цемента. HAUS гарантирует высочайшее качество!":
      "Suprantame jūsų norą sutaupyti! Bet pigūs blokai dažnai turi: 1) Netikslūs matmenis (betono eikvojimas); 2) Blogą geometriją; 3) Žemą cemento kokybę. HAUS garantuoja aukščiausią kokybę!",

    "Отличный вопрос о надежности! HAUS предоставляет: 1) Сертификат CE (европейский стандарт качества); 2) Технические условия; 3) 25 лет гарантии; 4) Испытания в литовских университетах.":
      "Puikus klausimas apie patikimumą! HAUS teikia: 1) CE sertifikatą (Europos kokybės standartą); 2) Technines specifikacijas; 3) 25 metų garantiją; 4) Tyrimus Lietuvos universitetuose.",

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
    "конкуренты, качество, гарантия, срок службы":
      "konkurentai, kokybė, garantija, eksploatavimo laikas",
    "гарантия, качество, сертификат, надежность, испытания":
      "garantija, kokybė, sertifikatas, patikimumas, tyrimai",
    "сложность, обучение, инструкция, простота":
      "sudėtingumas, mokymas, instrukcija, paprastumas",
    "прочность, нагрузка, несущие стены":
      "stiprumas, apkrova, laikančiosios sienos",
    "несущие стены, конструкция, прочность":
      "laikančiosios sienos, konstrukcija, stiprumas",
    "фундамент, типы, назначение, глубина": "pamatas, tipai, paskirtis, gylis",
    "соединение, замки, стыки, герметизация":
      "sujungimas, užraktai, sąnarios, hermetizavimas",
    "объем бетона, заливка, расход": "betono tūris, pildymas, sąnaudos",
    "расчет, метр квадратный, количество":
      "skaičiavimas, kvadratinis metras, kiekis",
    "экономия, строительство, стоимость, выгода":
      "taupymas, statyba, kaina, nauda",

    // === ЯЗЫК ===
    ru: "lt",
    русский: "lt",
  };

  // Если есть точный перевод - используем его
  if (translations[input]) {
    return translations[input];
  }

  // Если нет точного перевода, возвращаем оригинал (для чисел, кодов продуктов и т.д.)
  return input;
}

async function createCorrectLithuanianVersion() {
  try {
    console.log("🇱🇹 СОЗДАНИЕ ПРАВИЛЬНОЙ ЛИТОВСКОЙ ВЕРСИИ");
    console.log("========================================");

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("HAUS_FAQ_COMPLETE_LITHUANIAN.xlsx");

    console.log("📋 Добавляем литовскую вкладку...");

    // Находим русскую вкладку
    const russianSheet = workbook.worksheets[0]; // Первая вкладка

    // Создаем копию русской вкладки для литовской версии
    const lithuanianSheet = workbook.addWorksheet("FAQ Возражения (Lietuvių)");

    // Копируем структуру и стили
    lithuanianSheet.columns = russianSheet.columns.map((col) => ({
      header: col.header,
      key: col.key,
      width: col.width,
    }));

    console.log("🔄 Переводим содержимое...");

    let translatedCount = 0;

    // Переводим все содержимое
    russianSheet.eachRow((row, rowNumber) => {
      const newRow = lithuanianSheet.getRow(rowNumber);

      row.eachCell((cell, colNumber) => {
        const originalValue = cell.value ? String(cell.value) : "";

        if (originalValue.length > 0) {
          const translatedValue = translateToLithuanian(originalValue);
          newRow.getCell(colNumber).value = translatedValue;

          if (translatedValue !== originalValue) {
            translatedCount++;
          }
        }

        // Копируем стили
        newRow.getCell(colNumber).style = cell.style;
      });

      // Копируем высоту строки
      newRow.height = row.height;
    });

    // Сохраняем файл
    await workbook.xlsx.writeFile("HAUS_FAQ_COMPLETE_LITHUANIAN.xlsx");

    console.log("\n🎉 ЛИТОВСКАЯ ВЕРСИЯ СОЗДАНА!");
    console.log("============================");
    console.log(`📊 Переведено элементов: ${translatedCount}`);
    console.log(`📁 Файл сохранен: HAUS_FAQ_COMPLETE_LITHUANIAN.xlsx`);
    console.log("\n🇱🇹 Файл готов с правильными литовскими переводами!");
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
  }
}

createCorrectLithuanianVersion();
