import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

export const dynamicParams = true;

export async function generateMetadata() {
  return { robots: { index: false, follow: false } };
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect({ href: "/labs", locale });
}
