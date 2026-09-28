import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export const dynamic = "force-dynamic";
import { PageHero } from "@/components/page-hero";
import { ProductGlobe } from "@/components/product-globe";
import { SearchBox } from "@/components/search-box";
import { JsonLd, Section } from "@/components/ui";
import {
  bisRouteLabel,
  catalogStats,
  categories,
  featuredProducts,
  productsByCategory,
} from "@/data/catalog";
import { schemes } from "@/data/schemes";
import { getPage, sectionHeading } from "@/lib/cms";
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
      <section className="border-b border-navy bg-navy text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-10">
          <div className="lg:col-span-6">
            <p className="font-mono text-[11px] text-gold">{t("eyebrow")}</p>
            <h1 className="mt-3 max-w-xl text-white">{cms?.title ?? t("title")}</h1>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-white/80">{cms?.intro ?? t("subtitle")}</p>
            {cms?.heroImageUrl ? (
              <div className="mt-5 overflow-hidden border border-white/15">
                <PageHero src={cms.heroImageUrl} alt={cms.heroImageAlt || cms.title} />
              </div>
            ) : null}
            <div className="mt-6 max-w-xl text-navy">
              <SearchBox />
            </div>
            <p className="mt-3 font-mono text-[11px] text-white/55">
              {stats.products} products · {stats.tests} tests · {stats.schemes} schemes
            </p>
          </div>
          <div className="lg:col-span-6">
            <ProductGlobe />
            <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-wide text-white/50">{t("globeCaption")}</p>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-8">
          <div className="border border-white/15 bg-navy-800">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
              <p className="font-mono text-[11px] uppercase tracking-wide text-gold">{t("deskTitle")}</p>
              <Link href="/products/all" className="text-[11px] text-white/70 underline">
                {t("deskAll")}
              </Link>
            </div>
            <table className="w-full text-left text-[12px]">
              <thead className="text-white/50">
                <tr>
                  <th className="px-4 py-2 font-medium">Product</th>
                  <th className="px-4 py-2 font-medium">Standard</th>
                  <th className="hidden px-4 py-2 font-medium sm:table-cell">HSN</th>
                  <th className="px-4 py-2 font-medium">Route</th>
                </tr>
              </thead>
              <tbody>
                {featured.map((product) =>
                  product ? (
                    <tr key={product.slug} className="border-t border-white/10">
                      <td className="px-4 py-2.5">
                        <Link href={`/product/${product.slug}`} className="text-white hover:text-gold">
                          {product.name}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-white/75">{product.standard}</td>
                      <td className="hidden px-4 py-2.5 font-mono text-white/75 sm:table-cell">{product.hsn}</td>
                      <td className="px-4 py-2.5 text-gold">{bisRouteLabel(product).replace("BIS · ", "")}</td>
                    </tr>
                  ) : null,
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Section title={sectionHeading(cms, "need", t("needTitle"))} eyebrow={t("needEyebrow")}>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="font-display text-navy">{t("needCert")}</h3>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {schemes.slice(0, 8).map((scheme) => (
                <li key={scheme.slug}>
                  <Link href={`/certifications/${scheme.slug}`} className="flex items-baseline justify-between gap-3 py-2 hover:text-gold-600">
                    <span>{scheme.shortName}</span>
                    <span className="font-mono text-[11px] text-muted">{scheme.regulator}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-navy">{t("needTest")}</h3>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {[
                ["chemical-testing", "Chemical"],
                ["electrical-testing", "Electrical"],
                ["emc-testing", "EMC"],
                ["physical-testing", "Physical"],
                ["microbiology-testing", "Microbiology"],
                ["mechanical-testing", "Mechanical"],
              ].map(([slug, label]) => (
                <li key={slug}>
                  <Link href={`/testing/${slug}`} className="block py-2 hover:text-gold-600">
                    {label} testing
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title={sectionHeading(cms, "markets", t("marketsTitle"))} eyebrow={t("marketsEyebrow")}>
        <div className="overflow-x-auto border border-line bg-white">
          <table className="min-w-full text-left">
            <thead className="bg-navy text-white">
              <tr>
                <th className="px-4 py-2 font-medium">Market</th>
                <th className="px-4 py-2 font-medium">Marks we file against</th>
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

      <Section title={sectionHeading(cms, "how", t("howTitle"))}>
        <ol className="divide-y divide-line border-y border-line bg-white">
          {[
            [t("step1"), t("step1Body")],
            [t("step2"), t("step2Body")],
            [t("step3"), t("step3Body")],
          ].map(([title, body], index) => (
            <li key={title} className="grid gap-3 px-4 py-4 sm:grid-cols-[3rem_1fr] sm:items-start">
              <p className="font-mono text-[11px] text-gold-600">{String(index + 1).padStart(2, "0")}</p>
              <div>
                <h3 className="font-display text-navy">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title={sectionHeading(cms, "categories", t("categories"))}>
        <div className="columns-1 gap-x-10 sm:columns-2 lg:columns-3">
          {categories.map((category) => (
            <p key={category.slug} className="mb-2 break-inside-avoid border-b border-line pb-2">
              <Link href={`/category/${category.slug}`} className="text-navy hover:text-gold-600">
                {category.name}
              </Link>
              <span className="ms-2 font-mono text-[11px] text-muted">{productsByCategory(category.slug).length}</span>
            </p>
          ))}
        </div>
      </Section>

      <Section title={sectionHeading(cms, "faq", "Questions people actually ask")}>
        <div className="divide-y divide-line border-y border-line bg-white">
          {(cms?.sections.filter((section) => section.key.startsWith("faq-") && section.body.length).length
            ? cms.sections
                .filter((section) => section.key.startsWith("faq-"))
                .map((section) => ({ q: section.heading, a: section.body.join(" ") }))
            : faqs
          ).map((item) => (
            <details key={item.q} className="group px-4 py-3">
              <summary className="cursor-pointer font-display text-navy">{item.q}</summary>
              <p className="mt-2 max-w-3xl text-sm text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
