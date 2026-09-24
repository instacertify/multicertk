import { NextResponse } from "next/server";
import { CAPTCHA_COOKIE, clearCookie, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const response = NextResponse.json({ ok: true });
  clearCookie(response, SESSION_COOKIE, request);
  clearCookie(response, CAPTCHA_COOKIE, request);
  return response;
}
