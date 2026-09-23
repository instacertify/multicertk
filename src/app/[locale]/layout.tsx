import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import {
  Plus_Jakarta_Sans,
  Fraunces,
  Noto_Sans_Devanagari,
  Noto_Naskh_Arabic,
  Noto_Sans_SC,
  Noto_Sans,
} from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { routing } from "@/i18n/routing";
import { localesMeta, site } from "@/lib/site";
import "../globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const hindi = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-hindi",
});

const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
});

const cjk = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-cjk",
});

const cyrillic = Noto_Sans({
  subsets: ["cyrillic", "latin", "latin-ext"],
  variable: "--font-cyrillic",
});

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

  return (
    <html
      lang={meta.htmlLang}
      dir={meta.dir}
      className={`${sans.variable} ${display.variable} ${hindi.variable} ${arabic.variable} ${cjk.variable} ${cyrillic.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white font-sans text-ink">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
