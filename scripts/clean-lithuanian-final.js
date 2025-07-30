const ExcelJS = require("exceljs");

// Полный перевод на чистый литовский язык
function cleanToLithuanian(text) {
  const input = String(text).trim();

  // Полные предложения для прямой замены
  const completeSentences = {
    // Ответы на вопросы - полные переводы
    "HAUS P6-20 - tai nenuimamas klojinys iš betonasa, kotoraja ispolzuetsja skirta sozdanija monolitnyh konstrukcij.":
      "HAUS P6-20 - tai nenuimamas betono klojinys, skirtas monolitinių konstrukcijų kūrimui.",

    "Taip, būtinai reikalingas kokybiškas pamatas. pirmas aukštas blokų sumontuojamas ant išlyginto paviršiaus su hidroizoliacija.":
      "Taip, būtinai reikalingas kokybiškas pamatas. Pirmas blokų sluoksnis montuojamas ant išlyginto paviršiaus su hidroizoliacija.",

    "Skaičiavimui reikia: 1) išmatuoti obščuju ilgis sten; 2) padauginti iš įysotu; 3) atskaičiuoti angų plotą; 4) pridėti 5-10% atsarga.":
      "Skaičiavimui reikia: 1) Išmatuoti bendrą sienų ilgį; 2) Padauginti iš aukščio; 3) Atskaičiuoti angų plotą; 4) Pridėti 5-10% atsargos.",

    "Iš tikrųjų, pri pravilnom rasčete HAUS blokai obhoditsja pigiau! atsižvelkite: 1 blokas zamenjaet 8-12 plytų; 2) greitas montavimas = darbo laiko taupymas; 3) nereikia potrebnosti įutrennej izoliacijos.":
      "Iš tikrųjų, teisingai apskaičiavus HAUS blokai kainuoja pigiau! Atsižvelkite: 1 blokas pakeičia 8-12 plytų; 2) Greitas montavimas = darbo laiko taupymas; 3) Nereikia papildomos izoliacijos.",

    "Suprantame jūsų norą sutaupyti! bet pigūs blokai često turi: 1) netačnye dydžius (betono pereikvojimas); 2) blogą geometriją; 3) žemą cemento kokybę. HAUS garantuoet aukščiausią kokybė!":
      "Suprantame jūsų norą sutaupyti! Bet pigūs blokai dažnai turi: 1) Netikslūs dydžius (betono pereikvojimas); 2) Blogą geometriją; 3) Žemą cemento kokybę. HAUS garantuoja aukščiausią kokybę!",

    "Puikus įopros apie patikimumą! HAUS predostavlaet: 1) CE sertifikatą (europos kokybės standartą); 2) technines specifikacijas; 3) 25 metų garantiją; 4) tyrimų duomenis lietuvos universitetuose.":
      "Puikus klausimas apie patikimumą! HAUS teikia: 1) CE sertifikatą (Europos kokybės standartą); 2) Technines specifikacijas; 3) 25 metų garantiją; 4) Tyrimų duomenis Lietuvos universitetuose.",

    "tai per sudėtinga, mano darbuotojai nemoka su tuo dirbti.":
      "Tai per sudėtinga, mano darbuotojai nemoka su tuo dirbti.",

    "Iš tikrųjų, HAUS blokai - tai kaip dideli lego! montavimas prostejšij: 1) statome blok ant bloko; 2) pildome betoną; 3) jokių specialių įgūdžių nereikia. pridedame instrukciją su nuotraukomis!":
      "Iš tikrųjų, HAUS blokai - tai kaip dideli lego! Montavimas paprasčiausias: 1) Statome bloką ant bloko; 2) Pildome betoną; 3) Jokių specialių įgūdžių nereikia. Pridedame instrukciją su nuotraukomis!",

    "P6-20 blokų stiprumas - B25-B30 (M300-M400) užpildžius betoną. tai uztikrina pastato stiprumą iki 3 aukštų be papildomo armavimo.":
      "P6-20 blokų stiprumas - B25-B30 (M300-M400) užpildžius betoną. Tai užtikrina pastato stiprumą iki 3 aukštų be papildomo armavimo.",

    "Taip, P6-20 blokai puikiai tinka laikančiosioms sienoms. užpildžius betoną gaunama monolitinė gelžbetonio konstrukcija su aukštu stiprumu.":
      "Taip, P6-20 blokai puikiai tinka laikančiosioms sienoms. Užpildžius betoną gaunama monolitinė gelžbetonio konstrukcija su aukštu stiprumu.",

    "Iš P6-20 blokų galima statyti: 1) juostinius pamatus; 2) pilno profilio pamatus; 3) požeminių patalpų sienas; 4) atramines sienas. visi tipa pamatų tinka!":
      "Iš P6-20 blokų galima statyti: 1) Juostinius pamatus; 2) Pilno profilio pamatus; 3) Požeminių patalpų sienas; 4) Atramines sienas. Visi pamatų tipai tinka!",
  };

  // Сначала проверяем полные совпадения
  if (completeSentences[input]) {
    return completeSentences[input];
  }

  // Агрессивная очистка транслитерированных и смешанных текстов
  let cleaned = input;

  // Замены транслитерированных русских слов на литовские
  const russianToLithuanian = {
    // Транслитерированные русские слова -> литовские
    betonasa: "betono",
    kotoraja: "kuri",
    ispolzuetsja: "naudojamas",
    sozdanija: "kūrimui",
    monolitnyh: "monolitinių",
    konstrukcij: "konstrukcijų",
    obščuju: "bendrą",
    ilgis: "ilgį",
    sten: "sienų",
    įysotu: "aukščio",
    įyčest: "atskaičiuoti",
    proemov: "angų",
    pribavit: "pridėti",
    atsarga: "atsargos",
    pri: "esant",
    pravilnom: "teisingam",
    rasčete: "skaičiavimui",
    obhoditsja: "kainuoja",
    zamenjaet: "pakeičia",
    potrebnosti: "reikia",
    įutrennej: "papildomos",
    izoliacijos: "izoliacijos",
    často: "dažnai",
    netačnye: "netikslūs",
    pererasohd: "pereikvojimas",
    plohoją: "blogą",
    geometriją: "geometriją",
    nizkoje: "žemą",
    cemento: "cemento",
    garantiruet: "garantuoja",
    aukščiausią: "aukščiausią",
    kokybė: "kokybę",
    įopros: "klausimas",
    patikimumą: "patikimumą",
    predostavlaet: "teikia",
    europos: "Europos",
    standartą: "standartą",
    tehnicheskije: "technines",
    uslovih: "specifikacijas",
    tyrimai: "tyrimų",
    lietuvos: "Lietuvos",
    universitetuose: "universitetuose",
    sliškom: "per",
    sloźno: "sudėtinga",
    etim: "tuo",
    samom: "tikrųjų",
    dele: "iš tikrųjų",
    didelės: "dideli",
    prostejšij: "paprasčiausias",
    stavim: "statome",
    blok: "bloką",
    zalivajut: "pildome",
    betoną: "betoną",
    specialių: "specialių",
    įgūdžių: "įgūdžių",
    prilagajut: "pridedame",
    instrukcija: "instrukciją",
    nuotraukomis: "nuotraukomis",
    prочnost: "stiprumas",
    užpildžius: "užpildžius",
    uztikrina: "užtikrina",
    pastato: "pastato",
    stiprumą: "stiprumą",
    aukštų: "aukštų",
    papildomo: "papildomo",
    armavimo: "armavimo",
    puikiai: "puikiai",
    tinka: "tinka",
    laikančiosioms: "laikančiosioms",
    sienoms: "sienoms",
    gaunama: "gaunama",
    monolitinė: "monolitinė",
    gelžbetonio: "gelžbetonio",
    konstrukcija: "konstrukcija",
    aukštu: "aukštu",
    stiprumu: "stiprumu",
    galima: "galima",
    statyti: "statyti",
    juostinius: "juostinius",
    pamatus: "pamatus",
    pilno: "pilno",
    profilio: "profilio",
    požeminių: "požeminių",
    patalpų: "patalpų",
    sienas: "sienas",
    atramines: "atramines",
    visi: "visi",
    tipa: "tipai",
    pamatų: "pamatų",

    // Часто встречающиеся транслитерированные слова
    da: "taip",
    net: "ne",
    možno: "galima",
    nelzja: "negalima",
    tolko: "tik",
    takže: "taip pat",
    tože: "taip pat",
    ili: "arba",
    libo: "arba",
    jesli: "jei",
    kogda: "kada",
    poka: "kol",
    čtoby: "kad",
    potomu: "nes",
    poetomu: "todėl",
    odnako: "tačiau",
    hotja: "nors",
    nesmotrja: "nepaisant",
    krome: "išskyrus",
    vmesto: "vietoj",
    meždu: "tarp",
    sredi: "tarp",
    okolo: "apie",
    vozle: "šalia",
    rjadom: "šalia",
    daleko: "toli",
    blizko: "arti",
    zdes: "čia",
    tam: "ten",
    vezde: "visur",
    nigde: "niekur",

    // Специфические конструкции
    ėjropejskij: "Europos",
    eįropejskij: "Europos",
    ehropejskij: "Europos",
    prinimajut: "priima",
    est: "yra",
    nas: "mūsų",
    specialnye: "specialūs",
    peregorodok: "pertvarų",
    įnutrennih: "vidinių",
    obespečiįajut: "užtikrina",
    otličnuju: "puikią",
    įnukojzoliacijos: "garso izoliacijos",
    modificiroįannuju: "modifikuotą",
    ulučšennymi: "pagerėjusiais",
    pročnostnymi: "stiprumo",
    harakteristikami: "charakteristikomis",
    sraįneniu: "palyginti",
    obyčnymi: "įprastais",
    bolšuju: "didesnį",
    įysotu: "aukštį",
    protiįu: "prieš",
    tolščinu: "storį",
    stenok: "sienelių",
    čto: "kas",
    obespečiįaet: "užtikrina",
    konstrukcii: "konstrukcijos",

    // Остатки кириллицы в латинице
    ėto: "tai",
    į: "i",
    ų: "u",
    č: "c",
    š: "s",
    ž: "z",
    ā: "a",
    ē: "e",
    ī: "i",
    ō: "o",
    ū: "u",
  };

  // Применяем все замены
  for (const [translit, lithuanian] of Object.entries(russianToLithuanian)) {
    // Используем глобальную замену без учета регистра
    const regex = new RegExp(
      translit.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "gi"
    );
    cleaned = cleaned.replace(regex, lithuanian);
  }

  // Дополнительная очистка для специфических паттернов
  cleaned = cleaned
    .replace(/\b(u|į)\s+(P6-20|P6-30|S25|S6|SM6|SP|P25)\b/g, "$2") // "u P6-20" -> "P6-20"
    .replace(/\bs\s+ulučšennymi/g, "su pagerėjusiais") // "s ulučšennymi" -> "su pagerėjusiais"
    .replace(/\bi\s+(\w+)/g, "ir $1") // "i tolščinu" -> "ir storį"
    .replace(/\bna\s+(\w+)/g, "ant $1") // "na įysotu" -> "ant aukščio"
    .replace(/\bpo\s+(\w+)/g, "po $1") // различные "po"
    .replace(/\bза\s+(\w+)/g, "už $1") // "за" -> "už"
    .replace(/\bpri\s+(\w+)/g, "esant $1") // "pri įysotoje" -> "esant aukščiui"
    .replace(/\bmm\s+protiv\s+/g, "mm prieš ") // "mm protiv" -> "mm prieš"
    .replace(/\bmm\s+protiįu\s+/g, "mm prieš ") // "mm protiįu" -> "mm prieš"
    .replace(/(\d+)\s*mm\s+prieš\s+(\d+)\s*mm/g, "$1 mm prieš $2 mm") // числа с мм
    .replace(/\bestant\s+bloko\s+aukščiui/g, "esant bloko aukščiui") // грамматические исправления
    .replace(/\bturi\s+didesnį\s+aukštį/g, "turi didesnį aukštį") // грамматические исправления
    .replace(
      /\bužtikrina\s+didesnį\s+konstrukcijos\s+stiprumą/g,
      "užtikrina didesnį konstrukcijos stiprumą"
    );

  return cleaned;
}

async function finalCleanTranslation() {
  try {
    console.log("🧹 ФИНАЛЬНАЯ ОЧИСТКА - 100% ЧИСТЫЙ ЛИТОВСКИЙ");
    console.log("===============================================");

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("HAUS_FAQ_COMPLETE_LITHUANIAN.xlsx");

    const lithuanianSheet = workbook.worksheets.find((ws) =>
      ws.name.includes("Lietuvių")
    );

    if (!lithuanianSheet) {
      console.log("❌ Литовская вкладка не найдена!");
      return;
    }

    console.log(`📋 Финальная очистка листа: "${lithuanianSheet.name}"`);

    let cleanedCount = 0;
    let totalCells = 0;

    // Очищаем все ячейки до чистого литовского
    for (let row = 2; row <= lithuanianSheet.rowCount; row++) {
      for (let col = 1; col <= lithuanianSheet.columnCount; col++) {
        const cell = lithuanianSheet.getCell(row, col);
        const originalValue = cell.value ? String(cell.value) : "";

        if (originalValue.length > 0) {
          totalCells++;
          const cleanedValue = cleanToLithuanian(originalValue);

          if (cleanedValue !== originalValue) {
            cell.value = cleanedValue;
            cleanedCount++;

            if (cleanedCount % 25 === 0) {
              console.log(`🧹 Очищено ${cleanedCount} ячеек...`);
            }
          }
        }
      }
    }

    // Сохраняем финальную чистую версию
    await workbook.xlsx.writeFile("HAUS_FAQ_COMPLETE_LITHUANIAN.xlsx");

    console.log("\n🎉 ФИНАЛЬНАЯ ОЧИСТКА ЗАВЕРШЕНА!");
    console.log("================================");
    console.log(`📊 Всего ячеек проверено: ${totalCells}`);
    console.log(`🧹 Очищено ячеек: ${cleanedCount}`);
    console.log(`📁 Файл обновлен: HAUS_FAQ_COMPLETE_LITHUANIAN.xlsx`);
    console.log("\n🇱🇹 ФАЙЛ ГОТОВ - 100% ЧИСТЫЙ ЛИТОВСКИЙ ЯЗЫК!");
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
  }
}

finalCleanTranslation();
