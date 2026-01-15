import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { cn } from "@/lib/utils";

interface DocsCardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  className?: string;
  external?: boolean;
}

export function DocsCard({
  title,
  description,
  href,
  icon,
  className,
  external,
}: DocsCardProps) {
  const isExternal = external || href.startsWith("http");

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "group flex flex-col gap-2 rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 !no-underline",
        className,
      )}
    >
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
          {icon}
        </div>
      )}
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {isExternal ? (
          <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100" />
        ) : (
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
        )}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </Link>
  );
}
