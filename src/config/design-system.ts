/**
 * Design system — single place to document / reference tokens.
 *
 * Runtime values live in `src/styles/tokens.css`.
 * Change fonts, colors, spacing there; this file mirrors the system
 * for TypeScript consumers and keeps variant names typed.
 *
 * How to rebrand:
 * 1. Fonts   → edit `--font-*-family` in tokens.css (+ @font-face if needed)
 * 2. Colors  → edit HSL channels under `:root` / `.dark` in tokens.css
 * 3. Type    → edit `--type-*-size|leading|tracking|weight` in tokens.css
 * 4. Spacing → edit `--space-section*` / `--container-*` in tokens.css
 * 5. Radius  → edit `--radius` in tokens.css
 */

export const fonts = {
  sans: '"geomanist", "geomanist", ui-sans-serif, system-ui, sans-serif',
  display: '"geomanist", "geomanist", ui-sans-serif, system-ui, sans-serif',
  mono: "var(--font-geist-mono), ui-monospace, monospace",
} as const;

/** Semantic color roles — values are CSS variable names (HSL channels). */
export const colors = {
  background: "--background",
  foreground: "--foreground",
  primary: "--primary",
  secondary: "--secondary",
  accent: "--accent",
  muted: "--muted",
  brand: "--brand",
  inverse: "--inverse",
  surface: "--surface",
  destructive: "--destructive",
  success: "--success",
  warning: "--warning",
} as const;

export const typographyVariants = [
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "lead",
  "body",
  "muted",
  "eyebrow",
  "stat",
] as const;

export type TypographyVariant = (typeof typographyVariants)[number];

/** Spacing token names → CSS custom properties. */
export const spacing = {
  section: "--space-section",
  sectionSm: "--space-section-sm",
  sectionLg: "--space-section-lg",
  stack: "--space-stack",
  stackLg: "--space-stack-lg",
  containerMax: "--container-max",
  containerPadX: "--container-pad-x",
} as const;

/** Tailwind / utility class cheat sheet for layouts. */
export const utilities = {
  container: "container-page",
  sectionY: "py-section",
  sectionYSm: "py-section-sm",
  sectionYLg: "py-section-lg",
  surface: "bg-surface text-surface-foreground",
  brand: "bg-brand text-brand-foreground",
  inverse: "bg-inverse text-inverse-foreground",
} as const;

export const designSystem = {
  fonts,
  colors,
  typographyVariants,
  spacing,
  utilities,
} as const;

export type DesignSystem = typeof designSystem;
