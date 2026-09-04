import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/atoms/brand-logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from "@/components/atoms/social-icons";
import { siteConfig } from "@/config/site";
import { FOOTER_SERVICES } from "@/constants/services";

const socialLinks = [
  { href: siteConfig.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: siteConfig.social.twitter, label: "X (Twitter)", Icon: XIcon },
  { href: siteConfig.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: siteConfig.social.instagram, label: "Instagram", Icon: InstagramIcon },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand pt-20 pb-24 text-brand-foreground md:pb-10">
      <div className="container-page">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <BrandLogo variant="badge" size="lg" tone="light" className="mb-6" />
            <p className="text-muted-body mb-6">
              PAN India freight forwarding and Neutral Logistics Provider services connecting
              Indian origins with worldwide destinations — 39+ years of
              international cargo experience. Headquarters in Noida.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full bg-white/5 text-white/80 transition-colors hover:bg-accent hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="relative mb-6 inline-block text-lg font-bold text-white">
              Our Services
              <span className="absolute -bottom-2 left-0 h-1 w-1/2 bg-accent" />
            </h2>
            <ul className="space-y-3">
              {FOOTER_SERVICES.map((service) => (
                <li key={service.id}>
                  <Link
                    href={service.href}
                    className="transition-colors hover:text-accent"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="font-medium text-accent transition-colors hover:text-white"
                >
                  View all services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="relative mb-6 inline-block text-lg font-bold text-white">
              Company
              <span className="absolute -bottom-2 left-0 h-1 w-1/2 bg-accent" />
            </h2>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="hover:text-accent">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/industries" className="hover:text-accent">
                  Industries
                </Link>
              </li>
              <li>
                <Link href="/process" className="hover:text-accent">
                  Our Process
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-accent">
                  Track Shipment
                </Link>
              </li>
              <li>
                <Link href="/appointment" className="hover:text-accent">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/command-center" className="hover:text-accent">
                  Ops Login
                </Link>
              </li>
              <li>
                <Link href="/pan-india-logistics" className="hover:text-accent">
                  PAN India logistics
                </Link>
              </li>
              <li>
                <Link href="/shipping-routes" className="hover:text-accent">
                  Shipping routes
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-accent">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-accent">
                  Get a Quote
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-accent">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-accent">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="relative mb-6 inline-block text-lg font-bold text-white">
              Contact Us
              <span className="absolute -bottom-2 left-0 h-1 w-1/2 bg-accent" />
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 size-5 shrink-0 text-accent" />
                <span>{siteConfig.contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-5 shrink-0 text-accent" />
                <a
                  href={siteConfig.contact.phoneHref}
                  className="hover:text-accent"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-5 shrink-0 text-accent" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-accent"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid items-center gap-6 border-t border-white/10 pt-8 text-sm text-white/50 md:grid-cols-3">
          <p className="text-center md:text-left">
            Copyright © {year} {siteConfig.name}. All rights reserved.
          </p>

          <a
            href="https://www.nareshkumarconsulting.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex max-w-full flex-wrap items-center justify-center gap-3 text-left transition-opacity hover:opacity-90"
            aria-label="Powered by Naresh Kumar Consulting"
          >
            <Image
              src="/images/nk-mark.png"
              alt="Naresh Kumar Consulting"
              width={574}
              height={481}
              loading="lazy"
              className="h-8 w-auto brightness-0 invert"
            />
            <span className="h-8 w-px shrink-0 bg-white/25" aria-hidden />
            <span>
              <span className="block text-sm">
                <span className="text-white">Powered by </span>
                <span className="font-semibold text-accent">
                  Naresh Kumar Consulting
                </span>
              </span>
              <span className="mt-1 block text-xs tracking-wide text-white/55">
                AI Solutions
                <span className="mx-1.5 text-accent">●</span>
                Automation
                <span className="mx-1.5 text-accent">●</span>
                Digital Strategy
              </span>
            </span>
          </a>

          <div className="flex justify-center gap-6 md:justify-end">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
