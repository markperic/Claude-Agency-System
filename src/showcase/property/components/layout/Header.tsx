"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { HeaderContent } from "@/showcase/property/content";
import { Icon } from "@/showcase/property/components/ui/Icon";
import { Logo } from "@/showcase/property/components/ui/Logo";
import { Media } from "@/showcase/property/components/ui/Media";
import { gsap, ScrollTrigger } from "@/showcase/property/lib/gsap";

// Past this scroll position the header leaves the page flow and becomes a
// fixed compact pill (desktop) / menu button (mobile). Measured: switches
// between 1500 and 1510px at both 1440 and 390.
const STICKY_AT = 1500;

function HeaderLogo({ logo, className = "" }: { logo: HeaderContent["logo"]; className?: string }) {
  return (
    <Link href={logo.href} className={`flex h-90 w-90 items-center ${className}`}>
      <Logo title={logo.label} className="w-full" />
    </Link>
  );
}

const chevron = "size-[1.13rem] rotate-45 border-b border-r border-current";

export function Header({ content }: { content: HeaderContent }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: STICKY_AT + 1,
      end: "max",
      onToggle: (self) => setSticky(self.isActive),
    });
    return () => trigger.kill();
  }, []);

  // Fixed header drops in from above (≈0.5s ease-out, sampled from the reference).
  useEffect(() => {
    const el = headerRef.current;
    if (!el || !sticky) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(el, { yPercent: -100 }, { yPercent: 0, duration: 0.5, ease: "power3.out", clearProps: "transform" });
    return () => {
      tween.kill();
      gsap.set(el, { clearProps: "transform" });
    };
  }, [sticky]);
  const { logo, links, dropdown, account, cta, menuLabel, closeLabel } = content;

  return (
    <header
      ref={headerRef}
      data-sticky={sticky}
      className="group/h absolute inset-x-0 top-0 z-90 flex pt-20 text-paper data-[sticky=true]:fixed data-[sticky=true]:justify-end desk:data-[sticky=true]:justify-center desk:data-[sticky=true]:text-ink-alt"
    >
      <div className="relative z-2 flex h-header w-full items-start justify-end px-20 desk:justify-between group-data-[sticky=true]/h:h-60 group-data-[sticky=true]/h:w-auto desk:items-center desk:px-30 desk:group-data-[sticky=true]/h:h-52 desk:group-data-[sticky=true]/h:rounded-[6rem] desk:group-data-[sticky=true]/h:border desk:group-data-[sticky=true]/h:border-black/5 desk:group-data-[sticky=true]/h:bg-paper desk:group-data-[sticky=true]/h:py-5 desk:group-data-[sticky=true]/h:pl-20 desk:group-data-[sticky=true]/h:pr-5">
        {/* On mobile the hero carries the logo, so the bar shows only the menu button. */}
        <HeaderLogo logo={logo} className="max-desk:hidden group-data-[sticky=true]/h:hidden" />
        <Link href={logo.href} aria-label={logo.label} className="mr-30 hidden desk:group-data-[sticky=true]/h:block">
          <Icon name="home" className="size-14" />
        </Link>

        {/* Desktop nav — centred on the bar */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-30 text-nav group-data-[sticky=true]/h:static group-data-[sticky=true]/h:mr-21 group-data-[sticky=true]/h:translate-none group-data-[sticky=true]/h:gap-10 group-data-[sticky=true]/h:text-small group-data-[sticky=true]/h:leading-none desk:flex">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="px-10 py-8">
              {link.label}
            </Link>
          ))}
          <div className="group relative">
            <button type="button" className="flex cursor-pointer items-center gap-10 px-10 py-8">
              <span>{dropdown.label}</span>
              <span className={`${chevron} relative -top-2`} />
            </button>
            <div className="invisible absolute left-1/2 top-full z-10 w-300 -translate-x-1/2 pt-12 opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div className="flex gap-8 rounded-card bg-paper p-8">
                <div className="relative h-112 w-140 overflow-hidden rounded-card">
                  <Media media={dropdown.media} sizes="14rem" />
                </div>
                <ul className="flex flex-1 flex-col justify-center pb-2 pt-6">
                  {dropdown.items.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="flex items-center rounded-[0.4rem] px-8 py-4 text-small text-muted">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-10 group-data-[sticky=true]/h:gap-5 desk:flex">
          <Link
            href={account.href}
            aria-label={account.label}
            className="flex size-60 items-center justify-center rounded-full bg-brand text-cream group-data-[sticky=true]/h:size-40"
          >
            <Icon name={account.icon} className="size-20 group-data-[sticky=true]/h:size-14" />
          </Link>
          <Link
            href={cta.href}
            aria-label={cta.label}
            className="flex items-center gap-15 rounded-pill bg-cream py-5 pl-5 pr-20 group-data-[sticky=true]/h:size-40 group-data-[sticky=true]/h:justify-center group-data-[sticky=true]/h:bg-brand group-data-[sticky=true]/h:p-0"
          >
            <span className="flex size-50 items-center justify-center rounded-full bg-brand text-cream group-data-[sticky=true]/h:size-40 group-data-[sticky=true]/h:bg-transparent">
              <Icon name="calendar" className="size-22 group-data-[sticky=true]/h:size-18" />
            </span>
            <span className="text-body font-medium leading-[1.5] text-ink-alt group-data-[sticky=true]/h:hidden">{cta.label}</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="flex cursor-pointer items-center gap-15 rounded-pill bg-cream py-5 pl-5 pr-20 desk:hidden"
        >
          <span className="flex size-50 flex-col items-center justify-center gap-4 rounded-full bg-brand">
            <span className="h-[1.5px] w-18 rounded-sm bg-paper" />
            <span className="h-[1.5px] w-18 rounded-sm bg-paper" />
            <span className="h-[1.5px] w-18 rounded-sm bg-paper" />
          </span>
          <span className="text-body font-medium leading-none text-ink-alt">{menuLabel}</span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-95 flex flex-col bg-cream text-ink-alt desk:hidden ${menuOpen ? "" : "invisible [clip-path:polygon(0_0,100%_0,100%_0,0_0)]"}`}
      >
        <div className="flex h-120 items-center justify-between p-20">
          <HeaderLogo logo={logo} className="text-brand" />
          <button
            type="button"
            aria-label={closeLabel}
            onClick={() => setMenuOpen(false)}
            className="flex size-70 cursor-pointer items-center justify-center rounded-full bg-brand text-cream"
          >
            <Icon name="close" className="size-22" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col items-center gap-12 px-20 pb-20 pt-[12vh] text-h2 leading-[1.04]">
          {links.map((link) => (
            <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <button type="button" aria-expanded={subOpen} onClick={() => setSubOpen((v) => !v)} className="ml-10 flex cursor-pointer items-center gap-12">
            {dropdown.label}
            <span className="-mt-3 mr-10 size-[1.41rem] rotate-45 border-b-2 border-r-2 border-current" />
          </button>
          {subOpen && (
            <div className="flex flex-col items-center gap-6 text-menu leading-[1.04]">
              {dropdown.items.map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="py-4">
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </nav>
        <div className="flex flex-col gap-10 px-20 pb-30 text-body font-medium leading-[1.5]">
          <Link href={account.href} className="flex h-70 items-center gap-16 rounded-pill bg-brand p-10 text-cream">
            <span className="flex size-50 items-center justify-center rounded-full bg-cream text-brand">
              <Icon name={account.icon} className="size-22" />
            </span>
            <span className="flex-1 pr-50 text-center">{account.label}</span>
          </Link>
          <Link href={cta.href} className="flex h-70 items-center gap-16 rounded-pill bg-paper p-10">
            <span className="flex size-50 items-center justify-center rounded-full bg-brand text-cream">
              <Icon name="calendar" className="size-22" />
            </span>
            <span className="flex-1 pr-50 text-center">{cta.label}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
