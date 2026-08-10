"use client";

import { useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { logger } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("app.error", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="max-w-md text-slate-600">
          An unexpected error occurred. You can try again or return later.
        </p>
        <Button onClick={reset}>Try again</Button>
      </body>
    </html>
  );
}
