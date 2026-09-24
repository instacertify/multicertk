"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

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
  return (
    <div className={className}>
      <p className="font-semibold text-navy">{amount}</p>
      <PriceOffer />
    </div>
  );
}

export function PriceReassurance({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const t = useTranslations("price");

  return (
    <aside
      className={`rounded-2xl border border-gold/50 bg-gold/10 ${compact ? "p-4" : "p-5 sm:p-6"} ${className}`}
    >
      <p className="caption font-semibold uppercase tracking-wide text-gold-600">{t("eyebrow")}</p>
      <p className={`mt-1 font-semibold text-navy ${compact ? "" : "lead"}`}>{t("headline")}</p>
      <p className="mt-1 text-muted">{t("body")}</p>
      <Link href="/contact" className="type-btn mt-4 inline-flex rounded-full bg-navy px-4 py-2 text-white hover:bg-navy-800">
        {t("cta")}
      </Link>
    </aside>
  );
}
