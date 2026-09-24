import { seedArticles, seedPages, type CmsArticle, type CmsPage, type CmsSection } from "@/data/cms-seed";
import { readCmsOverrides } from "./cms-store";

export type { CmsArticle, CmsPage, CmsSection };

function env(name: string) {
  return process.env[name]?.trim() || "";
}

export function directusUrl() {
  return env("DIRECTUS_URL").replace(/\/$/, "");
}

export function directusConfigured() {
  return Boolean(directusUrl() && env("DIRECTUS_TOKEN"));
}

function applyPageOverride(page: CmsPage, override?: Partial<CmsPage>): CmsPage {
  if (!override) return page;
  return {
    ...page,
    title: override.title ?? page.title,
    path: override.path ?? page.path,
    intro: override.intro ?? page.intro,
    heroImageUrl: override.heroImageUrl ?? page.heroImageUrl,
    heroImageAlt: override.heroImageAlt ?? page.heroImageAlt,
    galleryUrls: override.galleryUrls ?? page.galleryUrls,
    sections: override.sections ?? page.sections,
  };
}

function applyArticleOverride(article: CmsArticle, override?: Partial<CmsArticle>): CmsArticle {
  if (!override) return article;
  return { ...article, ...override, slug: article.slug, locale: override.locale ?? article.locale };
}

const reservedRouteSlugs = new Set([
  "admin",
  "api",
  "p",
  "product",
  "products",
  "labs",
  "lab",
  "blog",
  "search",
  "certifications",
  "testing",
  "qco",
  "category",
  "privacy",
  "contact",
  "about",
  "guide",
  "tenders",
  "marketplaces",
  "terms",
  "sitemap",
  "uploads",
  "robots",
  "en",
  "hi",
  "zh",
  "es",
  "fr",
  "ar",
  "ru",
  "bis-certification-consulting",
  "msds-authoring-service",
]);

const seedPageSlugs = new Set(seedPages.map((page) => page.slug));
const seedArticleSlugs = new Set(seedArticles.map((article) => article.slug));

export function slugifyLabel(value: string, max = 80) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, max);
}

export function isReservedPageSlug(slug: string) {
  return reservedRouteSlugs.has(slug) || seedPageSlugs.has(slug);
}

export function isCustomCmsPage(page: Pick<CmsPage, "slug" | "path">) {
  return page.path.startsWith("/p/") || !seedPageSlugs.has(page.slug);
}

export function isSeedArticle(slug: string) {
  return seedArticleSlugs.has(slug);
}

function pageFromOverride(slug: string, locale: string, override: Partial<CmsPage>): CmsPage | null {
  if (!override.title) return null;
  return {
    slug,
    path: override.path || `/p/${slug}`,
    locale,
    title: override.title,
    intro: override.intro ?? "",
    heroImageUrl: override.heroImageUrl,
    heroImageAlt: override.heroImageAlt,
    galleryUrls: override.galleryUrls,
    sections: override.sections ?? [],
  };
}

function localPages(locale: string): CmsPage[] {
  const overrides = readCmsOverrides();
  const bySlug = new Map<string, CmsPage>();
  for (const page of seedPages) {
    const localized = applyPageOverride(page, overrides.pages[`${page.slug}:${locale}`]);
    if (locale === "en") {
      bySlug.set(page.slug, localized);
      continue;
    }
    const fallback = applyPageOverride(page, overrides.pages[`${page.slug}:en`]);
    bySlug.set(page.slug, applyPageOverride(fallback, overrides.pages[`${page.slug}:${locale}`]));
  }
  for (const [key, override] of Object.entries(overrides.pages)) {
    const [slug, itemLocale] = key.split(":");
    if (itemLocale !== locale && itemLocale !== "en") continue;
    if (bySlug.has(slug)) continue;
    const created = pageFromOverride(slug, itemLocale || locale, override);
    if (created) bySlug.set(slug, created);
  }
  return [...bySlug.values()].map((page) => ({ ...page, locale }));
}

function localArticles(locale: string): CmsArticle[] {
  const overrides = readCmsOverrides();
  const bySlug = new Map<string, CmsArticle>();
  for (const article of seedArticles) {
    bySlug.set(article.slug, applyArticleOverride(article, overrides.articles[`${article.slug}:en`]));
  }
  for (const [key, override] of Object.entries(overrides.articles)) {
    const [slug, itemLocale] = key.split(":");
    if (itemLocale !== locale && itemLocale !== "en") continue;
    const current = bySlug.get(slug);
    if (current) {
      bySlug.set(slug, applyArticleOverride(current, override));
    } else if (override.slug && override.title && override.body) {
      bySlug.set(slug, {
        slug,
        locale: itemLocale || locale,
        title: override.title,
        heading: override.heading ?? override.title,
        excerpt: override.excerpt ?? "",
        body: override.body,
        heroImageUrl: override.heroImageUrl,
        blocks: override.blocks,
        date: override.date ?? new Date().toISOString().slice(0, 10),
        tags: override.tags ?? [],
        relatedProductSlugs: override.relatedProductSlugs ?? [],
        relatedSchemeSlugs: override.relatedSchemeSlugs ?? [],
        status: override.status ?? "published",
      });
    }
  }
  return sortArticles([...bySlug.values()].filter((item) => item.status !== "draft"));
}

function sortArticles(rows: CmsArticle[]) {
  return rows.slice().sort((left, right) => {
    const byDate = (right.date || "").localeCompare(left.date || "");
    return byDate || left.title.localeCompare(right.title);
  });
}

function paragraphs(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return String(value || "")
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function csv(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return String(value || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

async function directusItems<T>(collection: string, query: string): Promise<T[] | null> {
  const base = directusUrl();
  const token = env("DIRECTUS_TOKEN");
  if (!base) return null;
  try {
    const response = await fetch(`${base}/items/${collection}?${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      next: { revalidate: 30 },
    });
    if (!response.ok) return null;
    const json = (await response.json()) as { data?: T[] };
    return json.data ?? null;
  } catch {
    return null;
  }
}

type DirectusPage = { slug: string; locale: string; title: string; intro: string; path?: string };
type DirectusSection = { page_slug: string; locale: string; sort?: number; key?: string; heading: string; body: string };
type DirectusArticle = {
  slug: string;
  locale: string;
  title: string;
  heading?: string;
  excerpt?: string;
  body?: string;
  date?: string;
  tags?: string;
  related_product_slugs?: string;
  related_scheme_slugs?: string;
  status?: string;
};

async function livePages(locale: string): Promise<CmsPage[] | null> {
  const rows = await directusItems<DirectusPage>(
    "cms_pages",
    `filter[locale][_eq]=${encodeURIComponent(locale)}&limit=100`,
  );
  if (!rows?.length) return null;
  const sections =
    (await directusItems<DirectusSection>(
      "cms_sections",
      `filter[locale][_eq]=${encodeURIComponent(locale)}&sort=sort&limit=400`,
    )) ?? [];
  return rows.map((row) => ({
    slug: row.slug,
    path: row.path || `/${row.slug === "home" ? "" : row.slug}`,
    locale: row.locale,
    title: row.title,
    intro: row.intro,
    sections: sections
      .filter((section) => section.page_slug === row.slug)
      .map((section) => ({
        key: section.key || section.heading.toLowerCase().replace(/\s+/g, "-"),
        heading: section.heading,
        body: paragraphs(section.body),
      })),
  }));
}

async function liveArticles(locale: string): Promise<CmsArticle[] | null> {
  const rows = await directusItems<DirectusArticle>(
    "cms_articles",
    `filter[locale][_eq]=${encodeURIComponent(locale)}&filter[status][_eq]=published&sort=-date&limit=2000`,
  );
  if (!rows?.length) return null;
  return rows.map((row) => ({
    slug: row.slug,
    locale: row.locale,
    title: row.title,
    heading: row.heading || row.title,
    excerpt: row.excerpt || "",
    body: paragraphs(row.body),
    date: row.date || "",
    tags: csv(row.tags),
    relatedProductSlugs: csv(row.related_product_slugs),
    relatedSchemeSlugs: csv(row.related_scheme_slugs),
    status: row.status === "draft" ? "draft" : "published",
  }));
}

export function listPages(locale = "en"): CmsPage[] {
  return localPages(locale);
}

export function listArticles(locale = "en"): CmsArticle[] {
  return sortArticles(localArticles(locale));
}

export async function getPages(locale: string): Promise<CmsPage[]> {
  const local = localPages(locale);
  const live = await livePages(locale);
  if (!live?.length) return local;
  const bySlug = new Map(local.map((page) => [page.slug, page]));
  for (const page of live) {
    if (!bySlug.has(page.slug)) bySlug.set(page.slug, page);
  }
  return [...bySlug.values()];
}

export async function getPage(slug: string, locale: string): Promise<CmsPage | undefined> {
  const pages = await getPages(locale);
  return pages.find((page) => page.slug === slug) ?? localPages("en").find((page) => page.slug === slug);
}

export async function getArticles(locale: string): Promise<CmsArticle[]> {
  const local = localArticles(locale);
  const live = await liveArticles(locale);
  if (!live?.length) return sortArticles(local);
  const bySlug = new Map(local.map((article) => [article.slug, article]));
  for (const article of live) bySlug.set(article.slug, article);
  return sortArticles([...bySlug.values()].filter((item) => item.status !== "draft"));
}

export async function getArticle(slug: string, locale: string): Promise<CmsArticle | undefined> {
  const articles = await getArticles(locale);
  return articles.find((article) => article.slug === slug) ?? localArticles("en").find((article) => article.slug === slug);
}

export function sectionHeading(page: CmsPage | undefined, key: string, fallback: string) {
  return page?.sections.find((section) => section.key === key)?.heading || fallback;
}

export function sectionBody(page: CmsPage | undefined, key: string, fallback = "") {
  const body = page?.sections.find((section) => section.key === key)?.body ?? [];
  return body.length ? body.join(" ") : fallback;
}
