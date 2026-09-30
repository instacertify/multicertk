"use client";

import { useEffect, useState } from "react";
import { ImageUpload } from "./image-upload";

type UploadItem = { url: string; folder: string; name: string };

export function ImageLibrary() {
  const [images, setImages] = useState<UploadItem[]>([]);
  const [latest, setLatest] = useState("");
  const [status, setStatus] = useState("");

  async function refresh() {
    const response = await fetch("/api/upload");
    const json = (await response.json()) as { images?: UploadItem[] };
    setImages(json.images ?? []);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setStatus(`Copied ${url}`);
    } catch {
      setStatus(url);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line bg-white p-5">
        <p className="caption font-semibold uppercase tracking-wide text-gold-600">Upload an image</p>
        <p className="mt-2 text-sm text-muted">Store images here, then paste the URL into any page or blog field.</p>
        <div className="mt-4">
          <ImageUpload
            label="New image"
            folder="library"
            value={latest}
            onChange={(url) => {
              setLatest(url);
              void refresh();
            }}
          />
        </div>
        {latest ? (
          <p className="mt-3 text-sm">
            Latest URL: <code className="rounded bg-paper px-1">{latest}</code>
          </p>
        ) : null}
      </div>
      <div>
        <p className="caption font-semibold uppercase tracking-wide text-gold-600">Image library</p>
        {images.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No uploads yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <figure key={image.url} className="rounded-2xl border border-line bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt="" className="h-32 w-full object-contain" />
                <figcaption className="mt-2 truncate text-xs text-muted">{image.folder}/{image.name}</figcaption>
                <button type="button" className="mt-2 text-sm font-semibold text-navy underline" onClick={() => void copy(image.url)}>
                  Copy URL
                </button>
              </figure>
            ))}
          </div>
        )}
        {status ? <p className="mt-3 text-sm text-muted">{status}</p> : null}
      </div>
    </div>
  );
}
