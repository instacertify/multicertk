import { NextResponse } from "next/server";
import { z } from "zod";
import { requireEditorSession } from "@/lib/auth";
import { invalidateSearchDocuments } from "@/lib/search";
import {
  getArticle,
  getPage,
  isCustomCmsPage,
  isReservedPageSlug,
  isSeedArticle,
  listArticles,
  listPages,
  slugifyLabel,
} from "@/lib/cms";
import { upsertDirectusItem } from "@/lib/directus-write";
import { deleteArticleOverride, deletePageOverride, saveArticleOverride, savePageOverride } from "@/lib/cms-store";

const pageSchema = z.object({
  kind: z.literal("page"),
  slug: z.string().trim().min(1).max(80),
  locale: z.string().trim().min(2).max(8).default("en"),
  title: z.string().trim().min(1).max(200),
  intro: z.string().trim().max(4000),
  heroImageUrl: z.string().trim().max(240).optional(),
  heroImageAlt: z.string().trim().max(160).optional(),
  galleryUrls: z.array(z.string().trim().max(240)).max(8).optional(),
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
  const denied = await requireEditorSession(request);
  if (denied) return denied;
  const raw = await request.json().catch(() => null);
  const pageParsed = pageSchema.safeParse(raw);
  const articleParsed = articleSchema.safeParse(raw);

  if (pageParsed.success) {
    const input = pageParsed.data;
    const slug = slugifyLabel(input.slug) || input.slug;
    const current = await getPage(slug, input.locale);
    if (!current && isReservedPageSlug(slug)) {
      return NextResponse.json({ error: "That page address is reserved. Choose another slug." }, { status: 400 });
    }
    const path = current?.path || `/p/${slug}`;
    savePageOverride(input.locale, {
      slug,
      path,
      title: input.title,
      intro: input.intro,
      heroImageUrl: input.heroImageUrl,
      heroImageAlt: input.heroImageAlt,
      galleryUrls: input.galleryUrls,
      sections: input.sections,
    });
    const pageResult = await upsertDirectusItem(
      "cms_pages",
      "slug",
      slug,
      { locale: input.locale },
      {
        slug,
        locale: input.locale,
        title: input.title,
        intro: input.intro,
        path,
        hero_image_url: input.heroImageUrl || "",
        hero_image_alt: input.heroImageAlt || "",
      },
    );
    for (const [index, section] of input.sections.entries()) {
      await upsertDirectusItem(
        "cms_sections",
        "key",
        section.key,
        { locale: input.locale, page_slug: slug },
        {
          page_slug: slug,
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
    invalidateSearchDocuments();
    return NextResponse.json({ ok: true, saved: "page", slug, path, created: !current, directus: pageResult });
  }

  if (articleParsed.success) {
    const input = articleParsed.data;
    const slug = slugifyLabel(input.slug, 180) || input.slug;
    const current = await getArticle(slug, input.locale);
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
      slug,
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
      slug,
      { locale: input.locale },
      {
        slug,
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
    invalidateSearchDocuments();
    return NextResponse.json({ ok: true, saved: "article", slug, created: !current, directus: articleResult });
  }

  return NextResponse.json({ error: "Invalid content payload" }, { status: 400 });
}

const deleteSchema = z.object({
  kind: z.enum(["page", "article"]),
  slug: z.string().trim().min(1).max(180),
  locale: z.string().trim().min(2).max(8).default("en"),
});

export async function DELETE(request: Request) {
  const denied = await requireEditorSession(request);
  if (denied) return denied;
  const parsed = deleteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid delete payload" }, { status: 400 });
  const { kind, slug, locale } = parsed.data;

  if (kind === "page") {
    const page = await getPage(slug, locale);
    if (!page || !isCustomCmsPage(page)) {
      return NextResponse.json({ error: "Only pages you added can be removed." }, { status: 400 });
    }
    deletePageOverride(locale, slug);
    invalidateSearchDocuments();
    return NextResponse.json({ ok: true, deleted: "page", slug });
  }

  if (isSeedArticle(slug)) {
    return NextResponse.json({ error: "Seeded notes stay in the library. Edit the copy instead." }, { status: 400 });
  }
  deleteArticleOverride(locale, slug);
  invalidateSearchDocuments();
  return NextResponse.json({ ok: true, deleted: "article", slug });
}
