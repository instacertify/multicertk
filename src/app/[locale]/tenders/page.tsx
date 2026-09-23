import { setRequestLocale } from "next-intl/server";
import { SearchBox } from "@/components/search-box";
import { CmsSimplePage, cmsPageMetadata } from "@/components/cms-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return cmsPageMetadata(locale, "tenders", "BIS certification for government tenders", "Search the IS number from your tender and see the scheme, labs and timeline required to pre-qualify.");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <CmsSimplePage slug="tenders" locale={locale} />
      <div className="mx-auto max-w-3xl px-4 pb-12">
        <SearchBox />
      </div>
    </>
  );
}
