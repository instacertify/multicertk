import crsBlogs from "./generated/crs-blogs.json";
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
  galleryUrls?: string[];
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
    slug: "category-detail",
    path: "/category",
    locale: "en",
    title: "Product category",
    intro: "Standards and schemes mapped to this product family.",
    sections: [],
  },
  {
    slug: "privacy",
    path: "/privacy",
    locale: "en",
    title: "Privacy policy",
    intro:
      "How Instacertify Labs Private Limited collects and uses personal data on Certko. This notice follows India’s Digital Personal Data Protection Act, 2023 and, where it applies, the EU / UK GDPR.",
    sections: [
      {
        key: "about",
        heading: "Who we are",
        body: [
          "Certko is a certification and compliance information platform operated by Instacertify Labs Private Limited, A-34, 4th Floor, Sector 63A, Noida, Uttar Pradesh 201301, India.",
          "Certko is not a certification body, testing laboratory or government authority unless a page says otherwise.",
        ],
      },
      {
        key: "scope",
        heading: "Scope",
        body: [
          "This notice covers the Certko website, quote forms, search tools and related digital services. It explains what we collect, why, how long we keep it, and how you can exercise your rights.",
        ],
      },
      {
        key: "collect",
        heading: "What we collect",
        body: [
          "Quote and data-request forms store your name, work email, company, phone and the product, HSN or standard you submit so we can reply.",
          "The site also records technical logs (IP, browser, locale) needed to serve pages securely. We do not sell personal data.",
        ],
      },
      {
        key: "use",
        heading: "Why we use it",
        body: [
          "To answer enquiries, map a certification path, keep the catalogue working, meet legal duties, and stop abuse.",
          "Where a law asks for a legal basis we rely on consent, a contract you requested, legitimate interests in running a secure site, or a legal obligation.",
        ],
      },
      {
        key: "cookies",
        heading: "Cookies",
        body: [
          "Necessary cookies keep locale and security working. Analytics and marketing cookies stay off until you allow them in the cookie banner.",
          "Read the cookie policy and the GDPR / DPDP note, or change your choice at any time from Cookie settings in the footer.",
        ],
      },
      {
        key: "share",
        heading: "Sharing",
        body: [
          "We share personal data with service providers, laboratories or regulators only when needed to answer a request you made or to meet a legal duty, and under contractual or legal safeguards.",
        ],
      },
      {
        key: "transfers",
        heading: "International transfers",
        body: [
          "Some service providers process data outside India. Where GDPR or DPDP requires a safeguard, we use one that matches that law before the transfer proceeds.",
        ],
      },
      {
        key: "retain",
        heading: "Retention and security",
        body: [
          "We keep enquiry records only as long as we need them to reply, to keep a secure audit trail, or as the law requires, then delete or anonymise them.",
          "We use administrative and technical controls to limit access. No internet transmission is perfectly secure; we keep improving the controls.",
        ],
      },
      {
        key: "rights",
        heading: "Your rights",
        body: [
          "You may ask for access, correction, deletion, restriction, portability or to withdraw consent, subject to the DPDP Act and, where it applies, GDPR.",
          "Use the data-request form or email info@certko.com. We may need to confirm it is you before we reply. Children should not use Certko; contact us if you think a child submitted data.",
        ],
      },
      {
        key: "contact",
        heading: "Privacy contact",
        body: [
          "Privacy Officer, Instacertify Labs Private Limited, A-34, 4th Floor, Sector 63A, Noida, Uttar Pradesh 201301, India. Email info@certko.com. Phone +91-9999118039.",
        ],
      },
    ],
  },
  {
    slug: "cookies",
    path: "/privacy/cookies",
    locale: "en",
    title: "Cookie policy",
    intro: "Certko uses a small set of cookies. You choose analytics and marketing. Necessary cookies stay on so the site can run.",
    sections: [
      {
        key: "necessary",
        heading: "Necessary cookies",
        body: [
          "These remember your locale, keep a page secure, and store the cookie choice you just made. The site cannot work without them.",
        ],
      },
      {
        key: "optional",
        heading: "Analytics and marketing",
        body: [
          "These load only after you allow that category in the banner. You can switch back to Essential only at any time from Cookie settings.",
        ],
      },
      {
        key: "manage",
        heading: "How to change your choice",
        body: [
          "Open Cookie settings in the footer, or use your browser controls. See also the privacy policy and the GDPR / DPDP note.",
        ],
      },
    ],
  },
  {
    slug: "gdpr-and-dpdp",
    path: "/privacy/gdpr-and-dpdp",
    locale: "en",
    title: "GDPR and DPDP",
    intro:
      "Two privacy laws can apply to a Certko quote: the EU / UK GDPR and India’s Digital Personal Data Protection Act, 2023. This page is a plain-language guide, not legal advice.",
    sections: [
      {
        key: "gdpr",
        heading: "GDPR (EU / EEA / UK)",
        body: [
          "The GDPR protects people in the EU and EEA (and UK GDPR in the United Kingdom). It can apply to an organisation outside Europe that offers services to those people or watches their behaviour.",
          "Where it applies we process personal data on consent, contract, legitimate interests or a legal duty. You may ask for access, correction, erasure, restriction, portability or to object, and you may complain to your local supervisory authority. Non-essential cookies wait for consent.",
        ],
      },
      {
        key: "dpdp",
        heading: "DPDP Act, 2023 (India)",
        body: [
          "We act as a Data Fiduciary for personal data whose purpose we decide. You are a Data Principal. Consent must be free, specific and informed.",
          "You may ask for access, correction, erasure and withdrawal of consent, subject to the Act and its rules. Grievances go to our Privacy Officer and, where the Act allows, the Data Protection Board of India. Cross-border transfers stay open unless the government restricts a country.",
        ],
      },
      {
        key: "request",
        heading: "How to raise a request",
        body: [
          "Use the data-request form or email info@certko.com. We reply after we can match the request to the person it concerns.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    path: "/terms",
    locale: "en",
    title: "Terms of use",
    intro: "These terms govern use of Certko, operated by Instacertify Labs Private Limited. Catalogue figures are indicative — confirm lab quotes, QCO status and regulator lists before you file.",
    sections: [
      {
        key: "accept",
        heading: "Acceptance",
        body: ["By using Certko you agree to these terms. If you do not agree, do not use the site."],
      },
      {
        key: "legal",
        heading: "No certification or legal advice",
        body: [
          "Content is informational. Certko is not a certification body, testing laboratory or government authority unless a page says otherwise. Scheme names and product scopes change — verify against the regulator and qualified counsel before you quote or file.",
        ],
      },
      {
        key: "use",
        heading: "Your responsibilities",
        body: [
          "Give accurate details on quote forms. Use the site only for lawful purposes. Do not disrupt, scrape or misuse the catalogue.",
        ],
      },
      {
        key: "ip",
        heading: "Intellectual property",
        body: [
          "Text, data compilations, branding and software belong to Instacertify or its licensors. You may use public pages for personal or internal business reference. Republishing or commercial reuse needs written permission.",
        ],
      },
      {
        key: "liability",
        heading: "Limitation of liability",
        body: [
          "To the extent the law allows, Certko and Instacertify are not liable for indirect loss, lost profit or reliance on catalogue figures. Pages are provided as-is.",
        ],
      },
      {
        key: "law",
        heading: "Governing law",
        body: [
          "These terms follow the laws of India. Subject to mandatory consumer protections, courts in New Delhi have exclusive jurisdiction.",
        ],
      },
      {
        key: "conduct",
        heading: "Conduct",
        body: [
          "Act honestly. Keep confidential information confidential. Do not offer or accept bribes. Disclose conflicts. Treat people with respect. Report suspected misuse to info@certko.com.",
        ],
      },
    ],
  },
];

export const seedArticles: CmsArticle[] = [
  ...posts.map((post) => ({
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
    status: "published" as const,
  })),
  {
    slug: "how-a-lab-quote-is-built",
    locale: "en",
    title: "How a lab quote is built",
    heading: "How a lab quote is built",
    excerpt: "Tables, bars and spacers sit in the same article as the copy — editors add them from the article screen.",
    body: ["A listed range is only the start. Certko rebuilds the quote from the standard, the lab scope and the scheme."],
    blocks: [
      { id: "p1", type: "paragraph", text: "A listed range is only the start. Certko rebuilds the quote from the standard, the lab scope and the scheme." },
      {
        id: "t1",
        type: "table",
        caption: "Indicative path",
        rows: [
          ["Item", "Share"],
          ["Laboratory testing", "55%"],
          ["Government fees", "25%"],
          ["Consulting", "20%"],
        ],
      },
      { id: "b1", type: "bar", label: "Lab testing share", value: 55 },
      { id: "s1", type: "spacer", size: "md" },
      { id: "p2", type: "paragraph", text: "If the listed price looks expensive, contact Certko for up to 30% lesser pricing." },
    ],
    date: "2026-09-23",
    tags: ["labs"],
    relatedProductSlugs: [],
    relatedSchemeSlugs: ["bis"],
    status: "published",
  },
  ...(crsBlogs as CmsArticle[]),
];

export function pageKey(slug: string, locale: string) {
  return `${slug}:${locale}`;
}

export function articleKey(slug: string, locale: string) {
  return `${slug}:${locale}`;
}
