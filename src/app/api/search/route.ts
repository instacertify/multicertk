import { NextResponse } from "next/server";
import { searchAll } from "@/lib/search";
import { searchQuerySchema } from "@/lib/validation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = searchQuerySchema.safeParse({
    q: url.searchParams.get("q") ?? "",
    type: url.searchParams.get("type") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const result = await searchAll(parsed.data.q, parsed.data.limit, parsed.data.type);
  return NextResponse.json(result);
}
