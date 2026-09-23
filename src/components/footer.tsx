import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import { Logo } from "./logo";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");

  return (
    <footer className="mt-auto border-t border-navy bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo variant="onDark" className="h-12 w-auto sm:h-14" />
          <p className="mt-4 max-w-md text-sm leading-6 text-white/75">{t("blurb")}</p>
        </div>
        <div>
          <h3 className="font-display text-lg text-gold">{t("explore")}</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><Link href="/products">{nav("products")}</Link></li>
            <li><Link href="/certifications">{nav("certifications")}</Link></li>
            <li><Link href="/testing">{nav("testing")}</Link></li>
            <li><Link href="/labs">{nav("labs")}</Link></li>
            <li><Link href="/certifications/countries">{nav("countries")}</Link></li>
            <li><Link href="/qco">{nav("qco")}</Link></li>
            <li><Link href="/sitemap">HTML sitemap</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg text-gold">{t("contact")}</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>{site.address}</li>
            <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><a href={site.phoneHref}>{site.phone}</a></li>
            <li><Link href="/privacy">{t("legal")} · Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
          <h3 className="mt-8 font-display text-lg text-gold">{t("backend")}</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/admin" className="font-semibold text-gold">
                {t("admin")} → /admin
              </Link>
            </li>
            <li><Link href="/admin/content">Headings & articles</Link></li>
            <li><Link href="/admin/translations">Translations</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {site.name}. {site.tagline} ·{" "}
        <Link href="/admin" className="text-gold hover:underline">
          {t("admin")}
        </Link>
      </div>
    </footer>
  );
}
