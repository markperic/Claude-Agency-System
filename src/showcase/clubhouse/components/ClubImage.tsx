import Image from "next/image";

export type Img = { src: string; width: number; height: number; alt: string };

type Props = {
  image?: Img;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
};

/**
 * Local-file stand-in for the client project's Sanity-backed image component.
 * Every photo is a static file in /public/showcase/clubhouse — no remote host, no CMS.
 */
export function ClubImage({ image, className, sizes = "100vw", priority, fill }: Props) {
  if (!image) return null;
  const common = { src: image.src, alt: image.alt, className, sizes, priority };
  return fill ? (
    <Image {...common} fill />
  ) : (
    <Image {...common} width={image.width} height={image.height} />
  );
}
