import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { Typography } from "@/components/atoms/typography";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-surface px-4 py-section text-center">
      <Typography variant="eyebrow" className="text-accent">
        Error 404
      </Typography>
      <Typography variant="h2" className="text-foreground">
        Page not found
      </Typography>
      <Typography variant="lead" className="max-w-md text-muted-foreground">
        This URL does not exist. Use a service, route or quote page instead of
        guessing paths.
      </Typography>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <Button asChild rounded="none">
          <Link href="/">Home</Link>
        </Button>
        <Button asChild variant="outline" rounded="none">
          <Link href="/services">Services</Link>
        </Button>
        <Button asChild variant="outline" rounded="none">
          <Link href="/pan-india-logistics">PAN India</Link>
        </Button>
        <Button asChild variant="outline" rounded="none">
          <Link href="/shipping-routes">Routes</Link>
        </Button>
        <Button asChild variant="outline" rounded="none">
          <Link href="/quote">Get a Quote</Link>
        </Button>
      </div>
    </div>
  );
}
