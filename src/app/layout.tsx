import type { Metadata } from "next";
import { LenisProvider } from "@/registry/lib/lenis-provider";
import "./globals.css";

// Deliberately not using next/font/google here — a starter template
// shouldn't have a hard build-time dependency on fetching from Google Fonts.
// Swap in next/font/local with a licensed font file, or next/font/google if
// your build environment has normal network access, whenever you're ready.

export const metadata: Metadata = {
  title: "Claude Agency System — Module Library",
  description: "A numbered, animated component library and starter kit for composing marketing sites with Claude Code.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
