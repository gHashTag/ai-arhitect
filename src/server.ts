import express from "express";
import cors from "cors";
import { faqService } from "./services/updatedFAQService";
import { loadExpandedFAQs } from "./services/expandedFAQData";
import faqRoutes from "./routes/faqRoutes";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Загружаем расширенные FAQ при старте сервера
loadExpandedFAQs(faqService);

// Роуты
app.use("/api/faq", faqRoutes);

// Главная страница
app.get("/", (req, res) => {
  res.json({
    message: "🏗️ HAUS FAQ Management System",
    version: "1.0.0",
    endpoints: {
      "GET /api/faq": "Получить все FAQ",
      "GET /api/faq/:id": "Получить FAQ по ID",
      "POST /api/faq": "Создать новый FAQ",
      "PUT /api/faq/:id": "Обновить FAQ",
      "DELETE /api/faq/:id": "Удалить FAQ",
      "GET /api/faq/categories": "Получить категории",
      "GET /api/faq/stats": "Статистика FAQ",
      "GET /api/faq/export/excel": "Экспорт в Excel",
      "POST /api/faq/import/excel": "Импорт из Excel",
      "GET /api/faq/context": "Контекст для AI",
    },
    stats: {
      totalFAQs: faqService.getAllFAQs().length,
      categories: faqService.getAllCategories().length,
    },
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    message: "Please check the API documentation",
  });
});

// Error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: err.message,
    });
  }
);

// Запуск сервера
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 HAUS FAQ Management Server запущен на порту ${PORT}`);
    console.log(`📊 Загружено FAQ: ${faqService.getAllFAQs().length}`);
    console.log(`📂 Категорий: ${faqService.getAllCategories().length}`);
    console.log(`🌐 API доступен: http://localhost:${PORT}`);
    console.log(`📋 Документация: http://localhost:${PORT}/api/faq`);
    console.log(`📊 Статистика: http://localhost:${PORT}/api/faq/stats`);
    console.log(
      `📥 Экспорт Excel: http://localhost:${PORT}/api/faq/export/excel`
    );
  });
}

export default app;
