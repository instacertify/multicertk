import { locales, type Locale } from "@/i18n/routing";

export const site = {
  name: "Certko",
  tagline: "Compliance. Assured.",
  legalName: "Instacertify Labs Private Limited",
  brandLegal: "Certko by Instacertify Labs Private Limited",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://certko.com",
  email: "info@certko.com",
  phone: "+91-9999118039",
  phoneHref: "tel:+919999118039",
  address:
    "A-34, 4th Floor, Sector 63A, Noida, Gautam Buddha Nagar, Uttar Pradesh – 201301, India",
  description:
    "Look up a product, HSN or IS number. Certko maps BIS CRS and ISI, BEE, G-Mark, CE, FCC, SABER and the labs that test them.",
} as const;

export const localesMeta: Record<
  Locale,
  { htmlLang: string; dir: "ltr" | "rtl"; label: string; hreflang: string }
> = {
  en: { htmlLang: "en", dir: "ltr", label: "English", hreflang: "en" },
  hi: { htmlLang: "hi", dir: "ltr", label: "हिन्दी", hreflang: "hi" },
  zh: { htmlLang: "zh-Hans", dir: "ltr", label: "中文", hreflang: "zh-Hans" },
  es: { htmlLang: "es", dir: "ltr", label: "Español", hreflang: "es" },
  fr: { htmlLang: "fr", dir: "ltr", label: "Français", hreflang: "fr" },
  ar: { htmlLang: "ar", dir: "rtl", label: "العربية", hreflang: "ar" },
  ru: { htmlLang: "ru", dir: "ltr", label: "Русский", hreflang: "ru" },
};

export function absUrl(path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${site.url}${clean === "/" ? "" : clean}`;
}

export function localizedPath(locale: string, path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return clean;
  return `/${locale}${clean === "/" ? "" : clean}`;
}

export function languageAlternates(path: string) {
  const languages: Record<string, string> = { "x-default": absUrl(localizedPath("en", path)) };
  for (const locale of locales) {
    languages[localesMeta[locale].hreflang] = absUrl(localizedPath(locale, path));
  }
  return languages;
}

/** Public copy uses Certko. The legal company name is reserved for About. */
export function asCertkoBrand(value: string) {
  return value
    .replace(/Instacertify Labs Private Limited/gi, site.name)
    .replace(/Instacertify/gi, site.name);
}
