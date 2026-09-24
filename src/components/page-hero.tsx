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

export function PageGallery({ urls, alt }: { urls?: string[]; alt: string }) {
  const images = urls?.filter(Boolean) ?? [];
  if (!images.length) return null;
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {images.map((src) => (
        <figure key={src} className="overflow-hidden rounded-2xl border border-line bg-paper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="max-h-56 w-full object-cover" />
        </figure>
      ))}
    </div>
  );
}

export function PageMedia({
  src,
  alt,
  gallery,
}: {
  src?: string;
  alt: string;
  gallery?: string[];
}) {
  return (
    <>
      <PageHero src={src} alt={alt} />
      <PageGallery urls={gallery} alt={alt} />
    </>
  );
}
