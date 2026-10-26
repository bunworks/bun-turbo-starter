import { paths } from "@acme/config";
import { redirect } from "next/navigation";
import { type ReactNode, Suspense } from "react";

import { getSession } from "~/auth/server";

/**
 * Auth pages are static (prerendered); the "already signed in" check reads
 * the session at request time, so it streams in behind its own boundary
 * instead of holding the forms back.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      {children}
    </>
  );
}

async function RedirectIfSignedIn() {
  const session = await getSession();
  if (session?.user) redirect(paths.dashboard.root);
  return null;
}
