"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

// Lightweight toast implementation without Radix dependency
// Uses sonner under the hood if available, otherwise falls back to a simple state-based approach

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type ToastProps = React.ComponentProps<"li"> &
  VariantProps<typeof toastVariants> & {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  };

type ToastActionElement = React.ReactElement<typeof ToastAction>;

function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function ToastViewport({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      className={cn(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        className,
      )}
      {...props}
    />
  );
}

function Toast({ className, variant, ...props }: ToastProps) {
  return (
    <li className={cn(toastVariants({ variant }), className)} {...props} />
  );
}

function ToastAction({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
        className,
      )}
      {...props}
    />
  );
}

function ToastClose({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
        className,
      )}
      {...props}
    >
      <X className="h-4 w-4" />
    </button>
  );
}

function ToastTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("text-sm font-semibold", className)} {...props} />;
}

function ToastDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("text-sm opacity-90", className)} {...props} />;
}

export {
  Toast,
  ToastAction,
  type ToastActionElement,
  ToastClose,
  ToastDescription,
  type ToastProps,
  ToastProvider,
  ToastTitle,
  ToastViewport,
};
