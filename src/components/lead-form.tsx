"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

const interests = [
  ["bis", "BIS / ISI / CRS"],
  ["bee", "BEE star labelling"],
  ["testing", "Laboratory testing"],
  ["export", "CE / FCC / GMARK / SABER"],
  ["tender", "Government tender"],
  ["marketplace", "Marketplace listing"],
  ["msds", "MSDS / SDS"],
  ["other", "Other"],
] as const;

export function LeadForm({ sourcePath }: { sourcePath?: string }) {
  const t = useTranslations("lead");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus("idle");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setPending(false);
    setStatus(response.ok ? "ok" : "err");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl border border-line bg-white p-5 shadow-sm">
      <input type="hidden" name="sourcePath" value={sourcePath ?? ""} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium">
          {t("name")}
          <input required name="name" className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="text-sm font-medium">
          {t("email")}
          <input required type="email" name="email" className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="text-sm font-medium">
          {t("company")}
          <input name="company" className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="text-sm font-medium">
          {t("phone")}
          <input name="phone" className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
        </label>
      </div>
      <label className="text-sm font-medium">
        {t("interest")}
        <select name="interest" className="mt-1 w-full rounded-lg border border-line px-3 py-2" defaultValue="bis">
          {interests.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium">
        {t("message")}
        <textarea required name="message" rows={4} className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
      >
        {pending ? "…" : t("submit")}
      </button>
      {status === "ok" ? <p className="text-sm text-emerald-700">{t("success")}</p> : null}
      {status === "err" ? <p className="text-sm text-red-700">{t("error")}</p> : null}
    </form>
  );
}
