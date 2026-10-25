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
      title: "Панель управления",
      url: paths.dashboard.root,
      icon: IconDashboard,
      isActive: true,
      items: [
        { title: "Обзор", url: paths.dashboard.root },
        { title: "Аналитика", url: "#" },
        { title: "Отчёты", url: "#" },
      ],
    },
    {
      title: "Жизненный цикл",
      url: "#",
      icon: IconListDetails,
      items: [
        { title: "Активные", url: "#" },
        { title: "Архив", url: "#" },
      ],
    },
    {
      title: "Аналитика",
      url: "#",
      icon: IconChartBar,
      items: [
        { title: "Обзор", url: "#" },
        { title: "Тренды", url: "#" },
      ],
    },
    {
      title: "Проекты",
      url: "#",
      icon: IconFolder,
      items: [
        { title: "Активные проекты", url: "#" },
        { title: "Архив", url: "#" },
      ],
    },
    {
      title: "Команда",
      url: "#",
      icon: IconUsers,
      items: [
        { title: "Участники", url: "#" },
        { title: "Роли", url: "#" },
      ],
    },
  ],
  navSecondary: [
    { title: "Настройки", url: paths.settings.root, icon: IconSettings },
  ],
  documents: [
    { name: "Библиотека данных", url: "#", icon: IconDatabase },
    { name: "Отчёты", url: "#", icon: IconReport },
    { name: "Помощник по Word", url: "#", icon: IconFileWord },
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
