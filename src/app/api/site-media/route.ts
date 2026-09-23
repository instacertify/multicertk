import { NextResponse } from "next/server";
import { z } from "zod";
import { getHeaderChrome, getLogos, getMenu, getReviews, readSiteMedia, saveLogos, saveMenu, saveReviews } from "@/lib/site-media";

const childSchema = z.object({
  id: z.string().trim().min(1).max(80),
  label: z.string().trim().min(1).max(160),
  href: z.string().trim().min(1).max(180),
  group: z.string().trim().max(40).optional(),
  iconUrl: z.string().trim().max(240).optional(),
});

const menuItemSchema = z.object({
  id: z.string().trim().min(1).max(80),
  label: z.string().trim().min(1).max(80),
  href: z.string().trim().min(1).max(180),
  iconUrl: z.string().trim().max(240).optional(),
  children: z.array(childSchema).max(80).optional(),
});

const logoSchema = z.object({
  kind: z.literal("logos"),
  logos: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(80),
        name: z.string().trim().min(1).max(120),
        href: z.string().trim().max(180).optional(),
        imageUrl: z.string().trim().min(1).max(240),
        alt: z.string().trim().max(120).optional(),
      }),
    )
    .max(40),
});

const reviewSchema = z.object({
  kind: z.literal("reviews"),
  reviews: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(80),
        name: z.string().trim().min(1).max(80),
        role: z.string().trim().max(120),
        quote: z.string().trim().min(1).max(600),
        rating: z.number().min(1).max(5),
        avatarUrl: z.string().trim().max(240).optional(),
      }),
    )
    .max(40),
});

const chromeSchema = z.object({
  searchIconUrl: z.string().trim().max(240).optional(),
  quoteIconUrl: z.string().trim().max(240).optional(),
  menuIconUrl: z.string().trim().max(240).optional(),
});

const menuSchema = z.object({
  kind: z.literal("menu"),
  menu: z.array(menuItemSchema).min(1).max(8),
  chrome: chromeSchema.optional(),
});

export async function GET() {
  return NextResponse.json({
    logos: getLogos(),
    reviews: getReviews(),
    menu: getMenu(),
    chrome: getHeaderChrome(),
  });
}

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  const logos = logoSchema.safeParse(raw);
  if (logos.success) {
    const store = saveLogos(
      logos.data.logos.map((logo) => ({ ...logo, alt: logo.alt || logo.name })),
    );
    return NextResponse.json({ ok: true, saved: "logos", ...store });
  }
  const reviews = reviewSchema.safeParse(raw);
  if (reviews.success) {
    const store = saveReviews(reviews.data.reviews);
    return NextResponse.json({ ok: true, saved: "reviews", ...store });
  }
  const menu = menuSchema.safeParse(raw);
  if (menu.success) {
    const store = saveMenu(menu.data.menu, menu.data.chrome);
    return NextResponse.json({ ok: true, saved: "menu", ...store });
  }
  return NextResponse.json({ error: "Invalid site-media payload", current: readSiteMedia() }, { status: 400 });
}
