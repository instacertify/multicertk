import type { ReactNode } from "react";

export function CatalogFilter({
  q,
  children,
}: {
  q?: string;
  children?: ReactNode;
}) {
  return (
    <form method="get" className="mt-6 flex flex-wrap items-end gap-3">
      <label className="min-w-[16rem] flex-1 text-sm">
        <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Search</span>
        <input
          name="q"
          defaultValue={q}
          placeholder="IS number, HSN, product or lab"
          className="w-full rounded-xl border border-line bg-white px-3 py-2 outline-none focus:border-navy"
        />
      </label>
      {children}
      <button type="submit" className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white">
        Filter
      </button>
    </form>
  );
}
