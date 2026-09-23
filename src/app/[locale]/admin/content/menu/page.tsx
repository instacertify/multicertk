import { setRequestLocale } from "next-intl/server";
import { MenuEditor } from "@/components/site-media-editor";
import { Breadcrumbs } from "@/components/ui";
import { getMenu } from "@/lib/site-media";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/admin/content/menu",
    title: "Edit header menu",
    description: "Change Certification, Testing, QCOs, Labs and their submenus.",
    index: false,
  });
}

export default async function MenuAdmin({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs
        items={[
          { href: "/admin", label: "Backend" },
          { href: "/admin/content", label: "Content" },
          { href: "/admin/content/menu", label: "Header menu" },
        ]}
      />
      <h1 className="mt-4 font-display text-navy">Header menu</h1>
      <p className="mt-3 text-muted">
        Default items are Certification, Testing, QCOs and Labs, each with a submenu. Add, remove or rename items here — the public header updates immediately.
      </p>
      <div className="mt-8">
        <MenuEditor menu={getMenu()} />
      </div>
    </div>
  );
}
