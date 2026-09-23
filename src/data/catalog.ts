import library from "./generated/library.json";
import { countries } from "./countries";
import { posts } from "./qcos";
import { schemes } from "./schemes";
import { tests as seedTests } from "./tests";
import type {
  BeeProduct,
  Category,
  EuSector,
  GmarkProduct,
  Lab,
  LabScope,
  Product,
  Qco,
  QcoStatus,
  TestDiscipline,
  TestService,
} from "./types";

export { countries, posts, schemes };

type RawProduct = {
  slug: string;
  name: string;
  standard: string;
  standardKey: string;
  hsn: string;
  hsn4?: string;
  category: string;
  categorySlug: string;
  schemeSlugs: string[];
  schemeLabel?: string;
  qcoStatus: string;
  qcoLabel?: string;
  qcoOrder?: string;
  qcoSlug?: string;
  testCostMin: number;
  testCostMax: number;
  timeline: string;
  markingFee: Product["markingFee"];
  unit?: string;
  excerpt: string;
  labSlugs?: string[];
  labCount?: number;
  countrySlugs?: string[];
  testSlugs?: string[];
};

type RawLab = {
  slug: string;
  name: string;
  city: string;
  state: string;
  code: string;
  phone?: string;
  email?: string;
  address?: string;
  contact?: string;
  categorySlugs: string[];
  standardKeys: string[];
};

type RawScope = LabScope;
type RawQco = Qco & { standard?: string; scheme?: string };

const raw = library as {
  products: RawProduct[];
  labs: RawLab[];
  scopes: RawScope[];
  categories: Category[];
  bee: BeeProduct[];
  gmark: GmarkProduct[];
  eu: EuSector[];
  qcos: RawQco[];
};

export const scopes: LabScope[] = raw.scopes;

const scopeByLab = new Map<string, LabScope[]>();
const scopeByKey = new Map<string, LabScope[]>();
for (const scope of scopes) {
  const labRows = scopeByLab.get(scope.labSlug) ?? [];
  labRows.push(scope);
  scopeByLab.set(scope.labSlug, labRows);
  const keyRows = scopeByKey.get(scope.standardKey) ?? [];
  keyRows.push(scope);
  scopeByKey.set(scope.standardKey, keyRows);
}

function asStatus(value: string): QcoStatus {
  if (value === "mandatory" || value === "upcoming") return value;
  return "voluntary";
}

export const products: Product[] = raw.products.map((item) => ({
  slug: item.slug,
  name: item.name,
  standard: item.standard,
  standardKey: item.standardKey,
  hsn: item.hsn,
  hsn4: item.hsn4,
  categorySlug: item.categorySlug,
  schemeSlugs: item.schemeSlugs,
  schemeLabel: item.schemeLabel,
  qcoStatus: asStatus(item.qcoStatus),
  qcoSlug: item.qcoSlug,
  qcoLabel: item.qcoLabel,
  qcoOrder: item.qcoOrder,
  testCostMin: item.testCostMin,
  testCostMax: item.testCostMax,
  labCount: item.labCount ?? item.labSlugs?.length ?? 0,
  timeline: item.timeline,
  markingFee: item.markingFee,
  labSlugs: item.labSlugs ?? [],
  testSlugs: item.testSlugs ?? [],
  countrySlugs: item.countrySlugs ?? ["india"],
  excerpt: item.excerpt,
  unit: item.unit,
}));

export const labs: Lab[] = raw.labs.map((lab) => {
  const labScopes = scopeByLab.get(lab.slug) ?? [];
  const prices = labScopes.map((row) => row.price).filter((price) => price > 0);
  return {
    slug: lab.slug,
    name: lab.name,
    city: lab.city,
    state: lab.state,
    bisCode: lab.code,
    categorySlugs: lab.categorySlugs,
    standardCodes: lab.standardKeys,
    costMin: prices.length ? Math.min(...prices) : 0,
    costMax: prices.length ? Math.max(...prices) : 0,
    scopes: labScopes.length || lab.standardKeys.length,
    phone: lab.phone,
    email: lab.email,
    address: lab.address,
    contact: lab.contact,
  };
});

export const categories: Category[] = raw.categories;
export const beeProducts: BeeProduct[] = raw.bee;
export const gmarkProducts: GmarkProduct[] = raw.gmark;
export const euSectors: EuSector[] = raw.eu;
export const qcos: Qco[] = raw.qcos.map((item) => ({
  slug: item.slug,
  name: item.name,
  ministry: item.ministry,
  status: asStatus(item.status),
  deadline: item.deadline || undefined,
  productSlugs: item.productSlugs ?? [],
  summary: item.summary,
  standard: item.standard,
  scheme: item.scheme,
}));

function digitsFrom(value: string) {
  return [...value.matchAll(/\d{3,5}/g)].map((match) => match[0]);
}

export const tests: TestService[] = seedTests.map((test) => {
  const digits = digitsFrom(test.standard);
  const matched = products.filter((product) => digits.some((digit) => product.standard.includes(digit)));
  return {
    ...test,
    productSlugs: matched.slice(0, 16).map((product) => product.slug),
    labSlugs: [...new Set(matched.flatMap((product) => product.labSlugs))].slice(0, 8),
  };
});

export const disciplines: { slug: TestDiscipline; name: string; summary: string }[] = [
  { slug: "chemical-testing", name: "Chemical Testing", summary: "Composition, heavy metals, leachables and chemical compliance." },
  { slug: "electrical-testing", name: "Electrical Testing", summary: "Safety, performance and compliance for lamps, appliances and electronics." },
  { slug: "emc-testing", name: "EMC Testing", summary: "Emissions, immunity and radio evidence for CE, FCC and WPC." },
  { slug: "physical-testing", name: "Physical Testing", summary: "Dimensions, optical and material-property tests." },
  { slug: "microbiology-testing", name: "Microbiology Testing", summary: "Food and water microbiology under FSSAI and BIS scopes." },
  { slug: "mechanical-testing", name: "Mechanical Testing", summary: "Strength, impact, fatigue and construction tests." },
];

const productBySlug = new Map(products.map((item) => [item.slug, item]));
const labBySlug = new Map(labs.map((item) => [item.slug, item]));
const categoryBySlug = new Map(categories.map((item) => [item.slug, item]));
const schemeBySlug = new Map(schemes.map((item) => [item.slug, item]));
const countryBySlug = new Map(countries.map((item) => [item.slug, item]));
const qcoBySlug = new Map(qcos.map((item) => [item.slug, item]));
const testBySlug = new Map(tests.map((item) => [item.slug, item]));
const beeBySlug = new Map(beeProducts.map((item) => [item.slug, item]));
const gmarkBySlug = new Map(gmarkProducts.map((item) => [item.slug, item]));
const euBySlug = new Map(euSectors.map((item) => [item.slug, item]));
const postBySlug = new Map(posts.map((item) => [item.slug, item]));

export function getScheme(slug: string) {
  return schemeBySlug.get(slug);
}

export function getCountry(slug: string) {
  return countryBySlug.get(slug);
}

export function getCategory(slug: string) {
  return categoryBySlug.get(slug);
}

export function getProduct(slug: string) {
  return productBySlug.get(slug);
}

export function getLab(slug: string) {
  return labBySlug.get(slug);
}

export function getTest(slug: string) {
  return testBySlug.get(slug);
}

export function getQco(slug: string) {
  return qcoBySlug.get(slug);
}

export function getBee(slug: string) {
  return beeBySlug.get(slug);
}

export function getGmark(slug: string) {
  return gmarkBySlug.get(slug);
}

export function getEu(slug: string) {
  return euBySlug.get(slug);
}

export function getPost(slug: string) {
  return postBySlug.get(slug);
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

export function productsByStandardKey(key: string) {
  return products.filter((item) => item.standardKey === key);
}

export function labsForProduct(productSlug: string) {
  const product = getProduct(productSlug);
  if (!product) return [];
  return product.labSlugs.map((slug) => labBySlug.get(slug)).filter((lab): lab is Lab => Boolean(lab));
}

export function scopesForProduct(productSlug: string) {
  const product = getProduct(productSlug);
  if (!product) return [];
  return product.standardKey ? (scopeByKey.get(product.standardKey) ?? []) : [];
}

export function scopesForLab(labSlug: string) {
  return scopeByLab.get(labSlug) ?? [];
}

export function testsForProduct(productSlug: string) {
  return tests.filter((test) => test.productSlugs.includes(productSlug));
}

export function testsByDiscipline(slug: TestDiscipline) {
  return tests.filter((test) => test.discipline === slug);
}

export function beeForProduct(productSlug: string) {
  return beeProducts.filter((item) => item.relatedProductSlug === productSlug);
}

export function gmarkForProduct(productSlug: string) {
  return gmarkProducts.filter((item) => item.relatedProductSlug === productSlug);
}

export function relatedProducts(productSlug: string, limit = 6) {
  const product = getProduct(productSlug);
  if (!product) return [];
  return products
    .filter((item) => item.slug !== productSlug)
    .map((item) => {
      let score = 0;
      if (item.categorySlug === product.categorySlug) score += 4;
      if (item.standardKey && item.standardKey === product.standardKey) score += 8;
      score += item.schemeSlugs.filter((scheme) => product.schemeSlugs.includes(scheme)).length * 2;
      score += item.labSlugs.filter((lab) => product.labSlugs.includes(lab)).length;
      if (item.qcoSlug && item.qcoSlug === product.qcoSlug) score += 3;
      if (item.hsn4 && item.hsn4 === product.hsn4) score += 2;
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

export function featuredProducts(limit = 6) {
  const hints = [
    /laptops?\s*\/?\s*notebooks?/i,
    /mobile phones$/i,
    /packaged drinking water other than/i,
    /ordinary portland cement/i,
    /room air conditioners specification part 1/i,
    /self-ballasted led lamps$/i,
    /protective helmet for two wheeler/i,
    /safety of toys part 1/i,
  ];
  const picked: Product[] = [];
  for (const hint of hints) {
    const match = products.find((item) => hint.test(item.name) && !picked.includes(item));
    if (match) picked.push(match);
  }
  if (picked.length < limit) {
    const extras = [...products]
      .filter((item) => item.qcoStatus === "mandatory" && item.labCount > 0 && !picked.includes(item))
      .sort((a, b) => b.labCount - a.labCount);
    picked.push(...extras.slice(0, limit - picked.length));
  }
  return picked.slice(0, limit);
}

export function filterProducts(filters: {
  q?: string;
  category?: string;
  scheme?: string;
  status?: string;
}) {
  const query = filters.q?.trim().toLowerCase() ?? "";
  return products.filter((item) => {
    if (filters.category && item.categorySlug !== filters.category) return false;
    if (filters.scheme && !item.schemeSlugs.includes(filters.scheme)) return false;
    if (filters.status && item.qcoStatus !== filters.status) return false;
    if (!query) return true;
    const hay = `${item.name} ${item.standard} ${item.hsn} ${item.hsn4 ?? ""} ${item.excerpt}`.toLowerCase();
    return hay.includes(query) || (item.standardKey ?? "").toLowerCase().includes(query.replace(/\s+/g, ""));
  });
}

export function filterLabs(filters: { q?: string; state?: string }) {
  const query = filters.q?.trim().toLowerCase() ?? "";
  return labs.filter((lab) => {
    if (filters.state && lab.state.toLowerCase() !== filters.state.toLowerCase()) return false;
    if (!query) return true;
    const hay = `${lab.name} ${lab.city} ${lab.state} ${lab.bisCode} ${lab.standardCodes.join(" ")}`.toLowerCase();
    return hay.includes(query);
  });
}

export function formatInr(value: number) {
  if (!value) return "On request";
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
  if (!min && !max) return "On request";
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
  | "post"
  | "bee"
  | "gmark"
  | "eu";

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
        product.standardKey ?? "",
        product.hsn,
        product.hsn4 ?? "",
        product.qcoStatus,
        product.schemeLabel ?? "",
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
      description: lab.standardCodes.slice(0, 12).join(", "),
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
      url: `/qco/${qco.slug}`,
      tags: [qco.status, qco.ministry, qco.standard ?? "", qco.scheme ?? ""],
    });
  }

  for (const item of beeProducts) {
    docs.push({
      id: `bee:${item.slug}`,
      type: "bee",
      title: item.name,
      subtitle: item.starMandatory ? "BEE mandatory stars" : "BEE voluntary",
      description: item.summary,
      url: `/certifications/bee/products/${item.slug}`,
      tags: ["bee", item.standard ?? "", item.regime ?? ""],
    });
  }

  for (const item of gmarkProducts) {
    docs.push({
      id: `gmark:${item.slug}`,
      type: "gmark",
      title: item.name,
      subtitle: item.standard ?? "G-Mark",
      description: item.summary,
      url: `/certifications/g-mark/products/${item.slug}`,
      tags: ["g-mark", "gso", item.family ?? "", item.standard ?? ""],
    });
  }

  for (const item of euSectors) {
    docs.push({
      id: `eu:${item.slug}`,
      type: "eu",
      title: item.name,
      subtitle: item.legal,
      description: item.summary,
      url: `/certifications/ce/products/${item.slug}`,
      tags: ["ce", "eu", item.mandate, item.nb],
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
    bee: beeProducts.length,
    gmark: gmarkProducts.length,
    eu: euSectors.length,
  };
}
