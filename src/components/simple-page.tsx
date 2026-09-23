import { Breadcrumbs } from "./ui";
import { LeadForm } from "./lead-form";

export function SimplePage({
  title,
  path,
  intro,
  sections,
  showLead = true,
}: {
  title: string;
  path: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
  showLead?: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: path, label: title }]} />
      <h1 className="mt-4 font-display text-4xl text-navy">{title}</h1>
      <p className="lead mt-3 text-muted">{intro}</p>
      {sections.map((section) => (
        <section key={section.heading} className="mt-8">
          <h2 className="font-display text-2xl text-navy">{section.heading}</h2>
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
