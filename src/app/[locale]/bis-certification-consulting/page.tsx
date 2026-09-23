import { setRequestLocale } from "next-intl/server";
import { SimplePage } from "@/components/simple-page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/bis-certification-consulting",
    title: "BIS certification consulting",
    description: "End-to-end ISI and CRS consulting — application, lab coordination, factory inspection and grant follow-up.",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SimplePage
      title="BIS certification consulting"
      path="/bis-certification-consulting"
      intro="Application drafting, technical file preparation, lab coordination, factory inspection readiness and licence grant follow-up."
      sections={[
        {
          heading: "Who we support",
          body: [
            "Indian manufacturers, importers, and foreign factories on FMCS who need an Authorised Indian Representative.",
          ],
        },
      ]}
    />
  );
}
