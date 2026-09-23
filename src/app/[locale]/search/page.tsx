import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/page-hero";
import { SearchBox } from "@/components/search-box";
import { Badge, Breadcrumbs, CardLink, JsonLd } from "@/components/ui";
import { searchAll } from "@/lib/search";
import { getPage } from "@/lib/cms";
import { pageMetadata, websiteLd } from "@/lib/seo";
import { searchQuerySchema } from "@/lib/validation";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  return pageMetadata({
    locale,
    path: q ? `/search?q=${encodeURIComponent(q)}` : "/search",
    title: q ? `Search: ${q}` : "Search certifications, labs and standards",
    description: "Search every lab standard and certification scheme — products, HSN, IS numbers, labs and markets.",
    index: false,
  });
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const raw = await searchParams;
  const parsed = searchQuerySchema.safeParse(raw);
  const q = parsed.success ? parsed.data.q : "";
  const type = parsed.success ? parsed.data.type : undefined;
  const result = await searchAll(q, 30, type);
  const cms = await getPage("search", locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <JsonLd data={websiteLd()} />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/search", label: "Search" }]} />
      <h1 className="mt-4 font-display text-4xl text-navy">{cms?.title ?? "Search the interlinked catalogue"}</h1>
      <p className="lead mt-2 text-muted">
        {cms?.intro ?? "Products, IS standards, HSN codes, schemes, labs, tests, QCOs and destination markets."}
      </p>
      <PageHero src={cms?.heroImageUrl} alt={cms?.heroImageAlt || cms?.title || "Search"} />
      <div className="mt-6">
        <SearchBox initialQuery={q} autoFocus />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {[
          ["", "All"],
          ["product", "Products"],
          ["lab", "Labs"],
          ["scheme", "Schemes"],
          ["qco", "QCO"],
          ["bee", "BEE"],
          ["gmark", "G-Mark"],
          ["eu", "EU / CE"],
        ].map(([value, label]) => {
          const href = q
            ? `/search?q=${encodeURIComponent(q)}${value ? `&type=${value}` : ""}`
            : `/search${value ? `?type=${value}` : ""}`;
          return (
            <Link
              key={label}
              href={href}
              className={`rounded-full border px-3 py-1 ${type === value || (!type && !value) ? "border-navy bg-navy text-white" : "border-line"}`}
            >
              {label}
            </Link>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted">
        Engine: {result.engine === "meilisearch" ? "Meilisearch Community Edition" : "in-process catalogue (Meilisearch optional)"}
      </p>
      <div className="mt-8 grid gap-4">
        {result.hits.length === 0 ? (
          <p className="rounded-2xl border border-line bg-paper p-6 text-muted">
            {q ? "No matches. Try an IS number, HSN, lab city or scheme name such as BIS, GMARK or SABER." : "Type a product, standard or HSN to begin."}
          </p>
        ) : (
          result.hits.map((hit) => (
            <div key={hit.id} className="relative">
              <CardLink href={hit.url} title={hit.title} meta={hit.subtitle} body={hit.description} />
              <div className="absolute right-4 top-4">
                <Badge>{hit.type}</Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
