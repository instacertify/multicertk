import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export const dynamic = "force-dynamic";
import { HomeHeroShapes } from "@/components/home-decor";
import { PageHero } from "@/components/page-hero";
import { ProductGlobe } from "@/components/product-globe";
import { SearchBox } from "@/components/search-box";
import { HighlightIcon, JsonLd, Section } from "@/components/ui";
import {
  bisRouteLabel,
  catalogStats,
  categories,
  featuredProducts,
  productsByCategory,
} from "@/data/catalog";
import { schemes } from "@/data/schemes";
import { getPage, sectionHeading, sectionIcon } from "@/lib/cms";
import { breadcrumbLd, faqLd, organizationLd, pageMetadata, websiteLd } from "@/lib/seo";

const faqs = [
  {
    q: "What is BIS certification?",
    a: "BIS certification is a conformity assessment run by the Bureau of Indian Standards. For notified products it is mandatory before manufacture, import or sale in India.",
  },
  {
    q: "What is the difference between ISI mark and CRS registration?",
    a: "CRS is part of BIS. If the product is on the CRS list it uses Scheme II (lab-test registration). Products not covered in CRS take the ISI mark licence (Scheme I — test plus factory inspection).",
  },
  {
    q: "How much does BIS certification cost in India?",
    a: "Total cost is laboratory testing + BIS government fees + marking fee + optional consulting. Product pages list an indicative range; the quote desk returns a booked rate.",
  },
  {
    q: "Do foreign manufacturers need BIS certification?",
    a: "Yes. Foreign factories use FMCS or CRS and must appoint an Authorised Indian Representative (AIR).",
  },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: "/",
    title: t("homeTitle"),
    description: t("homeDescription"),
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const cms = await getPage("home", locale);
  const stats = catalogStats();
  const featured = featuredProducts(8);

  return (
    <>
      <JsonLd data={[organizationLd(), websiteLd(), breadcrumbLd([{ name: "Home", path: "/" }], locale), faqLd(faqs)]} />
      <section className="home-hero home-hero-light">
        <HomeHeroShapes />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold-600">{t("eyebrow")}</p>
            <h1 className="mt-4 text-navy">{cms?.title ?? t("title")}</h1>
            <p className="mt-4 max-w-lg text-[15px] leading-7 text-muted">{cms?.intro ?? t("subtitle")}</p>
            {cms?.heroImageUrl ? (
              <div className="mt-6 overflow-hidden rounded-2xl border border-line">
                <PageHero src={cms.heroImageUrl} alt={cms.heroImageAlt || cms.title} />
              </div>
            ) : null}
            <div className="mt-8 w-full text-navy">
              <SearchBox />
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-3 font-mono text-[11px]">
              {(
                [
                  ["stat-products", "Products", stats.products],
                  ["stat-tests", "Tests", stats.tests],
                  ["stat-schemes", "Schemes", stats.schemes],
                ] as const
              ).map(([key, label, value]) => (
                <div key={key} className="home-stat">
                  <HighlightIcon src={sectionIcon(cms, key)} size="sm" />
                  <dt>{sectionHeading(cms, key, label)}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-7">
            <div className="home-globe-stage">
              <div className="home-globe-well">
                <ProductGlobe />
              </div>
            </div>
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-14 lg:pb-20">
          <div className="home-desk">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gold-600">
                <HighlightIcon src={sectionIcon(cms, "desk")} size="sm" />
                {sectionHeading(cms, "desk", t("deskTitle"))}
              </p>
              <Link href="/products/all" className="text-[11px] font-semibold text-gold-600 underline">
                {t("deskAll")}
              </Link>
            </div>
            <table className="home-desk-table w-full text-left">
              <thead className="text-muted">
                <tr>
                  <th className="px-5 py-2.5 font-medium">Product</th>
                  <th className="hidden px-5 py-2.5 font-medium md:table-cell">Standard</th>
                  <th className="hidden px-5 py-2.5 font-medium lg:table-cell">HSN</th>
                  <th className="px-5 py-2.5 font-medium">Route</th>
                </tr>
              </thead>
              <tbody>
                {featured.map((product) =>
                  product ? (
                    <tr key={product.slug} className="border-t border-line">
                      <td className="px-5 py-3">
                        <Link href={`/product/${product.slug}`} className="block truncate text-navy hover:text-gold-600" title={product.name}>
                          {product.name}
                        </Link>
                      </td>
                      <td className="hidden px-5 py-3 font-mono text-muted md:table-cell">{product.standard}</td>
                      <td className="hidden px-5 py-3 font-mono text-muted lg:table-cell">{product.hsn}</td>
                      <td className="px-5 py-3 font-semibold text-gold-600">{bisRouteLabel(product).replace("BIS · ", "")}</td>
                    </tr>
                  ) : null,
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Section title={sectionHeading(cms, "need", t("needTitle"))} eyebrow={t("needEyebrow")} iconUrl={sectionIcon(cms, "need")}>
        <div className="grid items-start gap-6 md:grid-cols-2 md:gap-8">
          <div className="home-panel p-5">
            <h3 className="flex items-center gap-2 font-display text-navy">
              <HighlightIcon src={sectionIcon(cms, "need-cert")} size="sm" />
              {sectionHeading(cms, "need-cert", t("needCert"))}
            </h3>
            <ul className="mt-4 divide-y divide-line">
              {schemes.slice(0, 8).map((scheme) => (
                <li key={scheme.slug}>
                  <Link href={`/certifications/${scheme.slug}`} className="flex items-baseline justify-between gap-3 py-2.5 hover:text-gold-600">
                    <span>{scheme.shortName}</span>
                    <span className="font-mono text-[11px] text-gold-600">{scheme.regulator}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="home-panel p-5">
            <h3 className="flex items-center gap-2 font-display text-navy">
              <HighlightIcon src={sectionIcon(cms, "need-test")} size="sm" />
              {sectionHeading(cms, "need-test", t("needTest"))}
            </h3>
            <ul className="mt-4 divide-y divide-line">
              {[
                ["chemical-testing", "Chemical"],
                ["electrical-testing", "Electrical"],
                ["emc-testing", "EMC"],
                ["physical-testing", "Physical"],
                ["microbiology-testing", "Microbiology"],
                ["mechanical-testing", "Mechanical"],
              ].map(([slug, label]) => (
                <li key={slug}>
                  <Link href={`/testing/${slug}`} className="block py-2.5 hover:text-gold-600">
                    {label} testing
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title={sectionHeading(cms, "markets", t("marketsTitle"))} eyebrow={t("marketsEyebrow")} iconUrl={sectionIcon(cms, "markets")}>
        <div className="home-panel overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gold/20 text-navy">
              <tr>
                <th className="px-4 py-2.5 font-medium">Market</th>
                <th className="px-4 py-2.5 font-medium">Marks we file against</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["india", "India", "BIS (CRS / ISI), BEE, WPC, TEC"],
                ["australia", "Australia", "RCM, GEMS"],
                ["european-union", "EU / EEA", "CE marking"],
                ["united-states", "United States", "FCC, NRTL"],
                ["saudi-arabia", "Saudi Arabia", "SABER, CST"],
              ].map(([slug, name, meta]) => (
                <tr key={slug} className="border-t border-line">
                  <td className="px-4 py-2.5">
                    <Link href={`/certifications/countries/${slug}`} className="font-semibold text-navy underline">
                      {name}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-muted">{meta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title={sectionHeading(cms, "how", t("howTitle"))} iconUrl={sectionIcon(cms, "how")}>
        <ol className="home-panel divide-y divide-line">
          {[
            ["how-1", t("step1"), t("step1Body")],
            ["how-2", t("step2"), t("step2Body")],
            ["how-3", t("step3"), t("step3Body")],
          ].map(([key, title, body]) => (
            <li key={key} className="grid gap-3 px-4 py-4 sm:grid-cols-[3rem_1fr] sm:items-start">
              <HighlightIcon src={sectionIcon(cms, key)} />
              <div>
                <h3 className="font-display text-navy">{sectionHeading(cms, key, title)}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title={sectionHeading(cms, "categories", t("categories"))} iconUrl={sectionIcon(cms, "categories")}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <p key={category.slug} className="home-category">
              <span className="flex min-w-0 items-center gap-2">
                <HighlightIcon src={sectionIcon(cms, `cat-${category.slug}`)} size="sm" />
                <Link href={`/category/${category.slug}`} className="truncate text-navy hover:text-gold-600">
                  {category.name}
                </Link>
              </span>
              <span className="font-mono text-[11px] text-gold-600">{productsByCategory(category.slug).length}</span>
            </p>
          ))}
        </div>
      </Section>

      <Section title={sectionHeading(cms, "faq", "Questions people actually ask")} iconUrl={sectionIcon(cms, "faq")}>
        <div className="home-panel divide-y divide-line">
          {(cms?.sections.filter((section) => section.key.startsWith("faq-") && section.body.length).length
            ? cms.sections
                .filter((section) => section.key.startsWith("faq-"))
                .map((section) => ({ key: section.key, q: section.heading, a: section.body.join(" ") }))
            : faqs.map((item, index) => ({ key: `faq-${index}`, q: item.q, a: item.a }))
          ).map((item) => (
            <details key={item.key} className="group px-4 py-3">
              <summary className="flex cursor-pointer list-none items-center gap-2 font-display text-navy [&::-webkit-details-marker]:hidden">
                <HighlightIcon src={sectionIcon(cms, item.key)} size="sm" />
                {item.q}
              </summary>
              <p className="mt-2 max-w-3xl pl-9 text-sm text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
