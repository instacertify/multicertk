export interface NavChild {
  id: string;
  label: string;
  href: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
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

export interface SiteMediaStore {
  logos: CustomerLogo[];
  reviews: CustomerReview[];
  menu: NavItem[];
}

export const defaultMenu: NavItem[] = [
  {
    id: "certification",
    label: "Certification",
    href: "/certifications",
    children: [
      { id: "bis", label: "BIS / ISI & CRS", href: "/certifications/bis" },
      { id: "bee", label: "BEE Star", href: "/certifications/bee" },
      { id: "wpc", label: "WPC / ETA", href: "/certifications/wpc-eta" },
      { id: "tec", label: "TEC MTCTE", href: "/certifications/tec-mtcte" },
      { id: "ce", label: "CE Marking", href: "/certifications/ce" },
      { id: "fcc", label: "FCC", href: "/certifications/fcc" },
      { id: "gmark", label: "G-Mark", href: "/certifications/g-mark" },
      { id: "saber", label: "SABER / SASO", href: "/certifications/saber" },
      { id: "ukca", label: "UKCA", href: "/certifications/ukca" },
      { id: "rcm", label: "RCM", href: "/certifications/rcm" },
      { id: "eac", label: "EAC", href: "/certifications/eac" },
      { id: "countries", label: "Destination markets", href: "/certifications/countries" },
    ],
  },
  {
    id: "testing",
    label: "Testing",
    href: "/testing",
    children: [
      { id: "chemical", label: "Chemical", href: "/testing/chemical-testing" },
      { id: "electrical", label: "Electrical", href: "/testing/electrical-testing" },
      { id: "emc", label: "EMC", href: "/testing/emc-testing" },
      { id: "physical", label: "Physical", href: "/testing/physical-testing" },
      { id: "microbiology", label: "Microbiology", href: "/testing/microbiology-testing" },
      { id: "mechanical", label: "Mechanical", href: "/testing/mechanical-testing" },
    ],
  },
  {
    id: "qcos",
    label: "QCOs",
    href: "/qco",
    children: [
      { id: "all-qco", label: "All QCOs", href: "/qco" },
      { id: "products", label: "Mapped products", href: "/products" },
      { id: "guide", label: "BIS guide", href: "/guide" },
    ],
  },
  { id: "labs", label: "Labs", href: "/labs", children: [{ id: "labs-dir", label: "Lab directory", href: "/labs" }] },
  {
    id: "resources",
    label: "Resources",
    href: "/blog",
    children: [
      { id: "blog", label: "Blog", href: "/blog" },
      { id: "guide", label: "BIS guide", href: "/guide" },
      { id: "tenders", label: "Tenders", href: "/tenders" },
      { id: "marketplaces", label: "Marketplaces", href: "/marketplaces" },
      { id: "consulting", label: "Consulting", href: "/bis-certification-consulting" },
      { id: "about", label: "About", href: "/about" },
    ],
  },
];

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
};
