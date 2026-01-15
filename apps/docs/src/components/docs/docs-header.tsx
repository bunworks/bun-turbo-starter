"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { docsConfig } from "@/lib/docs-config";
import { cn } from "@/lib/utils";
import { DocsSearch } from "./docs-search";

export function DocsHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                B
              </span>
            </div>
            <span className="hidden font-semibold sm:inline-block">
              Bun Turbo Starter
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/"
              className={cn(
                "relative px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/" ||
                  (pathname.startsWith("/") &&
                    !pathname.startsWith("/deployment"))
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Documentation
              {pathname === "/" ||
                (pathname.startsWith("/") &&
                  !pathname.startsWith("/deployment") && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary" />
                  ))}
            </Link>
            <Link
              href="/deployment/vercel"
              className={cn(
                "relative px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/deployment")
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Deployment
              {pathname.startsWith("/deployment") && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary" />
              )}
            </Link>
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden lg:block">
            <DocsSearch />
          </div>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="hidden md:inline-flex"
            asChild
          >
            <Link
              href="https://github.com/bunworks/bun-turbo-starter"
              target="_blank"
            >
              GitHub
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border md:hidden">
          <div className="p-4 border-b border-border">
            <DocsSearch />
          </div>
          <nav className="flex flex-col p-4 max-h-[60vh] overflow-y-auto">
            {docsConfig.sidebarNav.map((section, index) => (
              <div key={index} className="py-2">
                <h4 className="mb-1 text-sm font-semibold text-foreground">
                  {section.title}
                </h4>
                <div className="flex flex-col gap-1">
                  {section.items?.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      href={item.href || "#"}
                      className={cn(
                        "py-1.5 text-sm",
                        pathname === item.href
                          ? "text-primary font-medium"
                          : "text-muted-foreground",
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
