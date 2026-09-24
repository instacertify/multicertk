import { NextResponse } from "next/server";
import { CAPTCHA_COOKIE, clearCookie, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearCookie(response, SESSION_COOKIE);
  clearCookie(response, CAPTCHA_COOKIE);
  return response;
}
