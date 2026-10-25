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
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">
          Что-то пошло не так
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          {error.message ||
            "Произошла непредвиденная ошибка. Попробуйте ещё раз."}
        </p>
        {error.digest && (
          <p className="text-muted-foreground/60 font-mono text-xs">
            ID ошибки:&nbsp;{error.digest}
          </p>
        )}
      </div>
      <Button onClick={reset} variant="outline" size="sm">
        Повторить
      </Button>
    </div>
  );
}
