import { setRequestLocale } from "next-intl/server";
import { SimplePage } from "@/components/simple-page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/guide",
    title: "BIS certification guide",
    description: "Process, cost, documents and timelines for ISI mark licences and CRS registration.",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SimplePage
      title="The complete BIS certification guide"
      path="/guide"
      intro="Everything manufacturers and importers need to know about ISI mark licences and CRS registration in India."
      sections={[
        {
          heading: "Two schemes",
          body: [
            "ISI mark (Scheme I) needs testing plus factory inspection and applies to most industrial and consumer products under QCOs.",
            "CRS (Scheme II) is registration based on testing at a BIS-recognised lab, mainly for electronics and IT products.",
          ],
        },
        {
          heading: "Typical timeline",
          body: [
            "CRS registrations often complete in 6–10 weeks. ISI licences involving factory inspection usually take 10–26 weeks depending on lab turnaround and query cycles.",
          ],
        },
      ]}
    />
  );
}
