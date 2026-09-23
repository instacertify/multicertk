import { setRequestLocale } from "next-intl/server";
import { ReviewQueue } from "@/components/review-queue";
import { products, schemes } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/admin/translations",
    title: "Translation review",
    description: "AI translation drafts waiting for human review.",
    index: false,
  });
}

export default async function AdminTranslationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const seeds = [
    ...schemes.slice(0, 4).map((scheme) => ({
      entityType: "scheme" as const,
      entityId: scheme.slug,
      field: "summary",
      sourceText: scheme.summary,
    })),
    ...products.slice(0, 4).map((product) => ({
      entityType: "product" as const,
      entityId: product.slug,
      field: "excerpt",
      sourceText: product.excerpt,
    })),
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
        <a href="/admin" className="hover:underline">Editor</a> · Human review queue
      </p>
      <h1 className="mt-2 font-display text-4xl text-navy">AI translations + reviewer sign-off</h1>
      <p className="lead mt-3 max-w-3xl text-muted">
        Generate a draft with the translation API, then approve, edit or reject it. Approved copy is what next-intl can publish for Hindi and Arabic.
      </p>
      <ReviewQueue seeds={seeds} />
    </div>
  );
}
