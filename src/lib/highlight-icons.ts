const ICONS = {
  certification: "/header-icons/certification.svg",
  testing: "/header-icons/testing.svg",
  scheme: "/header-icons/scheme.svg",
  category: "/header-icons/category.svg",
  resources: "/header-icons/resources.svg",
  qcos: "/header-icons/qcos.svg",
  quote: "/header-icons/quote.svg",
  search: "/header-icons/search.svg",
} as const;

const BY_KEY: Record<string, string> = {
  need: ICONS.certification,
  "need-cert": ICONS.certification,
  "need-test": ICONS.testing,
  markets: ICONS.scheme,
  how: ICONS.resources,
  "how-1": ICONS.search,
  "how-2": ICONS.scheme,
  "how-3": ICONS.quote,
  "how-4": ICONS.certification,
  popular: ICONS.category,
  categories: ICONS.category,
  faq: ICONS.resources,
  desk: ICONS.category,
  "stat-products": ICONS.category,
  "stat-tests": ICONS.testing,
  "stat-schemes": ICONS.scheme,
  schemes: ICONS.scheme,
  programmes: ICONS.certification,
  process: ICONS.resources,
  mapped: ICONS.category,
  products: ICONS.category,
  marking: ICONS.qcos,
  tests: ICONS.testing,
  stacked: ICONS.scheme,
  related: ICONS.resources,
  quote: ICONS.quote,
  price: ICONS.quote,
  route: ICONS.certification,
  checklist: ICONS.resources,
  linked: ICONS.resources,
  bee: ICONS.scheme,
  gmark: ICONS.scheme,
  eu: ICONS.scheme,
  graph: ICONS.resources,
  timeline: ICONS.resources,
  howto: ICONS.resources,
  checks: ICONS.testing,
  who: ICONS.resources,
  send: ICONS.quote,
  scope: ICONS.qcos,
  about: ICONS.resources,
  intro: ICONS.resources,
  card: ICONS.resources,
};

export function defaultHighlightIcon(key = "card"): string {
  if (BY_KEY[key]) return BY_KEY[key];
  if (key.startsWith("faq")) return ICONS.resources;
  if (key.startsWith("stat-")) return ICONS.category;
  if (key.startsWith("how-")) return ICONS.resources;
  if (key.startsWith("cat-") || key.startsWith("category")) return ICONS.category;
  if (key.includes("test")) return ICONS.testing;
  if (key.includes("scheme") || key.includes("market")) return ICONS.scheme;
  if (key.includes("cert") || key.includes("process")) return ICONS.certification;
  if (key.includes("product") || key.includes("desk")) return ICONS.category;
  if (key.includes("quote") || key.includes("price") || key.includes("contact")) return ICONS.quote;
  if (key.includes("qco") || key.includes("marking")) return ICONS.qcos;
  return ICONS.resources;
}
