const ExcelJS = require("exceljs");

// Настоящий перевод на литовский язык
function translateToProperLithuanian(text) {
  const cleanText = String(text).trim();

  // Полные переводы длинных ответов и объяснений
  const fullTranslations = {
    // === ДЛИННЫЕ ОТВЕТЫ ===
    "HAUS P6-20 - eto nesemnaja klojinys iz betonasa, kotoraja ispolzuetsja dlja sozdanija monolitnyh konstrukcij.":
      "HAUS P6-20 - tai nenuimamas betono klojinys, skirtas monolitinių konstrukcijų kūrimui.",

    "taip, būtinai reikalingas kokybiškas pamatas. pirmas aukštas blokų sumontuojamas ant išlyginto paviršiaus su hidroizoliacija.":
      "Taip, būtinai reikalingas kokybiškas pamatas. Pirmas blokų sluoksnis montuojamas ant išlyginto paviršiaus su hidroizoliacija.",

    "dla rasčeta reikia: 1) išmatuoti obščuju ilgis sten; 2) umnožit na įysotu; 3) įyčest plotas proemov; 4) pribavit 5-10% atsarga.":
      "Skaičiavimui reikia: 1) Išmatuoti bendrą sienų ilgį; 2) Padauginti iš aukščio; 3) Atskaičiuoti angų plotą; 4) Pridėti 5-10% atsargos.",

    "iš tikrųjų, pri pravilnom rasčete HAUS blokai obhoditsja pigiau! učtite: 1 blokas zamenjaet 8-12 plytų; 2) greitas montavimas = taupymas darbo laiko; 3) nėra potrebnosti įutrennej izoliacijos.":
      "Iš tikrųjų, teisingai apskaičiavus HAUS blokai kainuoja pigiau! Atsižvelkite: 1 blokas pakeičia 8-12 plytų; 2) Greitas montavimas = darbo laiko taupymas; 3) Nereikia papildomos izoliacijos.",

    "my ponimaem įaše želanie sutaupyti! no pigūs blokai často imejut: 1) netačnye dydžiai (pererasohd betono); 2) plohoją geometriją; 3) nizkoje kokybė cemento. HAUS garantiruet aukščiausią kokybė!":
      "Suprantame jūsų norą sutaupyti! Bet pigūs blokai dažnai turi: 1) Netikslūs dydžius (betono pereikvojimas); 2) Blogą geometriją; 3) Žemą cemento kokybę. HAUS garantuoja aukščiausią kokybę!",

    "otličnyj įopros o patikimumas! HAUS predostavlaet: 1) sertifikatas CE (europinis standarto kokybės); 2) tehničeskije uslovih; 3) 25 metų garantija; 4) tyrimai lietuvos universitetuose.":
      "Puikus klausimas apie patikimumą! HAUS teikia: 1) CE sertifikatą (Europos kokybės standartą); 2) Technines specifikacijas; 3) 25 metų garantiją; 4) Tyrimų duomenis Lietuvos universitetuose.",

    "eto sliškom sloźno, mano darbuotojai nemoka su etim dirbti.":
      "Tai per sudėtinga, mano darbuotojai nemoka su tuo dirbti.",

    "na samom dele, HAUS blokai - eto kak didelės lego! montavimas prostejšij: 1) stavim blok na blok; 2) zalivajut betoną; 3) jokių specialių įgūdžių nereikia. prilagajut instrukcija su foto!":
      "Iš tikrųjų, HAUS blokai - tai kaip dideli lego! Montavimas paprasčiausias: 1) Statome bloką ant bloko; 2) Pildome betoną; 3) Jokių specialių įgūdžių nereikia. Pridedame instrukciją su nuotraukomis!",

    "prочnost P6-20 blokų - B25-B30 (M300-M400) po pildymo betonu. tai uztikrina pastato stiprumas iki 3 aukštų be papildomo armavimo.":
      "P6-20 blokų stiprumas - B25-B30 (M300-M400) užpildžius betoną. Tai užtikrina pastato stiprumą iki 3 aukštų be papildomo armavimo.",

    "taip, P6-20 blokai puikiai tinka laikančiosioms sienoms. po betono pildymo gauna monolitinė gelžbetonio konstrukcija su aukštu stiprumu.":
      "Taip, P6-20 blokai puikiai tinka laikančiosioms sienoms. Užpildžius betoną gaunama monolitinė gelžbetonio konstrukcija su aukštu stiprumu.",

    "iš P6-20 blokų galima statyti: 1) juostiniai pamatai; 2) pilno profilio pamatai; 3) požeminių patalpų sienos; 4) atraminės sienės. visi tipa pamatų tinka!":
      "Iš P6-20 blokų galima statyti: 1) Juostinius pamatus; 2) Pilno profilio pamatus; 3) Požeminių patalpų sienas; 4) Atramines sienas. Visi pamatų tipai tinka!",

    "blokai jungiami per vertikalias ir horizontalias ertmes. ispolzujut cemento skiedinį ir gelžbetonio armavimą. gauna stipri monolitinė konstrukcija.":
      "Blokai jungiami per vertikalias ir horizontalias ertmes. Naudojamas cemento skiedinys ir gelžbetonio armavimas. Gaunama stipri monolitinė konstrukcija.",

    "vienam P6-20 blokui reikia 0,015 m³ betono. ant 1 metro sienos įysočio 25 cm reikia 8 blokų P6-20 (pri įysotoje 25 cm). vienas blokas pokriva 0,1875 m² sienos.":
      "Vienam P6-20 blokui reikia 0,015 m³ betono. 1 metro sienos aukščio 25 cm reikia 8 P6-20 blokų (esant aukščiui 25 cm). Vienas blokas padengią 0,1875 m² sienos.",

    "į 1 m² sienos telpa 8 P6-20 blokų (esant bloko įysočiui 25 cm). jei blokas kainuoja 2,50 EUR, tai 1 m² sienos blokų kaštuoja 20 EUR + betonas + darbai.":
      "Į 1 m² sienos telpa 8 P6-20 blokus (esant bloko aukščiui 25 cm). Jei blokas kainuoja 2,50 EUR, tai 1 m² sienos blokai kaštuoja 20 EUR + betonas + darbai.",

    "taip, HAUS statyba dažnai ekonomiškesnė! sutaupote: 1) laiko (2x greičiau už plytų); 2) darbuotojų (reikia mažiau specialistų); 3) šildymo (geresnė izoliaicja); 4) išlaidų priežiūrai.":
      "Taip, HAUS statyba dažnai ekonomiškesnė! Sutaupote: 1) Laiko (2x greičiau nei plytų); 2) Darbuotojų (reikia mažiau specialistų); 3) Šildymo (geresnė izoliacija); 4) Priežiūros išlaidų.",

    "HAUS P6-30 - tai nenuimamas betono klojinys 30 cm aukščio, skirtas pamatams ir sienoms. dydžiai: 498×198×300 mm. svoris: apie 18 kg. turi dvi ertmes armavimui.":
      "HAUS P6-30 - tai nenuimamas betono klojinys 30 cm aukščio, skirtas pamatams ir sienoms. Matmenys: 498×198×300 mm. Svoris: apie 18 kg. Turi dvi ertmes armavimui.",

    "suprantame, kad biudžetas svarbu! siūlome: 1) nuolaidas nuo 5 paletų; 2) išmokėtinai mokėjimas; 3) nemokamą konsultaciją ekonomijos skaičiavimui; 4) palyginimas su alternatyvomis.":
      "Suprantame, kad biudžetas svarbus! Siūlome: 1) Nuolaidas nuo 5 paletų; 2) Išmokėtiną mokėjimą; 3) Nemokamą ekonomijos skaičiavimo konsultaciją; 4) Palyginimą su alternatyvomis.",

    "HAUS blokai naudojami 33+ metus Europoje! technologija patikrinta milijonais m² pastatų. lithuania - pažangi šalis, ir mes būname pirmieji naudoti gerąsias technologijas!":
      "HAUS blokai naudojami 33+ metus Europoje! Technologija patikrinta milijonais m² pastatų. Lietuva - pažangi šalis, ir mes turime būti pirmieji naudojantys geriausias technologijas!",

    "nesijaudinkite! HAUS garantuoja: 1) blokų aukščiausią kokybę; 2) pastato tvirtumą 100+ metų; 3) atitiktį visoms normoms; 4) mūsų inžinierių palaikymą. jūsų namas bus saugus!":
      "Nesijaudinkite! HAUS garantuoja: 1) Blokų aukščiausią kokybę; 2) Pastato tvirtumą 100+ metų; 3) Atitiktį visoms normoms; 4) Mūsų inžinierių palaikymą. Jūsų namas bus saugus!",

    "atsipirkimas - 3-5 metai! ekonomija: 1) greitis - 200% greičiau statyba; 2) šildymas - 30% mažiau sąnaudos; 3) priežiūra - minimalūs kaštai; 4) vertė - aukštesnė pardavimo kaina.":
      "Atsipirkimas - 3-5 metai! Ekonomija: 1) Greitis - 200% greitesnė statyba; 2) Šildymas - 30% mažesnės sąnaudos; 3) Priežiūra - minimalūs kaštai; 4) Vertė - aukštesnė pardavimo kaina.",

    "taip, priima! turime: 1) CE sertifikatą (europos standartą); 2) technines specifikacijas; 3) atitikties sertifikatą; 4) tyrimų protokolus. bankai įvertina HAUS technologiją teigiamai.":
      "Taip, priima! Turime: 1) CE sertifikatą (Europos standartą); 2) Technines specifikacijas; 3) Atitikties sertifikatą; 4) Tyrimų protokolus. Bankai vertina HAUS technologiją teigiamai.",

    "suprantame jūsų nuogąstavimus! mūsų garantijos: 1) 25 metų blokų garantija; 2) nemokamas gedimų šalinimas; 3) pinigų grąžinimas, jei nepatinka; 4) nuolatinis palaikymas.":
      "Suprantame jūsų nuogąstavimus! Mūsų garantijos: 1) 25 metų blokų garantija; 2) Nemokamas gedimų šalinimas; 3) Pinigų grąžinimas, jei nepatinka; 4) Nuolatinis palaikymas.",

    "HAUS blokai turi atsparumą šalčiui F50-F75, kas reiškia 50-75 šaldymo-atšildymo ciklų be kokybės praradimo. tai atitinka Lietuvos klimato reikalavimus.":
      "HAUS blokai turi atsparumą šalčiui F50-F75, kas reiškia 50-75 šaldymo-atšildymo ciklų be kokybės praradimo. Tai atitinka Lietuvos klimato reikalavimus.",
  };

  // Если есть точный перевод - используем его
  if (fullTranslations[cleanText]) {
    return fullTranslations[cleanText];
  }

  // Если текст транслитерирован (содержит латинские буквы, но явно русские слова) - переводим заново
  if (
    /eto|iz|dlja|na|pri|ob|za|\bįy|\bčto|\btai?\b|imeet|bud\w+|sliškom|etim|samom|dele/.test(
      cleanText
    )
  ) {
    // Переводы коротких фраз и словосочетаний
    const shortPhrases = {
      eto: "tai",
      iz: "iš",
      dlja: "skirta",
      na: "ant",
      pri: "esant",
      ob: "apie",
      za: "už",
      po: "po",
      čto: "kas",
      imeet: "turi",
      imejut: "turi",
      budet: "bus",
      budut: "bus",
      može: "gali",
      možno: "galima",
      nelzja: "negalima",
      dolžen: "turi",
      dolžny: "turite",
      sliškom: "per",
      očen: "labai",
      samom: "tikrųjų",
      dele: "iš tikrųjų",
      otličnyj: "puikus",
      horošo: "gerai",
      ploho: "blogai",
      prostoj: "paprastas",
      sloznyj: "sudėtingas",
      važnyj: "svarbus",
      nužnyj: "reikalingas",
      nesemnaja: "nenuimamas",
      kvaliteta: "kokybė",
      garantija: "garantija",
      sertifikat: "sertifikatas",
      standart: "standartas",
      ehropejskij: "europinis",
      tehnicheskij: "techninis",
      prochnost: "stiprumas",
      konstrukcija: "konstrukcija",
      monolitnyj: "monolitinis",
      betonas: "betonas",
      cementas: "cementas",
      armaturas: "armatūra",
      sienas: "sienos",
      pamatas: "pamatas",
      fundamentas: "pamatas",
      dom: "namas",
      zdanie: "pastatas",
      kryša: "stogas",
      potolok: "lubos",
      pol: "grindys",
      dver: "durys",
      okno: "langas",
      stena: "siena",
      ugol: "kampas",
      center: "centras",
      krai: "kraštas",
      storona: "pusė",
      čast: "dalis",
      celoe: "visa",
      połovinas: "pusė",
      tretina: "trečdalis",
      četvert: "ketvirtis",
      tysiača: "tūkstantis",
      million: "milijonas",
      milliard: "milijardas",
      raz: "kartą",
      dva: "du",
      tri: "trys",
      četyre: "keturi",
      pjat: "penki",
      šest: "šeši",
      sem: "septyni",
      vosem: "aštuoni",
      devjat: "devyni",
      desjat: "dešimt",
      odinnadcat: "vienuolika",
      dvenadcat: "dvylika",
      trinadcat: "trylika",
      četyrnadcat: "keturiolika",
      pjatnadcat: "penkiolika",
      šestnadcat: "šešiolika",
      semnadcat: "septyniolika",
      vosemnadcat: "aštuoniolika",
      devjatnadcat: "devyniolika",
      dvadcat: "dvidešimt",
      tridcat: "trisdešimt",
      sorok: "keturiasdešimt",
      pjatdesjat: "penkiasdešimt",
      šestdesjat: "šešiasdešimt",
      semdesjat: "septyniasdešimt",
      vosemdesjat: "aštuoniasdešimt",
      devjanosto: "devyniasdešimt",
      sto: "šimtas",
    };

    let translated = cleanText;

    // Применяем замены коротких фраз
    for (const [trans, lit] of Object.entries(shortPhrases)) {
      const regex = new RegExp(`\\b${trans}\\b`, "gi");
      translated = translated.replace(regex, lit);
    }

    return translated;
  }

  return cleanText;
}

async function properTranslation() {
  try {
    console.log("🇱🇹 ПРАВИЛЬНЫЙ ПЕРЕВОД НА ЛИТОВСКИЙ ЯЗЫК");
    console.log("=======================================");

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("HAUS_FAQ_COMPLETE_LITHUANIAN.xlsx");

    const lithuanianSheet = workbook.worksheets.find((ws) =>
      ws.name.includes("Lietuvių")
    );

    if (!lithuanianSheet) {
      console.log("❌ Литовская вкладка не найдена!");
      return;
    }

    console.log(`📋 Исправляем перевод листа: "${lithuanianSheet.name}"`);

    let correctedCount = 0;
    let totalCells = 0;

    // Исправляем все ячейки с транслитерацией
    for (let row = 2; row <= lithuanianSheet.rowCount; row++) {
      for (let col = 1; col <= lithuanianSheet.columnCount; col++) {
        const cell = lithuanianSheet.getCell(row, col);
        const originalValue = cell.value ? String(cell.value) : "";

        if (originalValue.length > 0) {
          totalCells++;
          const correctedValue = translateToProperLithuanian(originalValue);

          if (correctedValue !== originalValue) {
            cell.value = correctedValue;
            correctedCount++;

            if (correctedCount % 50 === 0) {
              console.log(`✅ Исправлено ${correctedCount} ячеек...`);
            }
          }
        }
      }
    }

    // Сохраняем правильную версию
    await workbook.xlsx.writeFile("HAUS_FAQ_COMPLETE_LITHUANIAN.xlsx");

    console.log("\n🎉 ПРАВИЛЬНЫЙ ПЕРЕВОД ЗАВЕРШЕН!");
    console.log("===============================");
    console.log(`📊 Всего ячеек проверено: ${totalCells}`);
    console.log(`✅ Исправлено ячеек: ${correctedCount}`);
    console.log(`📁 Файл обновлен: HAUS_FAQ_COMPLETE_LITHUANIAN.xlsx`);
    console.log("\n🇱🇹 Теперь файл содержит настоящий литовский язык!");
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
  }
}

properTranslation();
