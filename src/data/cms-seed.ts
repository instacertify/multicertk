import { posts } from "./qcos";

export interface CmsSection {
  key: string;
  heading: string;
  body: string[];
}

export interface CmsPage {
  slug: string;
  path: string;
  locale: string;
  title: string;
  intro: string;
  sections: CmsSection[];
}

export interface CmsArticle {
  slug: string;
  locale: string;
  title: string;
  heading: string;
  excerpt: string;
  body: string[];
  date: string;
  tags: string[];
  relatedProductSlugs: string[];
  relatedSchemeSlugs: string[];
  status: "published" | "draft";
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
