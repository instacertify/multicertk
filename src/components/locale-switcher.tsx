"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localesMeta } from "@/lib/site";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 text-xs font-medium text-navy">
      <span className="sr-only">Language</span>
      <select
        className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-navy"
        value={locale}
        onChange={(event) => router.replace(pathname, { locale: event.target.value })}
      >
        {Object.entries(localesMeta).map(([code, meta]) => (
          <option key={code} value={code}>
            {meta.label}
          </option>
        ))}
      </select>
    </label>
  );
}
