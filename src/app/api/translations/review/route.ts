import { NextResponse } from "next/server";
import { patchTranslation } from "@/lib/translations-store";
import { translationReviewSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = translationReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const record = await patchTranslation(parsed.data.id, {
    status: parsed.data.status,
    reviewedText: parsed.data.reviewedText,
    reviewer: parsed.data.reviewer ?? "reviewer",
  });
  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ record });
}
