import { setRequestLocale } from "next-intl/server";
import { CookieEditor } from "@/components/settings-editor";
import { Breadcrumbs, CardLink } from "@/components/ui";
import { getCookieSettings } from "@/lib/site-settings";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/admin/content/cookies",
    title: "Cookies & consent",
    description: "Cookie banner and optional analytics under GDPR and DPDP.",
    index: false,
  });
}

export default async function CookiesAdmin({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs
        items={[
          { href: "/admin", label: "Editor" },
          { href: "/admin/content", label: "Content" },
          { href: "/admin/content/cookies", label: "Cookies" },
        ]}
      />
      <h1 className="mt-4 font-display text-navy">Cookies & consent</h1>
      <p className="mt-3 text-muted">
        Manage the public banner, cookie inventory and controller details for DPDP, GDPR and EU ePrivacy. Analytics and marketing tags stay off until a visitor allows that category.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <CardLink href="/admin/content/page/privacy" title="Privacy policy" meta="/privacy" body="Edit the public privacy notice." />
        <CardLink href="/admin/content/page/cookies" title="Cookie policy" meta="/privacy/cookies" body="Edit cookie categories and how to change a choice." />
        <CardLink href="/admin/content/page/gdpr-and-dpdp" title="GDPR & DPDP" meta="/privacy/gdpr-and-dpdp" body="Edit the EU GDPR and India DPDP guide." />
        <CardLink href="/admin/content/page/terms" title="Terms" meta="/terms" body="Edit terms of use and conduct." />
      </div>
      <div className="mt-8">
        <CookieEditor cookies={getCookieSettings()} />
      </div>
    </div>
  );
}
