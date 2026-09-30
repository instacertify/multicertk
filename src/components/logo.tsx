import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function Logo({
  className = "h-10 w-auto",
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "onDark";
}) {
  const onDark = variant === "onDark";
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Certko home">
      <Image
        src={onDark ? "/certko-logo-on-dark.webp" : "/certko-logo.png"}
        alt="Certko — Compliance. Assured."
        width={282}
        height={78}
        className={className}
        priority={!onDark}
      />
    </Link>
  );
}
