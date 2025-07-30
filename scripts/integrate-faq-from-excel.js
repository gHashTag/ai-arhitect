const ExcelJS = require("exceljs");
const fs = require("fs");

// Читаем данные из переведенного Excel файла и создаем FAQ для бота
async function integrateFAQsFromExcel() {
  try {
    console.log("📋 ИНТЕГРАЦИЯ FAQ ИЗ EXCEL В БОТА");
    console.log("==================================");

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("HAUS_FAQ_COMPLETE_LITHUANIAN.xlsx");

    // Находим русскую и литовскую вкладки
    const russianSheet = workbook.worksheets.find(
      (ws) => ws.name.includes("Возражения") && !ws.name.includes("Lietuvių")
    );
    const lithuanianSheet = workbook.worksheets.find((ws) =>
      ws.name.includes("Lietuvių")
    );

    if (!russianSheet || !lithuanianSheet) {
      console.log("❌ Не найдены необходимые вкладки в Excel файле");
      return;
    }

    console.log(`✅ Русская вкладка: "${russianSheet.name}"`);
    console.log(`✅ Литовская вкладка: "${lithuanianSheet.name}"`);

    // Структура для сбора FAQ
    const faqs = [];
    const categories = new Set();

    // Читаем данные из русской вкладки
    console.log("\n📖 Читаем русские FAQ...");
    const russianFAQs = readFAQsFromSheet(russianSheet, "ru");

    console.log("\n📖 Читаем литовские FAQ...");
    const lithuanianFAQs = readFAQsFromSheet(lithuanianSheet, "lt");

    // Объединяем FAQ
    faqs.push(...russianFAQs, ...lithuanianFAQs);

    // Собираем категории
    faqs.forEach((faq) => categories.add(faq.category));

    console.log(`\n📊 Статистика:`);
    console.log(`   • Русских FAQ: ${russianFAQs.length}`);
    console.log(`   • Литовских FAQ: ${lithuanianFAQs.length}`);
    console.log(`   • Всего FAQ: ${faqs.length}`);
    console.log(`   • Категорий: ${categories.size}`);

    // Создаем TypeScript файл с данными
    const faqsData = {
      categories: Array.from(categories).map((cat, index) => ({
        id: cat.toLowerCase().replace(/[^a-z0-9]/g, "_"),
        name: cat,
        description: getDescriptionForCategory(cat),
        order: index + 1,
      })),
      faqs: faqs,
    };

    // Генерируем TypeScript код
    const tsCode = generateFAQServiceCode(faqsData);

    // Сохраняем обновленный FAQ сервис
    fs.writeFileSync("src/services/updatedFAQService.ts", tsCode);

    console.log("\n🎉 ИНТЕГРАЦИЯ ЗАВЕРШЕНА!");
    console.log("========================");
    console.log("📁 Создан файл: src/services/updatedFAQService.ts");
    console.log("💡 Теперь нужно заменить import в src/index.ts");
    console.log("🔄 Перезапустите бота для применения изменений");
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
  }
}

function readFAQsFromSheet(sheet, language) {
  const faqs = [];
  let rowIndex = 0;

  // Находим заголовки
  const headers = {};
  sheet.getRow(1).eachCell((cell, colNumber) => {
    const value = cell.value ? String(cell.value).trim() : "";
    if (value.includes("риоритет") || value.includes("rioritet"))
      headers.priority = colNumber;
    if (value.includes("атегор") || value.includes("ategor"))
      headers.category = colNumber;
    if (value.includes("родукт") || value.includes("rodukt"))
      headers.product = colNumber;
    if (value.includes("озражение") || value.includes("rieštarav"))
      headers.question = colNumber;
    if (value.includes("тработка") || value.includes("prendim"))
      headers.answer = colNumber;
    if (value.includes("лючевые") || value.includes("raktažod"))
      headers.tags = colNumber;
  });

  console.log(`   Найдены колонки: ${Object.keys(headers).join(", ")}`);

  // Читаем данные
  for (let row = 2; row <= sheet.rowCount; row++) {
    const rowData = sheet.getRow(row);

    const priority = getCellValue(rowData, headers.priority);
    const category = getCellValue(rowData, headers.category);
    const product = getCellValue(rowData, headers.product);
    const question = getCellValue(rowData, headers.question);
    const answer = getCellValue(rowData, headers.answer);
    const tags = getCellValue(rowData, headers.tags);

    // Пропускаем пустые строки
    if (!question || !answer) continue;

    faqs.push({
      id: `${language}_${row}_${Date.now()}`,
      question: question,
      answer: answer,
      category: category || "Общие",
      tags: tags ? tags.split(/[,;]\s*/) : [],
      product: product || "общее",
      language: language,
      priority: parseInt(priority) || 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    rowIndex++;
  }

  console.log(`   Обработано строк: ${rowIndex}`);
  return faqs;
}

function getCellValue(row, colNumber) {
  if (!colNumber) return "";
  const cell = row.getCell(colNumber);
  return cell.value ? String(cell.value).trim() : "";
}

function getDescriptionForCategory(category) {
  const descriptions = {
    "🔧 Технические": "Технические характеристики блоков HAUS",
    "⚡ Монтаж": "Вопросы по установке и монтажу",
    "📊 Расчеты": "Расчет количества материалов",
    "💰 Цена/Экономия": "Вопросы о стоимости и экономии",
    "🚚 Доставка": "Условия доставки блоков",
    "📄 Документы": "Документооборот и сертификаты",
    "🏗️ Применение": "Области применения блоков",

    "🔧 Techniniai": "HAUS blokų techninės charakteristikos",
    "⚡ Montavimas": "Montavimo ir įrengimo klausimai",
    "📊 Skaičiavimai": "Medžiagų kiekio skaičiavimas",
    "💰 Kaina/Taupymas": "Kainos ir taupymo klausimai",
    "🚚 Pristatymas": "Blokų pristatymo sąlygos",
    "📄 Dokumentai": "Dokumentų apyvarta ir sertifikatai",
    "🏗️ Taikymas": "Blokų taikymo sritys",
  };

  return descriptions[category] || "Часто задаваемые вопросы";
}

function generateFAQServiceCode(data) {
  return `export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  product: string;
  language: "lt" | "ru" | "en";
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQCategory {
  id: string;
  name: string;
  description: string;
  order: number;
}

export class FAQService {
  private faqs: FAQ[] = [];
  private categories: FAQCategory[] = [];

  constructor() {
    this.initializeCategories();
    this.initializeFAQs();
  }

  private initializeCategories() {
    this.categories = ${JSON.stringify(data.categories, null, 6)};
  }

  private initializeFAQs() {
    this.faqs = [
${data.faqs
  .map(
    (faq) => `      {
        id: "${faq.id}",
        question: ${JSON.stringify(faq.question)},
        answer: ${JSON.stringify(faq.answer)},
        category: "${faq.category.toLowerCase().replace(/[^a-z0-9]/g, "_")}",
        tags: ${JSON.stringify(faq.tags)},
        product: "${faq.product}",
        language: "${faq.language}" as "lt" | "ru" | "en",
        priority: ${faq.priority},
        createdAt: new Date("${faq.createdAt.toISOString()}"),
        updatedAt: new Date("${faq.updatedAt.toISOString()}")
      }`
  )
  .join(",\n")}
    ];
  }

  // Методы для работы с FAQ
  getAllFAQs(): FAQ[] {
    return this.faqs;
  }

  getFAQById(id: string): FAQ | undefined {
    return this.faqs.find(faq => faq.id === id);
  }

  getFAQsByLanguage(language: "lt" | "ru" | "en"): FAQ[] {
    return this.faqs.filter(faq => faq.language === language);
  }

  getFAQsByCategory(categoryId: string): FAQ[] {
    return this.faqs.filter(faq => faq.category === categoryId);
  }

  getAllCategories(): FAQCategory[] {
    return this.categories.sort((a, b) => a.order - b.order);
  }

  getCategoryById(id: string): FAQCategory | undefined {
    return this.categories.find(cat => cat.id === id);
  }

  searchFAQs(query: string, language?: "lt" | "ru" | "en"): FAQ[] {
    const searchTerm = query.toLowerCase();
    let results = this.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm) ||
      faq.answer.toLowerCase().includes(searchTerm) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );

    if (language) {
      results = results.filter(faq => faq.language === language);
    }

    return results.sort((a, b) => b.priority - a.priority);
  }

  addFAQ(faqData: Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'>): FAQ {
    const newFAQ: FAQ = {
      ...faqData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.faqs.push(newFAQ);
    return newFAQ;
  }

  updateFAQ(id: string, updates: Partial<Omit<FAQ, 'id' | 'createdAt'>>): FAQ | null {
    const faqIndex = this.faqs.findIndex(faq => faq.id === id);
    if (faqIndex === -1) return null;

    this.faqs[faqIndex] = {
      ...this.faqs[faqIndex],
      ...updates,
      updatedAt: new Date()
    };

    return this.faqs[faqIndex];
  }

  deleteFAQ(id: string): boolean {
    const faqIndex = this.faqs.findIndex(faq => faq.id === id);
    if (faqIndex === -1) return false;

    this.faqs.splice(faqIndex, 1);
    return true;
  }
}

export const faqService = new FAQService();
`;
}

integrateFAQsFromExcel();
