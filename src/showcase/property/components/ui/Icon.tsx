import type { SVGProps } from "react";

export type IconName =
  | "arrow"
  | "user"
  | "phone"
  | "calendar"
  | "home"
  | "plus"
  | "star"
  | "close"
  | "play"
  | "pause"
  | "social-a"
  | "social-b";

const PATHS: Record<IconName, React.ReactNode> = {
  arrow: <path d="M3 21 21 3M6 3h15v15" fill="none" stroke="currentColor" strokeWidth="1.6" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  phone: (
    <path
      d="M6 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 10h18M8 3v4M16 3v4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  home: <path d="M3 11 12 3l9 8v10h-6v-6H9v6H3z" fill="currentColor" />,
  plus: <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.6" />,
  star: <path d="m12 2 3.1 6.6 7.1.9-5.2 5 1.3 7.1L12 18.1 5.7 21.6 7 14.5l-5.2-5 7.1-.9z" fill="currentColor" />,
  close: <path d="M5 5l14 14M19 5 5 19" fill="none" stroke="currentColor" strokeWidth="1.6" />,
  play: <path d="M7 4v16l13-8z" fill="currentColor" />,
  pause: <path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor" />,
  "social-a": (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  "social-b": (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13 21v-9m0 0V9.5A2.5 2.5 0 0 1 15.5 7H17m-4 5h-3m3 0h3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
};

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      {PATHS[name]}
    </svg>
  );
}
