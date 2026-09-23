import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumbs, CardLink } from "@/components/ui";
import { disciplines, testsByDiscipline } from "@/data/catalog";
import type { TestDiscipline } from "@/data/types";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return disciplines.map((item) => ({ discipline: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; discipline: string }>;
}) {
  const { locale, discipline } = await params;
  const item = disciplines.find((row) => row.slug === discipline);
  if (!item) return {};
  return pageMetadata({
    locale,
    path: `/testing/${item.slug}`,
    title: item.name,
    description: item.summary,
  });
}

export default async function DisciplinePage({
  params,
}: {
  params: Promise<{ locale: string; discipline: string }>;
}) {
  const { locale, discipline } = await params;
  setRequestLocale(locale);
  const item = disciplines.find((row) => row.slug === discipline);
  if (!item) notFound();
  const mapped = testsByDiscipline(item.slug as TestDiscipline);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/testing", label: "Testing" },
          { href: `/testing/${item.slug}`, label: item.name },
        ]}
      />
      <h1 className="mt-4 font-display text-4xl text-navy">{item.name}</h1>
      <p className="lead mt-3 max-w-3xl text-muted">{item.summary}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {mapped.map((test) => (
          <CardLink
            key={test.slug}
            href={`/testing/${test.discipline}/${test.slug}`}
            title={test.name}
            meta={`${test.standard} · ${test.turnaround}`}
            body={test.summary}
          />
        ))}
      </div>
    </div>
  );
}
