import { NextResponse } from "next/server";
import { applyCookie, CAPTCHA_COOKIE, CAPTCHA_MAX_AGE, createCaptchaToken, randomCaptchaText, renderCaptchaSvg } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const text = randomCaptchaText();
  const token = await createCaptchaToken(text);
  const response = new NextResponse(renderCaptchaSvg(text), {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
  applyCookie(response, CAPTCHA_COOKIE, token, CAPTCHA_MAX_AGE);
  return response;
}
