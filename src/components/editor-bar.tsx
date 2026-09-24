"use client";

import { usePathname } from "@/i18n/navigation";

export function EditorBar() {
  const pathname = usePathname() || "";
  if (!pathname.includes("/admin") || pathname.includes("/admin/login")) return null;

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/admin/login");
  }

  return (
    <div className="border-b border-navy bg-navy text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold">Site editor</p>
        <button
          type="button"
          onClick={signOut}
          className="type-btn rounded-full border border-white/20 px-3 py-1 text-white hover:border-gold hover:text-gold"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
