"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Typography } from "@/components/atoms/typography";
import { Button } from "@/components/atoms/button";
import { ABOUT_HIGHLIGHTS } from "@/constants/content";
import { siteConfig } from "@/config/site";

export function AboutSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="overflow-hidden bg-background py-section">
      <div className="container-page">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/operations-center.jpg"
                alt="ExpressWay Logistic operations center"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
            </div>
            <div className="absolute -right-6 -bottom-6 hidden bg-primary p-8 text-white md:block">
              <div className="text-stat mb-2 text-accent">32+</div>
              <div className="text-lg font-medium leading-tight">
                Years of
                <br />
                Excellence
              </div>
            </div>
          </motion.div>

          <div>
            <Typography variant="eyebrow" className="mb-3">
              About {siteConfig.name}
            </Typography>
            <Typography variant="h2" className="mb-6 text-slate-900">
              Neutral NVOCC.{" "}
              <span className="text-primary">Total Reliability.</span>
            </Typography>
            <Typography variant="lead" className="mb-8 text-slate-600">
              {siteConfig.legalName} is promoted by professionals with 32 years
              in international cargo movement. As a neutral NVOCC, we combine
              professionalism and practical innovation to clear and deliver
              worldwide — with complete logistics, customs, warehousing,
              consolidation, and EXIM guidance for your trade needs.
            </Typography>

            <ul className="mb-8 grid gap-4 sm:grid-cols-2">
              {ABOUT_HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-800">
                  <CheckCircle2 className="size-5 shrink-0 text-accent" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <Button asChild rounded="none">
              <Link href="/about">
                More about us
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
