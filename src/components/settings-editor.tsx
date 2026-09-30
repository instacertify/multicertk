"use client";

import { useState } from "react";
import type { CookieCategory, CookieRow, CookieSettings, SeoSettings } from "@/data/site-settings";

function newId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

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
    setStatus(json.ok ? "SEO settings saved. Titles, robots and share tags apply on the next page load." : "Could not save SEO.");
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
      {field("organizationName", "Organisation name (GDPR / DPDP controller)")}
      {field("ogImage", "Share image path")}
      {field("twitterHandle", "Twitter / X handle")}
      {field("googleSiteVerification", "Google site verification")}
      {field("bingSiteVerification", "Bing site verification")}
      {field("indexable", "Allow search engines to index the public site", "checkbox")}
      <p className="caption text-muted">
        /admin and /api stay out of robots.txt. Public pages use these defaults plus each page title from the content editor.
      </p>
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
      body: JSON.stringify({
        kind: "cookies",
        ...form,
        rows: form.rows.filter((row) => row.name && row.purpose),
      }),
    });
    const json = (await response.json()) as { ok?: boolean; error?: string };
    setStatus(json.ok ? "Cookie and consent settings saved. A new consent version re-asks visitors." : json.error || "Could not save cookies.");
  }

  function patchRow(index: number, row: CookieRow) {
    const rows = [...form.rows];
    rows[index] = row;
    setForm({ ...form, rows });
  }

  return (
    <div className="space-y-5">
      <fieldset className="rounded-2xl border border-line p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-gold-600">Banner</legend>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.bannerEnabled} onChange={(event) => setForm({ ...form, bannerEnabled: event.target.checked })} />
          Show the public cookie banner (EU ePrivacy / GDPR / DPDP)
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.analyticsEnabled} onChange={(event) => setForm({ ...form, analyticsEnabled: event.target.checked })} />
          Offer analytics cookies (load only after consent)
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.marketingEnabled} onChange={(event) => setForm({ ...form, marketingEnabled: event.target.checked })} />
          Offer marketing cookies (load only after consent)
        </label>
        <label className="mt-3 block text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Banner message</span>
          <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} rows={4} className="w-full rounded-xl border border-line px-3 py-2" />
        </label>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Consent version</span>
            <input value={form.consentVersion} onChange={(event) => setForm({ ...form, consentVersion: event.target.value })} className="w-full rounded-xl border border-line px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Last reviewed</span>
            <input value={form.lastReviewed} onChange={(event) => setForm({ ...form, lastReviewed: event.target.value })} placeholder="YYYY-MM-DD" className="w-full rounded-xl border border-line px-3 py-2" />
          </label>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-line p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-gold-600">Legal pages</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {(
            [
              ["privacyPath", "Privacy"],
              ["cookiesPath", "Cookies"],
              ["gdprPath", "GDPR & DPDP"],
              ["termsPath", "Terms"],
              ["dataRequestPath", "Data request"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-sm">
              <span className="mb-1 block text-xs uppercase tracking-wide text-muted">{label}</span>
              <input value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="w-full rounded-xl border border-line px-3 py-2" />
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-line p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-gold-600">Controller (DPDP fiduciary / GDPR)</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Organisation</span>
            <input value={form.controllerName} onChange={(event) => setForm({ ...form, controllerName: event.target.value })} className="w-full rounded-xl border border-line px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Privacy email</span>
            <input value={form.controllerEmail} onChange={(event) => setForm({ ...form, controllerEmail: event.target.value })} className="w-full rounded-xl border border-line px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Grievance officer</span>
            <input value={form.grievanceOfficer} onChange={(event) => setForm({ ...form, grievanceOfficer: event.target.value })} className="w-full rounded-xl border border-line px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-muted">DPO / privacy email</span>
            <input value={form.dpoEmail} onChange={(event) => setForm({ ...form, dpoEmail: event.target.value })} className="w-full rounded-xl border border-line px-3 py-2" />
          </label>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-line p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-gold-600">Optional tags (after consent)</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-muted">GA4 measurement ID (G-…)</span>
            <input value={form.analyticsId} onChange={(event) => setForm({ ...form, analyticsId: event.target.value })} className="w-full rounded-xl border border-line px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Meta pixel ID (digits only)</span>
            <input value={form.marketingId} onChange={(event) => setForm({ ...form, marketingId: event.target.value })} className="w-full rounded-xl border border-line px-3 py-2" />
          </label>
        </div>
        <p className="mt-2 caption text-muted">Tags stay off until the visitor allows that category. Leave blank to keep measurement off.</p>
      </fieldset>

      <fieldset className="rounded-2xl border border-line p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-gold-600">Cookie inventory</legend>
        <div className="mt-2 space-y-3">
          {form.rows.map((row, index) => (
            <div key={row.id} className="grid gap-2 rounded-xl border border-line/80 p-3 sm:grid-cols-2">
              <input value={row.name} onChange={(event) => patchRow(index, { ...row, name: event.target.value })} placeholder="Name" className="rounded-xl border border-line px-3 py-2" />
              <select
                value={row.category}
                onChange={(event) => patchRow(index, { ...row, category: event.target.value as CookieCategory })}
                className="rounded-xl border border-line px-3 py-2"
              >
                <option value="necessary">Necessary</option>
                <option value="analytics">Analytics</option>
                <option value="marketing">Marketing</option>
              </select>
              <input value={row.duration} onChange={(event) => patchRow(index, { ...row, duration: event.target.value })} placeholder="Duration" className="rounded-xl border border-line px-3 py-2" />
              <input value={row.purpose} onChange={(event) => patchRow(index, { ...row, purpose: event.target.value })} placeholder="Purpose" className="rounded-xl border border-line px-3 py-2 sm:col-span-2" />
              <button type="button" className="text-start text-sm font-semibold text-red-700 underline" onClick={() => setForm({ ...form, rows: form.rows.filter((_, i) => i !== index) })}>
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-3 text-sm font-semibold text-navy underline"
          onClick={() =>
            setForm({
              ...form,
              rows: [...form.rows, { id: newId("cookie"), name: "", purpose: "", duration: "Session", category: "necessary" }],
            })
          }
        >
          Add cookie
        </button>
      </fieldset>

      <button type="button" className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white" onClick={() => void save()}>
        Save cookie settings
      </button>
      {status ? <p className="text-sm text-muted">{status}</p> : null}
    </div>
  );
}
