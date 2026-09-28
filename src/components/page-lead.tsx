"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { LeadForm } from "./lead-form";

const skipExact = new Set(["/contact", "/privacy/data-request"]);

export function PageLead() {
  const pathname = usePathname() || "/";
  const t = useTranslations("lead");
  if (pathname.includes("/admin") || skipExact.has(pathname)) return null;

  return (
    <section className="border-t border-navy bg-white" aria-label={t("title")}>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <p className="font-mono text-[11px] uppercase tracking-wide text-gold-600">Quote desk</p>
          <h2 className="mt-1 font-display text-navy">{t("title")}</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted">{t("body")}</p>
        </div>
        <div className="lg:col-span-7">
          <LeadForm sourcePath={pathname} />
        </div>
      </div>
    </section>
  );
}
