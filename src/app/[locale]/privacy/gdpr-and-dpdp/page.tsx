import { setRequestLocale } from "next-intl/server";
import { SimplePage } from "@/components/simple-page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/privacy/gdpr-and-dpdp", title: "GDPR and DPDP", description: "GDPR and India DPDP notices." });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SimplePage
      showLead={false}
      title="GDPR and DPDP"
      path="/privacy/gdpr-and-dpdp"
      intro="EU GDPR and the Indian Digital Personal Data Protection Act apply to personal data in quote requests."
      sections={[{ heading: "Rights", body: ["You can request access, correction or deletion through the data-request form."] }]}
    />
  );
}
