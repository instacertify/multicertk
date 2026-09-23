import { setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/lead-form";
import { Breadcrumbs } from "@/components/ui";
import { getCookieSettings } from "@/lib/site-settings";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/privacy/data-request",
    title: "Data request",
    description: "Request access, correction or deletion of personal data under DPDP and GDPR.",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = getCookieSettings();
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: settings.privacyPath, label: "Privacy" },
          { href: settings.dataRequestPath, label: "Data request" },
        ]}
      />
      <h1 className="mt-4 font-display text-navy">Data request</h1>
      <p className="mt-3 text-muted">
        Ask for access, correction, deletion or withdrawal of consent as a Data Principal under India’s DPDP Act or as a data subject under GDPR. {settings.grievanceOfficer} at {settings.dpoEmail || settings.controllerEmail} will reply after we can match the request to you.
      </p>
      <div className="mt-6">
        <LeadForm sourcePath="/privacy/data-request" />
      </div>
    </div>
  );
}
