import { Router } from "express";
import multer from "multer";
import { faqController } from "../controllers/faqController";

const router = Router();

// Настройка multer для загрузки файлов
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files are allowed"));
    }
  },
});

// Основные CRUD операции
router.get("/", faqController.getAllFAQs.bind(faqController));
router.get("/stats", faqController.getStats.bind(faqController));
router.get("/categories", faqController.getCategories.bind(faqController));
router.get("/context", faqController.getContextForAI.bind(faqController));
router.get("/export/excel", faqController.exportToExcel.bind(faqController));
router.post(
  "/import/excel",
  upload.single("file"),
  faqController.importFromExcel.bind(faqController)
);
router.get("/:id", faqController.getFAQById.bind(faqController));
router.post("/", faqController.createFAQ.bind(faqController));
router.put("/:id", faqController.updateFAQ.bind(faqController));
router.delete("/:id", faqController.deleteFAQ.bind(faqController));

export default router;
