"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface TocItem {
  id: string
  title: string
  level: number
}

export function DocsMobileToc({ items }: { items: TocItem[] }) {
  const [isOpen, setIsOpen] = useState(false)

  if (items.length === 0) return null

  return (
    <div className="mb-6 rounded-lg border border-border lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium"
      >
        <span>На этой странице</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="border-t border-border px-4 py-3">
          <nav className="flex flex-col gap-2">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-sm text-muted-foreground hover:text-foreground transition-colors",
                  item.level === 3 && "pl-4",
                )}
              >
                {item.title}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
