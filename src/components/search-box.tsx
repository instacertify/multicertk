"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SearchFields({
  query,
  onQueryChange,
  size,
  autoFocus,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  size: "lg" | "sm";
  autoFocus?: boolean;
}) {
  const t = useTranslations("search");
  const large = size === "lg";

  return (
    <div className={`flex overflow-hidden rounded-full border border-line bg-white shadow-sm ${large ? "h-11" : "h-9"}`}>
      <input
        name="q"
        value={query}
        autoFocus={autoFocus}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={t("placeholder")}
        className={`min-w-0 flex-1 bg-transparent px-5 text-navy outline-none placeholder:text-muted ${large ? "text-base" : "text-sm"}`}
      />
      <button type="submit" className="type-btn m-1 rounded-full bg-navy px-5 text-white hover:bg-navy-800">
        {t("submit")}
      </button>
    </div>
  );
}

function SearchForm({
  initialQuery = "",
  size = "lg",
  autoFocus = false,
}: {
  initialQuery?: string;
  size?: "lg" | "sm";
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next = query.trim();
    router.push(next ? `/search?q=${encodeURIComponent(next)}` : "/search");
  }

  return (
    <form onSubmit={onSubmit} className="w-full" role="search">
      <SearchFields query={query} onQueryChange={setQuery} size={size} autoFocus={autoFocus} />
    </form>
  );
}

function SearchFormFromUrl(props: {
  initialQuery?: string;
  size?: "lg" | "sm";
  autoFocus?: boolean;
}) {
  const params = useSearchParams();
  return <SearchForm {...props} initialQuery={props.initialQuery || params.get("q") || ""} />;
}

export function SearchBox(props: {
  initialQuery?: string;
  size?: "lg" | "sm";
  autoFocus?: boolean;
}) {
  return (
    <Suspense fallback={<SearchForm {...props} />}>
      <SearchFormFromUrl {...props} />
    </Suspense>
  );
}
