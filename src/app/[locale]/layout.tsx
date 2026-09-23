import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Inter, Noto_Sans_Arabic, Noto_Sans_Devanagari, Noto_Sans_SC } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SocialProof } from "@/components/trusted-by";
import { routing } from "@/i18n/routing";
import { getLogos, getMenu, getReviews } from "@/lib/site-media";
import { localesMeta, site } from "@/lib/site";
import "../globals.css";

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

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  icons: { icon: "/certko-logo.png" },
};

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
  const messages = await getMessages();
  const meta = localesMeta[locale as keyof typeof localesMeta];
  const menu = getMenu();
  const logos = getLogos();
  const reviews = getReviews();
  const navCopy = (messages as { nav?: { trustedBy?: string; reviewsTitle?: string } }).nav;

  return (
    <html
      lang={meta.htmlLang}
      dir={meta.dir}
      data-font={
        locale === "hi" ? "noto-sans-devanagari" : locale === "zh" ? "noto-sans-sc" : locale === "ar" ? "noto-sans-arabic" : "inter"
      }
      className={`${inter.variable} ${hindi.variable} ${arabic.variable} ${chinese.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white font-sans text-ink">
        <NextIntlClientProvider messages={messages}>
          <Header menu={menu} />
          <main className="flex-1">{children}</main>
          <SocialProof
            logos={logos}
            reviews={reviews}
            trustedHeading={navCopy?.trustedBy || "Trusted by"}
            reviewsHeading={navCopy?.reviewsTitle || "What customers say"}
          />
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
