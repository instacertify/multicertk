export const site = {
  name: "Certko",
  tagline: "Compliance. Assured.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://certko.com",
  email: "info@certko.com",
  phone: "+91-9999118039",
  phoneHref: "tel:+919999118039",
  address:
    "A-34, 4th Floor, Sector 63A, Noida, Gautam Buddha Nagar, Uttar Pradesh – 201301, India",
  description:
    "Find the right certification and testing for your product. Certko maps BIS, BEE, GMARK, CE, FCC, SABER, WPC and lab standards so every scheme is searchable and interlinked.",
} as const;

export const localesMeta = {
  en: { htmlLang: "en", dir: "ltr" as const, label: "English", hreflang: "en" },
  hi: { htmlLang: "hi", dir: "ltr" as const, label: "हिन्दी", hreflang: "hi" },
  ar: { htmlLang: "ar", dir: "rtl" as const, label: "العربية", hreflang: "ar" },
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
  return {
    en: absUrl(localizedPath("en", path)),
    hi: absUrl(localizedPath("hi", path)),
    ar: absUrl(localizedPath("ar", path)),
    "x-default": absUrl(localizedPath("en", path)),
  };
}
