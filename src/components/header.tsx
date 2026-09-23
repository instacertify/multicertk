"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { HeaderChrome, NavChild, NavItem } from "@/data/site-media";
import { LocaleSwitcher } from "./locale-switcher";
import { Logo } from "./logo";

const localeKeys: Record<string, "certification" | "testing" | "qcos" | "labs" | "resources"> = {
  certification: "certification",
  testing: "testing",
  qcos: "qcos",
  labs: "labs",
  resources: "resources",
};

function groupChildren(children: NavChild[]) {
  const groups: { name: string; items: NavChild[] }[] = [];
  const index = new Map<string, number>();
  for (const child of children) {
    const name = child.group || "";
    if (!index.has(name)) {
      index.set(name, groups.length);
      groups.push({ name, items: [] });
    }
    groups[index.get(name)!].items.push(child);
  }
  return groups;
}

function splitHref(href: string) {
  const [pathname, query] = href.split("?");
  if (!query) return href;
  return { pathname, query: Object.fromEntries(new URLSearchParams(query)) };
}

function NavIcon({ src, className }: { src?: string; className?: string }) {
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={className || "h-5 w-5 shrink-0 object-contain"} aria-hidden />
  );
}

function MenuLink({
  child,
  onClick,
  className,
}: {
  child: NavChild;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={splitHref(child.href)}
      onClick={onClick}
      className={className || "flex items-start gap-2 rounded-lg px-3 py-2 hover:bg-paper hover:text-gold-600"}
    >
      <NavIcon src={child.iconUrl} />
      <span className="leading-snug">{child.label}</span>
    </Link>
  );
}

export function Header({ menu, chrome }: { menu: NavItem[]; chrome?: HeaderChrome }) {
  const t = useTranslations("nav");
  const cta = useTranslations("cta");
  const [open, setOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  function labelFor(item: { id: string; label: string }) {
    const key = localeKeys[item.id];
    return key ? t(key) : item.label;
  }

  const openItem = menu.find((item) => item.id === openId);
  const openChildren = openItem?.children ?? [];
  const mega = openChildren.length > 8 || new Set(openChildren.map((child) => child.group).filter(Boolean)).size > 1;

  return (
    <header
      className="relative sticky top-0 z-40 border-b border-line/80 bg-white/95 backdrop-blur"
      onMouseLeave={() => setOpenId(null)}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5">
        <Logo className="h-8 w-auto sm:h-9" />
        <nav className="type-nav hidden items-center gap-1 text-navy lg:flex">
          {menu.map((item) => (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setOpenId(item.id)}
            >
              <Link
                href={item.href}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 hover:text-gold-600"
                aria-expanded={Boolean(item.children?.length && openId === item.id)}
                onFocus={() => setOpenId(item.id)}
              >
                <NavIcon src={item.iconUrl} />
                {labelFor(item)}
                {item.children?.length ? (
                  <span aria-hidden className="text-[10px]">
                    ▾
                  </span>
                ) : null}
              </Link>
              {item.children?.length && openId === item.id && !mega ? (
                <div
                  className="absolute start-0 top-full z-50 min-w-56 rounded-xl border border-line bg-white p-2 shadow-lg"
                  onMouseEnter={() => setOpenId(item.id)}
                  onMouseLeave={() => setOpenId(null)}
                >
                  {item.children.map((child) => (
                    <MenuLink key={child.id} child={child} />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/search" className="type-nav hidden items-center gap-1.5 text-navy hover:text-gold-600 sm:inline-flex">
            <NavIcon src={chrome?.searchIconUrl} />
            {t("search")}
          </Link>
          <LocaleSwitcher />
          <Link
            href="/contact"
            className="type-btn hidden items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 text-navy hover:bg-gold-600 md:inline-flex"
          >
            <NavIcon src={chrome?.quoteIconUrl} />
            {cta("quote")}
          </Link>
          <button
            type="button"
            className="type-btn inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
          >
            <NavIcon src={chrome?.menuIconUrl} />
            Menu
          </button>
        </div>
      </div>
      {openItem && mega ? (
        <div
          className="mega-menu absolute inset-x-0 top-full hidden border-t border-line bg-white shadow-lg lg:block"
          onMouseEnter={() => setOpenId(openItem.id)}
          onMouseLeave={() => setOpenId(null)}
        >
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-5 md:grid-cols-2 xl:grid-cols-4">
            {groupChildren(openChildren).map((group) => (
              <div key={group.name || "links"} className={group.items.length > 10 ? "md:col-span-2 xl:col-span-3" : ""}>
                {group.name ? (
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-600">{group.name}</p>
                ) : null}
                <div className={group.items.length > 10 ? "columns-2 gap-x-6 xl:columns-3" : "flex flex-col"}>
                  {group.items.map((child) => (
                    <MenuLink
                      key={child.id}
                      child={child}
                      className="mb-0.5 flex items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-paper hover:text-gold-600"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {open ? (
        <div className="border-t border-line bg-white px-4 py-3 lg:hidden">
          <div className="type-nav flex flex-col gap-3">
            {menu.map((item) => (
              <div key={item.id}>
                <Link href={item.href} className="inline-flex items-center gap-2 py-1 font-semibold" onClick={() => setOpen(false)}>
                  <NavIcon src={item.iconUrl} />
                  {labelFor(item)}
                </Link>
                {item.children?.length
                  ? groupChildren(item.children).map((group) => (
                      <div key={group.name || "links"} className="ms-3 mt-1 flex flex-col gap-1 text-muted">
                        {group.name ? (
                          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-600">{group.name}</p>
                        ) : null}
                        {group.items.map((child) => (
                          <MenuLink
                            key={child.id}
                            child={child}
                            onClick={() => setOpen(false)}
                            className="flex items-start gap-2 py-0.5"
                          />
                        ))}
                      </div>
                    ))
                  : null}
              </div>
            ))}
            <Link href="/search" className="inline-flex items-center gap-2" onClick={() => setOpen(false)}>
              <NavIcon src={chrome?.searchIconUrl} />
              {t("search")}
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2" onClick={() => setOpen(false)}>
              <NavIcon src={chrome?.quoteIconUrl} />
              {cta("quote")}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
