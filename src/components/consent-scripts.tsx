"use client";

import { useEffect } from "react";
import type { CookieSettings } from "@/data/site-settings";

const storageKey = "certko-cookie-choice";

function readChoice() {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    if (raw === "all") return { analytics: true, marketing: true, version: "" };
    if (raw === "essential") return { analytics: false, marketing: false, version: "" };
    const parsed = JSON.parse(raw) as { analytics?: boolean; marketing?: boolean; version?: string };
    return {
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      version: parsed.version || "",
    };
  } catch {
    return null;
  }
}

function loadScript(src: string, id: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

export function ConsentScripts({ settings }: { settings: CookieSettings }) {
  useEffect(() => {
    const choice = readChoice();
    if (!choice || choice.version !== settings.consentVersion) return;

    if (settings.analyticsEnabled && choice.analytics && /^G-[A-Z0-9]+$/.test(settings.analyticsId)) {
      loadScript(`https://www.googletagmanager.com/gtag/js?id=${settings.analyticsId}`, "certko-ga");
      const w = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
      w.dataLayer = w.dataLayer || [];
      w.gtag = (...args: unknown[]) => {
        w.dataLayer?.push(args);
      };
      w.gtag("js", new Date());
      w.gtag("config", settings.analyticsId, { anonymize_ip: true });
    }

    if (settings.marketingEnabled && choice.marketing && /^[0-9]{10,20}$/.test(settings.marketingId)) {
      loadScript(`https://connect.facebook.net/en_US/fbevents.js`, "certko-meta");
      const w = window as Window & { fbq?: (...args: unknown[]) => void };
      if (typeof w.fbq === "function") w.fbq("init", settings.marketingId);
    }
  }, [settings]);

  return null;
}
