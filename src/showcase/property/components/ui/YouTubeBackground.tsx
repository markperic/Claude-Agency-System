"use client";

import { useEffect, useRef, useState } from "react";

// YouTube shows its title bar for the first seconds of playback; the frame
// stays hidden behind the video's thumbnail until that has gone.
const CHROME_HIDE_MS = 3500;

/** Muted, looping, chrome-less YouTube player scaled to cover its (relative) parent. */
export function YouTubeBackground({ id, title, className = "" }: { id: string; title: string; className?: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;

    // Ask the player to report state changes, then wait for "playing" (state 1).
    const listen = () => el.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "widget" }), "*");
    const onMessage = (event: MessageEvent) => {
      if (event.source !== el.contentWindow || typeof event.data !== "string") return;
      try {
        const data = JSON.parse(event.data);
        if (data.info?.playerState === 1 && !timer) timer = setTimeout(() => setReady(true), CHROME_HIDE_MS);
      } catch {
        // not a player message
      }
    };
    window.addEventListener("message", onMessage);
    el.addEventListener("load", listen);
    const poll = setInterval(listen, 500);
    const stopPolling = setTimeout(() => clearInterval(poll), 10000);

    return () => {
      window.removeEventListener("message", onMessage);
      el.removeEventListener("load", listen);
      clearInterval(poll);
      clearTimeout(stopPolling);
      clearTimeout(timer);
    };
  }, []);

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: id,
    controls: "0",
    playsinline: "1",
    rel: "0",
    enablejsapi: "1",
  });

  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-cover bg-center [container-type:size] ${className}`}
      style={{ backgroundImage: `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)` }}
    >
      <iframe
        ref={frame}
        data-youtube
        title={title}
        src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
        allow="autoplay; encrypted-media; picture-in-picture"
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[max(100cqh,56.25cqw)] w-[max(100cqw,177.78cqh)] -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
