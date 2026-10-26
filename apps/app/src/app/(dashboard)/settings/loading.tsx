import { Skeleton } from "@acme/ui";

import {
  SettingsFormSkeleton,
  SettingsShell,
} from "~/components/settings/settings-shell";

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
      <SettingsFormSkeleton />
    </SettingsShell>
  );
}
