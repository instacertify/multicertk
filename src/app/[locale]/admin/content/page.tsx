import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NewPageForm } from "@/components/cms-editor";
import { Breadcrumbs, CardLink } from "@/components/ui";
import { getPages, isCustomCmsPage } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/admin/content",
    title: "Edit pages",
    description: "Add and edit public pages and their sections.",
    index: false,
  });
}

export default async function ContentIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const pages = await getPages(locale);
  const added = pages.filter(isCustomCmsPage);
  const seeded = pages.filter((page) => !isCustomCmsPage(page));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs
        items={[
          { href: "/admin", label: "Editor" },
          { href: "/admin/content", label: "Pages" },
        ]}
      />
      <h1 className="mt-4 font-display text-4xl text-navy">Pages</h1>
      <p className="mt-3 text-muted">
        Every heading and section is a field. Add a new public page, or open an existing one to change copy and images.
      </p>
      <div className="mt-8">
        <NewPageForm locale={locale} />
      </div>
      {added.length ? (
        <>
          <h2 className="mt-10 font-display text-2xl text-navy">Pages you added</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {added.map((page) => (
              <CardLink
                key={page.slug}
                href={`/admin/content/page/${page.slug}`}
                title={page.title}
                meta={`${page.sections.length} sections · ${page.path}`}
                body={page.intro}
              />
            ))}
          </div>
        </>
      ) : null}
      <h2 className="mt-10 font-display text-2xl text-navy">Site pages</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {seeded.map((page) => (
          <CardLink
            key={page.slug}
            href={`/admin/content/page/${page.slug}`}
            title={page.title}
            meta={`${page.sections.length} sections · ${page.path}`}
            body={page.intro}
          />
        ))}
      </div>
      <p className="mt-8 text-sm">
        <Link href="/admin/content/blogs" className="font-semibold text-navy underline">
          Blogs →
        </Link>
      </p>
    </div>
  );
}
