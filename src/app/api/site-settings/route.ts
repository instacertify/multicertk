import { NextResponse } from "next/server";
import { z } from "zod";
import { getCookieSettings, getSeo, readSiteSettings, saveCookies, saveSeo } from "@/lib/site-settings";

const seoSchema = z.object({
  kind: z.literal("seo"),
  defaultTitle: z.string().trim().min(1).max(160),
  titleTemplate: z.string().trim().min(1).max(80),
  defaultDescription: z.string().trim().min(1).max(400),
  keywords: z.string().trim().max(400),
  ogImage: z.string().trim().max(240),
  indexable: z.boolean(),
  googleSiteVerification: z.string().trim().max(200),
  bingSiteVerification: z.string().trim().max(200),
});

const cookieSchema = z.object({
  kind: z.literal("cookies"),
  bannerEnabled: z.boolean(),
  analyticsEnabled: z.boolean(),
  marketingEnabled: z.boolean(),
  message: z.string().trim().min(1).max(500),
  privacyPath: z.string().trim().min(1).max(80),
  cookiesPath: z.string().trim().min(1).max(80),
  gdprPath: z.string().trim().min(1).max(80),
});

export async function GET() {
  return NextResponse.json(readSiteSettings());
}

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  const seo = seoSchema.safeParse(raw);
  if (seo.success) {
    const { kind: _kind, ...data } = seo.data;
    return NextResponse.json({ ok: true, saved: "seo", seo: saveSeo(data), cookies: getCookieSettings() });
  }
  const cookies = cookieSchema.safeParse(raw);
  if (cookies.success) {
    const { kind: _kind, ...data } = cookies.data;
    return NextResponse.json({ ok: true, saved: "cookies", cookies: saveCookies(data), seo: getSeo() });
  }
  return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
}
