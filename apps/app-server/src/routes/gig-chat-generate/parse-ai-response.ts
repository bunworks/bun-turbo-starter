import {
  type GigAIResponse,
  type GigDocument,
  gigAIResponseSchema,
} from "./types";

export interface ValidationErrorDetail {
  path?: string;
  message: string;
  code?: string;
}

const DOC_FIELDS = [
  "title",
  "description",
  "deliverables",
  "requiredSkills",
  "budgetRange",
  "timeline",
  "message",
] as const;

function getStringFromDoc(text: string, field: string): string {
  if (!DOC_FIELDS.includes(field as (typeof DOC_FIELDS)[number])) return "";
  const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const strictRegex = new RegExp(
    `"${escaped}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)(?:"|$)`,
    "s",
  );
  let match = text.match(strictRegex);
  // Fallback: проще regex для частичной строки без escape (на случай нестандартного вывода модели)
  if (!match?.[1]) {
    const simpleRegex = new RegExp(`"${escaped}"\\s*:\\s*"([^"]*)`, "s");
    match = text.match(simpleRegex);
  }
  if (!match?.[1]) return "";
  try {
    return JSON.parse(`"${match[1]}"`);
  } catch {
    return match[1]
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }
}

export function extractPartialGigResponse(
  text: string,
  fallback?: GigDocument,
): GigAIResponse {
  const result: GigAIResponse = {
    document: { ...fallback },
    message: "",
  };

  const cleanText = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  const docFields = [
    "title",
    "description",
    "deliverables",
    "requiredSkills",
    "budgetRange",
    "timeline",
  ] as const;

  const startIndex = cleanText.indexOf("{");
  const docText = startIndex >= 0 ? cleanText.slice(startIndex) : cleanText;

  for (const field of docFields) {
    const val = getStringFromDoc(docText, field);
    if (val && result.document) result.document[field] = val;
  }

  result.message = getStringFromDoc(docText, "message") || "";

  const quickRepliesMatch = docText.match(
    /"quickReplies"\s*:\s*\[([\s\S]*?)\]/,
  );
  if (quickRepliesMatch?.[1]) {
    try {
      const repliesText = `[${quickRepliesMatch[1]}]`;
      const parsed = JSON.parse(repliesText);
      result.quickReplies = Array.isArray(parsed)
        ? parsed.filter((r): r is string => typeof r === "string")
        : [];
    } catch {
      // Ignore parse errors
    }
  }

  return result;
}

export function parseGigAIResponse(
  text: string,
  fallback?: GigDocument,
): {
  response: GigAIResponse;
  isComplete: boolean;
  validationErrors?: ValidationErrorDetail[];
} {
  let cleanText = text.trim();
  if (cleanText.startsWith("```json")) {
    cleanText = cleanText.slice(7);
  } else if (cleanText.startsWith("```")) {
    cleanText = cleanText.slice(3);
  }
  if (cleanText.endsWith("```")) {
    cleanText = cleanText.slice(0, -3);
  }
  cleanText = cleanText.trim();

  const startIndex = cleanText.indexOf("{");
  if (startIndex === -1) {
    return {
      response: extractPartialGigResponse(text, fallback),
      isComplete: false,
    };
  }

  let braceCount = 0;
  let endIndex = -1;
  let inString = false;
  let stringChar: string | null = null;
  let i = startIndex;

  while (i < cleanText.length) {
    const char = cleanText[i];
    if (inString) {
      if (char === "\\" && i + 1 < cleanText.length) {
        i += 2;
        continue;
      }
      if (char === stringChar) {
        inString = false;
        stringChar = null;
      }
      i++;
      continue;
    }
    if (char === '"' || char === "'") {
      inString = true;
      stringChar = char;
      i++;
      continue;
    }
    if (char === "{") {
      braceCount++;
    } else if (char === "}") {
      braceCount--;
      if (braceCount === 0) {
        endIndex = i;
        break;
      }
    }
    i++;
  }

  if (endIndex === -1) {
    return {
      response: extractPartialGigResponse(cleanText, fallback),
      isComplete: false,
    };
  }

  const jsonText = cleanText.substring(startIndex, endIndex + 1);

  try {
    const parsed = JSON.parse(jsonText);
    const data = parsed as Record<string, unknown>;
    const docData =
      data.document && typeof data.document === "object"
        ? (data.document as Record<string, unknown>)
        : data;

    const getString = (key: string, def = ""): string => {
      const value = docData[key];
      if (value === null || value === undefined) return def;
      return typeof value === "string" ? value : def;
    };

    const response: GigAIResponse = {
      document: {
        title: getString("title", fallback?.title ?? ""),
        description: getString("description", fallback?.description ?? ""),
        deliverables: getString("deliverables", fallback?.deliverables ?? ""),
        requiredSkills: getString(
          "requiredSkills",
          fallback?.requiredSkills ?? "",
        ),
        budgetRange: getString("budgetRange", fallback?.budgetRange ?? ""),
        timeline: getString("timeline", fallback?.timeline ?? ""),
      },
      message: typeof data.message === "string" ? data.message : "",
      quickReplies: Array.isArray(data.quickReplies)
        ? data.quickReplies.filter((r): r is string => typeof r === "string")
        : [],
    };

    const validated = gigAIResponseSchema.safeParse(response);
    if (validated.success) {
      return { response: validated.data, isComplete: true };
    }
    const flat = validated.error.flatten();
    const validationErrors: ValidationErrorDetail[] = [];
    if (flat.formErrors.length) {
      validationErrors.push(...flat.formErrors.map((m) => ({ message: m })));
    }
    for (const [path, msgs] of Object.entries(flat.fieldErrors)) {
      for (const m of Array.isArray(msgs) ? msgs : [msgs]) {
        if (m) validationErrors.push({ path, message: String(m) });
      }
    }
    return {
      response,
      isComplete: false,
      validationErrors,
    };
  } catch {
    return {
      response: extractPartialGigResponse(cleanText, fallback),
      isComplete: false,
    };
  }
}
