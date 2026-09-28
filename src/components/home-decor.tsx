"use client";

import { globeStampNames, ProductIcon } from "./product-globe";

const galleryLabels: Record<(typeof globeStampNames)[number], string> = {
  phone: "Phone",
  laptop: "Laptop",
  charger: "Charger",
  mouse: "Mouse",
  door: "Door",
  window: "Window",
  desk: "Desk",
  fan: "Fan",
  vacuum: "Vacuum",
  heater: "Heater",
  dryer: "Dryer",
  helmet: "Helmet",
  ac: "Air-con",
  handle: "Handle",
  backpack: "Bag",
  cup: "Cup",
  food: "Food",
  car: "Car",
};

export function HomeHeroShapes() {
  return (
    <div className="home-hero-shapes" aria-hidden="true">
      <span className="home-shape home-shape-disc" />
      <span className="home-shape home-shape-disc-2" />
      <span className="home-shape home-shape-square" />
      <span className="home-shape home-shape-arc" />
      <span className="home-shape home-shape-pill" />
      <span className="home-shape home-shape-dot" />
    </div>
  );
}

export function HomeProductGallery() {
  return (
    <div className="home-gallery">
      {globeStampNames.map((name) => (
        <figure key={name} className="home-gallery-card">
          <span className="home-gallery-icon" aria-hidden="true">
            <ProductIcon name={name} />
          </span>
          <figcaption>{galleryLabels[name]}</figcaption>
        </figure>
      ))}
    </div>
  );
}
