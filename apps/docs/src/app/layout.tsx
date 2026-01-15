import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import { DocsHeader } from "@/components/docs/docs-header";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const _geist = Geist({ subsets: ["latin", "cyrillic"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Documentation | Bun Turbo Starter",
    template: "%s | Bun Turbo Starter",
  },
  description:
    "Complete documentation for Bun Turbo Starter - A blazingly fast, production-ready monorepo starter",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <span
              className="fixed inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to bottom, rgba(59, 130, 246, 0.03), rgba(96, 165, 250, 0.08)), url("https://mintlify.s3.us-west-1.amazonaws.com/dub/images/background.png")',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right top",
                backgroundAttachment: "fixed",
              }}
            />
            <DocsHeader />
            <div className="mx-auto flex max-w-7xl">
              <DocsSidebar />
              <main className="flex-1 px-4 py-8 md:px-8 lg:px-12">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
