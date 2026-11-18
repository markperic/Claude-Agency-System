/**
 * Named colour fields for chapters/statements (Atmos-style colour sections),
 * ported from the client project's brand palette.
 */
export const PALETTE = {
  paddock: { name: "Paddock Green", bg: "#23452f", fg: "#f4ede2", accent: "#d4c06a", muted: "rgba(244,237,226,0.55)" },
  clay: { name: "Clubhouse Clay", bg: "#9a4a2c", fg: "#f7e8da", accent: "#f2c49f", muted: "rgba(247,232,218,0.6)" },
  gold: { name: "Kick-off Gold", bg: "#c4ab45", fg: "#142319", accent: "#23452f", muted: "rgba(20,35,25,0.55)" },
  eucalyptus: { name: "Eucalyptus", bg: "#a7bca3", fg: "#142319", accent: "#7a3d24", muted: "rgba(20,35,25,0.55)" },
  night: { name: "Floodlight Night", bg: "#0f1d15", fg: "#f4ede2", accent: "#d4c06a", muted: "rgba(244,237,226,0.5)" },
  sand: { name: "Sand", bg: "#e9dfcd", fg: "#1c3326", accent: "#9a4a2c", muted: "rgba(28,51,38,0.5)" },
  cream: { name: "Cream", bg: "#f4ede2", fg: "#1c3326", accent: "#b19b32", muted: "rgba(28,51,38,0.45)" },
} as const;

export type PaletteKey = keyof typeof PALETTE;

export function colour(key?: string) {
  return PALETTE[(key as PaletteKey) ?? "paddock"] ?? PALETTE.paddock;
}
