import { SidebarInset, SidebarProvider } from "@acme/ui";
import type { ReactNode } from "react";
import { getSession } from "~/auth/server";
import { AppSidebar } from "~/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) {
    return <>{children}</>;
  }
  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          avatar: session.user.image || "",
        }}
      />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
