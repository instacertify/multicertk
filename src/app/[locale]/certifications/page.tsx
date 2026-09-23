import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs, CardLink, JsonLd } from "@/components/ui";
import { countries, productsByScheme, schemes } from "@/data/catalog";
import { getPage, sectionHeading } from "@/lib/cms";

export const dynamic = "force-dynamic";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/certifications",
    title: "Certifications & global market access",
    description: "GMA framework plus full Certko programmes for India, the EU, the US, GCC and Saudi Arabia — and country guides for 39 other markets.",
  });
}

export default async function CertificationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cms = await getPage("certifications", locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Certifications", path: "/certifications" }], locale)} />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/certifications", label: "Certifications" }]} />
      <h1 className="mt-4 font-display text-4xl text-navy">{cms?.title ?? "Certifications & global market access"}</h1>
      <p className="lead mt-3 max-w-3xl text-muted">
        {cms?.intro ??
          "Start with the GMA framework, then open full programmes. Every scheme is interlinked to products, labs, tests and destination countries."}
      </p>
      <PageHero src={cms?.heroImageUrl} alt={cms?.heroImageAlt || cms?.title || "Certifications"} />
      <h2 className="mt-10 font-display text-2xl text-navy">{sectionHeading(cms, "how", "How GMA works")}</h2>
      <ol className="mt-4 grid gap-4 md:grid-cols-4">
        {["Regulatory determination", "Testing to the national standard", "Local representation", "Filing & follow-up"].map((step, index) => (
          <li key={step} className="rounded-2xl border border-line p-4">
            <p className="text-gold font-display text-2xl">{index + 1}</p>
            <p className="mt-1 font-semibold text-navy">{step}</p>
          </li>
        ))}
      </ol>
      <h2 className="mt-12 font-display text-2xl text-navy">{sectionHeading(cms, "programmes", "Certification programmes")}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {schemes.map((scheme) => (
          <CardLink
            key={scheme.slug}
            href={`/certifications/${scheme.slug}`}
            title={scheme.name}
            meta={`${productsByScheme(scheme.slug).length} products · ${scheme.regulator}`}
            body={scheme.summary}
          />
        ))}
      </div>
      <h2 className="mt-12 font-display text-2xl text-navy">{sectionHeading(cms, "markets", "Destination markets")}</h2>
      <p className="mt-2 text-sm">
        <a className="font-semibold text-navy underline" href="/certifications/countries">
          Browse all country guides →
        </a>
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {countries.slice(0, 8).map((country) => (
          <CardLink key={country.slug} href={`/certifications/countries/${country.slug}`} title={country.name} meta={country.region} />
        ))}
      </div>
    </div>
  );
}
