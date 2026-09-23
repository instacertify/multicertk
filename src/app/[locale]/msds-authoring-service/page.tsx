import { setRequestLocale } from "next-intl/server";
import { SimplePage } from "@/components/simple-page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/msds-authoring-service",
    title: "MSDS / SDS authoring",
    description: "Safety data sheet authoring for chemicals, batteries and dangerous goods shipments.",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SimplePage
      title="MSDS / SDS authoring"
      path="/msds-authoring-service"
      intro="Hazard communication is a different document from a BIS licence or a UN 38.3 test summary. We author and review SDS packs for chemicals, batteries and export lots."
      sections={[
        {
          heading: "What to send",
          body: [
            "Composition, intended use, destination markets and any existing GHS classification. We return a draft for human review before release.",
          ],
        },
      ]}
    />
  );
}
