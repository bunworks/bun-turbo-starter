"use client";

import { Button } from "@acme/ui";
import { useEffect } from "react";

export default function SettingsError({
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
    <div className="space-y-6 p-10 pb-16 max-w-5xl">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>

      <div className="flex items-center justify-center rounded-lg border p-16">
        <div className="text-center space-y-3">
          <h2 className="text-lg font-semibold">Failed to load settings</h2>
          <p className="text-muted-foreground text-sm max-w-sm">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
          {error.digest && (
            <p className="text-muted-foreground/60 font-mono text-xs">
              Error ID:&nbsp;{error.digest}
            </p>
          )}
          <Button onClick={reset} variant="outline" size="sm">
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
