import { NextResponse } from "next/server";
import { requireEditorSession } from "@/lib/auth";
import { generateAiTranslation, upsertTranslation } from "@/lib/translations-store";
import { translationGenerateSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const denied = await requireEditorSession(request);
  if (denied) return denied;
  const body = await request.json().catch(() => null);
  const parsed = translationGenerateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { locale, entityType, entityId, field, sourceText } = parsed.data;
  const ai = await generateAiTranslation(locale, sourceText);
  const id = `${entityType}:${entityId}:${field}:${locale}`;
  const record = await upsertTranslation({
    id,
    entityType,
    entityId,
    field,
    locale,
    sourceText,
    aiText: ai.text,
    reviewedText: "",
    status: "ai_generated",
    reviewer: "",
  });

  return NextResponse.json({ record, provider: ai.provider });
}
