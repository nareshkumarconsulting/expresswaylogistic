"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Typography } from "@/components/atoms/typography";
import { Button } from "@/components/atoms/button";
import { ServiceCard } from "@/components/molecules/service-card";
import { SERVICES } from "@/constants/services";

export function ServicesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="services" className="relative bg-surface py-section">
      <div className="absolute top-0 left-0 z-0 h-1/2 w-full bg-primary" />
      <div className="container-page relative z-10">
        <div className="mb-16 text-center">
          <Typography variant="eyebrow" className="mb-3">
            Our Services
          </Typography>
          <Typography variant="h2" className="text-white">
            Complete Logistics &amp; EXIM Solutions
          </Typography>
        </div>

        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((service) => (
            <motion.div
              key={service.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <ServiceCard
                title={service.title}
                description={service.description}
                icon={service.icon}
                href={service.href}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline" rounded="none" className="bg-card">
            <Link href="/services">
              View all services
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
