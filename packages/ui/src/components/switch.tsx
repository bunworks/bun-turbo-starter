"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from ".";

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent outline-none transition-all after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 data-[checked]:bg-primary data-[unchecked]:bg-input data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[size=default]:h-5 data-[size=default]:w-9 data-[size=sm]:h-[14px] data-[size=sm]:w-6 dark:data-[unchecked]:bg-input/80",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-background ring-0 transition-transform dark:data-[checked]:bg-primary-foreground dark:data-[unchecked]:bg-foreground group-data-[size=default]/switch:size-4 group-data-[size=default]/switch:data-[checked]:translate-x-4 group-data-[size=default]/switch:data-[unchecked]:translate-x-0.5 group-data-[size=sm]/switch:size-2.5 group-data-[size=sm]/switch:data-[checked]:translate-x-3 group-data-[size=sm]/switch:data-[unchecked]:translate-x-0.5"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
