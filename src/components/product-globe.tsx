"use client";

const items = [
  { label: "Mobile phone", delay: "0s", orbit: "outer" as const },
  { label: "Laptop", delay: "-3.5s", orbit: "outer" as const },
  { label: "Plug", delay: "-7s", orbit: "outer" as const },
  { label: "Charger", delay: "-10.5s", orbit: "outer" as const },
  { label: "Car", delay: "-14s", orbit: "outer" as const },
  { label: "Ceramic", delay: "-17.5s", orbit: "outer" as const },
  { label: "Food", delay: "-21s", orbit: "outer" as const },
  { label: "Lamp", delay: "-24.5s", orbit: "outer" as const },
  { label: "Tablet", delay: "0s", orbit: "inner" as const },
  { label: "Fridge", delay: "-8s", orbit: "inner" as const },
  { label: "Headphones", delay: "-16s", orbit: "inner" as const },
];

function Icon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "Mobile phone":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <rect x="7" y="3" width="10" height="18" rx="1.2" />
          <path d="M10 5.5h4M12 18.5h.01" />
        </svg>
      );
    case "Laptop":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M5 6.5h14v9H5z" />
          <path d="M3 17.5h18l-1.2 2H4.2z" />
        </svg>
      );
    case "Plug":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M9 3.5v5M15 3.5v5M7 8.5h10v4.5a5 5 0 0 1-10 0zM12 18v3" />
        </svg>
      );
    case "Charger":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <rect x="7" y="4" width="10" height="12" />
          <path d="M10 16v4h4v-4M11 8.5 13 11h-2l2 2.5" />
        </svg>
      );
    case "Car":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M4 14.5h16l-1.5-5.2H9L6 14.5" />
          <path d="M7 9.3 8.8 6.5h6.5L18 9.3" />
          <circle cx="7.5" cy="15.8" r="1.5" />
          <circle cx="16.5" cy="15.8" r="1.5" />
        </svg>
      );
    case "Ceramic":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M8 8c0-2.5 8-2.5 8 0v1.5c2.2.8 3.5 2.2 3.5 4.2 0 3.3-4.7 5.3-7.5 5.3S4.5 17 4.5 13.7c0-2 1.3-3.4 3.5-4.2z" />
        </svg>
      );
    case "Food":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M5 14.5h14s-.5 5.5-7 5.5-7-5.5-7-5.5z" />
          <path d="M8 14.5c.4-3.5 2-6 4-8 2 2 3.6 4.5 4 8" />
          <path d="M12 6.5V4" />
        </svg>
      );
    case "Lamp":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M9 14.5h6l1.5-6.5H7.5zM10 14.5v3h4v-3M9 19.5h6" />
        </svg>
      );
    case "Tablet":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <rect x="5" y="3.5" width="14" height="17" rx="1" />
          <path d="M12 17.8h.01" />
        </svg>
      );
    case "Fridge":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <rect x="7" y="3.5" width="10" height="17" />
          <path d="M7 10h10M15 6v2M15 13v3" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M5 12c3-6 11-6 14 0-3 6-11 6-14 0z" />
          <path d="M8 12h8" />
        </svg>
      );
  }
}

export function ProductGlobe() {
  const meridians = [0, 30, 60, 90, 120, 150];
  const latitudes = [
    { scale: 0.42, y: -38 },
    { scale: 0.78, y: -18 },
    { scale: 1, y: 0 },
    { scale: 0.78, y: 18 },
    { scale: 0.42, y: 38 },
  ];

  return (
    <div className="product-globe" aria-hidden="true">
      <div className="product-globe-sphere">
        {meridians.map((deg) => (
          <span key={deg} className="product-globe-meridian" style={{ transform: `rotateY(${deg}deg)` }} />
        ))}
        {latitudes.map((ring) => (
          <span
            key={ring.y}
            className="product-globe-latitude"
            style={{ transform: `translateY(${ring.y}%) scaleX(${ring.scale}) rotateX(90deg)` }}
          />
        ))}
      </div>
      <div className="product-globe-equator" />
      {items.map((item) => (
        <span
          key={`${item.orbit}-${item.label}`}
          className={`product-globe-item product-globe-item-${item.orbit}`}
          style={{ animationDelay: item.delay }}
          title={item.label}
        >
          <Icon name={item.label} />
        </span>
      ))}
    </div>
  );
}
