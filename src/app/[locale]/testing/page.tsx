import { setRequestLocale } from "next-intl/server";
import { Breadcrumbs, CardLink, JsonLd } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { SearchBox } from "@/components/search-box";
import { disciplines, testsByDiscipline } from "@/data/catalog";
import { getPage } from "@/lib/cms";

export const dynamic = "force-dynamic";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/testing",
    title: "Product testing & quality assurance",
    description: "Browse testing by discipline. Every BIS product standard is also a laboratory testing standard.",
  });
}

export default async function TestingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cms = await getPage("testing", locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Testing", path: "/testing" }], locale)} />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/testing", label: "Testing" }]} />
      <h1 className="mt-4 font-display text-4xl text-navy">{cms?.title ?? "Explore the right quality assurance solutions"}</h1>
      <p className="lead mt-3 max-w-3xl text-muted">
        {cms?.intro ??
          "Every BIS certification product standard is also a laboratory testing standard — mapped under chemical, electrical, EMC, physical, microbiology and mechanical categories."}
      </p>
      <PageHero src={cms?.heroImageUrl} alt={cms?.heroImageAlt || cms?.title || "Testing"} />
      <div className="mt-6 max-w-2xl">
        <SearchBox size="sm" />
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {disciplines.map((item) => (
          <CardLink
            key={item.slug}
            href={`/testing/${item.slug}`}
            title={item.name}
            meta={`${testsByDiscipline(item.slug).length} tests`}
            body={item.summary}
          />
        ))}
      </div>
    </div>
  );
}
