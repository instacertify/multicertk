import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { CmsArticle, CmsPage } from "@/data/cms-seed";

export interface CmsOverrides {
  pages: Record<string, Partial<CmsPage>>;
  articles: Record<string, Partial<CmsArticle>>;
}

const storePath = path.join(process.cwd(), "data", "cms-overrides.json");

export function readCmsOverrides(): CmsOverrides {
  try {
    const raw = readFileSync(storePath, "utf8");
    const parsed = JSON.parse(raw) as CmsOverrides;
    return { pages: parsed.pages ?? {}, articles: parsed.articles ?? {} };
  } catch {
    return { pages: {}, articles: {} };
  }
}

export function writeCmsOverrides(next: CmsOverrides) {
  mkdirSync(path.dirname(storePath), { recursive: true });
  writeFileSync(storePath, JSON.stringify(next, null, 2));
}

export function savePageOverride(locale: string, page: Partial<CmsPage> & { slug: string }) {
  const store = readCmsOverrides();
  const key = `${page.slug}:${locale}`;
  store.pages[key] = { ...store.pages[key], ...page, locale };
  writeCmsOverrides(store);
  return store.pages[key];
}

export function saveArticleOverride(locale: string, article: Partial<CmsArticle> & { slug: string }) {
  const store = readCmsOverrides();
  const key = `${article.slug}:${locale}`;
  store.articles[key] = { ...store.articles[key], ...article, locale };
  writeCmsOverrides(store);
  return store.articles[key];
}

export function overridesExist() {
  return existsSync(storePath);
}
