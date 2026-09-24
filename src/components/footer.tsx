import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import { getCookieSettings } from "@/lib/site-settings";
import { CookieSettingsButton } from "./cookie-banner";
import { Logo } from "./logo";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const legal = getCookieSettings();

  return (
    <footer className="mt-auto border-t border-navy bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-3">
        <div>
          <Logo variant="onDark" className="h-9 w-auto sm:h-10" />
          <p className="mt-4 max-w-md text-sm leading-6 text-white/75">{t("blurb")}</p>
          <ul className="mt-5 space-y-2 text-sm text-white/80">
            <li>{site.address}</li>
            <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><a href={site.phoneHref}>{site.phone}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-gold">{t("explore")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><Link href="/certifications">{nav("certification")}</Link></li>
            <li><Link href="/testing">{nav("testing")}</Link></li>
            <li><Link href="/qco">{nav("qcos")}</Link></li>
            <li><Link href="/labs">{nav("labs")}</Link></li>
            <li><Link href="/blog">{nav("resources")}</Link></li>
            <li><Link href="/sitemap">HTML sitemap</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-gold">{t("aboutUs")}</h4>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-white/80">
            <li><Link href={legal.privacyPath} className="block">Privacy</Link></li>
            <li><Link href={legal.cookiesPath} className="block">Cookies</Link></li>
            <li><Link href={legal.gdprPath} className="block">GDPR & DPDP</Link></li>
            <li><Link href={legal.termsPath} className="block">Terms</Link></li>
            <li className="block"><CookieSettingsButton /></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {site.name}. {site.tagline}
      </div>
    </footer>
  );
}
