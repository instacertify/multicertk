"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { Logo } from "./logo";

const links = [
  { href: "/products", key: "products" },
  { href: "/certifications", key: "certifications" },
  { href: "/testing", key: "testing" },
  { href: "/labs", key: "labs" },
  { href: "/qco", key: "qco" },
  { href: "/guide", key: "guide" },
  { href: "/blog", key: "blog" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const cta = useTranslations("cta");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Logo className="h-9 w-auto sm:h-10" />
        <nav className="type-nav hidden items-center gap-5 text-navy lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-gold-600">
              {t(link.key)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/search" className="type-nav hidden text-navy hover:text-gold-600 sm:inline">
            {t("search")}
          </Link>
          <LocaleSwitcher />
          <Link
            href="/contact"
            className="type-btn hidden rounded-full bg-gold px-4 py-2 text-navy hover:bg-gold-600 md:inline"
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
          <div className="type-nav flex flex-col gap-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {t(link.key)}
              </Link>
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
