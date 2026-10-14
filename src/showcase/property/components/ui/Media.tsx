import Image from "next/image";
import type { MediaContent } from "@/showcase/property/content";
import { YouTubeBackground } from "./YouTubeBackground";

/**
 * Fills its (relative) parent. Renders the real asset when one is set in
 * content.ts, otherwise a flat gradient placeholder in the given tone.
 */
export function Media({ media, sizes = "100vw" }: { media: MediaContent; sizes?: string }) {
  if (media.kind === "youtube") {
    return <YouTubeBackground id={media.id} title={media.alt} className={`ph-${media.tone}`} />;
  }
  if (media.src && media.kind === "video") {
    return (
      <video
        className="absolute inset-0 size-full object-cover"
        src={media.src}
        poster={media.poster}
        aria-label={media.alt}
        muted
        loop
        playsInline
        autoPlay
      />
    );
  }
  if (media.src) {
    return <Image src={media.src} alt={media.alt} fill sizes={sizes} className="object-cover" />;
  }
  return <div role="img" aria-label={media.alt} className={`absolute inset-0 ph-${media.tone}`} />;
}
