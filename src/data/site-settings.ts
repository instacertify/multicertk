export interface SeoSettings {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  keywords: string;
  ogImage: string;
  indexable: boolean;
  googleSiteVerification: string;
  bingSiteVerification: string;
}

export interface CookieSettings {
  bannerEnabled: boolean;
  analyticsEnabled: boolean;
  marketingEnabled: boolean;
  message: string;
  privacyPath: string;
  cookiesPath: string;
  gdprPath: string;
}

export interface SiteSettings {
  seo: SeoSettings;
  cookies: CookieSettings;
}

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
  },
};
