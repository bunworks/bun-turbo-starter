"use client";

import { APP_CONFIG, paths } from "@acme/config";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@acme/ui";
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import type * as React from "react";
import {
  NavDocuments,
  NavMain,
  NavSecondary,
  NavUser,
} from "~/components/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: paths.dashboard.root,
      icon: IconDashboard,
      isActive: true,
      items: [
        { title: "Overview", url: paths.dashboard.root },
        { title: "Analytics", url: "#" },
        { title: "Reports", url: "#" },
      ],
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: IconListDetails,
      items: [
        { title: "Active", url: "#" },
        { title: "Archived", url: "#" },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
      items: [
        { title: "Overview", url: "#" },
        { title: "Trends", url: "#" },
      ],
    },
    {
      title: "Projects",
      url: "#",
      icon: IconFolder,
      items: [
        { title: "Active Projects", url: "#" },
        { title: "Archived", url: "#" },
      ],
    },
    {
      title: "Team",
      url: "#",
      icon: IconUsers,
      items: [
        { title: "Members", url: "#" },
        { title: "Roles", url: "#" },
      ],
    },
  ],
  navSecondary: [
    { title: "Settings", url: paths.settings.root, icon: IconSettings },
    { title: "Get Help", url: "#", icon: IconHelp },
    { title: "Search", url: "#", icon: IconSearch },
  ],
  documents: [
    { name: "Data Library", url: "#", icon: IconDatabase },
    { name: "Reports", url: "#", icon: IconReport },
    { name: "Word Assistant", url: "#", icon: IconFileWord },
  ],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string; avatar: string };
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<a href={paths.dashboard.root} />}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <IconInnerShadowTop className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {APP_CONFIG.name}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
