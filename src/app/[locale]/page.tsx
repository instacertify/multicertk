import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export const dynamic = "force-dynamic";
import { Logo } from "@/components/logo";
import { SearchBox } from "@/components/search-box";
import { Badge, CardLink, JsonLd, Section } from "@/components/ui";
import {
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
    a: "ISI (Scheme I) needs product testing plus a factory inspection. CRS (Scheme II) is lab-test based registration, mainly for electronics and IT products.",
  },
  {
    q: "How much does BIS certification cost in India?",
    a: "Total cost is laboratory testing + BIS government fees + marking fee + optional consulting. Listed lab ranges can look high — contact Certko and get up to 30% lesser pricing.",
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
  const featured = featuredProducts();

  return (
    <>
      <JsonLd data={[organizationLd(), websiteLd(), breadcrumbLd([{ name: "Home", path: "/" }], locale), faqLd(faqs)]} />
      <section className="bg-navy text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <Logo variant="onDark" className="h-12 w-auto sm:h-14" />
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-gold">{t("eyebrow")}</p>
            <h1 className="mt-3 font-display text-white">{cms?.title ?? t("title")}</h1>
            <p className="lead mt-4 max-w-2xl text-white/75">{cms?.intro ?? t("subtitle")}</p>
            <div className="mt-8 max-w-2xl text-navy">
              <SearchBox />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              [stats.products, t("statsProducts")],
              [stats.tests, t("statsTests")],
              [stats.labs, t("statsLabs")],
              [stats.schemes, t("statsSchemes")],
            ].map(([value, label]) => (
              <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="font-display text-3xl text-gold">{value}+</p>
                <p className="mt-1 text-sm text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section title={sectionHeading(cms, "need", t("needTitle"))}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-paper p-6">
            <h3 className="font-display text-2xl text-navy">{t("needCert")}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {schemes.slice(0, 7).map((scheme) => (
                <Link key={scheme.slug} href={`/certifications/${scheme.slug}`}>
                  <Badge tone="navy">{scheme.shortName}</Badge>
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-mist p-6">
            <h3 className="font-display text-2xl text-navy">{t("needTest")}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {["chemical-testing", "electrical-testing", "emc-testing", "physical-testing", "microbiology-testing", "mechanical-testing"].map((slug) => (
                <Link key={slug} href={`/testing/${slug}`}>
                  <Badge tone="mist">{slug.replace("-testing", "")}</Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title={sectionHeading(cms, "markets", t("marketsTitle"))} eyebrow="Global market access">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["india", "India", "BIS · BEE · WPC · TEC"],
            ["australia", "Australia", "RCM · GEMS"],
            ["european-union", "EU / EEA", "CE marking"],
            ["united-states", "United States", "FCC · NRTL"],
            ["saudi-arabia", "Saudi Arabia", "SABER · CST"],
          ].map(([slug, name, meta]) => (
            <CardLink key={slug} href={`/certifications/countries/${slug}`} title={name} meta={meta} />
          ))}
        </div>
      </Section>

      <Section title={sectionHeading(cms, "how", t("howTitle"))}>
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            [t("step1"), t("step1Body")],
            [t("step2"), t("step2Body")],
            [t("step3"), t("step3Body")],
          ].map(([title, body], index) => (
            <li key={title} className="rounded-2xl border border-line p-5">
              <p className="font-display text-3xl text-gold">{index + 1}</p>
              <h3 className="mt-2 font-display text-xl text-navy">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title={sectionHeading(cms, "popular", t("popular"))}>
        <div className="grid gap-4 md:grid-cols-2">
          {featured.map((product) =>
            product ? (
              <CardLink
                key={product.slug}
                href={`/product/${product.slug}`}
                title={product.name}
                meta={`${product.standard} · ${product.qcoStatus}`}
                body={product.excerpt}
              />
            ) : null,
          )}
        </div>
      </Section>

      <Section title={sectionHeading(cms, "categories", t("categories"))}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CardLink
              key={category.slug}
              href={`/category/${category.slug}`}
              title={category.name}
              meta={`${productsByCategory(category.slug).length} products`}
              body={category.summary}
            />
          ))}
        </div>
      </Section>

      <Section title="Frequently asked questions">
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((item) => (
            <article key={item.q} className="rounded-2xl border border-line p-5">
              <h3 className="font-display text-lg text-navy">{item.q}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.a}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
