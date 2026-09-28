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
    mist: "border border-line bg-mist text-navy",
    alert: "bg-amber-100 text-amber-950",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function CardLink({
  href,
  title,
  meta,
  body,
  image,
}: {
  href: string;
  title: string;
  meta?: string;
  body?: string;
  image?: string;
}) {
  return (
    <Link href={href} className="block border border-line bg-white hover:border-navy">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="h-40 w-full object-cover" />
      ) : null}
      <div className="border-l-[3px] border-gold p-4">
        {meta ? <p className="font-mono text-[11px] text-gold-600">{meta}</p> : null}
        <h4 className="mt-1 font-display text-navy">{title}</h4>
        {body ? <p className="mt-2 text-sm text-muted">{body}</p> : null}
      </div>
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
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-9">
      {eyebrow ? <p className="font-mono text-[11px] uppercase tracking-wide text-gold-600">{eyebrow}</p> : null}
      <h2 className="mt-1 border-b border-navy pb-2 font-display text-navy">{title}</h2>
      <div className="mt-5">{children}</div>
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
