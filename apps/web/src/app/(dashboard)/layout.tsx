import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getSession } from "~/auth/server";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return <>{children}</>;
}
