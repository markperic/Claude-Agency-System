"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroContent } from "@/showcase/property/content";
import { HeroLogo } from "@/showcase/property/components/ui/HeroLogo";
import { Icon } from "@/showcase/property/components/ui/Icon";
import { Media } from "@/showcase/property/components/ui/Media";
import { MOTION_DESKTOP, MOTION_MOBILE, useStickyProgress } from "@/showcase/property/hooks/useStickyProgress";
import { gsap, ScrollTrigger } from "@/showcase/property/lib/gsap";

/*
 * Desktop scroll timeline, derived from reference/out/fine-hero-1440.json.
 * It is 3.5 units long and scrubbed across the wrapper's scroll range
 * (400vh − 100vh), so one unit is 2/7 of that range.
 *
 *   0   → 1    linear        outer phrases slide in to meet the centre one;
 *                            guide lines close in around the video card
 *   1   → 2.2  power1.inOut  guide lines run out to the edges, video goes full-bleed
 *   1   → 1.4  linear        description + rating fade out
 *   1   → 1.5  power1.in     phrases slide up out of their mask
 *   2.5 → 3.5  linear        three white panels rise, staggered by 0.3
 */
const GUIDES = {
  start: { "--hero-col": 33.333, "--hero-row-mid": 59.6, "--hero-row-bottom": 96.3, "--hero-inset": 3 },
  closed: { "--hero-col": 30, "--hero-row-mid": 27.03, "--hero-row-bottom": 72.99, "--hero-inset": 3 },
  open: { "--hero-col": 0, "--hero-row-mid": 0, "--hero-row-bottom": 100, "--hero-inset": 0 },
};
const TITLE_GAP_REM = 0.8;
const PLAYER_AT = 0.5; // timeline progress at which the player pill appears

/*
 * Intro (desktop). Shapes and easings are sampled from the reference
 * (reference/capture/probe-intro.mjs):
 *   - the phrases rise into their masks, 0.8s power3.out, shortly after load
 *   - the video card is revealed over 1.1s, power3.inOut
 * The reference runs both on a timer and scales the card up from a point;
 * here the card sits in place, waits for the first scroll, and is wiped open
 * from its horizontal centre line.
 */
const INTRO_DELAY = 1.5; // seconds after mount before the phrases rise; lets the logo trace lead
const CLIP_HIDDEN = "polygon(-20% -20%, 120% -20%, 120% -20%, -20% -20%)";
const CLIP_SHOWN = "polygon(-10% -10%, 110% -10%, 110% 110%, -10% 110%)";
const WIPE_HIDDEN = "inset(50% 0% 50% 0%)";
const WIPE_SHOWN = "inset(0% 0% 0% 0%)";

const formatTime = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds || 0));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

export function Hero({ content }: { content: HeroContent }) {
  const { heading, titles, description, aside, background, video, player } = content;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const playerTimeline = useRef<gsap.core.Timeline | null>(null);
  const progress = useRef(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState({ current: 0, total: 0 });

  const apply = (p: number) => {
    progress.current = p;
    timeline.current?.progress(p);
    const tl = playerTimeline.current;
    if (tl) {
      if (p >= PLAYER_AT) tl.play();
      else tl.reverse();
    }
  };
  useStickyProgress(wrapperRef, apply);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_DESKTOP, () => {
      const q = gsap.utils.selector(section);
      const [left, center, right] = q<HTMLElement>("[data-hero-title]");
      const gap = () => parseFloat(getComputedStyle(document.documentElement).fontSize) * TITLE_GAP_REM;

      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
      tl.fromTo(section, GUIDES.start, { ...GUIDES.closed, duration: 1 }, 0)
        .fromTo(left, { x: 0 }, { x: () => center.offsetLeft - gap() - (left.offsetLeft + left.offsetWidth), duration: 1 }, 0)
        .fromTo(right, { x: 0 }, { x: () => center.offsetLeft + center.offsetWidth + gap() - right.offsetLeft, duration: 1 }, 0)
        .fromTo(section, GUIDES.closed, { ...GUIDES.open, duration: 1.2, ease: "power1.inOut", immediateRender: false }, 1)
        .fromTo(q("[data-hero-footer]"), { opacity: 1 }, { opacity: 0, duration: 0.4 }, 1)
        .fromTo(q("[data-hero-titles]"), { yPercent: 0 }, { yPercent: -110, duration: 0.5, ease: "power1.in" }, 1);
      q("[data-hero-stair]").forEach((stair, i) => {
        tl.fromTo(stair, { yPercent: 0 }, { yPercent: -100, duration: 1 - i * 0.3 }, 2.5 + i * 0.3);
      });
      timeline.current = tl;

      // Player pill: pops in as a circle, then widens. Timing is estimated —
      // the reference only exposes its start and end states.
      const playerEl = q("[data-hero-player]");
      const ptl = gsap.timeline({ paused: true });
      ptl
        .fromTo(playerEl, { autoAlpha: 0, scale: 0, width: "7rem" }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power2.out" })
        .to(playerEl, { width: "24rem", duration: 0.45, ease: "power2.inOut" })
        .fromTo(q("[data-hero-player-inner]"), { opacity: 0 }, { opacity: 1, duration: 0.25 }, "-=0.2");
      playerTimeline.current = ptl;

      // Intro: phrases rise on a timer; the video card stays hidden until the first scroll.
      const intro = gsap.fromTo(
        q("[data-hero-line-text]"),
        { autoAlpha: 1, yPercent: 120, clipPath: CLIP_HIDDEN },
        { yPercent: 0, clipPath: CLIP_SHOWN, duration: 0.8, ease: "power3.out", stagger: 0.06, delay: INTRO_DELAY, clearProps: "transform,clipPath" },
      );
      const cardReveal = gsap.fromTo(
        q("[data-hero-video]"),
        { autoAlpha: 1, clipPath: WIPE_HIDDEN },
        { clipPath: WIPE_SHOWN, duration: 1.1, ease: "power3.inOut", clearProps: "clipPath", paused: true },
      );
      const revealCard = () => {
        if (window.scrollY <= 0) return;
        window.removeEventListener("scroll", revealCard);
        cardReveal.play();
      };
      window.addEventListener("scroll", revealCard, { passive: true });
      // Opened already scrolled into the hero: show everything straight away.
      if (window.scrollY > 0) {
        intro.progress(1);
        cardReveal.progress(1);
      }

      // Phrase offsets depend on layout, so re-measure whenever ScrollTrigger refreshes.
      const remeasure = () => {
        tl.invalidate();
        tl.progress(0).progress(progress.current);
      };
      ScrollTrigger.addEventListener("refreshInit", remeasure);
      tl.progress(progress.current);
      if (progress.current >= PLAYER_AT) ptl.progress(1);

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", remeasure);
        window.removeEventListener("scroll", revealCard);
        intro.kill();
        cardReveal.kill();
        timeline.current = null;
        playerTimeline.current = null;
      };
    });

    /*
     * Mobile: our own sequence (the reference's mobile hero is static). The
     * hero is sticky for 1.5 screens of scroll, scrubbed:
     *   0.05 → 0.35  headline and text lift and fade out (the logo un-draws alongside)
     *   0.20 → 0.60  the video card wipes open from its horizontal centre line
     */
    mm.add(MOTION_MOBILE, () => {
      const q = gsap.utils.selector(section);
      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
      tl.fromTo([q("[data-hero-titles]"), q("[data-hero-footer]")], { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -40, duration: 0.3 }, 0.05)
        .fromTo(q("[data-hero-video]"), { autoAlpha: 1, clipPath: WIPE_HIDDEN }, { clipPath: WIPE_SHOWN, duration: 0.4, ease: "power2.inOut" }, 0.2)
        .set({}, {}, 1);
      timeline.current = tl;

      const intro = gsap.fromTo(
        q("[data-hero-line-text]"),
        { autoAlpha: 1, yPercent: 120, clipPath: CLIP_HIDDEN },
        { yPercent: 0, clipPath: CLIP_SHOWN, duration: 0.8, ease: "power3.out", stagger: 0.06, delay: INTRO_DELAY, clearProps: "transform,clipPath" },
      );
      if (window.scrollY > 0) intro.progress(1);
      tl.progress(progress.current);

      return () => {
        intro.kill();
        timeline.current = null;
      };
    });

    return () => mm.revert();
  }, []);

  // Player controls act on the hero video when a real file is set in content.ts.
  const getVideo = () => sectionRef.current?.querySelector("video") ?? null;
  useEffect(() => {
    const el = getVideo();
    if (!el) return;
    const sync = () => setTime({ current: el.currentTime, total: el.duration });
    el.addEventListener("timeupdate", sync);
    el.addEventListener("loadedmetadata", sync);
    return () => {
      el.removeEventListener("timeupdate", sync);
      el.removeEventListener("loadedmetadata", sync);
    };
  }, []);
  // YouTube embeds are driven through the iframe player API.
  const youtube = (func: string) =>
    sectionRef.current
      ?.querySelector<HTMLIFrameElement>("iframe[data-youtube]")
      ?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
  const togglePlay = () => {
    const el = getVideo();
    if (el?.paused) el.play();
    else el?.pause();
    youtube(playing ? "pauseVideo" : "playVideo");
    setPlaying((v) => !v);
  };
  const toggleMute = () => {
    const el = getVideo();
    if (el) el.muted = !el.muted;
    youtube(muted ? "unMute" : "mute");
    setMuted((v) => !v);
  };
  const showTime = video.kind === "video" && Boolean(video.src);
  // Distance over which the logo un-draws: the first unit of the desktop
  // timeline, or most of the first screen on mobile.
  const logoScrollSpan = () => {
    const wrapper = wrapperRef.current;
    const range = wrapper ? wrapper.offsetHeight - window.innerHeight : 0;
    return range > 0 ? range / 3.5 : window.innerHeight * 0.6;
  };

  const align = ["desk:justify-self-start", "desk:justify-self-center", "desk:justify-self-end"];
  const hLine = "absolute inset-x-0 h-px";
  const vLine = "absolute inset-y-0 w-px";

  return (
    // The hero is sticky inside a tall wrapper: four viewports on desktop, 2.5 on mobile.
    // With reduced motion it stays a single static viewport.
    <div ref={wrapperRef} className="relative h-screen motion-safe:h-[250vh] desk:motion-safe:h-[400vh]">
      <section
        ref={sectionRef}
        id="hero"
        className="relative z-2 flex h-screen flex-col items-center justify-center gap-[8vh] overflow-hidden max-desk:justify-start max-desk:pt-[calc(27rem+6vh)] text-paper [--hero-col:33.333] [--hero-inset:3] [--hero-row-bottom:96.3] [--hero-row-mid:59.6] motion-safe:sticky motion-safe:top-0 desk:block"
      >
        <h1 className="sr-only">{heading}</h1>

        {/* Backdrop, and guide lines on desktop */}
        <div className="absolute inset-0">
          <Media media={background} />
          {/* Darkens the photo so the light text and logo stay legible */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="absolute inset-0 z-1 hidden desk:block">
          <div data-hero-line="col" className={`${vLine} left-[calc(var(--hero-col)*1%)] bg-line-hero`} />
          <div className={`${vLine} left-[calc((100-var(--hero-col))*1%)] bg-line-hero`} />
          <div data-hero-line="row-mid" className={`${hLine} top-[calc(var(--hero-row-mid)*1%)] bg-line-hero`} />
          <div data-hero-line="row-bottom" className={`${hLine} top-[calc(var(--hero-row-bottom)*1%)] bg-line-hero`} />
        </div>

        {/* Logo, centred above the middle phrase: traces on load, un-draws on scroll */}
        <HeroLogo
          title={heading}
          scrollSpan={logoScrollSpan}
          className="absolute left-1/2 top-[8rem] z-10 h-190 w-190 -translate-x-1/2 text-cream desk:bottom-[calc(54.6%+3.6rem)] desk:top-auto desk:h-260 desk:w-260"
        />

        {/* Display phrases */}
        <div className="relative z-10 overflow-hidden desk:absolute desk:inset-x-0 desk:top-[45.4%] desk:pb-2">
          <div data-hero-titles className="flex flex-col items-center gap-0 px-20 text-h2 font-extralight desk:grid desk:grid-cols-[1fr_auto_1fr] desk:gap-0 desk:px-32">
            {titles.map((title, i) => (
              <div key={title} data-hero-title className={`whitespace-nowrap ${align[i]}`}>
                <span data-hero-line-text className="block motion-safe:invisible">
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Video card: a centred 16:9 card on mobile; on desktop it sits inside the centre guide cell */}
        <div data-hero-video className="absolute z-1 overflow-hidden motion-safe:invisible max-desk:inset-x-20 max-desk:top-1/2 max-desk:aspect-video max-desk:-translate-y-1/2 max-desk:rounded-card max-desk:motion-reduce:hidden desk:bottom-[calc((100-var(--hero-row-bottom))*1%+var(--hero-inset)*1rem)] desk:left-[calc(var(--hero-col)*1%+var(--hero-inset)*1rem)] desk:right-[calc(var(--hero-col)*1%+var(--hero-inset)*1rem)] desk:top-[calc(var(--hero-row-mid)*1%+var(--hero-inset)*1rem)]">
          <Media media={video} />
        </div>

        {/* Player pill (desktop, appears once the video is nearly full-bleed) */}
        <div
          data-hero-player
          className="invisible absolute bottom-24 left-1/2 z-20 hidden h-70 w-240 -translate-x-1/2 overflow-hidden rounded-[6rem] bg-paper text-ink desk:block"
        >
          <div data-hero-player-inner className="flex h-full w-240 items-center">
            <button
              type="button"
              aria-label={playing ? player.pauseLabel : player.playLabel}
              onClick={togglePlay}
              className="relative z-20 ml-10 flex size-50 shrink-0 cursor-pointer items-center justify-center rounded-full bg-coal text-paper"
            >
              <Icon name={playing ? "pause" : "play"} className="size-14" />
            </button>
            <div className="relative z-1 flex flex-1 gap-10 px-26 text-small">
              {showTime && (
                <>
                  <span>{formatTime(time.current)}</span>
                  <span>{formatTime(time.total)}</span>
                </>
              )}
            </div>
            <button
              type="button"
              aria-label={muted ? player.unmuteLabel : player.muteLabel}
              aria-pressed={!muted}
              onClick={toggleMute}
              className="relative z-10 mr-20 flex h-24 cursor-pointer items-center gap-2"
            >
              {Array.from({ length: 7 }, (_, i) => (
                <span key={i} className={`h-18 w-2 rounded-[1px] bg-ink ${muted ? "scale-y-[0.3]" : ""}`} />
              ))}
            </button>
          </div>
        </div>

        {/* Description + rating */}
        <div
          data-hero-footer
          className="relative z-2 flex flex-col items-center gap-[5vh] px-20 desk:absolute desk:inset-x-0 desk:bottom-58 desk:flex-row desk:items-end desk:justify-between desk:gap-0 desk:px-32"
        >
          <p className="text-center desk:text-left">
            {description.map((line) => (
              <span key={line} data-hero-line-text className="block motion-safe:invisible">
                {line}
              </span>
            ))}
          </p>
          <div className="flex flex-col items-center desk:items-end">
            {aside.stars ? (
              <div className="flex h-27 items-center gap-[1.5px]" aria-hidden>
                {Array.from({ length: aside.stars }, (_, i) => (
                  <Icon key={i} name="star" className="size-18" />
                ))}
              </div>
            ) : null}
            {aside.lines.map((line) => (
              <div key={line} data-hero-line-text className="motion-safe:invisible">
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Exit: three panels that rise to cover the hero (desktop) */}
        <div className="pointer-events-none absolute inset-0 z-30 hidden desk:flex">
          {[0, 1, 2].map((i) => (
            <div key={i} data-hero-stair className="relative top-full h-full flex-1 bg-paper" />
          ))}
        </div>
      </section>
    </div>
  );
}
