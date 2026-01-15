"use client";

import { ArrowRight, FileText, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { docsConfig } from "@/lib/docs-config";

interface SearchResult {
  title: string;
  href: string;
  section: string;
}

export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Collect all pages for search
  const allPages: SearchResult[] = docsConfig.sidebarNav.flatMap((section) =>
    (section.items || []).map((item) => ({
      title: item.title,
      href: item.href || "#",
      section: section.title,
    })),
  );

  const filteredResults = query
    ? allPages.filter(
        (page) =>
          page.title.toLowerCase().includes(query.toLowerCase()) ||
          page.section.toLowerCase().includes(query.toLowerCase()),
      )
    : allPages.slice(0, 6);

  const handleSelect = (href: string) => {
    router.push(href);
    setOpen(false);
    setQuery("");
  };

  // Hotkey ⌘K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative flex h-9 w-full items-center rounded-md border border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 lg:w-64"
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search...</span>
        <kbd className="pointer-events-none absolute right-2 hidden select-none rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:block">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 p-0 sm:max-w-xl">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documentation..."
              className="h-12 border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2">
            {filteredResults.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">
                No results found for "{query}"
              </p>
            ) : (
              <div className="flex flex-col gap-1">
                {filteredResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(result.href)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium text-foreground">
                        {result.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {result.section}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
