export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <p className="text-[13px] text-muted">404</p>
      <h1 className="mt-2 font-display text-navy">Page not found</h1>
      <p className="lead mt-3 text-muted">That scheme, standard or lab record is not in the catalogue yet.</p>
      <p className="mt-4 text-sm text-muted">Use the quote desk below if you still need a certification path mapped.</p>
      <a href="/" className="type-btn mt-6 inline-block rounded-md bg-gold px-4 py-2 text-navy">
        Back home
      </a>
    </div>
  );
}
