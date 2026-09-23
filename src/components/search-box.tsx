"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function SearchBox({
  initialQuery = "",
  size = "lg",
  autoFocus = false,
}: {
  initialQuery?: string;
  size?: "lg" | "sm";
  autoFocus?: boolean;
}) {
  const t = useTranslations("search");
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next = query.trim();
    router.push(next ? `/search?q=${encodeURIComponent(next)}` : "/search");
  }

  const large = size === "lg";

  return (
    <form onSubmit={onSubmit} className="w-full" role="search">
      <div className={`flex overflow-hidden rounded-full border border-line bg-white shadow-sm ${large ? "h-14" : "h-11"}`}>
        <input
          name="q"
          value={query}
          autoFocus={autoFocus}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("placeholder")}
          className={`min-w-0 flex-1 bg-transparent px-5 text-navy outline-none placeholder:text-muted ${large ? "text-base" : "text-sm"}`}
        />
        <button
          type="submit"
          className="type-btn m-1 rounded-full bg-navy px-5 text-white hover:bg-navy-800"
        >
          {t("submit")}
        </button>
      </div>
    </form>
  );
}
