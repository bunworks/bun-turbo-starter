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
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="text-muted-foreground">
        Manage your account settings and set e-mail preferences.
      </p>
    </>
  );
}
