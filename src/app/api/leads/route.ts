import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation";

const leadsPath = path.join(process.cwd(), "data", "leads.json");

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  let existing: unknown[] = [];
  try {
    existing = JSON.parse(await readFile(leadsPath, "utf8")) as unknown[];
  } catch {
    existing = [];
  }
  existing.unshift({ ...parsed.data, createdAt: new Date().toISOString() });
  await mkdir(path.dirname(leadsPath), { recursive: true });
  await writeFile(leadsPath, JSON.stringify(existing, null, 2));

  return NextResponse.json({ ok: true });
}
