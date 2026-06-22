"use client";

import { Button } from "@acme/ui";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // biome-ignore lint/suspicious/noConsole: Error boundary logging
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">
          Something went wrong
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        {error.digest && (
          <p className="text-muted-foreground/60 font-mono text-xs">
            Error ID:&nbsp;{error.digest}
          </p>
        )}
      </div>
      <Button onClick={reset} variant="outline" size="sm">
        Try again
      </Button>
    </div>
  );
}
