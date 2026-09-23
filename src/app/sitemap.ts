import type { MetadataRoute } from "next";
import {
  beeProducts,
  categories,
  countries,
  disciplines,
  gmarkProducts,
  labs,
  posts,
  products,
  schemes,
  tests,
} from "@/data/catalog";
import { languageAlternates, site } from "@/lib/site";

function entry(path: string, changefreq: MetadataRoute.Sitemap[number]["changeFrequency"], priority: number) {
  return {
    url: `${site.url}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: changefreq,
    priority,
    alternates: { languages: languageAlternates(path) },
  } satisfies MetadataRoute.Sitemap[number];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    entry("/", "weekly", 1),
    entry("/products", "weekly", 0.9),
    entry("/products/all", "weekly", 0.9),
    entry("/certifications", "monthly", 0.8),
    entry("/certifications/countries", "monthly", 0.8),
    entry("/testing", "weekly", 0.8),
    entry("/labs", "weekly", 0.8),
    entry("/qco", "weekly", 0.8),
    entry("/blog", "weekly", 0.7),
    entry("/sitemap", "weekly", 0.4),
    entry("/contact", "monthly", 0.6),
    entry("/about", "monthly", 0.6),
    entry("/guide", "monthly", 0.8),
    entry("/tenders", "monthly", 0.6),
    entry("/marketplaces", "monthly", 0.6),
    entry("/bis-certification-consulting", "monthly", 0.6),
    entry("/msds-authoring-service", "monthly", 0.6),
    entry("/privacy", "yearly", 0.4),
    entry("/privacy/cookies", "yearly", 0.3),
    entry("/privacy/gdpr-and-dpdp", "yearly", 0.3),
    entry("/privacy/data-request", "yearly", 0.3),
    entry("/terms", "yearly", 0.4),
    ...categories.map((item) => entry(`/category/${item.slug}`, "weekly", 0.8)),
    ...schemes.map((item) => entry(`/certifications/${item.slug}`, "monthly", 0.8)),
    ...countries.map((item) => entry(`/certifications/countries/${item.slug}`, "monthly", 0.7)),
    ...products.map((item) => entry(`/product/${item.slug}`, "weekly", 0.7)),
    ...labs.map((item) => entry(`/labs/${item.slug}`, "weekly", 0.6)),
    ...disciplines.map((item) => entry(`/testing/${item.slug}`, "weekly", 0.7)),
    ...tests.map((item) => entry(`/testing/${item.discipline}/${item.slug}`, "weekly", 0.6)),
    ...beeProducts.map((item) => entry(`/certifications/bee/products/${item.slug}`, "monthly", 0.6)),
    ...gmarkProducts.map((item) => entry(`/certifications/g-mark/products/${item.slug}`, "monthly", 0.6)),
    ...posts.map((item) => entry(`/blog/${item.slug}`, "monthly", 0.5)),
  ];
}
