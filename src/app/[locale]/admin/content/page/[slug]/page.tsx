import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageEditor } from "@/components/cms-editor";
import { Breadcrumbs } from "@/components/ui";
import { getPage } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const page = await getPage(slug, locale);
  return pageMetadata({
    locale,
    path: `/admin/content/page/${slug}`,
    title: page ? `Edit ${page.title}` : "Edit page",
    description: "Edit page heading and section articles.",
    index: false,
  });
}

export default async function EditPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const page = await getPage(slug, locale);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs
        items={[
          { href: "/admin", label: "Editor" },
          { href: "/admin/content", label: "Content" },
          { href: `/admin/content/page/${page.slug}`, label: page.title },
        ]}
      />
      <h1 className="mt-4 font-display text-4xl text-navy">Edit page</h1>
      <p className="mt-2 text-sm text-muted">
        Public URL: <Link href={page.path || "/"} className="underline">{page.path || "/"}</Link>
      </p>
      <div className="mt-8">
        <PageEditor page={page} locale={locale} />
      </div>
    </div>
  );
}
