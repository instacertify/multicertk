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
    <footer className="mt-auto border-t border-line bg-white text-navy">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-3">
        <div>
          <Logo className="h-9 w-auto sm:h-10" />
          <p className="mt-4 max-w-md text-sm leading-6 text-muted">{t("blurb")}</p>
          <ul className="mt-5 space-y-2 text-sm text-ink">
            <li>{site.address}</li>
            <li><a href={`mailto:${site.email}`} className="hover:text-gold-600">{site.email}</a></li>
            <li><a href={site.phoneHref} className="hover:text-gold-600">{site.phone}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-navy">{t("explore")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink">
            <li><Link href="/certifications" className="hover:text-gold-600">{nav("certification")}</Link></li>
            <li><Link href="/testing" className="hover:text-gold-600">{nav("testing")}</Link></li>
            <li><Link href="/qco" className="hover:text-gold-600">{nav("qcos")}</Link></li>
            <li><Link href="/blog" className="hover:text-gold-600">{nav("resources")}</Link></li>
            <li><Link href="/sitemap" className="hover:text-gold-600">HTML sitemap</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-navy">{t("aboutUs")}</h4>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-ink">
            <li><Link href="/about" className="block hover:text-gold-600">About Certko</Link></li>
            <li><Link href={legal.privacyPath} className="block hover:text-gold-600">Privacy</Link></li>
            <li><Link href={legal.cookiesPath} className="block hover:text-gold-600">Cookies</Link></li>
            <li><Link href={legal.gdprPath} className="block hover:text-gold-600">GDPR & DPDP</Link></li>
            <li><Link href={legal.termsPath} className="block hover:text-gold-600">Terms</Link></li>
            <li className="block"><CookieSettingsButton /></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {site.name}. {site.tagline}
      </div>
    </footer>
  );
}
