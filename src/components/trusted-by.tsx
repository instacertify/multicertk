"use client";

import { usePathname } from "@/i18n/navigation";
import type { CustomerLogo, CustomerReview } from "@/data/site-media";

export function SocialProof({
  logos,
  reviews,
  trustedHeading,
  reviewsHeading,
}: {
  logos: CustomerLogo[];
  reviews: CustomerReview[];
  trustedHeading: string;
  reviewsHeading: string;
}) {
  const pathname = usePathname() || "";
  if (pathname.includes("/admin")) return null;

  return (
    <>
      {logos.length ? (
        <section className="border-t border-line bg-paper">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">{trustedHeading}</p>
            <div className="mt-5 grid grid-cols-2 items-center gap-4 sm:grid-cols-4 lg:grid-cols-8">
              {logos.map((logo) => {
                const image = (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo.imageUrl} alt={logo.alt || logo.name} className="mx-auto h-10 w-auto max-w-full object-contain" />
                );
                return logo.href ? (
                  <a key={logo.id} href={logo.href} className="opacity-80 hover:opacity-100" rel="noreferrer">
                    {image}
                  </a>
                ) : (
                  <div key={logo.id} className="opacity-80">
                    {image}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
      {reviews.length ? (
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">{reviewsHeading}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {reviews.map((review) => (
                <blockquote key={review.id} className="rounded-2xl border border-line bg-paper p-5">
                  <p className="text-gold" aria-label={`${review.rating} out of 5`}>
                    {"★".repeat(review.rating)}
                    {"☆".repeat(Math.max(0, 5 - review.rating))}
                  </p>
                  <p className="mt-3 text-ink">“{review.quote}”</p>
                  <footer className="mt-4 flex items-center gap-3">
                    {review.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={review.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">
                        {review.name.slice(0, 1)}
                      </span>
                    )}
                    <div>
                      <p className="font-semibold text-navy">{review.name}</p>
                      <p className="caption text-muted">{review.role}</p>
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
