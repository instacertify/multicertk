"use client";

import { useState } from "react";
import type { CustomerLogo, CustomerReview, NavItem } from "@/data/site-media";
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

export function MenuEditor({ menu }: { menu: NavItem[] }) {
  const [items, setItems] = useState(menu);
  const [status, setStatus] = useState("");

  async function save() {
    setStatus("Saving…");
    const response = await fetch("/api/site-media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "menu", menu: items }),
    });
    const json = (await response.json()) as { ok?: boolean };
    setStatus(json.ok ? "Header menu saved. Open any public page to see it." : "Could not save menu.");
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <fieldset key={item.id} className="rounded-2xl border border-line p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-gold-600">Item {index + 1}</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <input
              value={item.label}
              onChange={(event) => {
                const next = [...items];
                next[index] = { ...item, label: event.target.value };
                setItems(next);
              }}
              placeholder="Label"
              className="rounded-xl border border-line px-3 py-2"
            />
            <input
              value={item.href}
              onChange={(event) => {
                const next = [...items];
                next[index] = { ...item, href: event.target.value };
                setItems(next);
              }}
              placeholder="/certifications"
              className="rounded-xl border border-line px-3 py-2"
            />
          </div>
          <div className="mt-3 space-y-2">
            <p className="caption uppercase tracking-wide text-muted">Submenu</p>
            {(item.children ?? []).map((child, childIndex) => (
              <div key={child.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  value={child.label}
                  onChange={(event) => {
                    const next = [...items];
                    const children = [...(item.children ?? [])];
                    children[childIndex] = { ...child, label: event.target.value };
                    next[index] = { ...item, children };
                    setItems(next);
                  }}
                  className="rounded-xl border border-line px-3 py-2"
                />
                <input
                  value={child.href}
                  onChange={(event) => {
                    const next = [...items];
                    const children = [...(item.children ?? [])];
                    children[childIndex] = { ...child, href: event.target.value };
                    next[index] = { ...item, children };
                    setItems(next);
                  }}
                  className="rounded-xl border border-line px-3 py-2"
                />
                <button
                  type="button"
                  className="text-sm font-semibold text-red-700 underline"
                  onClick={() => {
                    const next = [...items];
                    next[index] = { ...item, children: (item.children ?? []).filter((_, i) => i !== childIndex) };
                    setItems(next);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-sm font-semibold text-navy underline"
              onClick={() => {
                const next = [...items];
                next[index] = {
                  ...item,
                  children: [...(item.children ?? []), { id: newId("child"), label: "New link", href: "/" }],
                };
                setItems(next);
              }}
            >
              Add submenu link
            </button>
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
