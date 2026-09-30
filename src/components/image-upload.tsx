"use client";

import { useState } from "react";

export function ImageUpload({
  label,
  value,
  folder,
  onChange,
  compact,
}: {
  label: string;
  value?: string;
  folder: "pages" | "blogs" | "logos" | "reviews" | "menu" | "library";
  onChange: (url: string) => void;
  compact?: boolean;
}) {
  const [status, setStatus] = useState("");

  async function onFile(file?: File) {
    if (!file) return;
    setStatus("Uploading…");
    const body = new FormData();
    body.set("file", file);
    body.set("folder", folder);
    const response = await fetch("/api/upload", { method: "POST", body });
    const json = (await response.json()) as { ok?: boolean; url?: string; error?: string };
    if (json.ok && json.url) {
      onChange(json.url);
      setStatus("Uploaded.");
    } else {
      setStatus(json.error || "Upload failed.");
    }
  }

  return (
    <div className="space-y-2">
      <span className="block text-xs uppercase tracking-wide text-muted">{label}</span>
      {value ? (
        <div className="overflow-hidden rounded-xl border border-line bg-paper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className={compact ? "h-10 w-10 object-contain" : "max-h-40 w-full object-contain"} />
        </div>
      ) : null}
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
        onChange={(event) => void onFile(event.target.files?.[0])}
        className="block w-full text-sm"
      />
      <input
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder="/uploads/… or paste a URL"
        className="w-full rounded-xl border border-line px-3 py-2"
      />
      {value ? (
        <button type="button" className="text-sm font-semibold text-red-700 underline" onClick={() => onChange("")}>
          Remove image
        </button>
      ) : null}
      {status ? <p className="caption text-muted">{status}</p> : null}
    </div>
  );
}
