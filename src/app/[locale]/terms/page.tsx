import { setRequestLocale } from "next-intl/server";
import { CmsSimplePage, cmsPageMetadata } from "@/components/cms-page";
import { LegalReviewed } from "@/components/legal-extras";
import { getCookieSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return cmsPageMetadata(locale, "terms", "Terms of use", "Terms for using the Certko catalogue and quote service.");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <CmsSimplePage
      slug="terms"
      locale={locale}
      showLead={false}
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/terms", label: "Terms" },
      ]}
    >
      <div className="mx-auto max-w-3xl px-4 pb-10">
        <LegalReviewed settings={getCookieSettings()} />
      </div>
    </CmsSimplePage>
  );
}
