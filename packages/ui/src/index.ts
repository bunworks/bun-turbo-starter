import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs));

// Export all components
export * from "./button";
export * from "./card";
export * from "./dropdown-menu";
export * from "./field";
export * from "./input";
export * from "./input-otp";
export * from "./label";
export * from "./separator";
export * from "./textarea";
export * from "./theme";
export * from "./toast";
