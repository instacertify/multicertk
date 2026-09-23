import type { Metadata } from "next";
import { getSeo } from "./site-settings";
import { languageAlternates, localizedPath, site } from "./site";

export function pageMetadata({
  locale,
  path,
  title,
  description,
  index = true,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  index?: boolean;
}): Metadata {
  const canonical = localizedPath(locale, path);
  const seo = getSeo();
  const allowIndex = index && seo.indexable;
  return {
    title,
    description,
    keywords: seo.keywords || undefined,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    robots: allowIndex ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: `${site.url}${canonical === "/" ? "" : canonical}`,
      siteName: site.name,
      locale,
      type: "website",
      images: [{ url: seo.ogImage || "/certko-logo.png", width: 1416, height: 391, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      creator: seo.twitterHandle || undefined,
    },
  };
}

export function jsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  return {
    __html: JSON.stringify(data),
  };
}

export function organizationLd() {
  const seo = getSeo();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seo.organizationName || site.name,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    slogan: site.tagline,
    logo: `${site.url}/certko-logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "A-34, 4th Floor, Sector 63A",
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      postalCode: "201301",
      addressCountry: "IN",
    },
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[], locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${localizedPath(locale, item.path)}`,
    })),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
