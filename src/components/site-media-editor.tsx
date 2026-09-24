"use client";

import { useState } from "react";
import type { CustomerLogo, CustomerReview, HeaderChrome, NavChild, NavItem } from "@/data/site-media";
import { defaultHeaderChrome } from "@/data/site-media";
import { ImageUpload } from "./image-upload";

function newId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

export function LogoLibraryEditor({ logos }: { logos: CustomerLogo[] }) {
  const [items, setItems] = useState(logos);
  const [status, setStatus] = useState("");

  async function save() {
    setStatus("Saving…");
    const response = await fetch("/api/site-media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "logos", logos: items.filter((item) => item.name && item.imageUrl) }),
    });
    const json = (await response.json()) as { ok?: boolean };
    setStatus(json.ok ? "Logo library saved. It now runs on every public page." : "Could not save logos.");
  }

  return (
    <div className="space-y-4">
      {items.map((logo, index) => (
        <fieldset key={logo.id} className="rounded-2xl border border-line p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-gold-600">Logo {index + 1}</legend>
          <input
            value={logo.name}
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...logo, name: event.target.value, alt: event.target.value };
              setItems(next);
            }}
            placeholder="School or customer name"
            className="mt-2 w-full rounded-xl border border-line px-3 py-2"
          />
          <input
            value={logo.href || ""}
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...logo, href: event.target.value };
              setItems(next);
            }}
            placeholder="Optional website"
            className="mt-2 w-full rounded-xl border border-line px-3 py-2"
          />
          <div className="mt-3">
            <ImageUpload
              label="Logo image"
              folder="logos"
              value={logo.imageUrl}
              onChange={(url) => {
                const next = [...items];
                next[index] = { ...logo, imageUrl: url };
                setItems(next);
              }}
            />
          </div>
          <button type="button" className="mt-3 text-sm font-semibold text-red-700 underline" onClick={() => setItems(items.filter((_, i) => i !== index))}>
            Remove logo
          </button>
        </fieldset>
      ))}
      <button
        type="button"
        className="rounded-xl border border-line px-4 py-2 text-sm font-semibold"
        onClick={() => setItems([...items, { id: newId("logo"), name: "New school", imageUrl: "", alt: "New school" }])}
      >
        Add school / customer logo
      </button>
      <button type="button" className="ml-3 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white" onClick={() => void save()}>
        Save logo library
      </button>
      {status ? <p className="text-sm text-muted">{status}</p> : null}
    </div>
  );
}

export function ReviewLibraryEditor({ reviews }: { reviews: CustomerReview[] }) {
  const [items, setItems] = useState(reviews);
  const [status, setStatus] = useState("");

  async function save() {
    setStatus("Saving…");
    const response = await fetch("/api/site-media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "reviews",
        reviews: items.filter((item) => item.name && item.quote && item.rating >= 1),
      }),
    });
    const json = (await response.json()) as { ok?: boolean };
    setStatus(json.ok ? "Review library saved. Quotes appear on every public page." : "Could not save reviews.");
  }

  return (
    <div className="space-y-4">
      {items.map((review, index) => (
        <fieldset key={review.id} className="rounded-2xl border border-line p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-gold-600">Review {index + 1}</legend>
          <input
            value={review.name}
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...review, name: event.target.value };
              setItems(next);
            }}
            placeholder="Customer name"
            className="mt-2 w-full rounded-xl border border-line px-3 py-2"
          />
          <input
            value={review.role}
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...review, role: event.target.value };
              setItems(next);
            }}
            placeholder="School, company or role"
            className="mt-2 w-full rounded-xl border border-line px-3 py-2"
          />
          <textarea
            value={review.quote}
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...review, quote: event.target.value };
              setItems(next);
            }}
            rows={4}
            className="mt-2 w-full rounded-xl border border-line px-3 py-2"
          />
          <input
            type="number"
            min={1}
            max={5}
            value={review.rating}
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...review, rating: Number(event.target.value) };
              setItems(next);
            }}
            className="mt-2 w-24 rounded-xl border border-line px-3 py-2"
          />
          <div className="mt-3">
            <ImageUpload
              label="Optional portrait"
              folder="reviews"
              value={review.avatarUrl}
              onChange={(url) => {
                const next = [...items];
                next[index] = { ...review, avatarUrl: url };
                setItems(next);
              }}
            />
          </div>
          <button type="button" className="mt-3 text-sm font-semibold text-red-700 underline" onClick={() => setItems(items.filter((_, i) => i !== index))}>
            Remove review
          </button>
        </fieldset>
      ))}
      <button
        type="button"
        className="rounded-xl border border-line px-4 py-2 text-sm font-semibold"
        onClick={() => setItems([...items, { id: newId("review"), name: "", role: "", quote: "", rating: 5 }])}
      >
        Add customer review
      </button>
      <button type="button" className="ml-3 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white" onClick={() => void save()}>
        Save review library
      </button>
      {status ? <p className="text-sm text-muted">{status}</p> : null}
    </div>
  );
}

function moveItem<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [row] = next.splice(from, 1);
  next.splice(to, 0, row);
  return next;
}

export function MenuEditor({
  menu,
  chrome,
  categories = [],
  articles = [],
}: {
  menu: NavItem[];
  chrome?: HeaderChrome;
  categories?: { slug: string; name: string }[];
  articles?: { slug: string; title: string }[];
}) {
  const [items, setItems] = useState(menu);
  const [actions, setActions] = useState<HeaderChrome>({ ...defaultHeaderChrome, ...chrome });
  const [status, setStatus] = useState("");

  function patch(index: number, nextItem: NavItem) {
    const next = [...items];
    next[index] = nextItem;
    setItems(next);
  }

  function patchChild(index: number, childIndex: number, child: NavChild) {
    const item = items[index];
    const children = [...(item.children ?? [])];
    children[childIndex] = child;
    patch(index, { ...item, children });
  }

  async function save() {
    setStatus("Saving…");
    const response = await fetch("/api/site-media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "menu",
        chrome: actions,
        menu: items.map((item) => ({
          ...item,
          iconUrl: item.iconUrl || undefined,
          children: (item.children ?? []).map((child) => ({
            ...child,
            group: child.group || undefined,
            iconUrl: child.iconUrl || undefined,
          })),
        })),
      }),
    });
    const json = (await response.json()) as { ok?: boolean; error?: string };
    setStatus(json.ok ? "Header menu saved. Open any public page to see it." : json.error || "Could not save menu.");
  }

  return (
    <div className="space-y-4">
      <fieldset className="rounded-2xl border border-line p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-gold-600">Header action icons</legend>
        <p className="mt-1 caption text-muted">Upload or paste an image for Search, the quote button, and the mobile menu. Leave blank to hide that icon.</p>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <ImageUpload compact label="Search icon" folder="menu" value={actions.searchIconUrl} onChange={(url) => setActions({ ...actions, searchIconUrl: url })} />
          <ImageUpload compact label="Quote button icon" folder="menu" value={actions.quoteIconUrl} onChange={(url) => setActions({ ...actions, quoteIconUrl: url })} />
          <ImageUpload compact label="Mobile menu icon" folder="menu" value={actions.menuIconUrl} onChange={(url) => setActions({ ...actions, menuIconUrl: url })} />
        </div>
      </fieldset>
      {items.map((item, index) => (
        <fieldset key={item.id} className="rounded-2xl border border-line p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-gold-600">
            {item.label || `Item ${index + 1}`}
          </legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <input
              value={item.label}
              onChange={(event) => patch(index, { ...item, label: event.target.value })}
              placeholder="Label"
              className="rounded-xl border border-line px-3 py-2"
            />
            <input
              value={item.href}
              onChange={(event) => patch(index, { ...item, href: event.target.value })}
              placeholder="/certifications"
              className="rounded-xl border border-line px-3 py-2"
            />
            <div className="flex gap-2">
              <button type="button" className="text-sm font-semibold text-navy underline" onClick={() => setItems(moveItem(items, index, index - 1))}>
                Up
              </button>
              <button type="button" className="text-sm font-semibold text-navy underline" onClick={() => setItems(moveItem(items, index, index + 1))}>
                Down
              </button>
            </div>
          </div>
          <div className="mt-3">
            <ImageUpload
              compact
              label="Header icon / image"
              folder="menu"
              value={item.iconUrl}
              onChange={(url) => patch(index, { ...item, iconUrl: url })}
            />
          </div>
          <div className="mt-3 space-y-3">
            <p className="caption uppercase tracking-wide text-muted">Submenu by category</p>
            {(item.children ?? []).map((child, childIndex) => (
              <div key={child.id} className="rounded-xl border border-line/80 p-3">
                <div className="grid gap-2 sm:grid-cols-3">
                  <input
                    value={child.label}
                    onChange={(event) => patchChild(index, childIndex, { ...child, label: event.target.value })}
                    placeholder="Label"
                    className="rounded-xl border border-line px-3 py-2"
                  />
                  <input
                    value={child.href}
                    onChange={(event) => patchChild(index, childIndex, { ...child, href: event.target.value })}
                    placeholder="/category/toys"
                    className="rounded-xl border border-line px-3 py-2"
                  />
                  <input
                    value={child.group || ""}
                    onChange={(event) => patchChild(index, childIndex, { ...child, group: event.target.value })}
                    placeholder="Group (Schemes, Product categories, Blogs…)"
                    className="rounded-xl border border-line px-3 py-2"
                  />
                </div>
                <div className="mt-2">
                  <ImageUpload
                    compact
                    label="Submenu icon"
                    folder="menu"
                    value={child.iconUrl}
                    onChange={(url) => patchChild(index, childIndex, { ...child, iconUrl: url })}
                  />
                </div>
                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    className="text-sm font-semibold text-navy underline"
                    onClick={() => patch(index, { ...item, children: moveItem(item.children ?? [], childIndex, childIndex - 1) })}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="text-sm font-semibold text-navy underline"
                    onClick={() => patch(index, { ...item, children: moveItem(item.children ?? [], childIndex, childIndex + 1) })}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className="text-sm font-semibold text-red-700 underline"
                    onClick={() =>
                      patch(index, { ...item, children: (item.children ?? []).filter((_, i) => i !== childIndex) })
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="text-sm font-semibold text-navy underline"
                onClick={() =>
                  patch(index, {
                    ...item,
                    children: [...(item.children ?? []), { id: newId("child"), label: "New link", href: "/", group: "Links" }],
                  })
                }
              >
                Add submenu link
              </button>
              {categories.length ? (
                <button
                  type="button"
                  className="text-sm font-semibold text-navy underline"
                  onClick={() => {
                    const hrefs = new Set((item.children ?? []).map((child) => child.href));
                    const labs = item.id === "labs";
                    const extra = categories
                      .map((category) => ({
                        id: `${labs ? "lab-cat" : "cat"}-${category.slug}`,
                        label: category.name,
                        href: labs ? `/labs?category=${category.slug}` : `/category/${category.slug}`,
                        group: labs ? "By category" : "Product categories",
                      }))
                      .filter((child) => !hrefs.has(child.href));
                    patch(index, { ...item, children: [...(item.children ?? []), ...extra] });
                  }}
                >
                  Add product categories
                </button>
              ) : null}
              {item.id === "resources" && articles.length ? (
                <button
                  type="button"
                  className="text-sm font-semibold text-navy underline"
                  onClick={() => {
                    const hrefs = new Set((item.children ?? []).map((child) => child.href));
                    const extra = articles
                      .map((article) => ({
                        id: `blog-${article.slug}`,
                        label: article.title,
                        href: `/blog/${article.slug}`,
                        group: "Blogs",
                      }))
                      .filter((child) => !hrefs.has(child.href));
                    patch(index, { ...item, children: [...(item.children ?? []), ...extra] });
                  }}
                >
                  Add blog articles
                </button>
              ) : null}
            </div>
          </div>
          <button type="button" className="mt-3 text-sm font-semibold text-red-700 underline" onClick={() => setItems(items.filter((_, i) => i !== index))}>
            Remove menu item
          </button>
        </fieldset>
      ))}
      <button
        type="button"
        className="rounded-xl border border-line px-4 py-2 text-sm font-semibold"
        onClick={() => setItems([...items, { id: newId("nav"), label: "New item", href: "/" }])}
      >
        Add header item
      </button>
      <button type="button" className="ml-3 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white" onClick={() => void save()}>
        Save header menu
      </button>
      {status ? <p className="text-sm text-muted">{status}</p> : null}
    </div>
  );
}
