import { setRequestLocale } from "next-intl/server";
import { PageMedia } from "@/components/page-hero";

export const dynamic = "force-dynamic";
import { Breadcrumbs } from "@/components/ui";
import { getPage } from "@/lib/cms";
import { cmsPageMetadata } from "@/components/cms-page";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return cmsPageMetadata(locale, "contact", "Contact Certko", "Talk to a certification expert. Free quote in 24 hours.");
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = await getPage("contact", locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/contact", label: "Contact" }]} />
      <h1 className="mt-4 font-display text-navy">{page?.title ?? "Get in touch"}</h1>
      <p className="mt-3 text-muted">{page?.intro}</p>
      <PageMedia src={page?.heroImageUrl} alt={page?.heroImageAlt || page?.title || "Contact"} gallery={page?.galleryUrls} />
      <ul className="mt-6 space-y-2 text-sm">
        <li>{site.address}</li>
        <li>
          <a className="underline" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </li>
        <li>
          <a className="underline" href={site.phoneHref}>
            {site.phone}
          </a>
        </li>
      </ul>
      <p className="mt-6 text-sm text-muted">
        Use the quote desk below on this page — the same form as the rest of the site.
      </p>
    </div>
  );
}
