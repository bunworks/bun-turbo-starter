import { GalleryVerticalEnd } from "lucide-react";
import type { Metadata } from "next";
import { ForgotPasswordForm } from "~/components/auth";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" aria-label="Company logo" />
          </div>
          Acme Inc.
        </a>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
