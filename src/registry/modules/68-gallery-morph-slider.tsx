"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { Mesh, Program, Renderer, Texture, Triangle, type OGLRenderingContext } from "ogl";
import { animate, type AnimationPlaybackControlsWithThen, type Easing } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/registry/lib/motion-variants";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";

/**
 * Module 68 — Gallery, Morph Slider
 * A WebGL image slider: crossfades between slides through a shader-driven
 * pixel displacement (default "melt" mode — a scrolling fbm noise field
 * warps each image apart/together as it swaps) instead of a CSS crossfade.
 * Adapted from a community MorphSlider component (ogl + GSAP). The vertex/
 * fragment shaders and the transition math inside them are copied close to
 * verbatim — dense, deliberate GLSL, not boilerplate to simplify, same as
 * module 66's corridor. Two real adaptations from the source: GSAP was
 * dropped in favor of `animate()` from `motion/react` (already a repo
 * dependency, one less animation library to depend on) to drive the
 * uProgress uniform, and the large prop-configurable API was collapsed to a
 * fixed default config (transition, items, autoplay) to match how every
 * other module in this catalog is a self-contained section rather than a
 * reusable component. `ogl` (a ~30kb dependency-free WebGL micro-library)
 * was added new — this effect is genuinely pixel-shader work, nothing in
 * this repo's Motion/CSS toolkit can do it. Title effect: A. The slider
 * itself is fully custom (WebGL canvas + pointer drag), not part of the
 * A–J catalog.
 */

type MorphItem = { image: string; caption: string };

const ITEMS: MorphItem[] = [
  { image: PLACEHOLDER_IMAGES.wallpaper02.src, caption: "Brand Identity" },
  { image: PLACEHOLDER_IMAGES.wallpaper03.src, caption: "Web Design" },
  { image: PLACEHOLDER_IMAGES.wallpaper05.src, caption: "Product Photography" },
  { image: PLACEHOLDER_IMAGES.wallpaper06.src, caption: "Motion Design" },
];

const MODE = 0; // melt — see TRANSITIONS in the original source for ripple(1)/shear(2)/swirl(3)
const DURATION = 1.1;
const EASE: Easing = "easeInOut";
const INTENSITY = 0.55;
const SCALE = 2.4;
const ABERRATION = 0.35;
const DRIFT = 0.4;
const OVERLAY: [number, number, number] = [0, 0, 0];
const AUTOPLAY_DELAY = 4000;

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform sampler2D tCurrent;
uniform sampler2D tNext;
uniform vec2 uResolution;
uniform vec2 uCurrentSize;
uniform vec2 uNextSize;
uniform float uProgress;
uniform float uDir;
uniform int uMode;
uniform float uIntensity;
uniform float uScale;
uniform float uAberration;
uniform float uDrift;
uniform float uTime;
uniform float uReduce;
uniform vec2 uPointer;
uniform vec3 uOverlay;

varying vec2 vUv;

const float PI = 3.14159265359;

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

mat2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

vec2 coverUV(vec2 uv, vec2 res, vec2 img) {
  float rA = res.x / max(res.y, 1.0);
  float iA = img.x / max(img.y, 1.0);
  vec2 s = vec2(1.0);
  float ratio = rA / max(iA, 0.0001);
  if (ratio > 1.0) {
    s.y = 1.0 / ratio;
  } else {
    s.x = ratio;
  }
  return (uv - 0.5) * s + 0.5;
}

void main() {
  float p = clamp(uProgress, 0.0, 1.0);
  float env = sin(p * PI);

  vec2 uv = vUv;

  uv += vec2(sin(uTime * 0.25 + uv.y * 4.0), cos(uTime * 0.22 + uv.x * 4.0)) * uDrift * 0.008;
  uv = (uv - 0.5) * (1.0 - uDrift * 0.02 * sin(uTime * 0.4)) + 0.5;

  vec2 uvC = uv;
  vec2 uvN = uv;
  float m = smoothstep(0.0, 1.0, p);

  if (uReduce < 0.5) {
    if (uMode == 3) {
      vec2 c = uv - 0.5;
      float r = length(c);
      float ang = env * uIntensity * 3.5 * (1.0 - r);
      uvC = rot(ang) * c + 0.5;
      uvN = rot(-ang) * c + 0.5;
      m = smoothstep(0.0, 1.0, p);
    } else if (uMode == 1) {
      float d = distance(uv, uPointer);
      float ring = p * 1.6;
      float wave = sin((d - ring) * 30.0) * env;
      vec2 dir = normalize(uv - uPointer + 1e-4);
      vec2 disp = dir * wave * uIntensity * 0.25;
      uvC = uv + disp;
      uvN = uv + disp * 0.6;
      m = 1.0 - smoothstep(ring - 0.03, ring + 0.03, d);
    } else if (uMode == 2) {
      float slices = 14.0;
      float row = floor(uv.y * slices);
      float rnd = hash11(row);
      vec2 disp = vec2((rnd - 0.5) * env * uIntensity * 0.6, 0.0);
      uvC = uv + disp;
      uvN = uv + disp;
      float localX = uDir > 0.0 ? uv.x : 1.0 - uv.x;
      float th = p * 1.5 - 0.25 + (rnd - 0.5) * 0.25;
      m = 1.0 - smoothstep(th - 0.06, th + 0.06, localX);
    } else {
      float nn = fbm(uv * uScale + uTime * 0.03);
      float warp = fbm(uv * uScale * 1.7 - uTime * 0.02);
      vec2 g = vec2(nn, warp) - 0.5;
      uvC = uv + g * uIntensity * 0.5 * p;
      uvN = uv - g * uIntensity * 0.5 * (1.0 - p);
      m = smoothstep(nn - 0.15, nn + 0.15, p);
    }
  }

  vec2 sC = coverUV(uvC, uResolution, uCurrentSize);
  vec2 sN = coverUV(uvN, uResolution, uNextSize);

  float ca = uReduce < 0.5 ? uAberration * env * 0.03 : 0.0;

  vec3 colC = vec3(
    texture2D(tCurrent, sC + vec2(ca, 0.0)).r,
    texture2D(tCurrent, sC).g,
    texture2D(tCurrent, sC - vec2(ca, 0.0)).b
  );
  vec3 colN = vec3(
    texture2D(tNext, sN + vec2(ca, 0.0)).r,
    texture2D(tNext, sN).g,
    texture2D(tNext, sN - vec2(ca, 0.0)).b
  );

  vec3 col = mix(colC, colN, m);

  float vig = smoothstep(1.25, 0.25, length(uv - 0.5));
  col = mix(col, uOverlay, (1.0 - vig) * 0.28);

  gl_FragColor = vec4(col, 1.0);
}
`;

function makeFallbackTexture(gl: OGLRenderingContext): Texture {
  const size = 4;
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    data[i * 4] = 24;
    data[i * 4 + 1] = 24;
    data[i * 4 + 2] = 28;
    data[i * 4 + 3] = 255;
  }
  return new Texture(gl, { image: data, width: size, height: size, generateMipmaps: false });
}

class MorphEngine {
  container: HTMLDivElement;
  items: MorphItem[];
  reducedMotion: boolean;
  onIndexChange: (index: number) => void;

  current: number;
  animating: boolean;
  dragging: boolean;
  dragDir: number;
  shownIndex: number;
  tween: AnimationPlaybackControlsWithThen | null;

  renderer: Renderer;
  gl: OGLRenderingContext;
  canvas: HTMLCanvasElement;
  geometry: Triangle;
  textures: Texture[];
  sizes: [number, number][];
  program: Program;
  mesh: Mesh;

  resizeObserver: ResizeObserver;
  boundContextLost: (e: Event) => void;
  raf: number;

  constructor(container: HTMLDivElement, items: MorphItem[], reducedMotion: boolean, onIndexChange: (index: number) => void) {
    this.container = container;
    this.items = items;
    this.onIndexChange = onIndexChange;
    this.reducedMotion = reducedMotion;

    this.current = 0;
    this.animating = false;
    this.dragging = false;
    this.dragDir = 0;
    this.shownIndex = 0;
    this.tween = null;

    this.renderer = new Renderer({
      alpha: false,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0.05, 0.05, 0.06, 1);

    this.canvas = this.gl.canvas;
    this.canvas.className = "block h-full w-full";
    container.appendChild(this.canvas);

    this.geometry = new Triangle(this.gl);

    this.textures = this.items.map(() => makeFallbackTexture(this.gl));
    this.sizes = this.items.map(() => [1, 1]);

    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        tCurrent: { value: this.textures[this.current] },
        tNext: { value: this.textures[this.current] },
        uResolution: { value: [1, 1] },
        uCurrentSize: { value: this.sizes[this.current] },
        uNextSize: { value: this.sizes[this.current] },
        uProgress: { value: 0 },
        uDir: { value: 1 },
        uMode: { value: MODE },
        uIntensity: { value: INTENSITY },
        uScale: { value: SCALE },
        uAberration: { value: ABERRATION },
        uDrift: { value: DRIFT },
        uTime: { value: 0 },
        uReduce: { value: reducedMotion ? 1 : 0 },
        uPointer: { value: [0.5, 0.5] },
        uOverlay: { value: OVERLAY },
      },
    });

    this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program });

    this.boundContextLost = this.onContextLost.bind(this);
    this.canvas.addEventListener("webglcontextlost", this.boundContextLost, false);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();

    this.loadTextures();

    this.raf = requestAnimationFrame(this.loop);
  }

  loadTextures() {
    this.items.forEach((item, index) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = item.image;
      img.onload = () => {
        const texture = new Texture(this.gl, { generateMipmaps: false });
        texture.image = img;
        this.textures[index] = texture;
        this.sizes[index] = [img.naturalWidth || 1, img.naturalHeight || 1];
        if (index === this.current) {
          this.program.uniforms.tCurrent.value = texture;
          this.program.uniforms.uCurrentSize.value = this.sizes[index];
        }
      };
    });
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const w = Math.max(rect.width, 1);
    const h = Math.max(rect.height, 1);
    this.renderer.setSize(w, h);
    this.program.uniforms.uResolution.value = [this.gl.canvas.width, this.gl.canvas.height];
  }

  loop = (t: number) => {
    this.program.uniforms.uTime.value = t * 0.001;
    this.renderer.render({ scene: this.mesh });
    this.raf = requestAnimationFrame(this.loop);
  };

  wrap(i: number) {
    const n = this.items.length;
    return ((i % n) + n) % n;
  }

  prepareNext(dir: number) {
    const target = this.wrap(this.current + dir);
    this.program.uniforms.tCurrent.value = this.textures[this.current];
    this.program.uniforms.uCurrentSize.value = this.sizes[this.current];
    this.program.uniforms.tNext.value = this.textures[target];
    this.program.uniforms.uNextSize.value = this.sizes[target];
    this.program.uniforms.uDir.value = dir;
    return target;
  }

  goTo(dir: number) {
    if (this.animating || this.dragging || this.items.length < 2) return;
    const target = this.prepareNext(dir);
    this.animating = true;
    this.announce(target);
    const duration = this.reducedMotion ? Math.min(DURATION, 0.4) : DURATION;
    this.tween = animate(0, 1, {
      duration,
      ease: EASE,
      onUpdate: (latest) => {
        this.program.uniforms.uProgress.value = latest;
      },
      onComplete: () => this.commit(target),
    });
  }

  announce(index: number) {
    if (index === this.shownIndex) return;
    this.shownIndex = index;
    this.onIndexChange(index);
  }

  commit(target: number) {
    this.current = target;
    this.program.uniforms.tCurrent.value = this.textures[target];
    this.program.uniforms.uCurrentSize.value = this.sizes[target];
    this.program.uniforms.uProgress.value = 0;
    this.animating = false;
    this.tween = null;
    this.announce(target);
  }

  next() {
    this.goTo(1);
  }

  prev() {
    this.goTo(-1);
  }

  setPointer(x: number, y: number) {
    this.program.uniforms.uPointer.value = [x, y];
  }

  beginDrag() {
    if (this.animating || this.items.length < 2) return false;
    this.dragging = true;
    this.dragDir = 0;
    return true;
  }

  drag(ndx: number) {
    if (!this.dragging) return;
    const dir = ndx < 0 ? 1 : -1;
    if (dir !== this.dragDir) {
      this.dragDir = dir;
      this.prepareNext(dir);
    }
    const progress = Math.min(Math.abs(ndx), 1);
    this.program.uniforms.uProgress.value = progress;
    this.announce(progress > 0.5 ? this.wrap(this.current + dir) : this.current);
  }

  endDrag() {
    if (!this.dragging) return;
    this.dragging = false;
    const p = this.program.uniforms.uProgress.value;
    if (this.dragDir === 0) return;
    const target = this.wrap(this.current + this.dragDir);
    const duration = this.reducedMotion ? 0.3 : 0.5;
    this.animating = true;
    if (p > 0.4) {
      this.announce(target);
      this.tween = animate(p, 1, {
        duration,
        ease: "easeOut",
        onUpdate: (latest) => {
          this.program.uniforms.uProgress.value = latest;
        },
        onComplete: () => this.commit(target),
      });
    } else {
      this.announce(this.current);
      this.tween = animate(p, 0, {
        duration,
        ease: "easeOut",
        onUpdate: (latest) => {
          this.program.uniforms.uProgress.value = latest;
        },
        onComplete: () => {
          this.animating = false;
          this.tween = null;
        },
      });
    }
  }

  onContextLost(e: Event) {
    e.preventDefault();
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.tween?.stop();
    this.resizeObserver.disconnect();
    this.canvas.removeEventListener("webglcontextlost", this.boundContextLost);
    this.textures.forEach((tex) => this.gl.deleteTexture(tex.texture));
    this.gl.deleteProgram(this.program.program);
    const ext = this.gl.getExtension("WEBGL_lose_context");
    if (ext && "loseContext" in ext) (ext as { loseContext: () => void }).loseContext();
    this.canvas.parentNode?.removeChild(this.canvas);
  }
}

export default function GalleryMorphSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<MorphEngine | null>(null);
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const engine = new MorphEngine(containerRef.current, ITEMS, reducedMotion, setIndex);
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const handleNext = useCallback(() => engineRef.current?.next(), []);
  const handlePrev = useCallback(() => engineRef.current?.prev(), []);

  useEffect(() => {
    if (hovering) return;
    const id = setTimeout(() => engineRef.current?.next(), AUTOPLAY_DELAY);
    return () => clearTimeout(id);
  }, [hovering, index]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0;
    let width = 1;
    let active = false;

    const onDown = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      width = rect.width || 1;
      startX = e.clientX;
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      engineRef.current?.setPointer(px, 1 - py);
      active = engineRef.current?.beginDrag() ?? false;
      if (active) el.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!active) return;
      engineRef.current?.drag((e.clientX - startX) / width);
    };
    const onUp = () => {
      if (!active) return;
      active = false;
      engineRef.current?.endDrag();
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    },
    [handleNext, handlePrev]
  );

  return (
    <section className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal
          effect="A"
          as="h2"
          className="mb-10 text-balance text-center text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl"
        >
          Work that speaks for itself
        </Reveal>

        <div
          className="relative h-[26rem] w-full touch-pan-y overflow-hidden rounded-2xl bg-[#0c0c0e] shadow-2xl select-none sm:h-[32rem]"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <div
            ref={containerRef}
            className="absolute inset-0 cursor-grab outline-none active:cursor-grabbing"
            role="group"
            aria-roledescription="carousel"
            aria-label="Image morph gallery"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={(e: ReactPointerEvent<HTMLDivElement>) => e.currentTarget.focus()}
          />

          <div className="pointer-events-none absolute bottom-5 left-5 z-10 grid max-w-[70%]" aria-live="polite">
            {ITEMS.map((item, i) => (
              <span
                key={item.caption}
                aria-hidden={i === index ? undefined : true}
                className={`col-start-1 row-start-1 justify-self-start rounded-lg border border-white/10 bg-black/40 px-3.5 py-2 text-sm font-semibold text-white backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  i === index ? "translate-y-0 opacity-100 blur-none" : "translate-y-3 opacity-0 blur-md"
                }`}
              >
                {item.caption}
              </span>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-4">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous slide"
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:scale-105 hover:border-white/50 hover:bg-black/60 active:scale-95"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next slide"
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:scale-105 hover:border-white/50 hover:bg-black/60 active:scale-95"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-2" role="tablist" aria-label="Slides">
            {ITEMS.map((item, i) => (
              <button
                key={item.caption}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => {
                  const engine = engineRef.current;
                  if (!engine || i === index) return;
                  engine.goTo(i > index ? 1 : -1);
                }}
                className={`h-2 rounded-full transition-all duration-500 ${i === index ? "w-6 bg-white/95" : "w-2 bg-white/35"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
