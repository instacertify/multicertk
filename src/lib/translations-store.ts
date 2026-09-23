import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type TranslationStatus =
  | "draft"
  | "ai_generated"
  | "in_review"
  | "approved"
  | "rejected";

export interface TranslationRecord {
  id: string;
  entityType: string;
  entityId: string;
  field: string;
  locale: string;
  sourceText: string;
  aiText: string;
  reviewedText: string;
  status: TranslationStatus;
  reviewer: string;
  updatedAt: string;
}

const storePath = path.join(process.cwd(), "data", "translations.json");

async function readStore(): Promise<TranslationRecord[]> {
  try {
    const raw = await readFile(storePath, "utf8");
    return JSON.parse(raw) as TranslationRecord[];
  } catch {
    return [];
  }
}

async function writeStore(rows: TranslationRecord[]) {
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, JSON.stringify(rows, null, 2));
}

export async function listTranslations() {
  const rows = await readStore();
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function upsertTranslation(input: Omit<TranslationRecord, "updatedAt">) {
  const rows = await readStore();
  const next: TranslationRecord = { ...input, updatedAt: new Date().toISOString() };
  const index = rows.findIndex((row) => row.id === input.id);
  if (index >= 0) rows[index] = next;
  else rows.unshift(next);
  await writeStore(rows);
  return next;
}

export async function patchTranslation(
  id: string,
  patch: Partial<Pick<TranslationRecord, "status" | "reviewedText" | "reviewer">>,
) {
  const rows = await readStore();
  const index = rows.findIndex((row) => row.id === id);
  if (index < 0) return null;
  rows[index] = {
    ...rows[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await writeStore(rows);
  return rows[index];
}

export async function generateAiTranslation(locale: "hi" | "ar", sourceText: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  const language = locale === "hi" ? "Hindi" : "Arabic";

  if (!apiKey) {
    return {
      text: `[AI draft — ${language}] ${sourceText}`,
      provider: "placeholder",
    };
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You translate certification and laboratory-standards copy. Keep IS numbers, HSN codes, scheme names (BIS, CRS, CE, FCC) and legal references unchanged. Return only the translation.",
        },
        {
          role: "user",
          content: `Translate the following into ${language}:\n\n${sourceText}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Translation API failed (${response.status})`);
  }

  const json = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = json.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty translation");
  return { text, provider: "openai" };
}
