import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function NotFound() {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-screen items-center justify-center font-sans">
        <div className="text-center">
          <p className="caption font-semibold uppercase tracking-wide text-gold-600">404</p>
          <h1 className="mt-2 font-display text-navy">Page not found</h1>
          <p className="lead mt-3 text-muted">That scheme, standard or lab record is not in the catalogue yet.</p>
          <a href="/" className="type-btn mt-6 inline-block rounded-full bg-navy px-5 py-2 text-white">
            Back home
          </a>
        </div>
      </body>
    </html>
  );
}
