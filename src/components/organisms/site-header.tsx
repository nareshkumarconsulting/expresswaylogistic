"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, Phone } from "lucide-react";
import { BrandLogo } from "@/components/atoms/brand-logo";
import { Button } from "@/components/atoms/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { SERVICES } from "@/constants/services";
import { cn } from "@/lib/utils";

function ServicesDropdown() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLLIElement>(null);
  const menuId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      clearCloseTimer();
    };
  }, []);

  return (
    <li
      ref={containerRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-accent",
          "text-foreground/80 dark:text-foreground",
          (open || pathname.startsWith("/services")) && "text-accent",
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        onFocus={openMenu}
      >
        Services
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <div
        id={menuId}
        role="menu"
        aria-label="Services"
        className={cn(
          "absolute top-full left-1/2 z-50 mt-3 w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 border border-border bg-card p-3 shadow-lg transition-all duration-200",
          open
            ? "pointer-events-auto visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-1 opacity-0",
        )}
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
      >
        <div className="grid gap-1 sm:grid-cols-2">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            const active = pathname === service.href;
            return (
              <Link
                key={service.id}
                href={service.href}
                role="menuitem"
                className={cn(
                  "flex items-start gap-3 px-3 py-2.5 transition-colors hover:bg-surface",
                  active && "bg-accent/10",
                )}
                onClick={() => setOpen(false)}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-primary",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">
                    {service.title}
                  </span>
                  <span className="mt-0.5 line-clamp-1 block text-xs text-muted-foreground">
                    {service.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
        <div className="mt-2 border-t border-border pt-2">
          <Link
            href="/services"
            role="menuitem"
            className="block px-3 py-2 text-sm font-semibold text-accent hover:bg-surface"
            onClick={() => setOpen(false)}
          >
            View all services
          </Link>
        </div>
      </div>
    </li>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [hiddenOnScroll, setHiddenOnScroll] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setOpen(false);
    setMobileServicesOpen(false);
    setHiddenOnScroll(false);
  }, [pathname]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const y = Math.max(0, window.scrollY);
      const delta = y - lastScrollY.current;
      lastScrollY.current = y;

      setHiddenOnScroll((currentlyHidden) => {
        if (y < 24) return false;
        if (delta > 8) return true;
        if (delta < -8) return false;
        return currentlyHidden;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const otherNav = siteConfig.nav.filter((link) => link.name !== "Services");
  const hideHeader = hiddenOnScroll && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 bg-white/90 py-2 shadow-sm backdrop-blur-md dark:bg-background/90",
        "transition-transform duration-300 ease-out motion-reduce:transition-none",
        hideHeader
          ? "pointer-events-none -translate-y-full"
          : "translate-y-0",
      )}
      aria-hidden={hideHeader || undefined}
      inert={hideHeader || undefined}
    >
      <div className="container-page flex items-center justify-between gap-3">
        <div className="min-w-0">
          <BrandLogo tone="dark" size="lg" />
        </div>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          <ul className="flex items-center gap-6">
            <ServicesDropdown />
            {otherNav.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent dark:text-foreground"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={siteConfig.cta.command.href}
                className="relative text-sm font-semibold text-primary transition-colors hover:text-accent"
              >
                {siteConfig.cta.command.label}
                <span className="absolute -top-1 -right-2.5 size-1.5 rounded-full bg-accent" />
              </Link>
            </li>
          </ul>
          <Button asChild rounded="none">
            <Link href={siteConfig.cta.primary.href}>
              {siteConfig.cta.primary.label}
            </Link>
          </Button>
        </nav>

        <div className="flex shrink-0 items-center gap-1 lg:hidden">
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label="Call ExpressWay"
            className="text-foreground"
          >
            <a href={siteConfig.contact.phoneHref}>
              <Phone className="size-5" />
            </a>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="text-foreground"
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <BrandLogo tone="dark" size="md" href={null} />
              <ul className="mt-6 flex flex-col gap-1">
                <li>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-2 text-lg font-medium text-foreground hover:text-accent"
                    aria-expanded={mobileServicesOpen}
                    onClick={() => setMobileServicesOpen((value) => !value)}
                  >
                    Services
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform",
                        mobileServicesOpen && "rotate-180",
                      )}
                      aria-hidden
                    />
                  </button>
                  {mobileServicesOpen ? (
                    <ul className="mb-2 ml-1 border-l border-border pl-3">
                      <li>
                        <Link
                          href="/services"
                          className="block py-2 text-sm font-semibold text-accent"
                          onClick={() => setOpen(false)}
                        >
                          All services
                        </Link>
                      </li>
                      {SERVICES.map((service) => (
                        <li key={service.id}>
                          <Link
                            href={service.href}
                            className="block py-2 text-sm text-foreground/80 hover:text-accent"
                            onClick={() => setOpen(false)}
                          >
                            {service.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
                {otherNav.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="block py-2 text-lg font-medium text-foreground hover:text-accent"
                      onClick={() => setOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={siteConfig.cta.command.href}
                    className="block py-2 text-lg font-semibold text-primary hover:text-accent"
                    onClick={() => setOpen(false)}
                  >
                    {siteConfig.cta.command.label}
                  </Link>
                </li>
              </ul>
              <div className="mt-auto flex flex-col gap-3 pt-4">
                <a
                  href={siteConfig.contact.phoneHref}
                  className="text-sm font-medium text-foreground/80"
                  onClick={() => setOpen(false)}
                >
                  Call {siteConfig.contact.phone}
                </a>
                <Button asChild className="w-full" rounded="none">
                  <Link
                    href={siteConfig.cta.primary.href}
                    onClick={() => setOpen(false)}
                  >
                    {siteConfig.cta.primary.label}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
