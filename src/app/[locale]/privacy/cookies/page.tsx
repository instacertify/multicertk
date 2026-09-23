import { setRequestLocale } from "next-intl/server";
import { CmsSimplePage, cmsPageMetadata } from "@/components/cms-page";
import { CookieInventory } from "@/components/legal-extras";
import { getCookieSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return cmsPageMetadata(locale, "cookies", "Cookie policy", "Cookies used by Certko and how to change your choice.");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = getCookieSettings();
  return (
    <CmsSimplePage
      slug="cookies"
      locale={locale}
      showLead={false}
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/privacy", label: "Privacy" },
        { href: "/privacy/cookies", label: "Cookies" },
      ]}
    >
      <CookieInventory settings={settings} />
    </CmsSimplePage>
  );
}
