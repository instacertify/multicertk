export interface SeoSettings {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  keywords: string;
  ogImage: string;
  indexable: boolean;
  googleSiteVerification: string;
  bingSiteVerification: string;
  organizationName: string;
  twitterHandle: string;
}

export type CookieCategory = "necessary" | "analytics" | "marketing";

export interface CookieRow {
  id: string;
  name: string;
  purpose: string;
  duration: string;
  category: CookieCategory;
}

export interface CookieSettings {
  bannerEnabled: boolean;
  analyticsEnabled: boolean;
  marketingEnabled: boolean;
  message: string;
  privacyPath: string;
  cookiesPath: string;
  gdprPath: string;
  termsPath: string;
  dataRequestPath: string;
  controllerName: string;
  controllerEmail: string;
  grievanceOfficer: string;
  dpoEmail: string;
  consentVersion: string;
  lastReviewed: string;
  analyticsId: string;
  marketingId: string;
  rows: CookieRow[];
}

export interface SiteSettings {
  seo: SeoSettings;
  cookies: CookieSettings;
}

export const defaultCookieRows: CookieRow[] = [
  {
    id: "choice",
    name: "certko-cookie-choice",
    purpose: "Stores whether you chose essential-only, analytics or marketing cookies.",
    duration: "12 months",
    category: "necessary",
  },
  {
    id: "locale",
    name: "NEXT_LOCALE",
    purpose: "Remembers the language you selected so pages stay in that locale.",
    duration: "Session",
    category: "necessary",
  },
  {
    id: "ga",
    name: "_ga",
    purpose: "Audience measurement. Loads only after you allow analytics.",
    duration: "13 months",
    category: "analytics",
  },
  {
    id: "fbp",
    name: "_fbp",
    purpose: "Optional advertising measurement. Loads only after you allow marketing.",
    duration: "3 months",
    category: "marketing",
  },
];

export const defaultSettings: SiteSettings = {
  seo: {
    defaultTitle: "Certko | Compliance. Assured.",
    titleTemplate: "%s | Certko",
    defaultDescription:
      "Find the right certification and testing for your product. Certko maps BIS, BEE, GMARK, CE, FCC, SABER, WPC and lab standards so every scheme is searchable and interlinked.",
    keywords: "BIS, ISI, CRS, BEE, CE, FCC, GMARK, SABER, WPC, certification, testing, QCO",
    ogImage: "/certko-logo.png",
    indexable: true,
    googleSiteVerification: "",
    bingSiteVerification: "",
    organizationName: "Instacertify Labs Private Limited",
    twitterHandle: "",
  },
  cookies: {
    bannerEnabled: true,
    analyticsEnabled: false,
    marketingEnabled: false,
    message:
      "We use necessary cookies to run the site. Analytics and marketing cookies stay off unless you allow them. See the cookie policy for GDPR and DPDP details.",
    privacyPath: "/privacy",
    cookiesPath: "/privacy/cookies",
    gdprPath: "/privacy/gdpr-and-dpdp",
    termsPath: "/terms",
    dataRequestPath: "/privacy/data-request",
    controllerName: "Instacertify Labs Private Limited",
    controllerEmail: "info@certko.com",
    grievanceOfficer: "Privacy Officer",
    dpoEmail: "info@certko.com",
    consentVersion: "1",
    lastReviewed: "2026-09-23",
    analyticsId: "",
    marketingId: "",
    rows: defaultCookieRows,
  },
};
