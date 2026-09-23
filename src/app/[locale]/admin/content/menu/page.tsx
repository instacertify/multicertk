import { setRequestLocale } from "next-intl/server";
import { MenuEditor } from "@/components/site-media-editor";
import { Breadcrumbs } from "@/components/ui";
import { categories } from "@/data/catalog";
import { listArticles } from "@/lib/cms";
import { getHeaderChrome, getMenu } from "@/lib/site-media";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/admin/content/menu",
    title: "Edit header menu",
    description: "Change Certification, Testing, QCOs, Labs, Resources and their category submenus.",
    index: false,
  });
}

export default async function MenuAdmin({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs
        items={[
          { href: "/admin", label: "Editor" },
          { href: "/admin/content", label: "Content" },
          { href: "/admin/content/menu", label: "Header menu" },
        ]}
      />
      <h1 className="mt-4 font-display text-navy">Header menu</h1>
      <p className="mt-3 text-muted">
        Public header items are Certification, Testing, QCOs, Labs and Resources. Add an icon or image on any item, submenu link, Search, the quote button or the mobile menu. Submenus follow category.
      </p>
      <div className="mt-8">
        <MenuEditor
          menu={getMenu()}
          chrome={getHeaderChrome()}
          categories={categories.map((category) => ({ slug: category.slug, name: category.name }))}
          articles={listArticles(locale).map((article) => ({ slug: article.slug, title: article.title }))}
        />
      </div>
    </div>
  );
}
