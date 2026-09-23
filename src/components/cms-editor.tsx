"use client";

import { useState } from "react";
import { articleBlocks, type ArticleBlock, type CmsArticle, type CmsPage } from "@/data/cms-seed";
import { ImageUpload } from "./image-upload";

function joinBody(value: string[]) {
  return value.join("\n\n");
}

function splitBody(value: string) {
  return value
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function newId() {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function rowsToText(rows: string[][]) {
  return rows.map((row) => row.join(" | ")).join("\n");
}

function textToRows(value: string) {
  return value
    .split("\n")
    .map((line) => line.split("|").map((cell) => cell.trim()))
    .filter((row) => row.some(Boolean));
}

export function PageEditor({ page, locale }: { page: CmsPage; locale: string }) {
  const [title, setTitle] = useState(page.title);
  const [intro, setIntro] = useState(page.intro);
  const [heroImageUrl, setHeroImageUrl] = useState(page.heroImageUrl || "");
  const [heroImageAlt, setHeroImageAlt] = useState(page.heroImageAlt || "");
  const [galleryUrls, setGalleryUrls] = useState<string[]>(page.galleryUrls ?? []);
  const [sections, setSections] = useState(page.sections);
  const [status, setStatus] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("Saving…");
    const response = await fetch("/api/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "page",
        slug: page.slug,
        locale,
        title,
        intro,
        heroImageUrl,
        heroImageAlt,
        galleryUrls: galleryUrls.filter(Boolean),
        sections,
      }),
    });
    const json = (await response.json()) as { ok?: boolean; directus?: { ok?: boolean; reason?: string } };
    setStatus(
      json.ok
        ? json.directus?.ok
          ? "Saved to the site and Directus."
          : "Saved on the site. Directus is optional — start it to sync."
        : "Could not save.",
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Page title / H1</span>
        <input value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-xl border border-line px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Intro</span>
        <textarea value={intro} onChange={(event) => setIntro(event.target.value)} rows={4} className="w-full rounded-xl border border-line px-3 py-2" />
      </label>
      <ImageUpload label="Page image" folder="pages" value={heroImageUrl} onChange={setHeroImageUrl} />
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Page image alt text</span>
        <input value={heroImageAlt} onChange={(event) => setHeroImageAlt(event.target.value)} className="w-full rounded-xl border border-line px-3 py-2" />
      </label>
      <div className="space-y-3 rounded-2xl border border-line p-4">
        <p className="caption font-semibold uppercase tracking-wide text-gold-600">More page images</p>
        {galleryUrls.map((url, index) => (
          <div key={`${url}-${index}`}>
            <ImageUpload
              label={`Extra image ${index + 1}`}
              folder="pages"
              value={url}
              onChange={(next) => {
                const copy = [...galleryUrls];
                copy[index] = next;
                setGalleryUrls(copy);
              }}
            />
            <button type="button" className="mt-2 text-sm font-semibold text-red-700 underline" onClick={() => setGalleryUrls(galleryUrls.filter((_, i) => i !== index))}>
              Remove image
            </button>
          </div>
        ))}
        <button type="button" className="rounded-xl border border-line px-3 py-2 text-sm font-semibold" onClick={() => setGalleryUrls([...galleryUrls, ""])}>
          Add another image
        </button>
      </div>
      {sections.map((section, index) => (
        <fieldset key={section.key} className="rounded-2xl border border-line p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-gold-600">Section {index + 1}</legend>
          <label className="mt-2 block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Heading</span>
            <input
              value={section.heading}
              onChange={(event) => {
                const next = [...sections];
                next[index] = { ...section, heading: event.target.value };
                setSections(next);
              }}
              className="w-full rounded-xl border border-line px-3 py-2"
            />
          </label>
          <label className="mt-3 block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Every word of this article (blank line = new paragraph)</span>
            <textarea
              value={joinBody(section.body)}
              onChange={(event) => {
                const next = [...sections];
                next[index] = { ...section, body: splitBody(event.target.value) };
                setSections(next);
              }}
              rows={6}
              className="w-full rounded-xl border border-line px-3 py-2"
            />
          </label>
          <div className="mt-3">
            <ImageUpload
              label="Section image"
              folder="pages"
              value={section.imageUrl}
              onChange={(url) => {
                const next = [...sections];
                next[index] = { ...section, imageUrl: url };
                setSections(next);
              }}
            />
          </div>
          <button
            type="button"
            className="mt-3 text-sm font-semibold text-red-700 underline"
            onClick={() => setSections(sections.filter((_, itemIndex) => itemIndex !== index))}
          >
            Remove this heading & article
          </button>
        </fieldset>
      ))}
      <button
        type="button"
        className="rounded-xl border border-line px-4 py-2 text-sm font-semibold text-navy"
        onClick={() =>
          setSections([
            ...sections,
            { key: `section-${Date.now()}`, heading: "New heading", body: ["Write every word of this article here."] },
          ])
        }
      >
        Add another heading & article
      </button>
      <button type="submit" className="ml-3 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white">
        Save every heading & word
      </button>
      {status ? <p className="text-sm text-muted">{status}</p> : null}
    </form>
  );
}

export function NewArticleForm({ locale }: { locale: string }) {
  const [title, setTitle] = useState("");
  const [heading, setHeading] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [status, setStatus] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("Saving…");
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);
    const response = await fetch("/api/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "article",
        slug: slug || `article-${Date.now()}`,
        locale,
        title,
        heading: heading || title,
        excerpt,
        heroImageUrl,
        body: splitBody(body || title),
        blocks: splitBody(body || title).map((text) => ({ id: newId(), type: "paragraph", text })),
        date: new Date().toISOString().slice(0, 10),
        tags: [],
      }),
    });
    const json = (await response.json()) as { ok?: boolean };
    setStatus(json.ok ? "Article published. Open it from the list below after refresh." : "Could not save.");
    if (json.ok) {
      setTitle("");
      setHeading("");
      setExcerpt("");
      setBody("");
      setHeroImageUrl("");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-line p-5">
      <p className="caption font-semibold uppercase tracking-wide text-gold-600">Write a new article</p>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Title</span>
        <input required value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-xl border border-line px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Heading</span>
        <input value={heading} onChange={(event) => setHeading(event.target.value)} className="w-full rounded-xl border border-line px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Every word of the article</span>
        <textarea required value={body} onChange={(event) => setBody(event.target.value)} rows={8} className="w-full rounded-xl border border-line px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Excerpt</span>
        <textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} rows={2} className="w-full rounded-xl border border-line px-3 py-2" />
      </label>
      <ImageUpload label="Article image" folder="blogs" value={heroImageUrl} onChange={setHeroImageUrl} />
      <p className="caption text-muted">After publish, open the article to add tables, bars, spacers and more images.</p>
      <button type="submit" className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white">
        Publish article
      </button>
      {status ? <p className="text-sm text-muted">{status}</p> : null}
    </form>
  );
}

function BlockEditor({
  block,
  onChange,
  onRemove,
}: {
  block: ArticleBlock;
  onChange: (next: ArticleBlock) => void;
  onRemove: () => void;
}) {
  return (
    <fieldset className="rounded-2xl border border-line p-4">
      <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-gold-600">{block.type}</legend>
      {block.type === "paragraph" ? (
        <textarea
          value={block.text}
          onChange={(event) => onChange({ ...block, text: event.target.value })}
          rows={5}
          className="mt-2 w-full rounded-xl border border-line px-3 py-2"
        />
      ) : null}
      {block.type === "image" ? (
        <div className="mt-2 space-y-3">
          <ImageUpload label="Blog image" folder="blogs" value={block.url} onChange={(url) => onChange({ ...block, url })} />
          <input
            value={block.caption || ""}
            onChange={(event) => onChange({ ...block, caption: event.target.value })}
            placeholder="Caption"
            className="w-full rounded-xl border border-line px-3 py-2"
          />
        </div>
      ) : null}
      {block.type === "table" ? (
        <div className="mt-2 space-y-3">
          <p className="caption text-muted">One row per line. Separate cells with |</p>
          <textarea
            value={rowsToText(block.rows)}
            onChange={(event) => onChange({ ...block, rows: textToRows(event.target.value) })}
            rows={6}
            className="w-full rounded-xl border border-line px-3 py-2 font-mono"
          />
          <input
            value={block.caption || ""}
            onChange={(event) => onChange({ ...block, caption: event.target.value })}
            placeholder="Table caption"
            className="w-full rounded-xl border border-line px-3 py-2"
          />
        </div>
      ) : null}
      {block.type === "bar" ? (
        <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_120px]">
          <input
            value={block.label}
            onChange={(event) => onChange({ ...block, label: event.target.value })}
            placeholder="Bar label"
            className="rounded-xl border border-line px-3 py-2"
          />
          <input
            type="number"
            min={0}
            max={100}
            value={block.value}
            onChange={(event) => onChange({ ...block, value: Number(event.target.value) })}
            className="rounded-xl border border-line px-3 py-2"
          />
        </div>
      ) : null}
      {block.type === "spacer" ? (
        <select
          value={block.size}
          onChange={(event) => onChange({ ...block, size: event.target.value as "sm" | "md" | "lg" })}
          className="mt-2 rounded-xl border border-line px-3 py-2"
        >
          <option value="sm">Small spacer</option>
          <option value="md">Medium spacer</option>
          <option value="lg">Large spacer</option>
        </select>
      ) : null}
      <button type="button" className="mt-3 text-sm font-semibold text-red-700 underline" onClick={onRemove}>
        Remove block
      </button>
    </fieldset>
  );
}

export function ArticleEditor({ article, locale }: { article: CmsArticle; locale: string }) {
  const [title, setTitle] = useState(article.title);
  const [heading, setHeading] = useState(article.heading);
  const [excerpt, setExcerpt] = useState(article.excerpt);
  const [heroImageUrl, setHeroImageUrl] = useState(article.heroImageUrl || "");
  const [blocks, setBlocks] = useState<ArticleBlock[]>(articleBlocks(article));
  const [status, setStatus] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("Saving…");
    const response = await fetch("/api/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "article",
        slug: article.slug,
        locale,
        title,
        heading,
        excerpt,
        heroImageUrl,
        body: blocks.flatMap((block) => (block.type === "paragraph" && block.text.trim() ? [block.text] : [])),
        blocks: blocks.filter((block) => block.type !== "image" || block.url),
        date: article.date,
        tags: article.tags,
      }),
    });
    const json = (await response.json()) as { ok?: boolean; directus?: { ok?: boolean } };
    setStatus(json.ok ? (json.directus?.ok ? "Saved to the site and Directus." : "Saved on the site. Directus is optional — start it to sync.") : "Could not save.");
  }

  function addBlock(block: ArticleBlock) {
    setBlocks([...blocks, block]);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Title</span>
        <input value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-xl border border-line px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Section heading</span>
        <input value={heading} onChange={(event) => setHeading(event.target.value)} className="w-full rounded-xl border border-line px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Excerpt</span>
        <textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} rows={3} className="w-full rounded-xl border border-line px-3 py-2" />
      </label>
      <ImageUpload label="Article hero image" folder="blogs" value={heroImageUrl} onChange={setHeroImageUrl} />
      <div className="space-y-4">
        <p className="caption font-semibold uppercase tracking-wide text-gold-600">Article blocks — copy, images, tables, bars, spacers</p>
        {blocks.map((block, index) => (
          <BlockEditor
            key={block.id}
            block={block}
            onChange={(next) => {
              const copy = [...blocks];
              copy[index] = next;
              setBlocks(copy);
            }}
            onRemove={() => setBlocks(blocks.filter((_, itemIndex) => itemIndex !== index))}
          />
        ))}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-xl border border-line px-3 py-2 text-sm font-semibold"
            onClick={() => addBlock({ id: newId(), type: "paragraph", text: "" })}
          >
            Add paragraph
          </button>
          <button
            type="button"
            className="rounded-xl border border-line px-3 py-2 text-sm font-semibold"
            onClick={() => addBlock({ id: newId(), type: "image", url: "", caption: "" })}
          >
            Add image
          </button>
          <button
            type="button"
            className="rounded-xl border border-line px-3 py-2 text-sm font-semibold"
            onClick={() => addBlock({ id: newId(), type: "table", rows: [["Column A", "Column B"], ["Value", "Value"]] })}
          >
            Add table
          </button>
          <button
            type="button"
            className="rounded-xl border border-line px-3 py-2 text-sm font-semibold"
            onClick={() => addBlock({ id: newId(), type: "bar", label: "Share of scope", value: 70 })}
          >
            Add bar
          </button>
          <button
            type="button"
            className="rounded-xl border border-line px-3 py-2 text-sm font-semibold"
            onClick={() => addBlock({ id: newId(), type: "spacer", size: "md" })}
          >
            Add spacer
          </button>
        </div>
      </div>
      <button type="submit" className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white">
        Save article
      </button>
      {status ? <p className="text-sm text-muted">{status}</p> : null}
    </form>
  );
}
