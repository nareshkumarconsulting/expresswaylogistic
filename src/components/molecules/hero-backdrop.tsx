import Image from "next/image";
import { cn } from "@/lib/utils";

export const HERO_BACKDROP_ALT =
  "Cargo and port operations for ExpressWay Logistic freight forwarding";

export function HeroBackdrop({
  src,
  alt = HERO_BACKDROP_ALT,
  className,
  priority = false,
}: {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1920}
      height={1080}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      sizes="100vw"
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}
