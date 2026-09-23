import { setRequestLocale } from "next-intl/server";
import { SimplePage } from "@/components/simple-page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/privacy/cookies", title: "Cookie policy", description: "Cookies used by Certko." });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SimplePage
      showLead={false}
      title="Cookie policy"
      path="/privacy/cookies"
      intro="Essential cookies keep the locale and form state working. Analytics cookies, if enabled, are optional."
      sections={[{ heading: "Locale", body: ["next-intl may store a locale preference so /hi and /ar routes stay consistent."] }]}
    />
  );
}
