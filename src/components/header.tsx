"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { NavItem } from "@/data/site-media";
import { LocaleSwitcher } from "./locale-switcher";
import { Logo } from "./logo";

const localeKeys: Record<string, "certification" | "testing" | "qcos" | "labs" | "resources"> = {
  certification: "certification",
  testing: "testing",
  qcos: "qcos",
  labs: "labs",
  resources: "resources",
};

export function Header({ menu }: { menu: NavItem[] }) {
  const t = useTranslations("nav");
  const cta = useTranslations("cta");
  const [open, setOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  function labelFor(item: { id: string; label: string }) {
    const key = localeKeys[item.id];
    return key ? t(key) : item.label;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5">
        <Logo className="h-8 w-auto sm:h-9" />
        <nav className="type-nav hidden items-center gap-1 text-navy lg:flex">
          {menu.map((item) => (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setOpenId(item.id)}
              onMouseLeave={() => setOpenId((current) => (current === item.id ? null : current))}
            >
              <Link
                href={item.href}
                className="inline-flex items-center gap-1 rounded-md px-3 py-2 hover:text-gold-600"
                aria-expanded={Boolean(item.children?.length && openId === item.id)}
              >
                {labelFor(item)}
                {item.children?.length ? <span aria-hidden className="text-[10px]">▾</span> : null}
              </Link>
              {item.children?.length && openId === item.id ? (
                <div className="absolute start-0 top-full z-50 min-w-56 rounded-xl border border-line bg-white p-2 shadow-lg">
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      href={child.href}
                      className="block rounded-lg px-3 py-2 hover:bg-paper hover:text-gold-600"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/search" className="type-nav hidden text-navy hover:text-gold-600 sm:inline">
            {t("search")}
          </Link>
          <LocaleSwitcher />
          <Link
            href="/contact"
            className="type-btn hidden rounded-full bg-gold px-3.5 py-1.5 text-navy hover:bg-gold-600 md:inline"
          >
            {cta("quote")}
          </Link>
          <button
            type="button"
            className="type-btn rounded-md border border-line px-3 py-1.5 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
          >
            Menu
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-line bg-white px-4 py-3 lg:hidden">
          <div className="type-nav flex flex-col gap-2">
            {menu.map((item) => (
              <div key={item.id}>
                <Link href={item.href} className="block py-1 font-semibold" onClick={() => setOpen(false)}>
                  {labelFor(item)}
                </Link>
                {item.children?.length ? (
                  <div className="ms-3 mt-1 flex flex-col gap-1 text-muted">
                    {item.children.map((child) => (
                      <Link key={child.id} href={child.href} onClick={() => setOpen(false)}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <Link href="/search" onClick={() => setOpen(false)}>
              {t("search")}
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)}>
              {cta("quote")}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
