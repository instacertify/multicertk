import { setRequestLocale } from "next-intl/server";
import { Breadcrumbs, CardLink } from "@/components/ui";
import { posts } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/blog",
    title: "Certification & testing notes",
    description: "Practical notes on HSN mapping, QCOs, multi-market testing and lab strategy.",
  });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/blog", label: "Blog" }]} />
      <h1 className="mt-4 font-display text-4xl text-navy">Notes from the certification desk</h1>
      <div className="mt-8 grid gap-4">
        {posts.map((post) => (
          <CardLink key={post.slug} href={`/blog/${post.slug}`} title={post.title} meta={post.date} body={post.excerpt} />
        ))}
      </div>
    </div>
  );
}
