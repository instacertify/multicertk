"use client";

type ProductMark = {
  name: string;
  lon: number;
  lat: number;
  radius: "in" | "mid" | "core";
};

const products: ProductMark[] = [
  { name: "phone", lon: 8, lat: 18, radius: "in" },
  { name: "laptop", lon: 52, lat: -12, radius: "in" },
  { name: "plug", lon: 98, lat: 22, radius: "in" },
  { name: "charger", lon: 148, lat: -18, radius: "in" },
  { name: "car", lon: 196, lat: 8, radius: "in" },
  { name: "ceramic", lon: 244, lat: -24, radius: "in" },
  { name: "food", lon: 292, lat: 16, radius: "in" },
  { name: "lamp", lon: 332, lat: -8, radius: "in" },
  { name: "tablet", lon: 28, lat: -32, radius: "mid" },
  { name: "fridge", lon: 118, lat: 4, radius: "mid" },
  { name: "headphones", lon: 208, lat: 28, radius: "mid" },
  { name: "toy", lon: 278, lat: -6, radius: "mid" },
  { name: "bottle", lon: 70, lat: 36, radius: "core" },
  { name: "helmet", lon: 170, lat: -36, radius: "core" },
  { name: "fan", lon: 250, lat: 14, radius: "core" },
];

function Icon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.35,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "phone":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <rect x="8" y="3" width="8" height="18" rx="1.4" />
          <path d="M10.5 5.2h3M12 18.6h.01" />
        </svg>
      );
    case "laptop":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M5 6.2h14v8.6H5z" />
          <path d="M3.2 16.8h17.6L19.4 19H4.6z" />
        </svg>
      );
    case "plug":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M9 3.2v5M15 3.2v5M7.2 8.2h9.6v4.2a4.8 4.8 0 0 1-9.6 0zM12 17.2v3.4" />
        </svg>
      );
    case "charger":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <rect x="7.5" y="3.5" width="9" height="11.5" />
          <path d="M10.2 15v4.2h3.6V15M11 8.2 13.2 11h-2.2L13.2 14" />
        </svg>
      );
    case "car":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M4 14.2h16l-1.6-5H9.2L6.2 14.2" />
          <path d="M7.2 9.2 8.8 6.6h6.4L18 9.2" />
          <circle cx="7.6" cy="15.6" r="1.4" />
          <circle cx="16.4" cy="15.6" r="1.4" />
        </svg>
      );
    case "ceramic":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M9 7.2c0-2.2 6-2.2 6 0v1.4c2 .7 3.2 2 3.2 3.8 0 3-4.2 4.8-6.2 4.8S5.8 15.4 5.8 12.4c0-1.8 1.2-3.1 3.2-3.8z" />
        </svg>
      );
    case "food":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M5.5 14.2h13s-.4 5-6.5 5-6.5-5-6.5-5z" />
          <path d="M8.4 14.2c.4-3.2 1.9-5.5 3.6-7.4 1.7 1.9 3.2 4.2 3.6 7.4" />
          <path d="M12 6.8V4.4" />
        </svg>
      );
    case "lamp":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M9 14.4h6l1.4-6.6H7.6zM10.2 14.4v2.8h3.6v-2.8M8.8 19.4h6.4" />
        </svg>
      );
    case "tablet":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <rect x="5.5" y="3.4" width="13" height="17.2" rx="1.2" />
          <path d="M12 17.6h.01" />
        </svg>
      );
    case "fridge":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <rect x="7.4" y="3.4" width="9.2" height="17.2" />
          <path d="M7.4 10.2h9.2M14.8 6v2.2M14.8 12.8v3.2" />
        </svg>
      );
    case "headphones":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M5.6 13.2v-1.6A6.4 6.4 0 0 1 12 5.2a6.4 6.4 0 0 1 6.4 6.4v1.6" />
          <rect x="4.2" y="12.4" width="3.4" height="6.2" rx="1" />
          <rect x="16.4" y="12.4" width="3.4" height="6.2" rx="1" />
        </svg>
      );
    case "toy":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <circle cx="12" cy="8.2" r="3" />
          <path d="M8.4 12.4h7.2L17 19.2H7z" />
          <path d="M9.4 12.4 8 8.8M14.6 12.4 16 8.8" />
        </svg>
      );
    case "bottle":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M10 3.4h4v2.4c1.6.8 2.6 2.4 2.6 4.4v8.4H7.4V10.2c0-2 1-3.6 2.6-4.4z" />
          <path d="M9.2 13.2h5.6" />
        </svg>
      );
    case "helmet":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M4.6 13.6c0-4.2 3.3-7.8 7.4-7.8s7.4 3.6 7.4 7.8H4.6z" />
          <path d="M4.6 13.6h14.8v2.4H4.6z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 5.2v2.2M12 16.6v2.2M5.2 12h2.2M16.6 12h2.2" />
        </svg>
      );
  }
}

export function ProductGlobe() {
  const meridians = [0, 30, 60, 90, 120, 150];
  const latitudes = [
    { y: "-42%", scale: 0.38 },
    { y: "-22%", scale: 0.78 },
    { y: "0%", scale: 1 },
    { y: "22%", scale: 0.78 },
    { y: "42%", scale: 0.38 },
  ];

  return (
    <div className="product-globe" aria-hidden="true">
      <div className="product-globe-scene">
        <div className="product-globe-spin">
          {meridians.map((deg) => (
            <span key={deg} className="product-globe-meridian" style={{ transform: `rotateY(${deg}deg)` }} />
          ))}
          {latitudes.map((ring) => (
            <span
              key={ring.y}
              className="product-globe-latitude"
              style={{ transform: `translateY(${ring.y}) rotateX(90deg) scaleX(${ring.scale})` }}
            />
          ))}
          {products.map((item) => (
            <span
              key={`${item.name}-${item.lon}`}
              className={`product-globe-item product-globe-item-${item.radius}`}
              style={{
                transform: `rotateY(${item.lon}deg) rotateX(${item.lat}deg) translateZ(var(--item-r))`,
              }}
              title={item.name}
            >
              <Icon name={item.name} />
            </span>
          ))}
        </div>
      </div>
      <svg className="product-globe-outline" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="98" />
        <ellipse cx="100" cy="100" rx="98" ry="22" />
        <ellipse cx="100" cy="58" rx="84" ry="14" />
        <ellipse cx="100" cy="142" rx="84" ry="14" />
        <path d="M100 2 C 68 40 68 160 100 198" />
        <path d="M100 2 C 132 40 132 160 100 198" />
      </svg>
    </div>
  );
}
