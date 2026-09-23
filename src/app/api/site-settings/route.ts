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
  organizationName: z.string().trim().max(160),
  twitterHandle: z.string().trim().max(80),
});

const cookieRowSchema = z.object({
  id: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(80),
  purpose: z.string().trim().min(1).max(240),
  duration: z.string().trim().min(1).max(40),
  category: z.enum(["necessary", "analytics", "marketing"]),
});

const cookieSchema = z.object({
  kind: z.literal("cookies"),
  bannerEnabled: z.boolean(),
  analyticsEnabled: z.boolean(),
  marketingEnabled: z.boolean(),
  message: z.string().trim().min(1).max(700),
  privacyPath: z.string().trim().min(1).max(80),
  cookiesPath: z.string().trim().min(1).max(80),
  gdprPath: z.string().trim().min(1).max(80),
  termsPath: z.string().trim().min(1).max(80),
  dataRequestPath: z.string().trim().min(1).max(80),
  controllerName: z.string().trim().min(1).max(160),
  controllerEmail: z.string().trim().min(1).max(120),
  grievanceOfficer: z.string().trim().max(120),
  dpoEmail: z.string().trim().max(120),
  consentVersion: z.string().trim().min(1).max(20),
  lastReviewed: z.string().trim().max(20),
  analyticsId: z.string().trim().max(40),
  marketingId: z.string().trim().max(40),
  rows: z.array(cookieRowSchema).max(40),
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
