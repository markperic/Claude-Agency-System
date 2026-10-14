import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { Header } from "@/showcase/property/components/layout/Header";
import { SmoothScroll } from "@/showcase/property/components/providers/SmoothScroll";
import { header, site } from "@/showcase/property/content";
import "./property.css";

/**
 * Root layout for the "Property" showcase example.
 *
 * It is its own root layout (its own <html>) rather than part of the main
 * site's: the template is built on a different Tailwind theme (1 spacing unit
 * = 0.1rem, custom breakpoints, a fluid root font size) that would break the
 * rest of the site if the two stylesheets ever loaded together. Separate root
 * layouts keep them apart entirely.
 */
const grotesk = Hanken_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  // Variable font: every weight from 100 to 900 is available.
  weight: "variable",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  // The showcase is a private link for clients, not part of the public site.
  robots: { index: false, follow: false },
};

export default function PropertyLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.lang} className={`${grotesk.variable} antialiased`}>
      <body>
        <SmoothScroll>
          <Header content={header} />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
