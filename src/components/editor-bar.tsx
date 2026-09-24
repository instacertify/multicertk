"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "./logo";

const tools = [
  { href: "/admin", label: "Home" },
  { href: "/admin/content", label: "Pages" },
  { href: "/admin/content/blogs", label: "Blogs" },
  { href: "/admin/content/images", label: "Images" },
  { href: "/admin/content/media", label: "Logos" },
  { href: "/admin/content/menu", label: "Menu" },
  { href: "/admin/content/seo", label: "SEO" },
  { href: "/admin/content/cookies", label: "Cookies" },
  { href: "/admin/translations", label: "Translations" },
];

export function EditorBar() {
  const pathname = usePathname() || "";
  if (!pathname.includes("/admin") || pathname.includes("/admin/login")) return null;

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/admin/login");
  }

  return (
    <div className="border-b border-navy bg-navy text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Logo variant="onDark" className="h-7 w-auto" />
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">Site editor</p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          {tools.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : item.href === "/admin/content"
                  ? pathname === "/admin/content" || pathname.startsWith("/admin/content/page/")
                  : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "font-semibold text-gold" : "text-white/80 hover:text-gold"}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={signOut}
            className="type-btn rounded-full border border-white/20 px-3 py-1 text-white hover:border-gold hover:text-gold"
          >
            Sign out
          </button>
        </nav>
      </div>
    </div>
  );
}
