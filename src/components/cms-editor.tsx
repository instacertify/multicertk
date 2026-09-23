"use client";

import { useState } from "react";
import type { CmsArticle, CmsPage } from "@/data/cms-seed";

function joinBody(value: string[]) {
  return value.join("\n\n");
}

function splitBody(value: string) {
  return value
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function PageEditor({ page, locale }: { page: CmsPage; locale: string }) {
  const [title, setTitle] = useState(page.title);
  const [intro, setIntro] = useState(page.intro);
  const [sections, setSections] = useState(page.sections);
  const [status, setStatus] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("Saving…");
    const response = await fetch("/api/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "page", slug: page.slug, locale, title, intro, sections }),
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

export function ArticleEditor({ article, locale }: { article: CmsArticle; locale: string }) {
  const [title, setTitle] = useState(article.title);
  const [heading, setHeading] = useState(article.heading);
  const [excerpt, setExcerpt] = useState(article.excerpt);
  const [body, setBody] = useState(joinBody(article.body));
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
        body: splitBody(body),
        date: article.date,
        tags: article.tags,
      }),
    });
    const json = (await response.json()) as { ok?: boolean; directus?: { ok?: boolean } };
    setStatus(json.ok ? (json.directus?.ok ? "Saved to the site and Directus." : "Saved on the site. Directus is optional — start it to sync.") : "Could not save.");
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
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Article (blank line = new paragraph)</span>
        <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={12} className="w-full rounded-xl border border-line px-3 py-2" />
      </label>
      <button type="submit" className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white">
        Save article
      </button>
      {status ? <p className="text-sm text-muted">{status}</p> : null}
    </form>
  );
}
