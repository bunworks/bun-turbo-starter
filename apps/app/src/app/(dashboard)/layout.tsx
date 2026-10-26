import { paths } from "@acme/config";
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  Skeleton,
} from "@acme/ui";
import { redirect } from "next/navigation";
import { type ReactNode, Suspense } from "react";
import { getSession } from "~/auth/server";
import { AppSidebar } from "~/components/sidebar";

/**
 * The shell (sidebar frame, page slot) is static and prerendered; only the
 * session-dependent sidebar streams in. Reading the session at the layout's
 * top level would hold every dashboard page behind the request.
 * @see https://nextjs.org/docs/app/guides/authentication-with-cache-components
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Suspense fallback={<SidebarSkeleton />}>
        <SessionSidebar />
      </Suspense>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

async function SessionSidebar() {
  const session = await getSession();
  // proxy.ts already redirects without a session cookie; this enforces it.
  if (!session?.user) redirect(paths.auth.login);

  return (
    <AppSidebar
      user={{
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.image || "",
      }}
    />
  );
}

// Fixed widths: shadcn's SidebarMenuSkeleton uses Math.random(), which can't
// be part of the prerendered static shell.
function SidebarSkeleton() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="gap-2 p-2">
        {["70%", "55%", "80%", "60%"].map((width) => (
          <div key={width} className="flex h-8 items-center gap-2 px-2">
            <Skeleton className="size-4 rounded-md" />
            <Skeleton className="h-4" style={{ width }} />
          </div>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
