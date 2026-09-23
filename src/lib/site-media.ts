import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { categories } from "@/data/catalog";
import {
  buildDefaultMenu,
  defaultMenu,
  seedLogos,
  seedReviews,
  type CustomerLogo,
  type CustomerReview,
  type NavChild,
  type NavItem,
  type SiteMediaStore,
} from "@/data/site-media";
import { listArticles } from "@/lib/cms";

const storePath = path.join(process.cwd(), "data", "site-media.json");

export function readSiteMedia(): SiteMediaStore {
  try {
    const parsed = JSON.parse(readFileSync(storePath, "utf8")) as Partial<SiteMediaStore>;
    return {
      logos: parsed.logos?.length ? parsed.logos : seedLogos,
      reviews: parsed.reviews?.length ? parsed.reviews : seedReviews,
      menu: parsed.menu?.length ? parsed.menu : defaultMenu,
    };
  } catch {
    return { logos: seedLogos, reviews: seedReviews, menu: defaultMenu };
  }
}

export function writeSiteMedia(next: SiteMediaStore) {
  mkdirSync(path.dirname(storePath), { recursive: true });
  writeFileSync(storePath, JSON.stringify(next, null, 2));
}

export function saveLogos(logos: CustomerLogo[]) {
  const store = readSiteMedia();
  store.logos = logos;
  writeSiteMedia(store);
  return store;
}

export function saveReviews(reviews: CustomerReview[]) {
  const store = readSiteMedia();
  store.reviews = reviews;
  writeSiteMedia(store);
  return store;
}

export function saveMenu(menu: NavItem[]) {
  const store = readSiteMedia();
  store.menu = menu;
  writeSiteMedia(store);
  return store;
}

export function siteMediaExists() {
  return existsSync(storePath);
}

function libraryMenu() {
  return buildDefaultMenu({
    categories: categories.map((category) => ({ slug: category.slug, name: category.name })),
    articles: listArticles("en").map((article) => ({ slug: article.slug, title: article.title })),
  });
}

function isCategoryHref(href: string) {
  return href.startsWith("/category/") || href.includes("category=");
}

function isBlogHref(href: string) {
  return href.startsWith("/blog/") && href !== "/blog";
}

function mergeChildren(stored: NavChild[], generated: NavChild[], itemId: string): NavChild[] {
  const labeled = stored.map((child) => {
    const match = generated.find((row) => row.href === child.href || row.id === child.id);
    return {
      ...child,
      group: child.group || match?.group,
      iconUrl: child.iconUrl || match?.iconUrl,
    };
  });
  const hrefs = new Set(labeled.map((child) => child.href));
  const fillCategories = ["certification", "qcos", "labs"].includes(itemId) && !labeled.some((child) => isCategoryHref(child.href));
  const fillBlogs = itemId === "resources" && !labeled.some((child) => isBlogHref(child.href));
  const extra = generated.filter((child) => {
    if (hrefs.has(child.href)) return false;
    if (isCategoryHref(child.href)) return fillCategories;
    if (isBlogHref(child.href)) return fillBlogs;
    return !labeled.some((current) => current.id === child.id);
  });
  return [...labeled, ...extra];
}

function mergeMenu(stored: NavItem[], generated: NavItem[]): NavItem[] {
  const generatedById = new Map(generated.map((item) => [item.id, item]));
  const merged = stored.map((item) => {
    const fallback = generatedById.get(item.id);
    if (!fallback) return item;
    return {
      ...item,
      children: mergeChildren(item.children ?? [], fallback.children ?? [], item.id),
    };
  });
  const seen = new Set(merged.map((item) => item.id));
  for (const item of generated) {
    if (!seen.has(item.id)) merged.push(item);
  }
  return merged;
}

export function getMenu() {
  const stored = readSiteMedia().menu;
  const generated = libraryMenu();
  if (!stored.length) return generated;
  return mergeMenu(stored, generated);
}

export function getLogos() {
  return readSiteMedia().logos;
}

export function getReviews() {
  return readSiteMedia().reviews;
}
