"use client";

import { paths } from "@acme/config";
import { cn } from "@acme/ui";
import { Bell, Circle, Globe, Monitor, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarNavItems = [
  {
    title: "Profile",
    href: paths.settings.profile,
    icon: User,
  },
  {
    title: "Account",
    href: paths.settings.root,
    icon: Circle,
  },
  {
    title: "Appearance",
    href: paths.settings.appearance,
    icon: Globe,
  },
  {
    title: "Notifications",
    href: paths.settings.notifications,
    icon: Bell,
  },
  {
    title: "Display",
    href: paths.settings.display,
    icon: Monitor,
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-1">
      {sidebarNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
            pathname === item.href
              ? "bg-accent text-foreground"
              : "text-foreground",
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
