import { setRequestLocale } from "next-intl/server";
import { SimplePage } from "@/components/simple-page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/about", title: "About Certko", description: "Certification and compliance solution partner." });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SimplePage
      title="About Certko"
      path="/about"
      intro="Certko helps manufacturers, importers and marketplace sellers map the right certification scheme to the right laboratory standard — then book the work."
      sections={[
        {
          heading: "Why the catalogue is a graph",
          body: [
            "A product is never just a mark. It is an IS / IEC standard, an HSN, a QCO status, a scheme, a set of lab scopes and often a second market overlay such as WPC or BEE.",
            "This rebuild treats every lab standard and certification scheme as a first-class, searchable, interlinked record — following the public sitemap shape of certko.com.",
          ],
        },
      ]}
    />
  );
}
