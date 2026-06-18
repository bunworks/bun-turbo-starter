import { Skeleton } from "@acme/ui";

export default function SettingsLoading() {
  return (
    <div className="space-y-6 p-10 pb-16 max-w-5xl">
      {/* Header */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-32 rounded-md" />
        <Skeleton className="h-4 w-80 rounded-md" />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar skeleton */}
        <aside className="lg:w-[240px] shrink-0">
          <div className="rounded-lg border p-2 flex flex-col gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
              <Skeleton key={i} className="h-9 w-full rounded-md" />
            ))}
          </div>
        </aside>

        {/* Form skeleton */}
        <div className="flex-1 rounded-lg border p-6 space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
          <Skeleton className="h-10 w-28 rounded-md mt-2" />
        </div>
      </div>
    </div>
  );
}
