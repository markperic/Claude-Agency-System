import { Archivo_Black } from "next/font/google";

/**
 * Heavy display face for the Showcase scroll-effect modules (78, 79) only —
 * not applied site-wide, per MODULE-LIBRARY.md's "one signature moment, not
 * a global swap." Archivo Black is a free placeholder standing in for a
 * licensed Adobe Fonts family (Grtsk Variable / Bite Stencil / Gunter) —
 * swap the import below for the real kit once it's wired in; every module
 * that uses `displayFont.className` picks up the change automatically.
 */
export const displayFont = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
