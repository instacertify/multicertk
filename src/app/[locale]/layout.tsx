import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Inter, Noto_Sans_Arabic, Noto_Sans_Devanagari, Noto_Sans_SC, Source_Serif_4 } from "next/font/google";
import { CookieBanner } from "@/components/cookie-banner";
import { ConsentScripts } from "@/components/consent-scripts";
import { EditorBar } from "@/components/editor-bar";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HideOnAdminLogin } from "@/components/hide-on-login";
import { PageLead } from "@/components/page-lead";
import { SocialProof } from "@/components/trusted-by";
import { routing } from "@/i18n/routing";
import { getHeaderChrome, getLogos, getMenu, getReviews } from "@/lib/site-media";
import { getCookieSettings, getSeo } from "@/lib/site-settings";
import { localesMeta, site } from "@/lib/site";
import "../globals.css";

function stripPublicMessages(messages: unknown): Record<string, unknown> {
  if (!messages || typeof messages !== "object" || Array.isArray(messages)) return {};
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(messages as Record<string, unknown>)) {
    if (key === "backend" || key === "admin") continue;
    next[key] = value && typeof value === "object" && !Array.isArray(value) ? stripPublicMessages(value) : value;
  }
  return next;
}

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const hindi = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hindi",
  display: "swap",
});

const arabic = Noto_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const chinese = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chinese",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata() {
  const seo = getSeo();
  return {
    metadataBase: new URL(site.url),
    title: {
      default: seo.defaultTitle,
      template: seo.titleTemplate,
    },
    description: seo.defaultDescription,
    keywords: seo.keywords || undefined,
    icons: { icon: "/certko-logo.png" },
    robots: seo.indexable ? { index: true, follow: true } : { index: false, follow: false },
    verification: {
      google: seo.googleSiteVerification || undefined,
      other: seo.bingSiteVerification ? { "msvalidate.01": seo.bingSiteVerification } : undefined,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-pathname") || "";
  const isAdmin = requestHeaders.get("x-certko-admin") === "1" || pathname.includes("/admin");
  const isLogin = requestHeaders.get("x-certko-login") === "1" || pathname.includes("/admin/login");
  const messages = stripPublicMessages(await getMessages());
  const meta = localesMeta[locale as keyof typeof localesMeta];
  const menu = getMenu();
  const chrome = getHeaderChrome();
  const logos = getLogos();
  const reviews = getReviews();
  const navCopy = (messages as { nav?: { trustedBy?: string; reviewsTitle?: string } }).nav;
  const cookies = getCookieSettings();

  return (
    <html
      lang={meta.htmlLang}
      dir={meta.dir}
      data-font={
        locale === "hi" ? "noto-sans-devanagari" : locale === "zh" ? "noto-sans-sc" : locale === "ar" ? "noto-sans-arabic" : "serif"
      }
      className={`${inter.variable} ${serif.variable} ${hindi.variable} ${arabic.variable} ${chinese.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        <NextIntlClientProvider messages={messages}>
          {isAdmin ? null : (
            <HideOnAdminLogin>
              <Header menu={menu} chrome={chrome} />
            </HideOnAdminLogin>
          )}
          {isAdmin && !isLogin ? <EditorBar /> : null}
          <main className="flex-1">{children}</main>
          {isAdmin ? null : (
            <HideOnAdminLogin>
              <PageLead iconUrl={chrome.quoteIconUrl} />
              <SocialProof
                logos={logos}
                reviews={reviews}
                trustedHeading={navCopy?.trustedBy || "On file"}
                reviewsHeading={navCopy?.reviewsTitle || "From recent work"}
              />
              <Footer />
              <ConsentScripts settings={cookies} />
              <CookieBanner settings={cookies} />
            </HideOnAdminLogin>
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
