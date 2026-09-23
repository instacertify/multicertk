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
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 p-4 shadow-[0_-8px_30px_rgba(6,20,40,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">Cookies</p>
          <p className="mt-1 text-ink">{settings.message}</p>
          {(settings.analyticsEnabled || settings.marketingEnabled) && (
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              {settings.analyticsEnabled ? (
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} />
                  Analytics
                </label>
              ) : null}
              {settings.marketingEnabled ? (
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} />
                  Marketing
                </label>
              ) : null}
            </div>
          )}
          <p className="mt-2 caption text-muted">
            <Link href={settings.cookiesPath} className="underline">
              Cookies
            </Link>
            {" · "}
            <Link href={settings.privacyPath} className="underline">
              Privacy
            </Link>
            {" · "}
            <Link href={settings.gdprPath} className="underline">
              GDPR & DPDP
            </Link>
            {" · "}
            <Link href={settings.termsPath} className="underline">
              Terms
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border border-line px-4 py-2" onClick={() => save(false, false)}>
            Essential only
          </button>
          {settings.analyticsEnabled || settings.marketingEnabled ? (
            <button type="button" className="rounded-full border border-navy px-4 py-2" onClick={() => save(analytics, marketing)}>
              Allow selected
            </button>
          ) : null}
          <button
            type="button"
            className="rounded-full bg-navy px-4 py-2 text-white"
            onClick={() => save(true, true)}
          >
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
      className="block w-full text-start hover:underline"
      onClick={() => window.dispatchEvent(new Event("certko-cookie-settings"))}
    >
      Cookie settings
    </button>
  );
}
