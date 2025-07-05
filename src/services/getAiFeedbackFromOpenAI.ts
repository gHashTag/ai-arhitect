import { openai } from './openai'

type GetAiSupabaseFeedbackT = {
  assistant_id: string
  report: string
  language_code: string
  full_name: string
}

function removeAnnotations(text: string): string {
  // Регулярное выражение для поиска шаблона аннотаций
  const annotationPattern = /【\d+:\d+†source】/g
  // Заменяем все совпадения на пустую строку
  return text.replace(annotationPattern, '')
}

export async function getAiFeedbackFromSupabase({
  assistant_id,
  report,
  language_code,
  full_name,
}: GetAiSupabaseFeedbackT): Promise<{ ai_response: string }> {
  if (!assistant_id) throw new Error('Assistant ID is not set')
  if (!report) throw new Error('Report is not set')
  if (!language_code) throw new Error('Language code is not set')
  if (!full_name) throw new Error('Full name is not set')

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OpenAI API key is not set')
  }

  try {
    // Step 1: Create a thread with necessary parameters
    const thread = await openai.beta.threads.create()

    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: report,
    })

    // Step 3: Run the assistant using assistantId
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id,
      instructions: `Обращайтесь к пользователю по имени: ${full_name}.

ОЧЕНЬ ВАЖНО: Обязательно отвечайте на том же языке, на котором пользователь написал свой вопрос.
Код языка пользователя: ${language_code}
- Если language_code = 'lt' - отвечайте на литовском языке (lietuvių kalba)
- Если language_code = 'ru' - отвечайте на русском языке
- Если language_code = 'en' - отвечайте на английском языке (English)

Если пользователь пишет на одном языке, а language_code указывает на другой - всегда отвечайте на языке, на котором пишет пользователь.

Вы - специализированный ИИ-консультант по строительным блокам и архитектурным решениям.

**Ваша роль:**
• Эксперт по строительным блокам HAUS, особенно P6-20
• Консультант по техническим характеристикам блоков
• Специалист по строительным нормам и стандартам
• Помощник в расчете материалов и объемов

**База знаний включает:**
• HAUS P6-20 блоки-опалубка из бетона
• Размеры: 498×198×250 мм (M) и 508×198×250 мм (K)
• Расход бетона: 0.015 м³ на блок
• Применение: фундаменты, ростверки, подпорные стены, перемычки
• Контакты: +37064608801, haus@vbg.lt

**Правила форматирования для Telegram:**
• Используйте *курсив* для выделения
• Используйте **жирный текст** для важного
• Создавайте списки с • или -
• НЕ используйте # для заголовков (они не работают в Telegram)
• Вместо заголовков используйте **Жирный текст:**
• Добавляйте строительные эмодзи 🏗️ 🧱 📐 💧
• Давайте конкретные практические советы с расчетами
• Упоминайте нормативные требования при необходимости`,
    })

    // Step 4: Periodically retrieve the run to check its status
    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(run.thread_id)
      console.log(messages, 'messages')
      for (const message of messages.data.reverse()) {
        if (message.role === 'assistant') {
          console.log(message.content, 'message.content')

          const content = message.content[0]
          console.log(content, 'content')
          if (content && content.type === 'text' && content.text) {
            return {
              ai_response: removeAnnotations(content.text.value),
            }
          }
        }
      }
    } else {
      console.log(run.status)
      return { ai_response: '' }
    }
  } catch (error) {
    console.error('Error querying OpenAI Assistant:', error)
    throw error
  }
  
  // Fallback return
  return { ai_response: '' }
}
