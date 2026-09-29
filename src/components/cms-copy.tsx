import { HighlightTitle } from "./ui";
import { SectionImage } from "./page-hero";
import type { CmsPage } from "@/data/cms-seed";
import { sectionHeading, sectionIcon } from "@/lib/cms";

export function CmsHeading({
  page,
  sectionKey,
  fallback,
  className = "",
  as = "h2",
}: {
  page?: CmsPage;
  sectionKey: string;
  fallback: string;
  className?: string;
  as?: "h2" | "h3" | "p";
}) {
  return (
    <HighlightTitle as={as} iconUrl={sectionIcon(page, sectionKey)} className={className}>
      {sectionHeading(page, sectionKey, fallback)}
    </HighlightTitle>
  );
}

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
          <HighlightTitle iconUrl={section.iconUrl || sectionIcon(page, section.key)}>{section.heading}</HighlightTitle>
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
