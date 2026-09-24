import { NextResponse } from "next/server";
import { requireEditorSession } from "@/lib/auth";
import { listTranslations } from "@/lib/translations-store";

export async function GET(request: Request) {
  const denied = await requireEditorSession(request);
  if (denied) return denied;
  const rows = await listTranslations();
  return NextResponse.json({ rows });
}
