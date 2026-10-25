import { Skeleton } from "@acme/ui";

import { SettingsShell } from "~/components/settings/settings-shell";

export default function SettingsLoading() {
  return (
    <SettingsShell
      header={
        <>
          <Skeleton className="h-8 w-32 rounded-md" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </>
      }
      sidebar={
        <div className="flex flex-col gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
            <Skeleton key={i} className="h-9 w-full rounded-md" />
          ))}
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
        <Skeleton className="mt-2 h-10 w-28 rounded-md" />
      </div>
    </SettingsShell>
  );
}
