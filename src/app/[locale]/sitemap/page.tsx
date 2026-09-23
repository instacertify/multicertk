import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/ui";
import {
  beeProducts,
  categories,
  countries,
  disciplines,
  euSectors,
  gmarkProducts,
  labs,
  products,
  qcos,
  schemes,
  tests,
} from "@/data/catalog";
import { listArticles } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/sitemap",
    title: "HTML sitemap",
    description: "Human-readable map of every searchable, interlinked Certko record.",
  });
}

export default async function HtmlSitemapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const groups: { title: string; links: { href: string; label: string }[] }[] = [
    {
      title: "Core",
      links: [
        { href: "/", label: "Home" },
        { href: "/products", label: "Products" },
        { href: "/products/all", label: "All products" },
        { href: "/certifications", label: "Certifications" },
        { href: "/certifications/countries", label: "Markets" },
        { href: "/testing", label: "Testing" },
        { href: "/labs", label: "Labs" },
        { href: "/qco", label: "QCO" },
        { href: "/blog", label: "Blog" },
        { href: "/search", label: "Search" },
        { href: "/guide", label: "Guide" },
        { href: "/tenders", label: "Tenders" },
        { href: "/marketplaces", label: "Marketplaces" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
      ],
    },
    { title: "Schemes", links: schemes.map((item) => ({ href: `/certifications/${item.slug}`, label: item.name })) },
    { title: "Markets", links: countries.map((item) => ({ href: `/certifications/countries/${item.slug}`, label: item.name })) },
    { title: "Categories", links: categories.map((item) => ({ href: `/category/${item.slug}`, label: item.name })) },
    { title: "Products / standards", links: products.map((item) => ({ href: `/product/${item.slug}`, label: `${item.standard} — ${item.name}` })) },
    { title: "Labs", links: labs.map((item) => ({ href: `/labs/${item.slug}`, label: item.name })) },
    { title: "Tests", links: tests.map((item) => ({ href: `/testing/${item.discipline}/${item.slug}`, label: item.name })) },
    { title: "Disciplines", links: disciplines.map((item) => ({ href: `/testing/${item.slug}`, label: item.name })) },
    { title: "BEE products", links: beeProducts.map((item) => ({ href: `/certifications/bee/products/${item.slug}`, label: item.name })) },
    { title: "G-Mark products", links: gmarkProducts.map((item) => ({ href: `/certifications/g-mark/products/${item.slug}`, label: item.name })) },
    { title: "EU / CE sectors", links: euSectors.map((item) => ({ href: `/certifications/ce/products/${item.slug}`, label: item.name })) },
    { title: "Quality Control Orders", links: qcos.map((item) => ({ href: `/qco/${item.slug}`, label: item.name })) },
    { title: "Blog", links: listArticles("en").map((item) => ({ href: `/blog/${item.slug}`, label: item.title })) },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/sitemap", label: "Sitemap" }]} />
      <h1 className="mt-4 font-display text-4xl text-navy">HTML sitemap</h1>
      <p className="mt-3 text-muted">Mirrors the public certko.com sitemap shape — every scheme, standard, lab and test is one click away.</p>
      {groups.map((group) => (
        <section key={group.title} className="mt-8">
          <h2 className="font-display text-2xl text-navy">{group.title}</h2>
          <ul className="mt-3 columns-1 gap-x-8 text-sm sm:columns-2">
            {group.links.map((link) => (
              <li key={link.href} className="mb-1 break-inside-avoid">
                <Link href={link.href} className="text-navy underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
