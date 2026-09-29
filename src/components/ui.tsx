import { Link } from "@/i18n/navigation";
import { defaultHighlightIcon } from "@/lib/highlight-icons";

export function HighlightIcon({ src, size = "md" }: { src?: string; size?: "sm" | "md" }) {
  return (
    <span className={`highlight-icon${size === "sm" ? " highlight-icon-sm" : ""}`} aria-hidden="true">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" />
      ) : null}
    </span>
  );
}

export function HighlightTitle({
  as: Tag = "h2",
  iconUrl,
  children,
  className = "",
}: {
  as?: "h2" | "h3" | "p";
  iconUrl?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tag className={`highlight-title font-display text-navy ${className}`.trim()}>
      <HighlightIcon src={iconUrl} />
      <span>{children}</span>
    </Tag>
  );
}

export function Badge({
  children,
  tone = "navy",
}: {
  children: React.ReactNode;
  tone?: "navy" | "gold" | "mist" | "alert";
}) {
  const tones = {
    navy: "border border-gold bg-gold/15 text-navy",
    gold: "bg-gold text-navy",
    mist: "border border-gold/50 bg-gold/10 text-navy",
    alert: "bg-amber-100 text-amber-950",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>
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
  iconUrl,
  iconKey,
}: {
  href: string;
  title: string;
  meta?: string;
  body?: string;
  image?: string;
  iconUrl?: string;
  iconKey?: string;
}) {
  const icon = iconUrl || defaultHighlightIcon(iconKey || "card");
  return (
    <Link href={href} className="soft-card block hover:border-gold-600">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="h-40 w-full object-cover" />
      ) : null}
      <div className="border-l-[3px] border-gold p-4">
        <div className="flex items-start gap-3">
          <HighlightIcon src={icon} />
          <div className="min-w-0">
            {meta ? <p className="font-mono text-[11px] text-gold-600">{meta}</p> : null}
            <h4 className="mt-1 font-display text-navy">{title}</h4>
            {body ? <p className="mt-2 text-sm text-muted">{body}</p> : null}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function Section({
  title,
  children,
  eyebrow,
  className = "",
  iconUrl,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
  iconUrl?: string;
}) {
  return (
    <section className={`mx-auto max-w-7xl px-4 py-10 md:py-14 ${className}`}>
      {eyebrow ? <p className="font-mono text-[11px] uppercase tracking-wide text-gold-600">{eyebrow}</p> : null}
      <HighlightTitle iconUrl={iconUrl} className="mt-1 border-b border-gold pb-2">
        {title}
      </HighlightTitle>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function StatusBadge({ status }: { status: "mandatory" | "upcoming" | "voluntary" }) {
  const map = {
    mandatory: { tone: "gold" as const, label: "Mandatory" },
    upcoming: { tone: "alert" as const, label: "Upcoming QCO" },
    voluntary: { tone: "mist" as const, label: "Voluntary" },
  };
  return <Badge tone={map[status].tone}>{map[status].label}</Badge>;
}

export function RecordTable({ children }: { children: React.ReactNode }) {
  return <div className="soft-card overflow-x-auto">{children}</div>;
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
            <Link href={item.href} className="hover:text-gold-600">
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
