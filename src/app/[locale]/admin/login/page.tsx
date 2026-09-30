import { setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/logo";
import { safeAdminNext } from "@/lib/auth";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/admin/login",
    title: "Editor sign in",
    description: "Sign in to edit Certko pages.",
    index: false,
  });
}

export default async function AdminLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);
  const nextPath = safeAdminNext(query.next);

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-navy-800 p-8 text-white shadow-xl">
        <Logo variant="onDark" className="h-10 w-auto" />
        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-gold">Editor</p>
        <h1 className="mt-2 font-display text-white">Editor sign in</h1>
        <p className="mt-3 text-sm leading-6 text-white/70">
          Enter your email, password and the characters in the image to open the site editor.
        </p>
        <LoginForm nextPath={nextPath} />
      </div>
    </div>
  );
}
