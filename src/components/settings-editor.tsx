"use client";

import { useState } from "react";
import type { CookieSettings, SeoSettings } from "@/data/site-settings";

export function SeoEditor({ seo }: { seo: SeoSettings }) {
  const [form, setForm] = useState(seo);
  const [status, setStatus] = useState("");

  async function save() {
    setStatus("Saving…");
    const response = await fetch("/api/site-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "seo", ...form }),
    });
    const json = (await response.json()) as { ok?: boolean };
    setStatus(json.ok ? "SEO settings saved. New titles and robots rules apply on the next page load." : "Could not save SEO.");
  }

  function field(key: keyof SeoSettings, label: string, type: "text" | "textarea" | "checkbox" = "text") {
    if (type === "checkbox") {
      return (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(form[key])}
            onChange={(event) => setForm({ ...form, [key]: event.target.checked })}
          />
          {label}
        </label>
      );
    }
    const value = String(form[key] ?? "");
    return (
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-wide text-muted">{label}</span>
        {type === "textarea" ? (
          <textarea value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })} rows={3} className="w-full rounded-xl border border-line px-3 py-2" />
        ) : (
          <input value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="w-full rounded-xl border border-line px-3 py-2" />
        )}
      </label>
    );
  }

  return (
    <div className="space-y-4">
      {field("defaultTitle", "Default title")}
      {field("titleTemplate", "Title template")}
      {field("defaultDescription", "Default description", "textarea")}
      {field("keywords", "Keywords")}
      {field("ogImage", "Share image path")}
      {field("googleSiteVerification", "Google site verification")}
      {field("bingSiteVerification", "Bing site verification")}
      {field("indexable", "Allow search engines to index the public site", "checkbox")}
      <button type="button" className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white" onClick={() => void save()}>
        Save SEO
      </button>
      {status ? <p className="text-sm text-muted">{status}</p> : null}
    </div>
  );
}

export function CookieEditor({ cookies }: { cookies: CookieSettings }) {
  const [form, setForm] = useState(cookies);
  const [status, setStatus] = useState("");

  async function save() {
    setStatus("Saving…");
    const response = await fetch("/api/site-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "cookies", ...form }),
    });
    const json = (await response.json()) as { ok?: boolean };
    setStatus(json.ok ? "Cookie and consent settings saved." : "Could not save cookies.");
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.bannerEnabled} onChange={(event) => setForm({ ...form, bannerEnabled: event.target.checked })} />
        Show the public cookie banner
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.analyticsEnabled} onChange={(event) => setForm({ ...form, analyticsEnabled: event.target.checked })} />
        Allow analytics cookies after consent
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.marketingEnabled} onChange={(event) => setForm({ ...form, marketingEnabled: event.target.checked })} />
        Allow marketing cookies after consent
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Banner message</span>
        <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} rows={4} className="w-full rounded-xl border border-line px-3 py-2" />
      </label>
      <button type="button" className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white" onClick={() => void save()}>
        Save cookie settings
      </button>
      {status ? <p className="text-sm text-muted">{status}</p> : null}
    </div>
  );
}
