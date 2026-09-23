export interface NavChild {
  id: string;
  label: string;
  href: string;
  group?: string;
  iconUrl?: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  iconUrl?: string;
  children?: NavChild[];
}

export interface CustomerLogo {
  id: string;
  name: string;
  href?: string;
  imageUrl: string;
  alt: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatarUrl?: string;
}

export interface HeaderChrome {
  searchIconUrl?: string;
  quoteIconUrl?: string;
  menuIconUrl?: string;
}

export interface SiteMediaStore {
  logos: CustomerLogo[];
  reviews: CustomerReview[];
  menu: NavItem[];
  chrome: HeaderChrome;
}

export const defaultHeaderChrome: HeaderChrome = {
  searchIconUrl: "/header-icons/search.svg",
  quoteIconUrl: "/header-icons/quote.svg",
  menuIconUrl: "/header-icons/menu.svg",
};

const navIcons: Record<string, string> = {
  certification: "/header-icons/certification.svg",
  testing: "/header-icons/testing.svg",
  qcos: "/header-icons/qcos.svg",
  labs: "/header-icons/labs.svg",
  resources: "/header-icons/resources.svg",
};

export type MenuLibrary = {
  categories?: { slug: string; name: string }[];
  articles?: { slug: string; title: string }[];
};

const schemeChildren: NavChild[] = [
  { id: "bis", label: "BIS / ISI & CRS", href: "/certifications/bis", group: "Schemes", iconUrl: "/header-icons/scheme.svg" },
  { id: "bee", label: "BEE Star", href: "/certifications/bee", group: "Schemes", iconUrl: "/header-icons/scheme.svg" },
  { id: "wpc", label: "WPC / ETA", href: "/certifications/wpc-eta", group: "Schemes", iconUrl: "/header-icons/scheme.svg" },
  { id: "tec", label: "TEC MTCTE", href: "/certifications/tec-mtcte", group: "Schemes", iconUrl: "/header-icons/scheme.svg" },
  { id: "ce", label: "CE Marking", href: "/certifications/ce", group: "Schemes", iconUrl: "/header-icons/scheme.svg" },
  { id: "fcc", label: "FCC", href: "/certifications/fcc", group: "Schemes", iconUrl: "/header-icons/scheme.svg" },
  { id: "gmark", label: "G-Mark", href: "/certifications/g-mark", group: "Schemes", iconUrl: "/header-icons/scheme.svg" },
  { id: "saber", label: "SABER / SASO", href: "/certifications/saber", group: "Schemes", iconUrl: "/header-icons/scheme.svg" },
  { id: "ukca", label: "UKCA", href: "/certifications/ukca", group: "Schemes", iconUrl: "/header-icons/scheme.svg" },
  { id: "rcm", label: "RCM", href: "/certifications/rcm", group: "Schemes", iconUrl: "/header-icons/scheme.svg" },
  { id: "eac", label: "EAC", href: "/certifications/eac", group: "Schemes", iconUrl: "/header-icons/scheme.svg" },
  { id: "countries", label: "Destination markets", href: "/certifications/countries", group: "Schemes", iconUrl: "/header-icons/scheme.svg" },
];

const testingChildren: NavChild[] = [
  { id: "chemical", label: "Chemical", href: "/testing/chemical-testing", group: "Disciplines", iconUrl: "/header-icons/testing.svg" },
  { id: "electrical", label: "Electrical", href: "/testing/electrical-testing", group: "Disciplines", iconUrl: "/header-icons/testing.svg" },
  { id: "emc", label: "EMC", href: "/testing/emc-testing", group: "Disciplines", iconUrl: "/header-icons/testing.svg" },
  { id: "physical", label: "Physical", href: "/testing/physical-testing", group: "Disciplines", iconUrl: "/header-icons/testing.svg" },
  { id: "microbiology", label: "Microbiology", href: "/testing/microbiology-testing", group: "Disciplines", iconUrl: "/header-icons/testing.svg" },
  { id: "mechanical", label: "Mechanical", href: "/testing/mechanical-testing", group: "Disciplines", iconUrl: "/header-icons/testing.svg" },
];

const qcoOverview: NavChild[] = [
  { id: "all-qco", label: "All QCOs", href: "/qco", group: "Overview", iconUrl: "/header-icons/qcos.svg" },
  { id: "products", label: "Mapped products", href: "/products", group: "Overview", iconUrl: "/header-icons/category.svg" },
  { id: "guide", label: "BIS guide", href: "/guide", group: "Overview", iconUrl: "/header-icons/resources.svg" },
];

const resourceLibrary: NavChild[] = [
  { id: "blog", label: "Blog", href: "/blog", group: "Library", iconUrl: "/header-icons/resources.svg" },
  { id: "guide", label: "BIS guide", href: "/guide", group: "Library", iconUrl: "/header-icons/resources.svg" },
  { id: "tenders", label: "Tenders", href: "/tenders", group: "Library", iconUrl: "/header-icons/qcos.svg" },
  { id: "marketplaces", label: "Marketplaces", href: "/marketplaces", group: "Library", iconUrl: "/header-icons/category.svg" },
  { id: "consulting", label: "Consulting", href: "/bis-certification-consulting", group: "Library", iconUrl: "/header-icons/certification.svg" },
  { id: "msds", label: "MSDS / SDS", href: "/msds-authoring-service", group: "Library", iconUrl: "/header-icons/qcos.svg" },
  { id: "about", label: "About", href: "/about", group: "Library", iconUrl: "/header-icons/resources.svg" },
];

export function categoryMenuChildren(
  categories: { slug: string; name: string }[],
  hrefFor: (slug: string) => string,
  group: string,
  idPrefix: string,
): NavChild[] {
  return categories.map((category) => ({
    id: `${idPrefix}-${category.slug}`,
    label: category.name,
    href: hrefFor(category.slug),
    group,
    iconUrl: "/header-icons/category.svg",
  }));
}

export function articleMenuChildren(articles: { slug: string; title: string }[]): NavChild[] {
  return articles.map((article) => ({
    id: `blog-${article.slug}`,
    label: article.title,
    href: `/blog/${article.slug}`,
    group: "Blogs",
    iconUrl: "/header-icons/resources.svg",
  }));
}

export function buildDefaultMenu(library: MenuLibrary = {}): NavItem[] {
  const categories = library.categories ?? [];
  const articles = library.articles ?? [];
  const byCategory = categoryMenuChildren(categories, (slug) => `/category/${slug}`, "Product categories", "cat");
  const labsByCategory = categoryMenuChildren(categories, (slug) => `/labs?category=${slug}`, "By category", "lab-cat");

  return [
    {
      id: "certification",
      label: "Certification",
      href: "/certifications",
      iconUrl: navIcons.certification,
      children: [...schemeChildren, ...byCategory],
    },
    {
      id: "testing",
      label: "Testing",
      href: "/testing",
      iconUrl: navIcons.testing,
      children: testingChildren,
    },
    {
      id: "qcos",
      label: "QCOs",
      href: "/qco",
      iconUrl: navIcons.qcos,
      children: [...qcoOverview, ...byCategory],
    },
    {
      id: "labs",
      label: "Labs",
      href: "/labs",
      iconUrl: navIcons.labs,
      children: [{ id: "labs-dir", label: "Lab directory", href: "/labs", group: "Directory", iconUrl: "/header-icons/labs.svg" }, ...labsByCategory],
    },
    {
      id: "resources",
      label: "Resources",
      href: "/blog",
      iconUrl: navIcons.resources,
      children: [...resourceLibrary, ...articleMenuChildren(articles)],
    },
  ];
}

export const defaultMenu: NavItem[] = buildDefaultMenu();

export const seedLogos: CustomerLogo[] = [
  { id: "apex", name: "Apex Industrial Academy", imageUrl: "/trust/apex-academy.svg", alt: "Apex Industrial Academy" },
  { id: "coastal", name: "Coastal Maritime School", imageUrl: "/trust/coastal-maritime.svg", alt: "Coastal Maritime School" },
  { id: "packaging", name: "National Packaging Institute", imageUrl: "/trust/packaging-institute.svg", alt: "National Packaging Institute" },
  { id: "himalaya", name: "Himalaya Polytechnic", imageUrl: "/trust/himalaya-polytechnic.svg", alt: "Himalaya Polytechnic" },
  { id: "harbour", name: "Harbour Design School", imageUrl: "/trust/harbour-design.svg", alt: "Harbour Design School" },
  { id: "pioneer", name: "Pioneer Safety College", imageUrl: "/trust/pioneer-safety.svg", alt: "Pioneer Safety College" },
  { id: "deccan", name: "Deccan Materials School", imageUrl: "/trust/deccan-materials.svg", alt: "Deccan Materials School" },
  { id: "orient", name: "Orient Trade Academy", imageUrl: "/trust/orient-trade.svg", alt: "Orient Trade Academy" },
];

export const seedReviews: CustomerReview[] = [
  {
    id: "ananya",
    name: "Ananya Shah",
    role: "Quality head, appliance exporter",
    quote: "Listed lab prices looked high. Certko remapped the BIS path and the booked quote came in well under the published range.",
    rating: 5,
  },
  {
    id: "ravi",
    name: "Ravi Menon",
    role: "Tender cell, electrical OEM",
    quote: "We drop every tender IS number into Certko first. The QCO status and the lab path are already linked.",
    rating: 5,
  },
  {
    id: "iyer",
    name: "Prof. Iyer",
    role: "Harbour Design School",
    quote: "Our workshop used the lab directory to book EMC without chasing private contact sheets. The school logo strip is the same one our partners see.",
    rating: 5,
  },
];

export const seedSiteMedia: SiteMediaStore = {
  logos: seedLogos,
  reviews: seedReviews,
  menu: defaultMenu,
  chrome: defaultHeaderChrome,
};
