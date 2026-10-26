import { Skeleton } from "@acme/ui";
import { Frame, FramePanel } from "@acme/ui/reui/frame";

import type { ReactNode } from "react";

/**
 * Shared layout for the settings pages and their loading state: a header,
 * a navigation panel and a content panel, both ReUI frames.
 */
export function SettingsShell({
  header,
  sidebar,
  children,
}: {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex max-w-5xl flex-col gap-6 p-10 pb-16">
      <div className="flex flex-col gap-1">{header}</div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="shrink-0 lg:w-60">
          <Frame spacing="xs">
            <FramePanel>{sidebar}</FramePanel>
          </Frame>
        </aside>
        <Frame className="flex-1">
          <FramePanel>{children}</FramePanel>
        </Frame>
      </div>
    </div>
  );
}

export function SettingsHeader() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Настройки</h1>
      <p className="text-muted-foreground">
        Управляйте настройками аккаунта и параметрами уведомлений по почте.
      </p>
    </>
  );
}

/** Placeholder for a settings form while its data streams in. */
export function SettingsFormSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {["a", "b", "c"].map((key) => (
        <div key={key} className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
      <Skeleton className="mt-2 h-10 w-28 rounded-md" />
    </div>
  );
}
