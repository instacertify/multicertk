import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

export default function NotFound() {
  return (
    <html lang="en">
      <body className={`${sans.variable} flex min-h-screen items-center justify-center font-sans`}>
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">404</p>
          <h1 className="mt-2 font-display text-4xl text-navy">Page not found</h1>
          <p className="mt-3 text-muted">That scheme, standard or lab record is not in the catalogue yet.</p>
          <a href="/" className="mt-6 inline-block rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white">
            Back home
          </a>
        </div>
      </body>
    </html>
  );
}
