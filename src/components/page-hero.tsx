export function PageHero({ src, alt }: { src?: string; alt: string }) {
  if (!src) return null;
  return (
    <figure className="mt-5 overflow-hidden rounded-2xl border border-line bg-paper">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="max-h-72 w-full object-cover" />
    </figure>
  );
}

export function SectionImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) return null;
  return (
    <figure className="mt-4 overflow-hidden rounded-2xl border border-line bg-paper">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="max-h-64 w-full object-cover" />
    </figure>
  );
}
