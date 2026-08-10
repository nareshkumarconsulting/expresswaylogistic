# Component Documentation

## Atoms

| Component | Path | Notes |
| --- | --- | --- |
| Button | `components/atoms/button.tsx` | variants, sizes, loading |
| Typography | `components/atoms/typography.tsx` | display hierarchy |
| Badge | `components/atoms/badge.tsx` | status chips |
| Input / Textarea / Label | `components/atoms/*` | accessible form primitives |
| Spinner / Divider | `components/atoms/*` | feedback & layout |

## Molecules

| Component | Path |
| --- | --- |
| FormField | `components/molecules/form-field.tsx` |
| ServiceCard | `components/molecules/service-card.tsx` |
| StatCard | `components/molecules/stat-card.tsx` |
| StateAlert | `components/molecules/state-alert.tsx` |
| AnimatedCounter | `components/molecules/animated-counter.tsx` |

## Organisms

| Component | Path |
| --- | --- |
| SiteHeader / SiteFooter | `components/organisms/site-*` |
| Hero / About / Services / … | `components/organisms/*-section.tsx` |
| Quote CTA | `features/contact/components/quote-cta-section.tsx` |
| Command Sidebar / Topbar | `features/command-center/components/*` |

Atoms never import molecules/organisms. Molecules compose atoms only.
