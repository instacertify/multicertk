import { NextResponse } from "next/server";
import { z } from "zod";
import { getArticle, getPage, listArticles, listPages } from "@/lib/cms";
import { upsertDirectusItem } from "@/lib/directus-write";
import { saveArticleOverride, savePageOverride } from "@/lib/cms-store";

const pageSchema = z.object({
  kind: z.literal("page"),
  slug: z.string().trim().min(1).max(80),
  locale: z.string().trim().min(2).max(8).default("en"),
  title: z.string().trim().min(1).max(200),
  intro: z.string().trim().max(4000),
  heroImageUrl: z.string().trim().max(240).optional(),
  heroImageAlt: z.string().trim().max(160).optional(),
  sections: z
    .array(
      z.object({
        key: z.string().trim().min(1).max(80),
        heading: z.string().trim().min(1).max(200),
        body: z.array(z.string().trim().max(4000)).max(12),
        imageUrl: z.string().trim().max(240).optional(),
        imageAlt: z.string().trim().max(160).optional(),
      }),
    )
    .max(20),
});

const blockSchema = z.discriminatedUnion("type", [
  z.object({ id: z.string(), type: z.literal("paragraph"), text: z.string().trim().max(4000) }),
  z.object({
    id: z.string(),
    type: z.literal("image"),
    url: z.string().trim().min(1).max(240),
    alt: z.string().trim().max(160).optional(),
    caption: z.string().trim().max(200).optional(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("table"),
    caption: z.string().trim().max(200).optional(),
    rows: z.array(z.array(z.string().trim().max(200)).max(8)).min(1).max(20),
  }),
  z.object({ id: z.string(), type: z.literal("bar"), label: z.string().trim().max(80), value: z.number().min(0).max(100) }),
  z.object({ id: z.string(), type: z.literal("spacer"), size: z.enum(["sm", "md", "lg"]) }),
]);

const articleSchema = z.object({
  kind: z.literal("article"),
  slug: z.string().trim().min(1).max(180),
  locale: z.string().trim().min(2).max(8).default("en"),
  title: z.string().trim().min(1).max(240),
  heading: z.string().trim().min(1).max(240),
  excerpt: z.string().trim().max(800),
  body: z.array(z.string().trim().max(4000)).max(40).optional(),
  heroImageUrl: z.string().trim().max(240).optional(),
  blocks: z.array(blockSchema).max(40).optional(),
  date: z.string().trim().max(20).optional(),
  tags: z.array(z.string().trim().max(40)).max(12).optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale") || "en";
  return NextResponse.json({
    pages: listPages(locale),
    articles: listArticles(locale),
  });
}

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  const pageParsed = pageSchema.safeParse(raw);
  const articleParsed = articleSchema.safeParse(raw);

  if (pageParsed.success) {
    const input = pageParsed.data;
    const current = (await getPage(input.slug, input.locale)) ?? { path: `/${input.slug}`, sections: [] };
    savePageOverride(input.locale, {
      slug: input.slug,
      path: current.path,
      title: input.title,
      intro: input.intro,
      heroImageUrl: input.heroImageUrl,
      heroImageAlt: input.heroImageAlt,
      sections: input.sections,
    });
    const pageResult = await upsertDirectusItem(
      "cms_pages",
      "slug",
      input.slug,
      { locale: input.locale },
      {
        slug: input.slug,
        locale: input.locale,
        title: input.title,
        intro: input.intro,
        path: current.path,
        hero_image_url: input.heroImageUrl || "",
        hero_image_alt: input.heroImageAlt || "",
      },
    );
    for (const [index, section] of input.sections.entries()) {
      await upsertDirectusItem(
        "cms_sections",
        "key",
        section.key,
        { locale: input.locale, page_slug: input.slug },
        {
          page_slug: input.slug,
          locale: input.locale,
          key: section.key,
          heading: section.heading,
          body: section.body.join("\n\n"),
          image_url: section.imageUrl || "",
          image_alt: section.imageAlt || "",
          sort: index + 1,
        },
      );
    }
    return NextResponse.json({ ok: true, saved: "page", directus: pageResult });
  }

  if (articleParsed.success) {
    const input = articleParsed.data;
    const current = await getArticle(input.slug, input.locale);
    const body =
      input.body?.length
        ? input.body
        : (input.blocks ?? [])
            .filter((block) => block.type === "paragraph")
            .map((block) => block.text)
            .filter(Boolean);
    if (!body.length && !input.blocks?.length) {
      return NextResponse.json({ error: "Article needs copy or blocks" }, { status: 400 });
    }
    saveArticleOverride(input.locale, {
      slug: input.slug,
      title: input.title,
      heading: input.heading,
      excerpt: input.excerpt,
      body: body.length ? body : [input.title],
      heroImageUrl: input.heroImageUrl,
      blocks: input.blocks,
      date: input.date,
      tags: input.tags,
      relatedProductSlugs: current?.relatedProductSlugs,
      relatedSchemeSlugs: current?.relatedSchemeSlugs,
      status: "published",
    });
    const articleResult = await upsertDirectusItem(
      "cms_articles",
      "slug",
      input.slug,
      { locale: input.locale },
      {
        slug: input.slug,
        locale: input.locale,
        title: input.title,
        heading: input.heading,
        excerpt: input.excerpt,
        body: body.join("\n\n"),
        hero_image_url: input.heroImageUrl || "",
        blocks: JSON.stringify(input.blocks ?? []),
        date: input.date,
        tags: (input.tags ?? []).join(", "),
        related_product_slugs: (current?.relatedProductSlugs ?? []).join(", "),
        related_scheme_slugs: (current?.relatedSchemeSlugs ?? []).join(", "),
        status: "published",
      },
    );
    return NextResponse.json({ ok: true, saved: "article", directus: articleResult });
  }

  return NextResponse.json({ error: "Invalid content payload" }, { status: 400 });
}
