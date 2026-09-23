import { setRequestLocale } from "next-intl/server";
import { SimplePage } from "@/components/simple-page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/privacy", title: "Privacy policy", description: "How Certko handles enquiry and catalogue data." });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SimplePage
      showLead={false}
      title="Privacy policy"
      path="/privacy"
      intro="We collect only what is needed to map a certification path and reply to a quote request."
      sections={[
        {
          heading: "What we store",
          body: [
            "Name, work email, company, phone and the product / HSN / standard you submit. Leads are used to reply within 24 hours and are not sold.",
            "See also cookies, GDPR / DPDP and the data-request form.",
          ],
        },
      ]}
    />
  );
}
