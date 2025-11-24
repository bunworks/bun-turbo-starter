import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getSession } from "~/auth/server";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  // If user is already authenticated, redirect to dashboard
  if (session?.user) {
    redirect("/");
  }

  return <>{children}</>;
}
