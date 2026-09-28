"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { CookieSettings } from "@/data/site-settings";

const storageKey = "certko-cookie-choice";

type StoredChoice = {
  analytics: boolean;
  marketing: boolean;
  version: string;
};

function readChoice(): StoredChoice | null {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    if (raw === "all") return { analytics: true, marketing: true, version: "" };
    if (raw === "essential") return { analytics: false, marketing: false, version: "" };
    const parsed = JSON.parse(raw) as StoredChoice;
    if (typeof parsed.analytics === "boolean") return parsed;
    return null;
  } catch {
    return null;
  }
}

function writeChoice(next: StoredChoice) {
  window.localStorage.setItem(storageKey, JSON.stringify(next));
}

export function CookieBanner({ settings }: { settings: CookieSettings }) {
  const pathname = usePathname() || "";
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = readChoice();
    if (stored && stored.version === settings.consentVersion) {
      setAnalytics(stored.analytics);
      setMarketing(stored.marketing);
      setOpen(false);
    } else {
      setOpen(true);
    }
    const onOpen = () => setOpen(true);
    window.addEventListener("certko-cookie-settings", onOpen);
    return () => window.removeEventListener("certko-cookie-settings", onOpen);
  }, [settings.consentVersion]);

  if (pathname.includes("/admin") || !settings.bannerEnabled) return null;
  if (!open) return null;

  function save(nextAnalytics: boolean, nextMarketing: boolean) {
    writeChoice({
      analytics: nextAnalytics && settings.analyticsEnabled,
      marketing: nextMarketing && settings.marketingEnabled,
      version: settings.consentVersion,
    });
    setOpen(false);
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-line bg-white px-4 py-3 text-navy shadow-[0_12px_40px_rgba(16,32,51,0.12)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <p className="max-w-3xl text-[12px] leading-snug text-muted">
          {settings.message}{" "}
          <Link href={settings.cookiesPath} className="text-navy underline hover:text-gold-600">
            Cookies
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" className="rounded-full border border-line px-3 py-1 text-[12px] text-navy" onClick={() => save(false, false)}>
            Essential
          </button>
          <button type="button" className="rounded-full bg-gold px-3 py-1 text-[12px] text-navy" onClick={() => save(true, true)}>
            Allow
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
      className="block w-full text-start hover:underline"
      onClick={() => window.dispatchEvent(new Event("certko-cookie-settings"))}
    >
      Cookie settings
    </button>
  );
}
