import { createJiti } from "jiti";
import type { NextConfig } from "next";

/**
 * Security headers applied to every response.
 *
 * The Content-Security-Policy is a pragmatic baseline that works with the
 * Next.js App Router and Vercel Analytics out of the box. For the strictest
 * setup, switch to a nonce-based CSP in `proxy.ts` and drop `'unsafe-inline'`.
 * @see https://nextjs.org/docs/app/guides/content-security-policy
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
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
  const jiti = createJiti(import.meta.url);

  // Import env files to validate at build time. Use jiti so we can load .ts files in here.
  await jiti.import("./src/env");

  const config: NextConfig = {
    /** Enables hot reloading for local packages without a build step */
    output: "standalone",
    transpilePackages: [
      "@acme/api",
      "@acme/auth",
      "@acme/config",
      "@acme/db",
      "@acme/ui",
      "@acme/validators",
    ],

    /** We already do linting and typechecking as separate tasks in CI */
    typescript: { ignoreBuildErrors: true },

    async headers() {
      return [{ source: "/:path*", headers: securityHeaders }];
    },
  };

  return config;
}
