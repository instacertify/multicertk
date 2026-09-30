"use client";

import { useState } from "react";

export function DeleteContentButton({
  kind,
  slug,
  locale,
  label,
}: {
  kind: "page" | "article";
  slug: string;
  locale: string;
  label: string;
}) {
  const [status, setStatus] = useState("");

  async function onClick() {
    if (!window.confirm(`Remove ${label}? This only deletes the editor copy you added.`)) return;
    setStatus("Removing…");
    const response = await fetch("/api/cms", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, slug, locale }),
    });
    const json = (await response.json()) as { ok?: boolean; error?: string };
    if (json.ok) {
      window.location.assign(kind === "page" ? "/admin/content" : "/admin/content/blogs");
      return;
    }
    setStatus(json.error || "Could not remove.");
  }

  return (
    <div>
      <button type="button" className="text-sm font-semibold text-red-700 underline" onClick={() => void onClick()}>
        Remove {kind === "page" ? "page" : "blog"}
      </button>
      {status ? <p className="mt-1 text-sm text-muted">{status}</p> : null}
    </div>
  );
}
