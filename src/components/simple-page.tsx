import { PageMedia, SectionImage } from "./page-hero";
import { Breadcrumbs } from "./ui";
import { LeadForm } from "./lead-form";

export function SimplePage({
  title,
  path,
  intro,
  heroImageUrl,
  heroImageAlt,
  galleryUrls,
  sections,
  showLead = true,
  crumbs,
}: {
  title: string;
  path: string;
  intro: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  galleryUrls?: string[];
  sections: { heading: string; body: string[]; imageUrl?: string; imageAlt?: string }[];
  showLead?: boolean;
  crumbs?: { href: string; label: string }[];
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={crumbs ?? [{ href: "/", label: "Home" }, { href: path, label: title }]} />
      <h1 className="mt-4 font-display text-navy">{title}</h1>
      <p className="lead mt-3 text-muted">{intro}</p>
      <PageMedia src={heroImageUrl} alt={heroImageAlt || title} gallery={galleryUrls} />
      {sections.map((section) => (
        <section key={section.heading} className="mt-8">
          <h2 className="font-display text-navy">{section.heading}</h2>
          <SectionImage src={section.imageUrl} alt={section.imageAlt || section.heading} />
          {section.body.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-ink">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
      {showLead ? (
        <div className="mt-10">
          <LeadForm sourcePath={path} />
        </div>
      ) : null}
    </div>
  );
}
