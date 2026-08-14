/**
 * Local placeholder photo library — src/registry/lib/placeholder-images.ts
 * Every image lives in public/images/library/ (resized to a 2400px long
 * edge, JPEG q82). Centralizing them here means alt text is written once
 * per photo even when the same file is reused across modules, and swapping
 * a placeholder for a real client asset later is a one-line change in this
 * file rather than hunting through every module that references it.
 */

export type PlaceholderImage = { src: string; alt: string };

const lib = (file: string): string => `/images/library/${file}`;

export const PLACEHOLDER_IMAGES = {
  landscape01: { src: lib("landscape01.jpg"), alt: "Layered mountain ridgelines at sunset with a hiker silhouetted on the summit" },
  landscape02: { src: lib("landscape02.jpg"), alt: "Aerial view of green rolling hills with a shepherd and flock crossing a ridge" },
  landscape03: { src: lib("landscape03.jpg"), alt: "Jagged coastal mountain reflected on a black sand beach at dusk" },
  landscape04: { src: lib("landscape04.jpg"), alt: "Silhouetted slot canyon walls against a starry night sky" },
  landscape05: { src: lib("landscape05.jpg"), alt: "Four friends sitting on a mountain ridge overlooking a green valley" },
  landscape06: { src: lib("landscape06.jpg"), alt: "Earth at night from orbit, city lights glowing across the globe" },
  landscape07: { src: lib("landscape07.jpg"), alt: "A group of friends walking down a sunlit coastal promenade at golden hour" },
  landscape08: { src: lib("landscape08.jpg"), alt: "A misty forest path glowing with golden light in the distance" },
  landscape09: { src: lib("landscape09.jpg"), alt: "Four friends with arms around each other watching a golden sunset over hills" },
  landscape10: { src: lib("landscape10.jpg"), alt: "Mount Fuji at dusk above a lakeside town" },
  landscape11: { src: lib("landscape11.jpg"), alt: "A winding mountain road at blue hour with long-exposure light trails" },
  landscape12: { src: lib("landscape12.jpg"), alt: "A hiker standing on a rock outcrop above misty green mountains at sunrise" },
  landscape13: { src: lib("landscape13.jpg"), alt: "Desert hoodoo rock formations under the Milky Way" },
  landscape14: { src: lib("landscape14.jpg"), alt: "A misty forest river valley with rushing water over rocks" },

  portrait01: { src: lib("portrait01.jpg"), alt: "Earth's curvature seen from near space above snow-covered mountains" },
  portrait02: { src: lib("portrait02.jpg"), alt: "Dozens of colorful hot air balloons filling a clear blue sky" },
  portrait03: { src: lib("portrait03.jpg"), alt: "A desert canyon road leading toward a distant peak" },
  portrait04: { src: lib("portrait04.jpg"), alt: "The Milky Way over a lone tree reflected in still lake water" },
  portrait05: { src: lib("portrait05.jpg"), alt: "A silhouetted figure standing in an industrial space lit by a beam of light" },
  portrait06: { src: lib("portrait06.jpg"), alt: "Aerial view of ocean waves breaking on a rocky coastline" },
  portrait07: { src: lib("portrait07.jpg"), alt: "A snow-capped alpine peak at sunset above layered ridgelines" },
  portrait08: { src: lib("portrait08.jpg"), alt: "A massive banyan tree with sunlight flaring through its canopy" },
  portrait09: { src: lib("portrait09.jpg"), alt: "Multnomah Falls waterfall with its iconic footbridge" },

  wallpaper01: { src: lib("wallpaper01.jpg"), alt: "Abstract dark blue and purple gradient spheres" },
  wallpaper02: { src: lib("wallpaper02.jpg"), alt: "Abstract geometric 3D planes in orange, pink, and blue" },
  wallpaper03: { src: lib("wallpaper03.jpg"), alt: "Soft abstract 3D crumpled-fabric shapes on a warm gradient" },
  wallpaper04: { src: lib("wallpaper04.jpg"), alt: "Warm terracotta abstract ribbon waves" },
  wallpaper05: { src: lib("wallpaper05.jpg"), alt: "A fiery orange and yellow gradient with a blue wave shape" },
  wallpaper06: { src: lib("wallpaper06.jpg"), alt: "Vibrant multicolor abstract 3D flow ribbons" },

  wallpaperPortrait01: { src: lib("wallpaper-portrait01.jpg"), alt: "Vibrant blue, orange, and pink fluid-art streaks on black" },
  wallpaperPortrait02: { src: lib("wallpaper-portrait02.jpg"), alt: "A soft blurred pink, coral, and purple abstract bloom" },
  wallpaperPortrait03: { src: lib("wallpaper-portrait03.jpg"), alt: "A purple and blue abstract field with a bright yellow ribbon curve" },
  wallpaperPortrait04: { src: lib("wallpaper-portrait04.jpg"), alt: "A blue, violet, and red abstract gradient blob" },
  wallpaperPortrait05: { src: lib("wallpaper-portrait05.jpg"), alt: "Blue and orange marbled fluid art" },

  person05: { src: lib("person05.jpg"), alt: "Portrait of a woman with a soft smile, outdoors at golden hour" },
  person07: { src: lib("person07.jpg"), alt: "Portrait of a man in a cardigan and collared shirt, smiling warmly" },
  person08: { src: lib("person08.jpg"), alt: "Portrait of a smiling man in a plain white t-shirt" },
  person11: { src: lib("person11.jpg"), alt: "Portrait of a woman with dramatic side lighting against a warm background" },
} as const satisfies Record<string, PlaceholderImage>;
