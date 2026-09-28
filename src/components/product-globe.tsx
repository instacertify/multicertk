"use client";

type ProductMark = {
  name: string;
  lon: number;
  lat: number;
  radius: "in" | "mid" | "core";
};

const products: ProductMark[] = [
  { name: "phone", lon: 4, lat: 14, radius: "in" },
  { name: "laptop", lon: 38, lat: -12, radius: "in" },
  { name: "charger", lon: 72, lat: 20, radius: "in" },
  { name: "mouse", lon: 108, lat: -18, radius: "in" },
  { name: "helmet", lon: 142, lat: 10, radius: "in" },
  { name: "ac", lon: 176, lat: -22, radius: "in" },
  { name: "door", lon: 210, lat: 16, radius: "in" },
  { name: "window", lon: 246, lat: -10, radius: "in" },
  { name: "desk", lon: 282, lat: 22, radius: "in" },
  { name: "fan", lon: 318, lat: -16, radius: "in" },
  { name: "vacuum", lon: 22, lat: 32, radius: "mid" },
  { name: "heater", lon: 58, lat: -30, radius: "mid" },
  { name: "dryer", lon: 96, lat: 8, radius: "mid" },
  { name: "handle", lon: 132, lat: -28, radius: "mid" },
  { name: "backpack", lon: 168, lat: 28, radius: "mid" },
  { name: "cup", lon: 204, lat: -8, radius: "mid" },
  { name: "food", lon: 240, lat: 34, radius: "mid" },
  { name: "plug", lon: 276, lat: -32, radius: "mid" },
  { name: "car", lon: 312, lat: 6, radius: "mid" },
  { name: "tablet", lon: 348, lat: -24, radius: "mid" },
  { name: "lamp", lon: 16, lat: -6, radius: "core" },
  { name: "fridge", lon: 52, lat: 18, radius: "core" },
  { name: "headphones", lon: 88, lat: -20, radius: "core" },
  { name: "toy", lon: 124, lat: 12, radius: "core" },
  { name: "bottle", lon: 160, lat: -16, radius: "core" },
  { name: "ceramic", lon: 196, lat: 20, radius: "core" },
  { name: "phone", lon: 232, lat: -28, radius: "core" },
  { name: "charger", lon: 268, lat: 4, radius: "core" },
  { name: "helmet", lon: 304, lat: -12, radius: "core" },
  { name: "cup", lon: 340, lat: 24, radius: "core" },
];

export const globeStampNames = [
  "phone",
  "laptop",
  "charger",
  "mouse",
  "door",
  "window",
  "desk",
  "fan",
  "vacuum",
  "heater",
  "dryer",
  "helmet",
  "ac",
  "handle",
  "backpack",
  "cup",
  "food",
  "car",
] as const;

export function ProductIcon({ name }: { name: string }) {
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
    case "fan":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <circle cx="12" cy="11" r="2" />
          <path d="M12 9c2.4-3.6 6.4-3.2 6.8-.4C16.6 8.2 13.6 9.4 12 9zM13.8 12.2c3.4.8 4.8 4.4 2.6 6.2-1.4-2.4-3.6-3.8-4.8-4.2zM10.2 12.2C7 13.4 4.4 11.4 5 8.6c2.6 1.2 4.6 2.6 5.2 3.6z" />
          <path d="M12 13.2v7.2M9.2 20.4h5.6" />
        </svg>
      );
    case "door":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M6.4 3.6h11.2v16.8H6.4z" />
          <path d="M14.8 12.2h.01" />
        </svg>
      );
    case "window":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <rect x="5" y="4.2" width="14" height="15.6" />
          <path d="M12 4.2v15.6M5 12h14" />
        </svg>
      );
    case "desk":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M3.6 9.2h16.8M5.2 9.2v10.4M18.8 9.2v10.4M5.2 14.4h6.2V19.6H5.2z" />
        </svg>
      );
    case "vacuum":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <circle cx="9.2" cy="13.4" r="4.4" />
          <path d="M12.8 11.2 18.4 5.8h2M7.6 17.6h3.2" />
        </svg>
      );
    case "heater":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <rect x="5.4" y="4.4" width="13.2" height="15.2" />
          <path d="M8.4 8.2v7.4M12 8.2v7.4M15.6 8.2v7.4" />
        </svg>
      );
    case "dryer":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <rect x="4.6" y="3.8" width="14.8" height="16.4" />
          <circle cx="12" cy="12" r="4.4" />
          <circle cx="12" cy="12" r="1.4" />
        </svg>
      );
    case "mouse":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M8.2 8.4c0-3.2 1.6-5 3.8-5s3.8 1.8 3.8 5v6.4c0 3.2-1.6 5.2-3.8 5.2s-3.8-2-3.8-5.2z" />
          <path d="M12 3.4v6.4" />
        </svg>
      );
    case "ac":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <rect x="3.6" y="5.4" width="16.8" height="8.4" />
          <path d="M6.4 10.2h11.2M8 16.4c1.2 1.4 2.4 1.4 3.6 0M12.4 16.4c1.2 1.4 2.4 1.4 3.6 0" />
        </svg>
      );
    case "handle":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <circle cx="8.2" cy="12" r="2.2" />
          <path d="M10.2 12h8.4c1.2 0 2 .8 2 1.8s-.8 1.8-2 1.8H14" />
        </svg>
      );
    case "backpack":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M8 8.4h8v11.2H8z" />
          <path d="M9.4 8.4V6.6a2.6 2.6 0 0 1 5.2 0v1.8M8 12.4h8" />
        </svg>
      );
    case "cup":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M7 7.4h8.4v6.4A4.2 4.2 0 0 1 11.2 18H11A4.2 4.2 0 0 1 7 13.8z" />
          <path d="M15.4 8.8h2.4a2.4 2.4 0 0 1 0 4.8h-2.4M8.2 19.6h6.8" />
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
          {products.map((item, index) => (
            <span
              key={`${item.name}-${item.lon}-${index}`}
              className={`product-globe-item product-globe-item-${item.radius}`}
              style={{
                transform: `rotateY(${item.lon}deg) rotateX(${item.lat}deg) translateZ(var(--item-r))`,
              }}
              title={item.name}
            >
              <ProductIcon name={item.name} />
            </span>
          ))}
        </div>
      </div>
      <svg className="product-globe-outline" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="98" />
      </svg>
    </div>
  );
}
