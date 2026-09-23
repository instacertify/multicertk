import { SectionImage } from "./page-hero";
import type { CmsPage } from "@/data/cms-seed";

export function CmsArticles({
  page,
  skip = [],
}: {
  page?: CmsPage;
  skip?: string[];
}) {
  const sections = page?.sections.filter((section) => section.body.length && !skip.includes(section.key)) ?? [];
  if (!sections.length) return null;
  return (
    <div className="mt-12 space-y-8">
      {sections.map((section) => (
        <section key={section.key}>
          <h2 className="font-display text-navy">{section.heading}</h2>
          <SectionImage src={section.imageUrl} alt={section.imageAlt || section.heading} />
          {section.body.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-ink">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
