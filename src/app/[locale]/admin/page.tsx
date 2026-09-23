import { setRequestLocale } from "next-intl/server";
import { CardLink } from "@/components/ui";
import { directusConfigured, directusUrl } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/admin",
    title: "Certko backend",
    description: "Simple editorial backend for headings, articles and translations.",
    index: false,
  });
}

export default async function AdminHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const studio = directusUrl() || "http://localhost:8055";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">Simple backend</p>
      <h1 className="mt-2 font-display text-4xl text-navy">Edit headings & articles</h1>
      <p className="mt-3 max-w-3xl text-muted">
        Catalogue products and labs stay in the generated library. Page headings, section copy and blog articles are edited here — and optionally synced to Directus.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <CardLink
          href="/admin/content"
          title="Headings & articles"
          meta="In-app editor"
          body="Change a page H1, any section heading, or a blog article. Saves immediately; Directus picks it up when it is running."
        />
        <CardLink
          href="/admin/translations"
          title="Translations"
          meta="Human review"
          body="AI drafts plus approve / edit / reject for locale copy."
        />
      </div>
      <div className="mt-6 rounded-2xl border border-line p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">Directus</p>
        <h2 className="mt-2 font-display text-2xl text-navy">Studio</h2>
        <p className="mt-2 text-sm text-muted">
          {directusConfigured()
            ? "This site is configured to read and write cms_pages, cms_sections and cms_articles."
            : "Start Directus with docker compose, then run npm run cms:bootstrap. Until then, the in-app editor still works."}
        </p>
        <p className="mt-4">
          <a href={studio} className="font-semibold text-navy underline" rel="noreferrer">
            Open Directus at {studio} →
          </a>
        </p>
      </div>
    </div>
  );
}
