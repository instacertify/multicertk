import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  defaultMenu,
  seedLogos,
  seedReviews,
  type CustomerLogo,
  type CustomerReview,
  type NavItem,
  type SiteMediaStore,
} from "@/data/site-media";

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

export function getMenu() {
  return readSiteMedia().menu;
}

export function getLogos() {
  return readSiteMedia().logos;
}

export function getReviews() {
  return readSiteMedia().reviews;
}
