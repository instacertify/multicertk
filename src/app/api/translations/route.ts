import { NextResponse } from "next/server";
import { listTranslations } from "@/lib/translations-store";

export async function GET() {
  const rows = await listTranslations();
  return NextResponse.json({ rows });
}
