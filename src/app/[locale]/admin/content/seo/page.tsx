import { setRequestLocale } from "next-intl/server";
import { SeoEditor } from "@/components/settings-editor";
import { Breadcrumbs } from "@/components/ui";
import { getSeo } from "@/lib/site-settings";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/admin/content/seo",
    title: "SEO",
    description: "Default titles, descriptions and search-index rules.",
    index: false,
  });
}

export default async function SeoAdmin({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs
        items={[
          { href: "/admin", label: "Editor" },
          { href: "/admin/content", label: "Content" },
          { href: "/admin/content/seo", label: "SEO" },
        ]}
      />
      <h1 className="mt-4 font-display text-navy">SEO</h1>
      <p className="mt-3 text-muted">
        Default title, description, share image and whether public pages may be indexed. Page-level titles still come from each page editor.
      </p>
      <div className="mt-8">
        <SeoEditor seo={getSeo()} />
      </div>
    </div>
  );
}
