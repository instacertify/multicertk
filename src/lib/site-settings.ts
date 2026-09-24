import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  defaultCookieRows,
  defaultSettings,
  type CookieSettings,
  type SeoSettings,
  type SiteSettings,
} from "@/data/site-settings";

const storePath = path.join(process.cwd(), "data", "site-settings.json");

export function readSiteSettings(): SiteSettings {
  try {
    const parsed = JSON.parse(readFileSync(storePath, "utf8")) as Partial<SiteSettings>;
    return {
      seo: { ...defaultSettings.seo, ...parsed.seo },
      cookies: {
        ...defaultSettings.cookies,
        ...parsed.cookies,
        rows: parsed.cookies?.rows?.length ? parsed.cookies.rows : defaultCookieRows,
      },
    };
  } catch {
    return defaultSettings;
  }
}

export function writeSiteSettings(next: SiteSettings) {
  mkdirSync(path.dirname(storePath), { recursive: true });
  writeFileSync(storePath, JSON.stringify(next, null, 2));
  return next;
}

export function getSeo(): SeoSettings {
  return readSiteSettings().seo;
}

export function getCookieSettings(): CookieSettings {
  return readSiteSettings().cookies;
}

export function saveSeo(seo: SeoSettings) {
  const store = readSiteSettings();
  return writeSiteSettings({ ...store, seo }).seo;
}

export function saveCookies(cookies: CookieSettings) {
  const store = readSiteSettings();
  return writeSiteSettings({ ...store, cookies }).cookies;
}
