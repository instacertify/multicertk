export type QcoStatus = "mandatory" | "upcoming" | "voluntary";
export type SchemeFamily =
  | "product-mark"
  | "energy-label"
  | "radio"
  | "telecom"
  | "conformity-mark"
  | "pre-shipment";
export type TestDiscipline =
  | "chemical-testing"
  | "electrical-testing"
  | "emc-testing"
  | "physical-testing"
  | "microbiology-testing"
  | "mechanical-testing";

export interface Scheme {
  slug: string;
  name: string;
  shortName: string;
  regulator: string;
  family: SchemeFamily;
  countrySlugs: string[];
  summary: string;
  process: string[];
  whoNeedsIt: string;
  pillars: string[];
}

export interface Country {
  slug: string;
  name: string;
  region: string;
  schemeSlugs: string[];
  summary: string;
  checklist: string[];
}

export interface Category {
  slug: string;
  name: string;
  summary: string;
}

export interface Product {
  slug: string;
  name: string;
  standard: string;
  hsn: string;
  categorySlug: string;
  schemeSlugs: string[];
  qcoStatus: QcoStatus;
  qcoSlug?: string;
  testCostMin: number;
  testCostMax: number;
  labCount: number;
  timeline: string;
  markingFee: { large: number; medium: number; small: number; micro: number };
  labSlugs: string[];
  testSlugs: string[];
  countrySlugs: string[];
  excerpt: string;
}

export interface Lab {
  slug: string;
  name: string;
  city: string;
  state: string;
  bisCode: string;
  categorySlugs: string[];
  standardCodes: string[];
  costMin: number;
  costMax: number;
  scopes: number;
}

export interface TestService {
  slug: string;
  discipline: TestDiscipline;
  name: string;
  standard: string;
  productSlugs: string[];
  labSlugs: string[];
  turnaround: string;
  summary: string;
}

export interface Qco {
  slug: string;
  name: string;
  ministry: string;
  status: QcoStatus;
  deadline?: string;
  productSlugs: string[];
  summary: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  relatedProductSlugs: string[];
  relatedSchemeSlugs: string[];
  body: string[];
}

export interface BeeProduct {
  slug: string;
  name: string;
  starMandatory: boolean;
  relatedProductSlug?: string;
  summary: string;
}

export interface GmarkProduct {
  slug: string;
  name: string;
  relatedProductSlug?: string;
  summary: string;
}
