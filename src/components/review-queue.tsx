"use client";

import { useEffect, useState } from "react";

interface Seed {
  entityType: "product" | "scheme" | "ui";
  entityId: string;
  field: string;
  sourceText: string;
}

interface RecordRow {
  id: string;
  entityType: string;
  entityId: string;
  field: string;
  locale: string;
  sourceText: string;
  aiText: string;
  reviewedText: string;
  status: string;
  reviewer: string;
}

export function ReviewQueue({ seeds }: { seeds: Seed[] }) {
  const [rows, setRows] = useState<RecordRow[]>([]);
  const [locale, setLocale] = useState<"hi" | "ar">("hi");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const response = await fetch("/api/translations");
    const json = await response.json();
    setRows(json.rows ?? []);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function generate(seed: Seed) {
    setBusy(true);
    await fetch("/api/translations/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...seed, locale }),
    });
    await refresh();
    setBusy(false);
  }

  async function review(id: string, status: "approved" | "rejected" | "in_review", reviewedText?: string) {
    await fetch("/api/translations/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, reviewedText, reviewer: "editor" }),
    });
    await refresh();
  }

  return (
    <div className="mt-8 space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-semibold">
          Target locale{" "}
          <select
            value={locale}
            onChange={(event) => setLocale(event.target.value as "hi" | "ar")}
            className="ml-2 rounded-lg border border-line px-2 py-1"
          >
            <option value="hi">Hindi</option>
            <option value="ar">Arabic</option>
          </select>
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {seeds.map((seed) => (
          <button
            key={`${seed.entityType}:${seed.entityId}:${seed.field}`}
            disabled={busy}
            onClick={() => generate(seed)}
            className="rounded-2xl border border-line bg-paper p-4 text-left text-sm hover:border-gold"
          >
            <p className="text-xs uppercase text-muted">
              {seed.entityType} · {seed.field}
            </p>
            <p className="mt-1 font-semibold text-navy">{seed.entityId}</p>
            <p className="mt-2 line-clamp-3 text-muted">{seed.sourceText}</p>
            <p className="mt-3 text-xs font-semibold text-gold-600">Generate AI draft →</p>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {rows.length === 0 ? <p className="text-sm text-muted">No drafts yet. Generate one above.</p> : null}
        {rows.map((row) => (
          <article key={row.id} className="rounded-2xl border border-line p-5">
            <p className="text-xs uppercase text-muted">
              {row.locale} · {row.status} · {row.entityType}/{row.entityId}
            </p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold uppercase text-muted">Source</h3>
                <p className="mt-1 text-sm leading-6">{row.sourceText}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase text-muted">AI draft</h3>
                <p className="mt-1 text-sm leading-6">{row.aiText}</p>
              </div>
            </div>
            <label className="mt-3 block text-sm font-medium">
              Reviewer edit
              <textarea
                defaultValue={row.reviewedText || row.aiText}
                className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm"
                rows={3}
                id={`edit-${row.id}`}
              />
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className="rounded-full bg-navy px-4 py-1.5 text-xs font-semibold text-white"
                onClick={() => {
                  const value = (document.getElementById(`edit-${row.id}`) as HTMLTextAreaElement | null)?.value;
                  void review(row.id, "approved", value);
                }}
              >
                Approve
              </button>
              <button
                className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold"
                onClick={() => review(row.id, "rejected")}
              >
                Reject
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
