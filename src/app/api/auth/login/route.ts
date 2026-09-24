import { NextResponse } from "next/server";
import { z } from "zod";
import {
  applyCookie,
  CAPTCHA_COOKIE,
  clearCookie,
  createSessionToken,
  credentialsMatch,
  readCaptchaText,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  timingSafeEqual,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().trim().email().max(120),
  password: z.string().min(1).max(200),
  captcha: z.string().trim().min(4).max(8),
});

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const response = NextResponse.json({ error: "Enter email, password and the characters." }, { status: 400 });
    clearCookie(response, CAPTCHA_COOKIE, request);
    return response;
  }

  const expected = await readCaptchaText(request);
  const submitted = parsed.data.captcha.replace(/\s+/g, "").toUpperCase();
  const captchaOk = expected ? timingSafeEqual(submitted, expected) : false;
  if (!captchaOk) {
    const response = NextResponse.json({ error: "Check the characters and try again." }, { status: 400 });
    clearCookie(response, CAPTCHA_COOKIE, request);
    return response;
  }

  const ok = await credentialsMatch(parsed.data.email, parsed.data.password);
  if (!ok) {
    const response = NextResponse.json({ error: "Email or password is not right." }, { status: 401 });
    clearCookie(response, CAPTCHA_COOKIE, request);
    return response;
  }

  const token = await createSessionToken(parsed.data.email);
  const response = NextResponse.json({ ok: true, email: parsed.data.email.trim().toLowerCase() });
  applyCookie(response, SESSION_COOKIE, token, SESSION_MAX_AGE, request);
  clearCookie(response, CAPTCHA_COOKIE, request);
  return response;
}
