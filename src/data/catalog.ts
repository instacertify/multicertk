import { beeProducts, gmarkProducts, posts, qcos } from "./qcos";
import { categories } from "./categories";
import { countries } from "./countries";
import { labs } from "./labs";
import { products } from "./products";
import { schemes } from "./schemes";
import { tests } from "./tests";
import type { TestDiscipline } from "./types";

export {
  beeProducts,
  categories,
  countries,
  gmarkProducts,
  labs,
  posts,
  products,
  qcos,
  schemes,
  tests,
};

export const disciplines: { slug: TestDiscipline; name: string; summary: string }[] = [
  { slug: "chemical-testing", name: "Chemical Testing", summary: "Composition, heavy metals, leachables and chemical compliance." },
  { slug: "electrical-testing", name: "Electrical Testing", summary: "Safety, performance and compliance for lamps, appliances and electronics." },
  { slug: "emc-testing", name: "EMC Testing", summary: "Emissions, immunity and radio evidence for CE, FCC and WPC." },
  { slug: "physical-testing", name: "Physical Testing", summary: "Dimensions, optical and material-property tests." },
  { slug: "microbiology-testing", name: "Microbiology Testing", summary: "Food and water microbiology under FSSAI and BIS scopes." },
  { slug: "mechanical-testing", name: "Mechanical Testing", summary: "Strength, impact, fatigue and construction tests." },
];

export function getScheme(slug: string) {
  return schemes.find((item) => item.slug === slug);
}

export function getCountry(slug: string) {
  return countries.find((item) => item.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((item) => item.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((item) => item.slug === slug);
}

export function getLab(slug: string) {
  return labs.find((item) => item.slug === slug);
}

export function getTest(slug: string) {
  return tests.find((item) => item.slug === slug);
}

export function getQco(slug: string) {
  return qcos.find((item) => item.slug === slug);
}

export function getPost(slug: string) {
  return posts.find((item) => item.slug === slug);
}

export function productsByCategory(slug: string) {
  return products.filter((item) => item.categorySlug === slug);
}

export function productsByScheme(slug: string) {
  return products.filter((item) => item.schemeSlugs.includes(slug));
}

export function productsByCountry(slug: string) {
  return products.filter((item) => item.countrySlugs.includes(slug));
}

export function productsByLab(slug: string) {
  return products.filter((item) => item.labSlugs.includes(slug));
}

export function labsForProduct(productSlug: string) {
  const product = getProduct(productSlug);
  if (!product) return [];
  return labs.filter((lab) => product.labSlugs.includes(lab.slug));
}

export function testsForProduct(productSlug: string) {
  const product = getProduct(productSlug);
  if (!product) return [];
  return tests.filter((test) => product.testSlugs.includes(test.slug));
}

export function testsByDiscipline(slug: TestDiscipline) {
  return tests.filter((test) => test.discipline === slug);
}

export function relatedProducts(productSlug: string, limit = 4) {
  const product = getProduct(productSlug);
  if (!product) return [];
  return products
    .filter((item) => item.slug !== productSlug)
    .map((item) => {
      let score = 0;
      if (item.categorySlug === product.categorySlug) score += 4;
      score += item.schemeSlugs.filter((scheme) => product.schemeSlugs.includes(scheme)).length * 2;
      score += item.labSlugs.filter((lab) => product.labSlugs.includes(lab)).length;
      score += item.testSlugs.filter((test) => product.testSlugs.includes(test)).length * 2;
      if (item.qcoSlug && item.qcoSlug === product.qcoSlug) score += 3;
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

export function formatInr(value: number) {
  if (value >= 100000) {
    const lakhs = value / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
  }
  if (value >= 1000) {
    const thousands = value / 1000;
    return `₹${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
  }
  return `₹${value}`;
}

export function formatRange(min: number, max: number) {
  if (min === max) return formatInr(min);
  return `${formatInr(min)} – ${formatInr(max)}`;
}

export type SearchDocType =
  | "product"
  | "scheme"
  | "lab"
  | "test"
  | "category"
  | "country"
  | "qco"
  | "post";

export interface SearchDocument {
  id: string;
  type: SearchDocType;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  tags: string[];
}

export function buildSearchDocuments(): SearchDocument[] {
  const docs: SearchDocument[] = [];

  for (const product of products) {
    const category = getCategory(product.categorySlug);
    docs.push({
      id: `product:${product.slug}`,
      type: "product",
      title: product.name,
      subtitle: `${product.standard} · HSN ${product.hsn}`,
      description: product.excerpt,
      url: `/product/${product.slug}`,
      tags: [
        product.standard,
        product.hsn,
        product.qcoStatus,
        category?.name ?? "",
        ...product.schemeSlugs,
      ],
    });
  }

  for (const scheme of schemes) {
    docs.push({
      id: `scheme:${scheme.slug}`,
      type: "scheme",
      title: scheme.name,
      subtitle: scheme.regulator,
      description: scheme.summary,
      url: `/certifications/${scheme.slug}`,
      tags: [scheme.shortName, scheme.family, ...scheme.countrySlugs],
    });
  }

  for (const lab of labs) {
    docs.push({
      id: `lab:${lab.slug}`,
      type: "lab",
      title: lab.name,
      subtitle: `${lab.city}, ${lab.state} · ${lab.bisCode}`,
      description: lab.standardCodes.join(", "),
      url: `/labs/${lab.slug}`,
      tags: [lab.bisCode, lab.city, lab.state, ...lab.standardCodes, ...lab.categorySlugs],
    });
  }

  for (const test of tests) {
    docs.push({
      id: `test:${test.slug}`,
      type: "test",
      title: test.name,
      subtitle: test.standard,
      description: test.summary,
      url: `/testing/${test.discipline}/${test.slug}`,
      tags: [test.discipline, test.standard],
    });
  }

  for (const category of categories) {
    docs.push({
      id: `category:${category.slug}`,
      type: "category",
      title: category.name,
      subtitle: `${productsByCategory(category.slug).length} products`,
      description: category.summary,
      url: `/category/${category.slug}`,
      tags: [category.slug],
    });
  }

  for (const country of countries) {
    docs.push({
      id: `country:${country.slug}`,
      type: "country",
      title: country.name,
      subtitle: country.region,
      description: country.summary,
      url: `/certifications/countries/${country.slug}`,
      tags: [country.region, ...country.schemeSlugs],
    });
  }

  for (const qco of qcos) {
    docs.push({
      id: `qco:${qco.slug}`,
      type: "qco",
      title: qco.name,
      subtitle: `${qco.ministry} · ${qco.status}`,
      description: qco.summary,
      url: `/qco#${qco.slug}`,
      tags: [qco.status, qco.ministry],
    });
  }

  for (const post of posts) {
    docs.push({
      id: `post:${post.slug}`,
      type: "post",
      title: post.title,
      subtitle: post.date,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      tags: post.tags,
    });
  }

  return docs;
}

export function catalogStats() {
  return {
    products: products.length,
    labs: labs.length,
    tests: tests.length,
    schemes: schemes.length,
    categories: categories.length,
    countries: countries.length,
    qcos: qcos.length,
  };
}
