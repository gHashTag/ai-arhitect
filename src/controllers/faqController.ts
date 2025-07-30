import { Request, Response } from "express";
import * as XLSX from "xlsx";
import { faqService, FAQ } from "../services/faqService";

export class FAQController {
  // GET /api/faq - получить все FAQ
  async getAllFAQs(req: Request, res: Response): Promise<void> {
    try {
      const { category, product, language, search } = req.query;

      let faqs = faqService.getAllFAQs();

      if (category) {
        faqs = faqService.getFAQsByCategory(category as string);
      }

      if (product) {
        faqs = faqService.getFAQsByProduct(product as string);
      }

      if (language) {
        faqs = faqService.getFAQsByLanguage(language as string);
      }

      if (search) {
        faqs = faqService.searchFAQs(search as string);
      }

      res.json({
        success: true,
        data: faqs,
        total: faqs.length,
      });
    } catch (error) {
      console.error("Error getting FAQs:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  // GET /api/faq/:id - получить FAQ по ID
  async getFAQById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const faq = faqService.getFAQById(id);

      if (!faq) {
        res.status(404).json({
          success: false,
          error: "FAQ not found",
        });
        return;
      }

      res.json({
        success: true,
        data: faq,
      });
    } catch (error) {
      console.error("Error getting FAQ by ID:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  // POST /api/faq - создать новый FAQ
  async createFAQ(req: Request, res: Response): Promise<void> {
    try {
      const faqData = req.body;

      // Валидация данных
      if (!faqData.question || !faqData.answer || !faqData.category) {
        res.status(400).json({
          success: false,
          error: "Question, answer and category are required",
        });
        return;
      }

      const newFAQ = faqService.addFAQ(faqData);

      res.status(201).json({
        success: true,
        data: newFAQ,
      });
    } catch (error) {
      console.error("Error creating FAQ:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  // PUT /api/faq/:id - обновить FAQ
  async updateFAQ(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedFAQ = faqService.updateFAQ(id, updates);

      if (!updatedFAQ) {
        res.status(404).json({
          success: false,
          error: "FAQ not found",
        });
        return;
      }

      res.json({
        success: true,
        data: updatedFAQ,
      });
    } catch (error) {
      console.error("Error updating FAQ:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  // DELETE /api/faq/:id - удалить FAQ
  async deleteFAQ(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deleted = faqService.deleteFAQ(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: "FAQ not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "FAQ deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  // GET /api/faq/categories - получить все категории
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = faqService.getAllCategories();

      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      console.error("Error getting categories:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  // GET /api/faq/export/excel - экспорт в Excel
  async exportToExcel(req: Request, res: Response): Promise<void> {
    try {
      const data = faqService.exportToExcel();

      // Создаем рабочую книгу
      const workbook = XLSX.utils.book_new();

      // Создаем лист с данными FAQ
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Настраиваем ширину колонок
      const columnWidths = [
        { wch: 10 }, // ID
        { wch: 50 }, // Вопрос
        { wch: 80 }, // Ответ
        { wch: 20 }, // Категория
        { wch: 15 }, // Продукт
        { wch: 30 }, // Теги
        { wch: 10 }, // Язык
        { wch: 10 }, // Приоритет
        { wch: 20 }, // Создан
        { wch: 20 }, // Обновлен
      ];

      worksheet["!cols"] = columnWidths;

      // Добавляем лист в книгу
      XLSX.utils.book_append_sheet(workbook, worksheet, "FAQ");

      // Генерируем Excel файл
      const buffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });

      // Отправляем файл
      const fileName = `FAQ_${new Date().toISOString().split("T")[0]}.xlsx`;

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("Content-Length", buffer.length);

      res.send(buffer);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  // POST /api/faq/import/excel - импорт из Excel
  async importFromExcel(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: "Excel file is required",
        });
        return;
      }

      // Читаем Excel файл
      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Конвертируем в JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Импортируем данные
      const importedFAQs = faqService.importFromExcel(jsonData);

      res.json({
        success: true,
        message: `Successfully imported ${importedFAQs.length} FAQs`,
        data: importedFAQs,
      });
    } catch (error) {
      console.error("Error importing from Excel:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  // GET /api/faq/context - получить контекст для AI
  async getContextForAI(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.query;
      const context = faqService.getContextForAI(query as string);

      res.json({
        success: true,
        data: {
          context,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error getting AI context:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  // GET /api/faq/stats - статистика FAQ
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const allFAQs = faqService.getAllFAQs();
      const categories = faqService.getAllCategories();

      const stats = {
        total: allFAQs.length,
        categories: categories.length,
        byCategory: categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          count: faqService.getFAQsByCategory(cat.id).length,
        })),
        byLanguage: {
          ru: faqService.getFAQsByLanguage("ru").length,
          lt: faqService.getFAQsByLanguage("lt").length,
          en: faqService.getFAQsByLanguage("en").length,
        },
        byProduct: this.getProductStats(allFAQs),
      };

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error getting stats:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  private getProductStats(faqs: FAQ[]): Record<string, number> {
    const productStats: Record<string, number> = {};

    faqs.forEach((faq) => {
      if (faq.product) {
        productStats[faq.product] = (productStats[faq.product] || 0) + 1;
      }
    });

    return productStats;
  }
}

export const faqController = new FAQController();
