import { setRequestLocale } from "next-intl/server";
import { LogoLibraryEditor, ReviewLibraryEditor } from "@/components/site-media-editor";
import { Breadcrumbs } from "@/components/ui";
import { getLogos, getReviews } from "@/lib/site-media";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/admin/content/media",
    title: "Logos & customer reviews",
    description: "Upload trusted-by school logos and edit the customer review library.",
    index: false,
  });
}

export default async function MediaAdmin({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs
        items={[
          { href: "/admin", label: "Backend" },
          { href: "/admin/content", label: "Content" },
          { href: "/admin/content/media", label: "Logos & reviews" },
        ]}
      />
      <h1 className="mt-4 font-display text-navy">Trusted-by logos & reviews</h1>
      <p className="mt-3 text-muted">
        Upload school and customer logos in one place. The strip runs on every public page. The review library is edited here and shown with the same strip.
      </p>
      <h2 className="mt-10 font-display text-navy">Logo library</h2>
      <div className="mt-4">
        <LogoLibraryEditor logos={getLogos()} />
      </div>
      <h2 className="mt-12 font-display text-navy">Customer review library</h2>
      <div className="mt-4">
        <ReviewLibraryEditor reviews={getReviews()} />
      </div>
    </div>
  );
}
