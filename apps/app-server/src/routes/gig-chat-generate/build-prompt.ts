import type { GigDocument } from "./types";

export interface CompanySettings {
  companyName?: string;
  companyDescription?: string;
  botName?: string;
  botRole?: string;
}

function isDocumentEmpty(doc: GigDocument | undefined): boolean {
  if (!doc) return true;
  return !(
    doc.title?.trim() ||
    doc.description?.trim() ||
    doc.deliverables?.trim() ||
    doc.requiredSkills?.trim() ||
    doc.budgetRange?.trim() ||
    doc.timeline?.trim()
  );
}

export function buildGigPrompt(
  message: string,
  currentDocument?: GigDocument,
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>,
  companySettings?: CompanySettings | null,
): string {
  const parts: string[] = [];

  if (companySettings?.botName && companySettings?.botRole) {
    const companyPart = companySettings.companyName
      ? ` компании "${companySettings.companyName}"`
      : "";
    parts.push(
      `Ты — ${companySettings.botName}, ${companySettings.botRole}${companyPart}.`,
    );
  } else if (companySettings?.companyName) {
    parts.push(
      `Ты — эксперт по созданию технических заданий для компании "${companySettings.companyName}".`,
    );
  } else {
    parts.push(
      "Ты — эксперт по созданию разовых заданий (gigs). Веди диалог пошагово.",
    );
  }

  if (companySettings?.companyDescription) {
    parts.push("");
    parts.push(`Контекст: ${companySettings.companyDescription}`);
  }

  parts.push("");
  parts.push(
    "ЗАДАЧА: Помоги пользователю создать разовое задание для российского рынка. Бюджет и суммы — только в рублях (₽). Веди диалог пошагово — после каждого ответа пользователя обновляй документ и задавай следующий логичный вопрос.",
  );
  parts.push("");
  parts.push("ПРАВИЛА ПОШАГОВОГО ДИАЛОГА:");
  parts.push(
    "1. ШАГ 1 (что нужно): из первого сообщения извлеки суть задачи, заполни title, description, deliverables. Задай уточняющий вопрос или переходи к стеку.",
  );
  parts.push(
    "2. ШАГ 2 (стек технологий): для технических задач (лендинг, сайт, бот, приложение, скрипт, интеграция, дизайн в Figma и т.д.) — обязательно спроси «На каком стеке реализовать?» и заполни requiredSkills. Предложи варианты в quickReplies, релевантные для РФ-рынка (например: «React/Next.js», «WordPress», «Telegram Bot API», «Python», «1С», «Bitrix24 / amoCRM», «На усмотрение исполнителя»). Для нетехнических задач (тексты, переводы, монтаж видео) стек можно пропустить.",
  );
  parts.push(
    "3. ШАГ 3 (бюджет): если не указан — спроси «Какой бюджет планируете?» и предложи варианты в quickReplies в рублях (₽), например: «до 5 000 ₽», «5 000 – 15 000 ₽», «15 000 – 50 000 ₽», «50 000 – 150 000 ₽», «150 000+ ₽». Бюджет всегда в рублях — целевой рынок РФ.",
  );
  parts.push(
    "4. ШАГ 4 (сроки): когда бюджет есть — спроси «Когда нужен результат?» (срочно, неделя, 2 недели, месяц, гибкие сроки).",
  );
  parts.push(
    "5. ШАГ 5 (детали): когда есть title, deliverables, requiredSkills (если применимо), бюджет, сроки — предложи уточнить детали или сообщи что ТЗ готово.",
  );
  parts.push(
    "6. Сохраняй уже заполненные поля. Не перезаписывай без явного запроса пользователя.",
  );
  parts.push(
    "7. quickReplies — 2–5 КОНКРЕТНЫХ вариантов как в quiz: пользователь может нажать кнопку ИЛИ написать свой вариант. Примеры: для «что нужно» — «Лендинг», «Telegram-бот», «Интеграция с 1С»; для стека — «React/Next.js», «WordPress», «На усмотрение»; для бюджета — «до 5 000 ₽», «5 000 – 15 000 ₽», «50 000 – 150 000 ₽»; для сроков — «Срочно (1-3 дня)», «Неделя», «2 недели». Каждый вариант = готовый ответ, который можно отправить одним кликом.",
  );
  parts.push("");

  if (conversationHistory?.length) {
    parts.push("ИСТОРИЯ ДИАЛОГА:");
    for (const msg of conversationHistory) {
      const role = msg.role === "user" ? "Пользователь" : "Ассистент";
      parts.push(`${role}: ${msg.content}`);
    }
    parts.push("");
  }

  const docEmpty = isDocumentEmpty(currentDocument);
  if (currentDocument && !docEmpty) {
    parts.push("ТЕКУЩИЙ ДОКУМЕНТ:");
    if (currentDocument.title) parts.push(`Название: ${currentDocument.title}`);
    if (currentDocument.description)
      parts.push(`Описание: ${currentDocument.description}`);
    if (currentDocument.deliverables)
      parts.push(`Что нужно сделать: ${currentDocument.deliverables}`);
    if (currentDocument.requiredSkills)
      parts.push(`Стек / навыки: ${currentDocument.requiredSkills}`);
    if (currentDocument.budgetRange)
      parts.push(`Бюджет: ${currentDocument.budgetRange}`);
    if (currentDocument.timeline)
      parts.push(`Сроки: ${currentDocument.timeline}`);
    parts.push("");
  } else {
    parts.push("ТЕКУЩИЙ ДОКУМЕНТ: (пусто — первый шаг)");
    parts.push("");
  }

  parts.push(`СООБЩЕНИЕ ПОЛЬЗОВАТЕЛЯ:\n${message}`);
  parts.push("");
  parts.push(
    "Обнови документ на основе сообщения. Определи шаг, задай короткий вопрос и предложи 2–5 quiz-вариантов в quickReplies. Пользователь выберет вариант или напишет своё.",
  );
  parts.push("");
  parts.push("ФОРМАТ ОТВЕТА (строго JSON):");
  parts.push("{");
  parts.push(
    '  "message": "Твой ответ пользователю — следующий вопрос или подтверждение",',
  );
  parts.push('  "quickReplies": ["Вариант 1", "Вариант 2", "Вариант 3"],');
  parts.push('  "document": {');
  parts.push('    "title": "Название задания",');
  parts.push('    "description": "Описание",');
  parts.push('    "deliverables": "Что нужно сделать",');
  parts.push(
    '    "requiredSkills": "Стек технологий / навыки (React, Python, Figma и т.д.)",',
  );
  parts.push('    "budgetRange": "5 000 – 15 000 ₽",');
  parts.push('    "timeline": "1-2 недели"');
  parts.push("  }");
  parts.push("}");
  parts.push("");
  parts.push("Верни ТОЛЬКО валидный JSON.");
  return parts.join("\n");
}
