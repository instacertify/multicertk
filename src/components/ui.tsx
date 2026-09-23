import { Link } from "@/i18n/navigation";

export function Badge({
  children,
  tone = "navy",
}: {
  children: React.ReactNode;
  tone?: "navy" | "gold" | "mist" | "alert";
}) {
  const tones = {
    navy: "bg-navy text-white",
    gold: "bg-gold text-navy",
    mist: "bg-mist text-navy",
    alert: "bg-amber-100 text-amber-900",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function CardLink({
  href,
  title,
  meta,
  body,
}: {
  href: string;
  title: string;
  meta?: string;
  body?: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gold"
    >
      {meta ? <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">{meta}</p> : null}
      <h4 className="mt-1 font-display text-navy">{title}</h4>
      {body ? <p className="mt-2 text-muted">{body}</p> : null}
    </Link>
  );
}

export function Section({
  title,
  children,
  eyebrow,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">{eyebrow}</p> : null}
      <h2 className="mt-1 font-display text-3xl text-navy">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function StatusBadge({ status }: { status: "mandatory" | "upcoming" | "voluntary" }) {
  const map = {
    mandatory: { tone: "navy" as const, label: "Mandatory" },
    upcoming: { tone: "alert" as const, label: "Upcoming QCO" },
    voluntary: { tone: "mist" as const, label: "Voluntary" },
  };
  return <Badge tone={map[status].tone}>{map[status].label}</Badge>;
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function Breadcrumbs({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="caption text-muted">
      <ol className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index > 0 ? <span>/</span> : null}
            <Link href={item.href} className="hover:text-navy">
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
