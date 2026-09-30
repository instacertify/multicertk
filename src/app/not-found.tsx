import { Inter } from "next/font/google";
import { LeadFormPlain } from "@/components/lead-form-plain";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function NotFound() {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-screen items-center justify-center bg-paper px-4 font-sans text-ink">
        <div className="w-full max-w-xl py-12">
          <p className="text-[13px] text-muted">404</p>
          <h1 className="mt-2 font-display text-navy">Page not found</h1>
          <p className="lead mt-3 text-muted">That scheme, standard or lab record is not in the catalogue yet.</p>
          <a href="/" className="type-btn mt-6 inline-block rounded-md bg-gold px-4 py-2 text-navy">
            Back home
          </a>
          <LeadFormPlain sourcePath="/404" />
        </div>
      </body>
    </html>
  );
}
