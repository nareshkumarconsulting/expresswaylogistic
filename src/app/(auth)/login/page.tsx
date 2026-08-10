import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BrandLogo } from "@/components/atoms/brand-logo";
import { Typography } from "@/components/atoms/typography";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md border border-border bg-card p-8 shadow-md">
        <div className="mb-8">
          <BrandLogo tone="dark" size="md" />
        </div>
        <Typography variant="h3" className="mb-2 text-foreground">
          Command Center Sign in
        </Typography>
        <Typography variant="muted" className="mb-6 text-muted-foreground">
          Restricted operations access for ExpressWay Logistic staff.
        </Typography>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-semibold text-accent hover:underline">
            Back to website
          </Link>
        </p>
      </div>
    </main>
  );
}
