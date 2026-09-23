import { posts } from "./qcos";

export interface CmsSection {
  key: string;
  heading: string;
  body: string[];
  imageUrl?: string;
  imageAlt?: string;
}

export interface CmsPage {
  slug: string;
  path: string;
  locale: string;
  title: string;
  intro: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  sections: CmsSection[];
}

export type ArticleBlock =
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "image"; url: string; alt?: string; caption?: string }
  | { id: string; type: "table"; caption?: string; rows: string[][] }
  | { id: string; type: "bar"; label: string; value: number }
  | { id: string; type: "spacer"; size: "sm" | "md" | "lg" };

export interface CmsArticle {
  slug: string;
  locale: string;
  title: string;
  heading: string;
  excerpt: string;
  body: string[];
  heroImageUrl?: string;
  blocks?: ArticleBlock[];
  date: string;
  tags: string[];
  relatedProductSlugs: string[];
  relatedSchemeSlugs: string[];
  status: "published" | "draft";
}

export function articleBlocks(article: CmsArticle): ArticleBlock[] {
  if (article.blocks?.length) return article.blocks;
  return article.body.map((text, index) => ({ id: `p-${index}`, type: "paragraph" as const, text }));
}

export const seedPages: CmsPage[] = [
  {
    slug: "home",
    path: "/",
    locale: "en",
    title: "Find the right certification and testing for your product",
    intro:
      "Type a product name, IS standard or HSN. We’ll show the schemes that usually apply — plus the tests, labs and ballpark costs.",
    sections: [
      { key: "need", heading: "What do you need for this product?", body: [] },
      { key: "markets", heading: "Where are you selling?", body: [] },
      { key: "how", heading: "How it works", body: [] },
      { key: "popular", heading: "Popular products to check", body: [] },
      { key: "categories", heading: "Certification solutions & product categories", body: [] },
      { key: "faq", heading: "Frequently asked questions", body: [] },
      {
        key: "faq-bis",
        heading: "What is BIS certification?",
        body: [
          "BIS certification is a conformity assessment run by the Bureau of Indian Standards. For notified products it is mandatory before manufacture, import or sale in India.",
        ],
      },
      {
        key: "faq-isi",
        heading: "What is the difference between ISI mark and CRS registration?",
        body: [
          "ISI (Scheme I) needs product testing plus a factory inspection. CRS (Scheme II) is lab-test based registration, mainly for electronics and IT products.",
        ],
      },
      {
        key: "faq-cost",
        heading: "How much does BIS certification cost in India?",
        body: [
          "Total cost is laboratory testing + BIS government fees + marking fee + optional consulting. Listed lab ranges can look high — contact Certko and get up to 30% lesser pricing.",
        ],
      },
      {
        key: "faq-foreign",
        heading: "Do foreign manufacturers need BIS certification?",
        body: ["Yes. Foreign factories use FMCS or CRS and must appoint an Authorised Indian Representative (AIR)."],
      },
    ],
  },
  {
    slug: "about",
    path: "/about",
    locale: "en",
    title: "About Certko",
    intro:
      "Certko helps manufacturers, importers and marketplace sellers map the right certification scheme to the right laboratory standard — then book the work.",
    sections: [
      {
        key: "graph",
        heading: "Why the catalogue is a graph",
        body: [
          "A product is never just a mark. It is an IS / IEC standard, an HSN, a QCO status, a scheme, a set of lab scopes and often a second market overlay such as WPC or BEE.",
          "This rebuild treats every lab standard and certification scheme as a first-class, searchable, interlinked record — following the public sitemap shape of certko.com.",
        ],
      },
    ],
  },
  {
    slug: "guide",
    path: "/guide",
    locale: "en",
    title: "The complete BIS certification guide",
    intro: "Everything manufacturers and importers need to know about ISI mark licences and CRS registration in India.",
    sections: [
      {
        key: "schemes",
        heading: "Two schemes",
        body: [
          "ISI mark (Scheme I) needs testing plus factory inspection and applies to most industrial and consumer products under QCOs.",
          "CRS (Scheme II) is registration based on testing at a BIS-recognised lab, mainly for electronics and IT products.",
        ],
      },
      {
        key: "timeline",
        heading: "Typical timeline",
        body: [
          "CRS registrations often complete in 6–10 weeks. ISI licences involving factory inspection usually take 10–26 weeks depending on lab turnaround and query cycles.",
        ],
      },
    ],
  },
  {
    slug: "contact",
    path: "/contact",
    locale: "en",
    title: "Get in touch",
    intro: "Scheme mapping, lab coordination and filings for India and export markets.",
    sections: [],
  },
  {
    slug: "blog",
    path: "/blog",
    locale: "en",
    title: "Notes from the certification desk",
    intro: "Practical notes on HSN mapping, QCOs, multi-market testing and lab strategy.",
    sections: [],
  },
  {
    slug: "tenders",
    path: "/tenders",
    locale: "en",
    title: "BIS certification for government tenders",
    intro: "Most government and PSU tenders reject bids without a valid ISI licence for the quoted IS standard.",
    sections: [
      {
        key: "howto",
        heading: "How to use this",
        body: [
          "Search the IS number from the tender document. The product page shows the applicable scheme, approved testing labs, marking fees and typical timeline.",
          "A licence is specific to one IS standard, one factory and a declared variety list.",
        ],
      },
    ],
  },
  {
    slug: "marketplaces",
    path: "/marketplaces",
    locale: "en",
    title: "Marketplace compliance",
    intro: "Marketplaces actively verify BIS registration numbers. Selling a notified product without a licence leads to immediate delisting.",
    sections: [
      {
        key: "checks",
        heading: "What they check",
        body: [
          "Licence or registration number, brand, model / variety list and whether the Standard Mark artwork matches the granted scope.",
          "Toys, helmets, appliances and cables are the categories most often pulled from listings.",
        ],
      },
    ],
  },
  {
    slug: "bis-certification-consulting",
    path: "/bis-certification-consulting",
    locale: "en",
    title: "BIS certification consulting",
    intro:
      "Application drafting, technical file preparation, lab coordination, factory inspection readiness and licence grant follow-up.",
    sections: [
      {
        key: "who",
        heading: "Who we support",
        body: [
          "Indian manufacturers, importers, and foreign factories on FMCS who need an Authorised Indian Representative.",
        ],
      },
    ],
  },
  {
    slug: "msds-authoring-service",
    path: "/msds-authoring-service",
    locale: "en",
    title: "MSDS / SDS authoring",
    intro:
      "Hazard communication is a different document from a BIS licence or a UN 38.3 test summary. We author and review SDS packs for chemicals, batteries and export lots.",
    sections: [
      {
        key: "send",
        heading: "What to send",
        body: [
          "Composition, intended use, destination markets and any existing GHS classification. We return a draft for human review before release.",
        ],
      },
    ],
  },
  {
    slug: "products",
    path: "/products",
    locale: "en",
    title: "Certification solutions — products by category",
    intro: "Match the right mark to your product, then open the HSN / IS record for QCO status, labs and interlinked tests.",
    sections: [
      { key: "schemes", heading: "Start with a scheme", body: [] },
    ],
  },
  {
    slug: "products-all",
    path: "/products/all",
    locale: "en",
    title: "All mapped products",
    intro: "Unique Indian Standard / CRS records from the Certko library — each opens as its own interlinked page in every language.",
    sections: [],
  },
  {
    slug: "labs",
    path: "/labs",
    locale: "en",
    title: "BIS testing labs directory",
    intro: "Recognised testing laboratories from the library — compare locations, scopes and indicative charges, then open the standards they unlock.",
    sections: [],
  },
  {
    slug: "certifications",
    path: "/certifications",
    locale: "en",
    title: "Certifications & global market access",
    intro: "Pick a scheme, then open the products, labs and destination markets it unlocks.",
    sections: [
      { key: "how", heading: "How GMA works", body: [] },
      { key: "programmes", heading: "Certification programmes", body: [] },
      { key: "markets", heading: "Destination markets", body: [] },
    ],
  },
  {
    slug: "testing",
    path: "/testing",
    locale: "en",
    title: "Explore the right quality assurance solutions",
    intro: "Book the laboratory discipline that unlocks your certification path.",
    sections: [],
  },
  {
    slug: "qco",
    path: "/qco",
    locale: "en",
    title: "Never miss a new mandatory product",
    intro: "Quality Control Orders decide whether an IS standard is voluntary or mandatory before sale in India.",
    sections: [],
  },
  {
    slug: "search",
    path: "/search",
    locale: "en",
    title: "Search the interlinked catalogue",
    intro: "Products, IS standards, HSN codes, schemes, labs, tests, QCOs and destination markets.",
    sections: [],
  },
  {
    slug: "product-detail",
    path: "/product",
    locale: "en",
    title: "Product record",
    intro: "IS standard, HSN, test cost, marking fee, recognised labs and related schemes.",
    sections: [
      { key: "marking", heading: "Annual BIS marking fee", body: [] },
      { key: "labs", heading: "Recognised labs", body: [] },
      { key: "prices", heading: "Scope & indicative test prices", body: [] },
      { key: "tests", heading: "Relevant product testing", body: [] },
      { key: "stacked", heading: "Stacked energy & export marks", body: [] },
      { key: "related", heading: "Related standards & schemes", body: [] },
      { key: "quote", heading: "Need a quote?", body: ["Free mapping of the certification and lab path within 24 hours."] },
    ],
  },
  {
    slug: "lab-detail",
    path: "/labs",
    locale: "en",
    title: "Laboratory record",
    intro: "Request a quote to get the recognised lab assigned for your standard. Direct lab addresses and contact details are not published.",
    sections: [
      { key: "scope", heading: "Standards in scope", body: [] },
      { key: "products", heading: "Products / schemes this lab unlocks", body: [] },
    ],
  },
  {
    slug: "scheme-detail",
    path: "/certifications",
    locale: "en",
    title: "Certification scheme",
    intro: "Process, markets and mapped products for this scheme.",
    sections: [
      { key: "process", heading: "Process", body: [] },
      { key: "markets", heading: "Markets", body: [] },
      { key: "mapped", heading: "Mapped products & standards", body: [] },
      { key: "bee", heading: "BEE labelled appliances", body: [] },
      { key: "gmark", heading: "G-Mark listed categories", body: [] },
      { key: "eu", heading: "EU sector mandates", body: [] },
    ],
  },
  {
    slug: "countries",
    path: "/certifications/countries",
    locale: "en",
    title: "Destination markets",
    intro: "Country guides for India and export markets.",
    sections: [],
  },
  {
    slug: "country-detail",
    path: "/certifications/countries",
    locale: "en",
    title: "Country certifications",
    intro: "Schemes and products commonly scoped for this market.",
    sections: [
      { key: "checklist", heading: "Scoping checklist", body: [] },
      { key: "schemes", heading: "Schemes for this market", body: [] },
      { key: "products", heading: "Products often scoped here", body: [] },
    ],
  },
  {
    slug: "test-detail",
    path: "/testing",
    locale: "en",
    title: "Testing record",
    intro: "Standards, products and labs for this test.",
    sections: [
      { key: "products", heading: "Standards / products this unlocks", body: [] },
      { key: "labs", heading: "Labs that typically run this scope", body: [] },
    ],
  },
  {
    slug: "qco-detail",
    path: "/qco",
    locale: "en",
    title: "Quality Control Order",
    intro: "Mapped products and standards under this order.",
    sections: [{ key: "mapped", heading: "Mapped products & standards", body: [] }],
  },
  {
    slug: "blog-detail",
    path: "/blog",
    locale: "en",
    title: "Article",
    intro: "Notes from the certification desk.",
    sections: [{ key: "linked", heading: "Linked schemes & standards", body: [] }],
  },
  {
    slug: "scheme-product",
    path: "/certifications",
    locale: "en",
    title: "Scheme product",
    intro: "Linked Indian Standard or product record.",
    sections: [{ key: "linked", heading: "Linked IS / product record", body: [] }],
  },
  {
    slug: "terms",
    path: "/terms",
    locale: "en",
    title: "Terms of use",
    intro: "Catalogue figures are indicative. Always confirm lab quotes, QCO status and regulator lists before filing.",
    sections: [
      {
        key: "legal",
        heading: "No legal advice",
        body: ["Content is informational. Scheme names and product scopes change — verify against the regulator before quoting."],
      },
    ],
  },
];

export const seedArticles: CmsArticle[] = posts.map((post) => ({
  slug: post.slug,
  locale: "en",
  title: post.title,
  heading: post.title,
  excerpt: post.excerpt,
  body: post.body,
  date: post.date,
  tags: post.tags,
  relatedProductSlugs: post.relatedProductSlugs,
  relatedSchemeSlugs: post.relatedSchemeSlugs,
  status: "published",
}));

export function pageKey(slug: string, locale: string) {
  return `${slug}:${locale}`;
}

export function articleKey(slug: string, locale: string) {
  return `${slug}:${locale}`;
}
