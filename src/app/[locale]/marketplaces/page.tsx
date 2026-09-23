import { setRequestLocale } from "next-intl/server";
import { SimplePage } from "@/components/simple-page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/marketplaces",
    title: "Marketplace compliance",
    description: "Amazon, Flipkart and other marketplaces verify BIS registration numbers on notified products.",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SimplePage
      title="Marketplace compliance"
      path="/marketplaces"
      intro="Marketplaces actively verify BIS registration numbers. Selling a notified product without a licence leads to immediate delisting."
      sections={[
        {
          heading: "What they check",
          body: [
            "Licence or registration number, brand, model / variety list and whether the Standard Mark artwork matches the granted scope.",
            "Toys, helmets, appliances and cables are the categories most often pulled from listings.",
          ],
        },
      ]}
    />
  );
}
