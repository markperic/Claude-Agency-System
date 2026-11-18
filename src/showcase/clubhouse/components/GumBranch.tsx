/** Hand-drawn style eucalyptus branch with gumnuts. Decorative only. */
const leaves: [number, number, number, number][] = [
  [40, 470, -120, 1.05],
  [70, 410, -40, 1.1],
  [105, 350, -135, 1],
  [135, 300, -30, 1.15],
  [175, 245, -150, 0.95],
  [205, 200, -45, 1.05],
  [250, 150, -160, 0.9],
  [280, 115, -60, 0.95],
  [325, 80, -20, 0.85],
];

function Leaf() {
  return (
    <>
      <path d="M0 0 C 26 -16, 76 -22, 122 -8 C 80 6, 30 10, 0 0 Z" />
      <path d="M3 0 C 42 -6, 82 -10, 118 -8" strokeWidth="0.9" />
      <path d="M30 -3 l 12 -9 M55 -6 l 12 -9 M80 -8 l 11 -7 M38 -3 l 13 7 M64 -6 l 12 7" strokeWidth="0.6" />
    </>
  );
}

function Nut() {
  return (
    <>
      <path d="M0 0 C -9 2, -10 16, 0 20 C 10 16, 9 2, 0 0 Z" />
      <path d="M-7 3 C -3 6, 3 6, 7 3" strokeWidth="0.8" />
      <path d="M0 0 v -10" />
    </>
  );
}

export function GumBranch({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 420 520"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`pointer-events-none select-none ${flip ? "-scale-x-100" : ""} ${className}`}
    >
      <path d="M20 515 C 60 430, 110 330, 180 240 C 230 175, 290 110, 370 55" strokeWidth="1.6" />
      {leaves.map(([x, y, r, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          <Leaf />
        </g>
      ))}
      <path d="M232 178 C 250 186, 262 200, 268 214" strokeWidth="1" />
      <g transform="translate(262 222) rotate(-10)"><Nut /></g>
      <g transform="translate(280 214) rotate(18)"><Nut /></g>
      <g transform="translate(270 238) rotate(4)"><Nut /></g>
    </svg>
  );
}
