"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { docsConfig } from "@/lib/docs-config";
import { cn } from "@/lib/utils";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 border-r border-border md:sticky md:block">
      <div className="h-full overflow-y-auto py-6 pr-6 pl-4">
        <nav className="flex flex-col gap-6">
          {docsConfig.sidebarNav.map((section) => (
            <SidebarSection
              key={section.title}
              section={section}
              pathname={pathname}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}

function SidebarSection({
  section,
  pathname,
}: {
  section: (typeof docsConfig.sidebarNav)[0];
  pathname: string;
}) {
  const isActiveSection = section.items?.some((item) => pathname === item.href);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (isActiveSection) {
      setIsOpen(true);
    }
  }, [isActiveSection]);

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1 text-sm font-semibold transition-colors",
          isActiveSection
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            isOpen && "rotate-90",
          )}
        />
        {section.title}
      </button>
      <div
        className={cn(
          "ml-4 flex flex-col gap-0.5 border-l border-border pl-3 overflow-hidden transition-all duration-200",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {section.items?.map((item) => (
          <Link
            key={item.href || item.title}
            href={item.href || "#"}
            className={cn(
              "relative text-sm py-1.5 transition-colors hover:text-foreground",
              pathname === item.href
                ? "text-primary font-medium before:absolute before:-left-3 before:top-0 before:h-full before:w-0.5 before:bg-primary"
                : "text-muted-foreground",
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
