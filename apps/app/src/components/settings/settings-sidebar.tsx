"use client";

import { paths } from "@acme/config";
import { cn } from "@acme/ui";
import { Circle, KeyRound, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarNavItems = [
  {
    title: "Профиль",
    href: paths.settings.profile,
    icon: User,
  },
  {
    title: "Аккаунт",
    href: paths.settings.root,
    icon: Circle,
  },
  {
    title: "Безопасность",
    href: paths.settings.security,
    icon: KeyRound,
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
