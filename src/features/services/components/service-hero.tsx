"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { siteConfig } from "@/config/site";
import { getServiceById } from "@/constants/services";
import { cn } from "@/lib/utils";

type ServiceHeroProps = {
  serviceId: string;
};

export function ServiceHero({ serviceId }: ServiceHeroProps) {
  const reduceMotion = useReducedMotion();
  const service = getServiceById(serviceId);

  if (!service) return null;

  const Icon = service.icon;
  const preview = service.highlights.slice(0, 3);

  const fade = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: "easeOut" as const },
        };

  return (
    <section className="relative isolate overflow-hidden bg-brand pt-36 pb-16 text-brand-foreground md:pt-40 md:pb-20">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-port.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-brand/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/85 to-brand/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand via-transparent to-brand/40" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.12]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(0 0% 100% / 0.08) 1px, transparent 1px), linear-gradient(to bottom, hsl(0 0% 100% / 0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container-page relative z-10">
        <motion.div {...fade(0)} className="mb-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All services
          </Link>
        </motion.div>

        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <motion.p
              {...fade(0.05)}
              className="mb-4 text-xs font-semibold tracking-[0.2em] text-accent uppercase"
            >
              ExpressWay Logistic · Services
            </motion.p>

            <motion.h1
              {...fade(0.1)}
              className="text-display mb-5 max-w-3xl text-white"
            >
              {service.title}
            </motion.h1>

            <motion.p
              {...fade(0.18)}
              className="text-lead mb-8 max-w-2xl text-white/80"
            >
              {service.description}
            </motion.p>

            <motion.div
              {...fade(0.26)}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Button
                asChild
                size="lg"
                rounded="none"
                className="shadow-accent-glow"
              >
                <Link href={siteConfig.cta.primary.href}>
                  Get a Quote
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                rounded="none"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/appointment">Book an Appointment</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div {...fade(0.2)} className="relative lg:col-span-5">
            <div className="relative overflow-hidden border border-white/15 bg-white/5 p-6 backdrop-blur-sm md:p-8">
              <div
                className={cn(
                  "mb-6 flex size-16 items-center justify-center bg-accent text-accent-foreground shadow-[0_0_40px_-8px_hsl(var(--accent))]",
                )}
              >
                <Icon className="size-8" aria-hidden />
              </div>

              <p className="mb-4 text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
                At a glance
              </p>

              <ul className="space-y-3">
                {preview.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-relaxed text-white/85"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-accent"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pointer-events-none absolute -right-8 -bottom-10 size-40 rounded-full bg-accent/20 blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
