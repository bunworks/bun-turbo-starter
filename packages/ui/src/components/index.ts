import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs));

// Export all components
export * from "./avatar";
export * from "./badge";
export * from "./button";
export * from "./card";
export * from "./chart";
export * from "./checkbox";
export * from "./drawer";
export * from "./dropdown-menu";
export * from "./field";
export * from "./input";
export * from "./input-otp";
export * from "./label";
export * from "./select";
export * from "./separator";
export * from "./sidebar";
export * from "./table";
export * from "./tabs";
export * from "./textarea";
export * from "./theme";
export * from "./toast";
export * from "./toggle";
export * from "./toggle-group";
export * from "./tooltip";
