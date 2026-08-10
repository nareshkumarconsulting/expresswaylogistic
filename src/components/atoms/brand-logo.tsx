"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type LogoVariant = "lockup" | "mark" | "badge";
type LogoTone = "light" | "dark";
type LogoSize = "sm" | "md" | "lg";

interface BrandLogoProps {
  href?: string | null;
  variant?: LogoVariant;
  tone?: LogoTone;
  size?: LogoSize;
  className?: string;
  priority?: boolean;
}

/** Copied from docs/logo.png — used as-is, no processing. */
const LOGO_SRC = "/images/expressway-logo.png";
const LOGO_WIDTH = 1536;
const LOGO_HEIGHT = 1024;

const lockupHeight: Record<LogoSize, string> = {
  sm: "h-12",
  md: "h-16",
  lg: "h-20 sm:h-24",
};

const badgeHeight: Record<LogoSize, string> = {
  sm: "h-16",
  md: "h-20",
  lg: "h-28",
};

export function BrandLogo({
  href = "/",
  variant = "lockup",
  tone = "dark",
  size = "md",
  className,
  priority = false,
}: BrandLogoProps) {
  const reduceMotion = useReducedMotion();
  const useBrandPlaque = tone === "light" || variant === "badge";

  const heightClass =
    variant === "badge"
      ? badgeHeight[size]
      : variant === "mark"
        ? lockupHeight.sm
        : lockupHeight[size];

  const inner: ReactNode = (
    // eslint-disable-next-line @next/next/no-img-element -- serve exact PNG from docs/logo.png
    <img
      src={LOGO_SRC}
      alt={variant === "mark" ? "" : siteConfig.name}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={cn("block w-auto object-contain", heightClass)}
    />
  );

  const body = (
    <motion.span
      className={cn(
        "group relative inline-flex items-center",
        useBrandPlaque &&
          "rounded-xl border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(241,245,249,0.96))] p-2 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.65)] ring-1 ring-black/5 backdrop-blur-sm",
        variant === "badge" && size === "lg" && "p-3",
        className,
      )}
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={
        reduceMotion || variant === "badge"
          ? undefined
          : { scale: 1.02, transition: { type: "spring", stiffness: 260 } }
      }
    >
      {inner}
    </motion.span>
  );

  if (href === null) {
    return (
      <span className="inline-flex" aria-label={siteConfig.name}>
        {body}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="relative z-10 inline-flex focus-visible:outline-none"
      aria-label={`${siteConfig.name} home`}
    >
      {body}
    </Link>
  );
}
