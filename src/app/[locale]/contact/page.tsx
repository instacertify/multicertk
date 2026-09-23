import { setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/lead-form";
import { Breadcrumbs } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/contact",
    title: "Contact Certko",
    description: "Talk to a certification expert. Free quote in 24 hours.",
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-2">
      <div>
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/contact", label: "Contact" }]} />
        <h1 className="mt-4 font-display text-4xl text-navy">Get in touch</h1>
        <p className="mt-3 text-muted">Scheme mapping, lab coordination and filings for India and export markets.</p>
        <ul className="mt-6 space-y-2 text-sm">
          <li>{site.address}</li>
          <li><a className="underline" href={`mailto:${site.email}`}>{site.email}</a></li>
          <li><a className="underline" href={site.phoneHref}>{site.phone}</a></li>
        </ul>
      </div>
      <LeadForm sourcePath="/contact" />
    </div>
  );
}
