"use client";

import { globeStampNames, ProductIcon } from "./product-globe";

export function HomeHeroShapes() {
  return (
    <div className="home-hero-shapes" aria-hidden="true">
      <span className="home-shape home-shape-rule" />
      <span className="home-shape home-shape-rule-2" />
      <span className="home-shape home-shape-disc" />
      <span className="home-shape home-shape-square" />
      <span className="home-shape home-shape-arc" />
    </div>
  );
}

export function HomeStampStrip() {
  return (
    <div className="home-stamp-strip" aria-hidden="true">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-4 px-4">
        {globeStampNames.map((name) => (
          <span key={name} className="home-stamp">
            <ProductIcon name={name} />
          </span>
        ))}
      </div>
    </div>
  );
}
