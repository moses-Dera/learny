import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// ─── Typography ─────────────────────────────────────────────────────────────
// Inter is the primary typeface. Loaded via Next.js optimization.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Learny | The Smarter Way to Learn & Teach Online",
  description:
    "Join 10,000+ learners accessing world-class courses with paywall-protected video, progress tracking, and verified certificates.",
};

import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { VisibilityWrapper } from "@/components/layout/visibility-wrapper";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // dark mode by default as per the design system rules
    <html lang="en" className={cn("dark", "antialiased", inter.variable, "font-sans")}>
      <body className="min-h-[100dvh] flex flex-col bg-background text-foreground">
        <VisibilityWrapper>
          <SiteHeader />
        </VisibilityWrapper>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <VisibilityWrapper>
          <SiteFooter />
        </VisibilityWrapper>
        <Toaster />
      </body>
    </html>
  );
}
