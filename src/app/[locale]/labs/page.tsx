import { setRequestLocale } from "next-intl/server";
import { PageMedia } from "@/components/page-hero";
import { Breadcrumbs, JsonLd } from "@/components/ui";
import { getPage } from "@/lib/cms";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/labs",
    title: "Laboratory testing",
    description: "Certko assigns an accredited laboratory for your standard. Recognised-lab names, cities and scope tables are not published.",
    index: false,
  });
}

export default async function LabsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cms = await getPage("labs", locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Testing", path: "/testing" }], locale)} />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/testing", label: "Testing" }]} />
      <h1 className="mt-4 font-display text-navy">{cms?.title ?? "Laboratory testing"}</h1>
      <p className="lead mt-3 max-w-3xl text-muted">
        {cms?.intro ??
          "Certko assigns an accredited laboratory for your standard. Recognised-lab names, cities and scope tables are not published. Use the quote desk and we book the test."}
      </p>
      <PageMedia src={cms?.heroImageUrl} alt={cms?.heroImageAlt || cms?.title || "Laboratory testing"} gallery={cms?.galleryUrls} />
      <p className="mt-6 rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink">
        Named testing laboratories, locations and indicative lab-scope prices stay off this site. Product pages list the IS standard and a test-cost range only.
      </p>
    </div>
  );
}
