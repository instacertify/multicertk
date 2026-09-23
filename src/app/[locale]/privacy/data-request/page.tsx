import { setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/lead-form";
import { Breadcrumbs } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/privacy/data-request", title: "Data request", description: "Request access or deletion of personal data." });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/privacy", label: "Privacy" }, { href: "/privacy/data-request", label: "Data request" }]} />
      <h1 className="mt-4 font-display text-4xl text-navy">Data request</h1>
      <p className="mt-3 text-muted">Use the form to request access, correction or deletion.</p>
      <div className="mt-6">
        <LeadForm sourcePath="/privacy/data-request" />
      </div>
    </div>
  );
}
