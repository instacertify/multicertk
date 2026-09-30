"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HighlightIcon } from "./ui";

export function PriceOffer({ className = "" }: { className?: string }) {
  const t = useTranslations("price");
  return (
    <Link
      href="/contact"
      className={`mt-1 block font-semibold text-gold-600 hover:underline ${className}`}
    >
      {t("inline")}
    </Link>
  );
}

export function ListedPrice({
  amount,
  className = "",
}: {
  amount: string;
  className?: string;
}) {
  if (!amount || amount === "—") {
    return <span className={className}>{amount || "—"}</span>;
  }
  return <span className={`font-semibold text-gold-600 ${className}`}>{amount}</span>;
}

export function PriceReassurance({
  compact = false,
  className = "",
  iconUrl,
}: {
  compact?: boolean;
  className?: string;
  iconUrl?: string;
}) {
  const t = useTranslations("price");

  return (
    <aside
      className={`border border-gold bg-gold/10 ${compact ? "p-4" : "px-4 py-4"} ${className}`}
    >
      <div className="flex items-start gap-3">
        <HighlightIcon src={iconUrl} />
        <div>
          <p className="text-[13px] text-muted">{t("eyebrow")}</p>
          <p className={`mt-1 font-display text-navy ${compact ? "" : "lead"}`}>{t("headline")}</p>
          <p className="mt-1 text-muted">{t("body")}</p>
          <Link href="/contact" className="type-btn mt-3 inline-flex rounded-md bg-gold px-3 py-1.5 text-navy hover:bg-gold-600">
            {t("cta")}
          </Link>
        </div>
      </div>
    </aside>
  );
}
