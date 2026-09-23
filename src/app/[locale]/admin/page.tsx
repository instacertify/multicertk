import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CardLink } from "@/components/ui";
import { directusConfigured, directusUrl } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/admin",
    title: "Certko backend / admin",
    description: "How to open the Certko admin and edit headings and articles.",
    index: false,
  });
}

export default async function AdminHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const studio = directusUrl() || "http://localhost:8055";
  const prefix = locale === "en" ? "" : `/${locale}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">Backend access</p>
      <h1 className="mt-2 font-display text-4xl text-navy">How to open Admin</h1>
      <p className="lead mt-3 max-w-3xl text-muted">
        The public catalogue stays searchable. Editors open Admin from the site footer, then edit headings and articles here — or in Directus.
      </p>

      <ol className="mt-8 space-y-4">
        <li className="rounded-2xl border border-line p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">Step 1</p>
          <h2 className="mt-1 font-display text-2xl text-navy">From any page footer</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Scroll to the navy footer → <strong>Backend</strong> → <strong>Admin</strong>. The same link is also in the copyright bar.
          </p>
        </li>
        <li className="rounded-2xl border border-line p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">Step 2</p>
          <h2 className="mt-1 font-display text-2xl text-navy">Or open the URL directly</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              English: <Link href="/admin" className="font-semibold text-navy underline">{prefix || ""}/admin</Link>
            </li>
            <li>
              Headings & articles:{" "}
              <Link href="/admin/content" className="font-semibold text-navy underline">
                {prefix}/admin/content
              </Link>
            </li>
            <li>
              Translations:{" "}
              <Link href="/admin/translations" className="font-semibold text-navy underline">
                {prefix}/admin/translations
              </Link>
            </li>
            <li className="text-muted">
              Other languages use the same path with a prefix: <code>/zh/admin</code>, <code>/es/admin</code>, <code>/fr/admin</code>, <code>/ar/admin</code>, <code>/ru/admin</code>, <code>/hi/admin</code>.
            </li>
          </ul>
        </li>
        <li className="rounded-2xl border border-line p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">Step 3</p>
          <h2 className="mt-1 font-display text-2xl text-navy">Choose what to edit</h2>
          <p className="mt-2 text-sm text-muted">
            Page titles, section headings, blog articles (images, tables, bars, spacers), the trusted-by logo library, customer reviews, or the header menu.
          </p>
        </li>
      </ol>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <CardLink
          href="/admin/content"
          title="Headings & articles"
          meta="In-app editor"
          body="Change a page H1, any section heading, or a blog article. Saves on the site immediately."
        />
        <CardLink
          href="/admin/content/media"
          title="Logos & reviews"
          meta="Trusted-by library"
          body="Upload school and customer logos once. Edit the review library that runs on every public page."
        />
        <CardLink
          href="/admin/content/menu"
          title="Header menu"
          meta="Certification · Testing · QCOs · Labs"
          body="Edit the public header and its submenus."
        />
        <CardLink
          href="/admin/translations"
          title="Translations"
          meta="Human review"
          body="AI drafts plus approve / edit / reject for locale copy."
        />
      </div>

      <div className="mt-6 rounded-2xl border border-line p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">Optional Directus studio</p>
        <h2 className="mt-2 font-display text-2xl text-navy">Same content, desktop CMS</h2>
        <p className="mt-2 text-sm text-muted">
          {directusConfigured()
            ? "This site is configured to read and write cms_pages, cms_sections and cms_articles."
            : "Start Directus with docker compose, then run npm run cms:bootstrap. Until then, the in-app editor still works."}
        </p>
        <p className="mt-3 text-sm">
          Studio:{" "}
          <a href={studio} className="font-semibold text-navy underline" rel="noreferrer">
            {studio}
          </a>
          {" "}
          · local login <code>admin@certko.com</code> / <code>certko-admin</code>
        </p>
      </div>
    </div>
  );
}
