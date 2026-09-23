import { setRequestLocale } from "next-intl/server";
import { CardLink } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/admin",
    title: "Editor",
    description: "Edit Certko pages, media, SEO and consent.",
    index: false,
  });
}

export default async function AdminHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">Editor</p>
      <h1 className="mt-2 font-display text-navy">Site editor</h1>
      <p className="lead mt-3 max-w-3xl text-muted">
        Change headings, articles, logos, reviews, the header menu, SEO and cookie consent. Saves apply on the public site immediately.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <CardLink
          href="/admin/content"
          title="Headings & articles"
          meta="Pages and blog"
          body="Edit every public H1, section and article. Add images, tables, bars and spacers on blogs."
        />
        <CardLink
          href="/admin/content/media"
          title="Logos & reviews"
          meta="Trusted-by library"
          body="Upload school and customer logos once. Edit the review library shown on public pages."
        />
        <CardLink
          href="/admin/content/menu"
          title="Header menu"
          meta="Certification · Testing · QCOs · Labs · Resources"
          body="Rename items and edit submenus, including Resources (blog, guide and related pages)."
        />
        <CardLink
          href="/admin/content/seo"
          title="SEO"
          meta="Titles, robots, share image"
          body="Default title, description, keywords and search-index rules for GDPR-aware public pages."
        />
        <CardLink
          href="/admin/content/cookies"
          title="Cookies & consent"
          meta="DPDP · GDPR"
          body="Cookie banner copy and whether analytics or marketing cookies may load after consent."
        />
        <CardLink
          href="/admin/translations"
          title="Translations"
          meta="Human review"
          body="AI drafts plus approve / edit / reject for locale copy."
        />
      </div>
    </div>
  );
}
