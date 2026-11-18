import type { Metadata } from "next";
import { Manrope, Roboto_Slab } from "next/font/google";
import { Header } from "@/showcase/clubhouse/components/Header";
import { LenisProvider } from "@/showcase/clubhouse/components/motion/LenisProvider";
import { PageTransition } from "@/showcase/clubhouse/components/motion/PageTransition";
import { site } from "@/showcase/clubhouse/content";
import "./clubhouse.css";

/**
 * Root layout for the "The Clubhouse" showcase example.
 *
 * It is its own root layout (its own <html>) rather than part of the main
 * site's: the client project's theme tokens (--color-ink, --color-cream) and
 * utility classes (eyebrow, btn, btn-gold) collide by name with the main
 * site's own, with different values — isolating the stylesheet keeps the two
 * apart entirely, the same reason `(property)` has its own root layout.
 */
const slab = Roboto_Slab({ variable: "--font-clubhouse-display", subsets: ["latin"], weight: ["400", "500", "600"] });
const manrope = Manrope({ variable: "--font-clubhouse-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  // The showcase is a private link for clients, not part of the public site.
  robots: { index: false, follow: false },
};

export default function ClubhouseLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.lang} className={`${slab.variable} ${manrope.variable} antialiased`}>
      <body className="min-h-dvh">
        <div id="top" />
        <LenisProvider>
          <PageTransition>
            <Header />
            {children}
          </PageTransition>
        </LenisProvider>
      </body>
    </html>
  );
}
