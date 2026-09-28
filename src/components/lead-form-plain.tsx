"use client";

import { useState } from "react";

export function LeadFormPlain({ sourcePath }: { sourcePath?: string }) {
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
    <form onSubmit={onSubmit} className="mt-8 grid gap-3 border border-line bg-white p-5 text-start">
      <input type="hidden" name="sourcePath" value={sourcePath ?? "/404"} />
      <p className="font-mono text-[11px] uppercase tracking-wide text-gold-600">Quote desk</p>
      <p className="font-display text-navy">Can’t find the right solution?</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Name
          <input required name="name" className="mt-1 w-full border border-line px-3 py-2" />
        </label>
        <label className="text-sm font-medium">
          Work email
          <input required type="email" name="email" className="mt-1 w-full border border-line px-3 py-2" />
        </label>
      </div>
      <input type="hidden" name="interest" value="other" />
      <label className="text-sm font-medium">
        Product, HSN or standard
        <textarea required name="message" rows={3} className="mt-1 w-full border border-line px-3 py-2" />
      </label>
      <button type="submit" disabled={pending} className="type-btn bg-navy px-5 py-2.5 text-white disabled:opacity-60">
        {pending ? "…" : "Request a quote"}
      </button>
      {status === "ok" ? <p className="text-sm text-emerald-700">Thanks — a Certko specialist will reply within 24 hours.</p> : null}
      {status === "err" ? <p className="text-sm text-red-700">Please check the form and try again.</p> : null}
    </form>
  );
}
