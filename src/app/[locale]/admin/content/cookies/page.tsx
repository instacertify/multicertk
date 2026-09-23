import { setRequestLocale } from "next-intl/server";
import { CookieEditor } from "@/components/settings-editor";
import { Breadcrumbs } from "@/components/ui";
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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs
        items={[
          { href: "/admin", label: "Editor" },
          { href: "/admin/content", label: "Content" },
          { href: "/admin/content/cookies", label: "Cookies" },
        ]}
      />
      <h1 className="mt-4 font-display text-navy">Cookies & consent</h1>
      <p className="mt-3 text-muted">
        The public banner asks for consent before analytics or marketing cookies. Edit the legal pages at Privacy, Cookies and GDPR / DPDP.
      </p>
      <div className="mt-8">
        <CookieEditor cookies={getCookieSettings()} />
      </div>
    </div>
  );
}
