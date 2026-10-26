import type { NextConfig } from "next";

import "./src/env";

/**
 * Security headers applied to every response.
 *
 * The Content-Security-Policy is a pragmatic baseline that works with the
 * Next.js App Router and Vercel Analytics out of the box. For the strictest
 * setup, switch to a nonce-based CSP in `proxy.ts` and drop `'unsafe-inline'`.
 * @see https://nextjs.org/docs/app/guides/content-security-policy
 */
const isDev = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
]
  .join("; ")
  .concat(";");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

export default async function createNextConfig(): Promise<NextConfig> {
  const config: NextConfig = {
    output: "standalone",
    /**
     * Workspace packages consumed as TypeScript source (`exports` → src/).
     * Packages that ship a built `dist/` (@acme/config, @acme/emails,
     * @acme/storage) don't belong here.
     */
    transpilePackages: [
      "@acme/api",
      "@acme/auth",
      "@acme/db",
      "@acme/jobs",
      "@acme/ui",
      "@acme/validators",
    ],
    /** `Link href` / `router.push` are checked against the app's routes. */
    typedRoutes: true,
    /** Automatic memoization; no hand-written useMemo/useCallback needed. */
    reactCompiler: true,
    /**
     * Partial Prerendering: each route gets a static shell; request-time
     * reads (session, headers) stream in behind <Suspense>. Cache with
     * "use cache" instead of route segment configs (`dynamic`, `revalidate`).
     * @see https://nextjs.org/docs/app/guides/authentication-with-cache-components
     */
    cacheComponents: true,
    partialPrefetching: true,

    async headers() {
      return [{ source: "/:path*", headers: securityHeaders }];
    },
  };

  return config;
}
