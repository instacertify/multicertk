"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { HighlightTitle } from "./ui";
import { LeadForm } from "./lead-form";

export function PageLead({ iconUrl }: { iconUrl?: string }) {
  const pathname = usePathname() || "/";
  const t = useTranslations("lead");
  if (pathname.includes("/admin")) return null;

  return (
    <section id="quote-desk" className="border-t border-line bg-white" aria-label={t("title")}>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <p className="text-[13px] text-muted">Quote desk</p>
          <HighlightTitle iconUrl={iconUrl} className="mt-1">{t("title")}</HighlightTitle>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted">{t("body")}</p>
        </div>
        <div className="lg:col-span-7">
          <LeadForm sourcePath={pathname} />
        </div>
      </div>
    </section>
  );
}
