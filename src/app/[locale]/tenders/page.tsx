import { setRequestLocale } from "next-intl/server";
import { SearchBox } from "@/components/search-box";
import { SimplePage } from "@/components/simple-page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/tenders",
    title: "BIS certification for government tenders",
    description: "Search the IS number from your tender and see the scheme, labs and timeline required to pre-qualify.",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <SimplePage
        title="BIS certification for government tenders"
        path="/tenders"
        intro="Most government and PSU tenders reject bids without a valid ISI licence for the quoted IS standard."
        sections={[
          {
            heading: "How to use this",
            body: [
              "Search the IS number from the tender document. The product page shows the applicable scheme, approved testing labs, marking fees and typical timeline.",
              "A licence is specific to one IS standard, one factory and a declared variety list.",
            ],
          },
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 pb-12">
        <SearchBox />
      </div>
    </>
  );
}
