import Link from "next/link";
import type { NavLink } from "@/showcase/property/content";
import { Icon } from "./Icon";

type ButtonProps = {
  link: NavLink;
  theme?: "brand" | "paper";
  /** Stretch the label pill to fill the available width. */
  block?: boolean;
};

/** Round arrow badge + label pill, 60 tall. */
export function Button({ link, theme = "brand", block = false }: ButtonProps) {
  const fill = theme === "brand" ? "bg-brand text-cream" : "bg-paper text-ink";
  return (
    <Link href={link.href} className={`relative z-1 flex h-60 items-center pl-55 ${block ? "w-full" : ""}`}>
      <span className={`absolute left-0 top-0 z-10 flex size-60 items-center justify-center rounded-pill ${fill}`}>
        <Icon name="arrow" className="size-15" />
      </span>
      <span className={`flex h-full items-center justify-center rounded-pill ${fill} ${block ? "flex-1" : ""}`}>
        <span className="px-30 text-center text-body font-medium leading-[1.5]">{link.label}</span>
      </span>
    </Link>
  );
}
