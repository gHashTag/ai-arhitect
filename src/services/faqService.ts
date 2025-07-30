export interface FAQ {
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
    this.initializeDefaultCategories();
    this.initializeDefaultFAQs();
  }

  private initializeDefaultCategories() {
    this.categories = [
      {
        id: "technical",
        name: "Технические характеристики",
        description: "Вопросы о размерах, весе, прочности блоков",
        order: 1,
      },
      {
        id: "application",
        name: "Применение",
        description: "Где и как использовать блоки",
        order: 2,
      },
      {
        id: "installation",
        name: "Монтаж",
        description: "Процесс установки и сборки",
        order: 3,
      },
      {
        id: "calculation",
        name: "Расчеты",
        description: "Подсчет количества материалов",
        order: 4,
      },
      {
        id: "pricing",
        name: "Стоимость",
        description: "Ценообразование и скидки",
        order: 5,
      },
      {
        id: "delivery",
        name: "Доставка",
        description: "Условия доставки и сроки",
        order: 6,
      },
    ];
  }

  private initializeDefaultFAQs() {
    this.faqs = [
      {
        id: "1",
        question: "Что такое блоки-опалубка HAUS P6-20?",
        answer:
          "HAUS P6-20 - это несъемная опалубка из бетона, которая используется для создания монолитных конструкций. Блоки полые внутри, собираются без раствора, а затем заполняются бетоном. Размеры: 498×198×250 мм (M) и 508×198×250 мм (K).",
        category: "technical",
        tags: ["блоки", "опалубка", "размеры", "P6-20"],
        product: "P6-20",
        language: "ru",
        priority: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        question: "Сколько бетона нужно на один блок P6-20?",
        answer:
          "Для заполнения одного блока P6-20 требуется 0.015 м³ бетона. На 1 метр стены высотой 25 см нужно 0.03 м³ бетона, на высоту 50 см - 0.06 м³.",
        category: "calculation",
        tags: ["расход", "бетон", "расчет", "объем"],
        product: "P6-20",
        language: "ru",
        priority: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        question: "Можно ли использовать блоки без заполнения бетоном?",
        answer:
          "Нет! Блоки HAUS P6-20 предназначены исключительно для использования с заполнением бетоном. Без бетона они не обеспечивают необходимую прочность конструкции.",
        category: "application",
        tags: ["безопасность", "применение", "бетон", "прочность"],
        product: "P6-20",
        language: "ru",
        priority: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4",
        question: "Какая арматура нужна для блоков P6-20?",
        answer:
          "Армирование выполняется по проекту. Обычно используется арматура A500C диаметром 10-16 мм. Вертикальная арматура устанавливается в полости блоков, горизонтальная - между рядами.",
        category: "technical",
        tags: ["арматура", "армирование", "A500C", "диаметр"],
        product: "P6-20",
        language: "ru",
        priority: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "5",
        question: "Сколько блоков в паллете P6-20?",
        answer:
          "В одной паллете содержится 50 блоков P6-20: 40 блоков типа M (498×198×250 мм) и 10 блоков типа K (508×198×250 мм).",
        category: "technical",
        tags: ["паллета", "упаковка", "количество", "типы блоков"],
        product: "P6-20",
        language: "ru",
        priority: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  // CRUD операции
  getAllFAQs(): FAQ[] {
    return this.faqs.sort((a, b) => b.priority - a.priority);
  }

  getFAQById(id: string): FAQ | undefined {
    return this.faqs.find((faq) => faq.id === id);
  }

  getFAQsByCategory(categoryId: string): FAQ[] {
    return this.faqs
      .filter((faq) => faq.category === categoryId)
      .sort((a, b) => b.priority - a.priority);
  }

  getFAQsByProduct(product: string): FAQ[] {
    return this.faqs
      .filter((faq) => faq.product === product)
      .sort((a, b) => b.priority - a.priority);
  }

  getFAQsByLanguage(language: string): FAQ[] {
    return this.faqs
      .filter((faq) => faq.language === language)
      .sort((a, b) => b.priority - a.priority);
  }

  searchFAQs(query: string): FAQ[] {
    const lowercaseQuery = query.toLowerCase();
    return this.faqs
      .filter(
        (faq) =>
          faq.question.toLowerCase().includes(lowercaseQuery) ||
          faq.answer.toLowerCase().includes(lowercaseQuery) ||
          faq.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
      )
      .sort((a, b) => b.priority - a.priority);
  }

  addFAQ(faq: Omit<FAQ, "id" | "createdAt" | "updatedAt">): FAQ {
    const newFAQ: FAQ = {
      ...faq,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.faqs.push(newFAQ);
    return newFAQ;
  }

  updateFAQ(
    id: string,
    updates: Partial<Omit<FAQ, "id" | "createdAt">>
  ): FAQ | null {
    const index = this.faqs.findIndex((faq) => faq.id === id);
    if (index === -1) return null;

    this.faqs[index] = {
      ...this.faqs[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.faqs[index];
  }

  deleteFAQ(id: string): boolean {
    const index = this.faqs.findIndex((faq) => faq.id === id);
    if (index === -1) return false;

    this.faqs.splice(index, 1);
    return true;
  }

  // Категории
  getAllCategories(): FAQCategory[] {
    return this.categories.sort((a, b) => a.order - b.order);
  }

  getCategoryById(id: string): FAQCategory | undefined {
    return this.categories.find((cat) => cat.id === id);
  }

  // Экспорт в Excel
  exportToExcel(): any[] {
    return this.faqs.map((faq) => ({
      ID: faq.id,
      Вопрос: faq.question,
      Ответ: faq.answer,
      Категория: this.getCategoryById(faq.category)?.name || faq.category,
      Продукт: faq.product,
      Теги: faq.tags.join(", "),
      Язык: faq.language,
      Приоритет: faq.priority,
      Создан: faq.createdAt.toISOString(),
      Обновлен: faq.updatedAt.toISOString(),
    }));
  }

  // Импорт из Excel
  importFromExcel(data: any[]): FAQ[] {
    const importedFAQs: FAQ[] = [];

    data.forEach((row) => {
      const faq: FAQ = {
        id: row["ID"] || Date.now().toString(),
        question: row["Вопрос"] || "",
        answer: row["Ответ"] || "",
        category: this.findCategoryIdByName(row["Категория"]) || "technical",
        product: row["Продукт"] || "",
        tags: row["Теги"] ? row["Теги"].split(", ") : [],
        language: row["Язык"] || "ru",
        priority: parseInt(row["Приоритет"]) || 5,
        createdAt: row["Создан"] ? new Date(row["Создан"]) : new Date(),
        updatedAt: new Date(),
      };

      importedFAQs.push(faq);
    });

    this.faqs = [...this.faqs, ...importedFAQs];
    return importedFAQs;
  }

  private findCategoryIdByName(name: string): string | undefined {
    return this.categories.find((cat) => cat.name === name)?.id;
  }

  // Получение контекста для AI
  getContextForAI(query?: string): string {
    let relevantFAQs = this.faqs;

    if (query) {
      relevantFAQs = this.searchFAQs(query).slice(0, 10);
    } else {
      relevantFAQs = this.faqs
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 15);
    }

    const context = relevantFAQs
      .map(
        (faq) =>
          `Q: ${faq.question}\nA: ${faq.answer}\nПродукт: ${faq.product}\nКатегория: ${faq.category}`
      )
      .join("\n\n---\n\n");

    return `БАЗА ЗНАНИЙ FAQ:\n\n${context}`;
  }
}

export const faqService = new FAQService();
