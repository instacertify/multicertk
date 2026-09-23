"use client";

import { usePathname } from "@/i18n/navigation";
import type { CustomerLogo, CustomerReview } from "@/data/site-media";

function LogoMark({ logo }: { logo: CustomerLogo }) {
  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logo.imageUrl} alt={logo.alt || logo.name} className="h-10 w-auto max-w-[9rem] object-contain" />
  );
  if (logo.href) {
    return (
      <a href={logo.href} className="shrink-0 opacity-80 hover:opacity-100" rel="noreferrer">
        {image}
      </a>
    );
  }
  return <div className="shrink-0 opacity-80">{image}</div>;
}

function ReviewCard({ review }: { review: CustomerReview }) {
  return (
    <blockquote className="w-[20rem] shrink-0 rounded-2xl border border-line bg-paper p-5">
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
  );
}

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

  const logoLoop = logos.length ? [...logos, ...logos] : [];
  const reviewLoop = reviews.length ? [...reviews, ...reviews] : [];

  return (
    <>
      {logos.length ? (
        <section className="border-t border-line bg-paper py-7" aria-label={trustedHeading}>
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">{trustedHeading}</p>
          <div className="trust-strip">
            <div className="trust-track">
              {logoLoop.map((logo, index) => (
                <LogoMark key={`${logo.id}-${index}`} logo={logo} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      {reviews.length ? (
        <section className="border-t border-line bg-white py-7" aria-label={reviewsHeading}>
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">{reviewsHeading}</p>
          <div className="trust-strip">
            <div className="trust-track trust-track-reviews">
              {reviewLoop.map((review, index) => (
                <ReviewCard key={`${review.id}-${index}`} review={review} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
