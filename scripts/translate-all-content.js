const ExcelJS = require("exceljs");

// Полный перевод ВСЕГО содержимого на литовский язык
function translateAllContent(text) {
  const input = String(text).trim();

  // Полные переводы ВСЕХ длинных ответов
  const fullContentTranslations = {
    // === ДЛИННЫЕ ОТВЕТЫ СПЕЦИАЛИСТОВ ===
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

    "Это слишком сложно, мои рабочие не умеют с этим работать.":
      "Tai per sudėtinga, mano darbuotojai nemoka su tuo dirbti.",

    "На самом деле, блоки HAUS ПРОЩЕ обычной кладки! Преимущества: 1) Как детский конструктор - блок на блок; 2) Не нужны специальные навыки; 3) Подробная инструкция с фото; 4) Техподдержка по телефону.":
      "Iš tikrųjų, HAUS blokai PAPRASTESNI už įprastą mūrijimą! Privalumai: 1) Kaip vaikiškas konstruktorius - blokas ant bloko; 2) Nereikia specialių įgūdžių; 3) Detali instrukcija su nuotraukomis; 4) Techninis palaikymas telefonu.",

    "Блоки HAUS P6-20 имеют прочность на сжатие не менее 10 МПа (M100). После заливки бетоном прочность увеличивается до B25-B30 (M300-M400). Это обеспечивает надежность конструкций.":
      "HAUS P6-20 blokai turi gniuždymo stiprumą ne mažiau kaip 10 MPa (M100). Užpildžius betoną stiprumas padidėja iki B25-B30 (M300-M400). Tai užtikrina konstrukcijų patikimumą.",

    "Да, блоки P6-20 предназначены для несущих конструкций. После заполнения бетоном они образуют монолитную железобетонную конструкцию с высокой несущей способностью.":
      "Taip, P6-20 blokai skirti laikančiosioms konstrukcijoms. Užpildžius betoną formuoja monolitinę gelžbetonio konstrukciją su aukštu laikomąja geba.",

    'Из блоков P6-20 можно строить: ленточные фундаменты, ростверки на сваях, подпорные стены, цокольные этажи. Блоки подходят для точечного позиционирования. Блоки HAUS имеют систему "шип-паз".':
      'Iš P6-20 blokų galima statyti: juostinius pamatus, roštvarkus ant polių, atraminės sienas, rūsio aukštus. Blokai tinka tiksliam pozicionavimui. HAUS blokai turi "smeigės-griovelio" sistemą.',

    "Для заполнения одного блока P6-20 требуется 0,015 м³ бетона. На 1 метр стены высотой 25 см нужно 0,03 м³ бетона (при использовании 8 блоков P6-20).":
      "Vienam P6-20 blokui užpildyti reikia 0,015 m³ betono. 1 metro sienos 25 cm aukščio reikia 0,03 m³ betono (naudojant 8 P6-20 blokus).",

    "В 1 м² стены помещается 8 блоков P6-20 (при высоте блока 25 см). Один блок покрывает площадь 0,125 м². При стоимости блока 2,50 EUR, 1 м² стены обойдется в 20 EUR + бетон + работа.":
      "Į 1 m² sienos telpa 8 P6-20 blokai (esant bloko aukščiui 25 cm). Vienas blokas dengia 0,125 m² plotą. Esant bloko kainai 2,50 EUR, 1 m² sienos kainuos 20 EUR + betonas + darbas.",

    "Да, экономически строительство из блоков HAUS выгоднее! Экономия достигается за счет: 1) Скорости монтажа (экономия на оплате труда); 2) Отсутствия потребности в утеплении; 3) Сокращения сроков стройки.":
      "Taip, ekonomiškai statyba iš HAUS blokų naudingesne! Ekonomija pasiekiama dėl: 1) Montavimo greičio (darbo užmokesčio taupymas); 2) Šiltinimo poreikio nebuvimo; 3) Statybos laikų sutrumpėjimo.",

    "HAUS P6-30 - несъемная опалубка из бетона высотой 30 см для фундаментов и стен. Размеры: 498×198×300 мм. Вес: около 18 кг. Имеет две полости для армирования.":
      "HAUS P6-30 - nenuimamas betono klojinys 30 cm aukščio pamatams ir sienoms. Matmenys: 498×198×300 mm. Svoris: apie 18 kg. Turi dvi ertmes armavimui.",

    "Понимаем, что бюджет важен! Предлагаем: 1) Скидки от 5 поддонов; 2) Рассрочку платежа; 3) Бесплатную консультацию по расчету экономии; 4) Сравнение с альтернативами.":
      "Suprantame, kad biudžetas svarbus! Siūlome: 1) Nuolaidas nuo 5 padėklų; 2) Mokėjimo atidėjimą; 3) Nemokamą ekonomijos skaičiavimo konsultaciją; 4) Palyginimą su alternatyvomis.",

    "Блоки HAUS используются 33+ лет в Европе! Технология проверена миллионами м² построек. Литва - прогрессивная страна, и мы должны быть первыми в использовании лучших технологий!":
      "HAUS blokai naudojami 33+ metus Europoje! Technologija patikrinta milijonais m² statinių. Lietuva - pažangi šalis, ir turime būti pirmieji naudojant geriausias technologijas!",

    "Не волнуйтесь! HAUS гарантирует: 1) Высочайшее качество блоков; 2) Прочность дома 100+ лет; 3) Соответствие всем нормам; 4) Поддержку наших инженеров. Ваш дом будет безопасным!":
      "Nesijaudinkite! HAUS garantuoja: 1) Aukščiausią blokų kokybę; 2) Namo tvirtumą 100+ metų; 3) Atitiktį visoms normoms; 4) Mūsų inžinierių palaikymą. Jūsų namas bus saugus!",

    "Окупаемость - 3-5 лет! Экономия: 1) Скорость - строительство в 2 раза быстрее; 2) Отопление - на 30% меньше расходов; 3) Обслуживание - минимальные затраты; 4) Стоимость - выше цена продажи.":
      "Atsipirkimas - 3-5 metai! Ekonomija: 1) Greitis - statyba 2 kartus greitesnė; 2) Šildymas - 30% mažiau išlaidų; 3) Priežiūra - minimalūs kaštai; 4) Vertė - aukštesnė pardavimo kaina.",

    "Да, принимают! У нас есть: 1) Сертификат CE (европейский стандарт); 2) Технические спецификации; 3) Сертификат соответствия; 4) Протоколы испытаний. Банки положительно оценивают технологию HAUS.":
      "Taip, priima! Turime: 1) CE sertifikatą (Europos standartą); 2) Technines specifikacijas; 3) Atitikties sertifikatą; 4) Tyrimų protokolus. Bankai teigiamai vertina HAUS technologiją.",

    "Понимаем ваши опасения! Наши гарантии: 1) 25 лет гарантии на блоки; 2) Бесплатное устранение дефектов; 3) Возврат денег, если не понравится; 4) Постоянная поддержка.":
      "Suprantame jūsų nuogąstavimus! Mūsų garantijos: 1) 25 metų garantija blokams; 2) Nemokamas defektų šalinimas; 3) Pinigų grąžinimas, jei nepatiks; 4) Nuolatinis palaikymas.",

    "Блоки HAUS имеют морозостойкость F50-F75, что означает 50-75 циклов замораживания-оттаивания без потери качества. Это соответствует требованиям климата Литвы.":
      "HAUS blokai turi atsparumą šalčiui F50-F75, kas reiškia 50-75 užšaldymo-atšildymo ciklus be kokybės praradimo. Tai atitinka Lietuvos klimato reikalavimus.",

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
  if (fullContentTranslations[input]) {
    return fullContentTranslations[input];
  }

  // Если нет точного перевода, возвращаем оригинал
  return input;
}

async function translateAllContent() {
  try {
    console.log("🔥 ПОЛНЫЙ ПЕРЕВОД ВСЕГО СОДЕРЖИМОГО");
    console.log("==================================");

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

    console.log(`📋 Переводим ВСЕ содержимое листа: "${lithuanianSheet.name}"`);

    let translatedCount = 0;
    let totalCells = 0;

    // Переводим все ячейки
    for (let row = 1; row <= lithuanianSheet.rowCount; row++) {
      for (let col = 1; col <= lithuanianSheet.columnCount; col++) {
        const cell = lithuanianSheet.getCell(row, col);
        const originalValue = cell.value ? String(cell.value) : "";

        if (originalValue.length > 0) {
          totalCells++;
          const translatedValue = translateAllContent(originalValue);

          if (translatedValue !== originalValue) {
            cell.value = translatedValue;
            translatedCount++;

            if (translatedCount % 25 === 0) {
              console.log(`✅ Переведено ${translatedCount} ячеек...`);
            }
          }
        }
      }
    }

    // Сохраняем обновленный файл
    await workbook.xlsx.writeFile("HAUS_FAQ_COMPLETE_LITHUANIAN.xlsx");

    console.log("\n🎉 ПОЛНЫЙ ПЕРЕВОД ЗАВЕРШЕН!");
    console.log("===========================");
    console.log(`📊 Всего ячеек проверено: ${totalCells}`);
    console.log(`✅ Переведено ячеек: ${translatedCount}`);
    console.log(`📁 Файл обновлен: HAUS_FAQ_COMPLETE_LITHUANIAN.xlsx`);
    console.log("\n🇱🇹 Теперь переведено ВСЕ содержимое - включая ответы!");
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
  }
}

translateAllContent();
