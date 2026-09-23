"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import type { CookieSettings } from "@/data/site-settings";

const storageKey = "certko-cookie-choice";

export function CookieBanner({ settings }: { settings: CookieSettings }) {
  const pathname = usePathname() || "";
  const [choice, setChoice] = useState<"unknown" | "essential" | "all">("unknown");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "essential" || stored === "all") setChoice(stored);
    else setOpen(true);
    const onOpen = () => setOpen(true);
    window.addEventListener("certko-cookie-settings", onOpen);
    return () => window.removeEventListener("certko-cookie-settings", onOpen);
  }, []);

  if (pathname.includes("/admin") || !settings.bannerEnabled) return null;
  if (!open && choice !== "unknown") return null;

  function save(next: "essential" | "all") {
    window.localStorage.setItem(storageKey, next);
    setChoice(next);
    setOpen(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 p-4 shadow-[0_-8px_30px_rgba(6,20,40,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">Cookies</p>
          <p className="mt-1 text-ink">{settings.message}</p>
          <p className="mt-2 caption text-muted">
            <Link href={settings.cookiesPath} className="underline">
              Cookie policy
            </Link>
            {" · "}
            <Link href={settings.privacyPath} className="underline">
              Privacy
            </Link>
            {" · "}
            <Link href={settings.gdprPath} className="underline">
              GDPR & DPDP
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border border-line px-4 py-2" onClick={() => save("essential")}>
            Essential only
          </button>
          <button type="button" className="rounded-full bg-navy px-4 py-2 text-white" onClick={() => save("all")}>
            Allow all
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="text-start hover:underline"
      onClick={() => window.dispatchEvent(new Event("certko-cookie-settings"))}
    >
      Cookie settings
    </button>
  );
}
