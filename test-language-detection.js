import { detectLanguageFromText } from "./dist/services/i18n.js";

// Тестовые фразы для проверки определения языка
const testCases = [
  // Русский язык
  { text: "Привет! Какие блоки лучше для фундамента?", expected: "ru" },
  { text: "Сколько бетона нужно для дома 10×12 метров?", expected: "ru" },
  { text: "Помогите мне выбрать материал для стены", expected: "ru" },
  { text: "Что лучше - P6-20 или P25?", expected: "ru" },

  // Английский язык
  { text: "Hello! Which blocks are better for foundation?", expected: "en" },
  { text: "How much concrete do I need for a 10×12 house?", expected: "en" },
  { text: "Can you help me choose the right material?", expected: "en" },
  { text: "What is better - P6-20 or P25?", expected: "en" },

  // Литовский язык
  { text: "Labas! Kokie blokai geriausi pamatams?", expected: "lt" },
  { text: "Kiek betono reikia 10×12 namui?", expected: "lt" },
  { text: "Padėkite išsirinkti tinkamą medžiagą", expected: "lt" },
  { text: "Kas geriau - P6-20 ar P25?", expected: "lt" },

  // Смешанные случаи
  { text: "Hello, как дела?", expected: "ru" }, // Кириллица должна побеждать
  { text: "Aš noriu know more", expected: "lt" }, // Литовские диакритики
];

console.log("🔍 Тестирование автоматического определения языка...\n");

let passed = 0;
let total = testCases.length;

testCases.forEach((testCase, index) => {
  const detected = detectLanguageFromText(testCase.text);
  const isCorrect = detected === testCase.expected;

  console.log(`${index + 1}. "${testCase.text}"`);
  console.log(
    `   Ожидалось: ${testCase.expected} | Получено: ${detected} ${isCorrect ? "✅" : "❌"}`
  );

  if (isCorrect) {
    passed++;
  }

  console.log("");
});

console.log(
  `📊 Результаты: ${passed}/${total} тестов пройдено (${Math.round((passed / total) * 100)}%)`
);

if (passed === total) {
  console.log("🎉 Все тесты пройдены успешно!");
} else {
  console.log(
    "⚠️  Некоторые тесты не пройдены. Возможно, нужно улучшить алгоритм определения языка."
  );
}
