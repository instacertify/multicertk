import { setRequestLocale } from "next-intl/server";
import { SimplePage } from "@/components/simple-page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/terms", title: "Terms of use", description: "Terms for using the Certko catalogue and quote service." });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SimplePage
      showLead={false}
      title="Terms of use"
      path="/terms"
      intro="Catalogue figures are indicative. Always confirm lab quotes, QCO status and regulator lists before filing."
      sections={[{ heading: "No legal advice", body: ["Content is informational. Scheme names and product scopes change — verify against the regulator before quoting."] }]}
    />
  );
}
