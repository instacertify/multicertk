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
  standardKey?: string;
  hsn: string;
  hsn4?: string;
  categorySlug: string;
  schemeSlugs: string[];
  schemeLabel?: string;
  qcoStatus: QcoStatus;
  qcoSlug?: string;
  qcoLabel?: string;
  qcoOrder?: string;
  testCostMin: number;
  testCostMax: number;
  labCount: number;
  timeline: string;
  markingFee: { large: number; medium: number; small: number; micro: number };
  labSlugs: string[];
  testSlugs: string[];
  countrySlugs: string[];
  excerpt: string;
  unit?: string;
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
  phone?: string;
  email?: string;
  address?: string;
  contact?: string;
}

export interface LabScope {
  labSlug: string;
  standard: string;
  standardKey: string;
  productScope: string;
  category: string;
  categorySlug: string;
  price: number;
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
  standard?: string;
  scheme?: string;
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
  regime?: string;
  standard?: string;
  starTable?: string;
  price?: string;
  labs?: string;
}

export interface GmarkProduct {
  slug: string;
  name: string;
  relatedProductSlug?: string;
  summary: string;
  family?: string;
  standard?: string;
  tests?: string;
  emc?: string;
  cb?: string;
  nb?: string;
  remarks?: string;
}

export interface EuSector {
  slug: string;
  name: string;
  mandate: string;
  legal: string;
  testing: string;
  nb: string;
  whenNb: string;
  route: string;
  url: string;
  updates: string;
  summary: string;
}
