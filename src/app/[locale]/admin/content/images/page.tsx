import { setRequestLocale } from "next-intl/server";
import { ImageLibrary } from "@/components/image-library";
import { Breadcrumbs } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/admin/content/images",
    title: "Image library",
    description: "Upload and reuse images on pages and blogs.",
    index: false,
  });
}

export default async function ImagesAdmin({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs
        items={[
          { href: "/admin", label: "Editor" },
          { href: "/admin/content/images", label: "Images" },
        ]}
      />
      <h1 className="mt-4 font-display text-4xl text-navy">Images</h1>
      <p className="mt-3 text-muted">
        Upload images for pages and blogs. Copy a URL and paste it into any image field, or upload directly on a page or article.
      </p>
      <div className="mt-8">
        <ImageLibrary />
      </div>
    </div>
  );
}
