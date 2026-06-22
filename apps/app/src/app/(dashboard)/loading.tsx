import { Skeleton } from "@acme/ui";

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* SectionCards skeleton */}
          <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>

          {/* Chart skeleton */}
          <div className="px-4 lg:px-6">
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>

          {/* Table skeleton */}
          <div className="px-4 lg:px-6">
            <Skeleton className="h-8 w-48 mb-4 rounded-md" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
