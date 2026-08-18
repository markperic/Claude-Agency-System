"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useScroll, useTransform } from "motion/react";

/**
 * A lab, not a finished module. The point is to judge the ring's proportions
 * and the feel of the squeeze at real size before it gets designed into a
 * page, so every value worth arguing about is on a slider.
 *
 * `ssr: false` because the scene reaches for a WebGL context and pulls in
 * three's RoomEnvironment, neither of which exists during the server render.
 */
const RingScene = dynamic(() => import("./ring-scene"), {
  ssr: false,
  loading: () => null,
});

export default function PilatesRingLabPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [tubeRadius, setTubeRadius] = useState(0.055);
  const [bandColor, setBandColor] = useState("#c9c4bb");
  const [manualOn, setManualOn] = useState(false);
  const [manualSqueeze, setManualSqueeze] = useState(0.5);

  // The frame loop reads these refs, so dragging the manual slider never has
  // to wait on a React render to reach the geometry. Synced in an effect
  // rather than assigned during render — a render-phase ref write is not safe
  // under concurrent rendering, where React may render a component without
  // ever committing it.
  const manualOnRef = useRef(manualOn);
  const manualSqueezeRef = useRef(manualSqueeze);

  useEffect(() => {
    manualOnRef.current = manualOn;
  }, [manualOn]);

  useEffect(() => {
    manualSqueezeRef.current = manualSqueeze;
  }, [manualSqueeze]);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  // Press, hold, release — the shape a real repetition has.
  const scrollSqueeze = useTransform(scrollYProgress, [0.05, 0.5, 0.78, 1], [0, 1, 1, 0.08]);
  const scrollSpin = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 0.7]);

  const squeeze = useMemo(
    () => ({
      get: () => (manualOnRef.current ? manualSqueezeRef.current : scrollSqueeze.get()),
    }),
    [scrollSqueeze],
  );

  return (
    <main className="bg-[#efe9e0] text-[#2f3330]">
      <div ref={scrollRef} className="relative h-[320vh]">
        <div className="sticky top-0 h-screen">
          <div className="absolute inset-0">
            <RingScene
              squeeze={squeeze}
              spin={scrollSpin}
              tubeRadius={tubeRadius}
              bandColor={bandColor}
            />
          </div>

          {/* Sits in front of the canvas — the thing an iframe embed can't do. */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <h1 className="text-center font-light tracking-tight text-[clamp(2.5rem,9vw,8rem)] leading-[0.95] mix-blend-multiply">
              Control
              <br />
              is strength
            </h1>
          </div>

          <Controls
            tubeRadius={tubeRadius}
            setTubeRadius={setTubeRadius}
            bandColor={bandColor}
            setBandColor={setBandColor}
            manualOn={manualOn}
            setManualOn={setManualOn}
            manualSqueeze={manualSqueeze}
            setManualSqueeze={setManualSqueeze}
          />
        </div>
      </div>

      <section className="px-8 py-32 text-center text-sm opacity-60">
        Scroll back up to run the squeeze in reverse.
      </section>
    </main>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex items-center gap-3 text-xs">
      <span className="w-24 shrink-0 opacity-70">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="flex-1 accent-[#2f3330]"
      />
      <span className="w-10 shrink-0 text-right tabular-nums opacity-50">{value.toFixed(3)}</span>
    </label>
  );
}

function Controls(props: {
  tubeRadius: number;
  setTubeRadius: (v: number) => void;
  bandColor: string;
  setBandColor: (v: string) => void;
  manualOn: boolean;
  setManualOn: (v: boolean) => void;
  manualSqueeze: number;
  setManualSqueeze: (v: number) => void;
}) {
  return (
    <div className="absolute bottom-6 left-6 z-10 w-80 rounded-xl bg-white/70 p-4 backdrop-blur-md shadow-sm">
      <div className="mb-3 flex flex-col gap-2">
        <Slider label="Band" value={props.tubeRadius} min={0.02} max={0.12} step={0.005} onChange={props.setTubeRadius} />
      </div>

      <div className="mb-3 flex items-center gap-4 text-xs">
        <label className="flex items-center gap-2">
          <span className="opacity-70">Band</span>
          <input type="color" value={props.bandColor} onChange={(e) => props.setBandColor(e.target.value)} className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent" />
        </label>
      </div>

      <label className="mb-2 flex items-center gap-2 text-xs">
        <input type="checkbox" checked={props.manualOn} onChange={(e) => props.setManualOn(e.target.checked)} className="accent-[#2f3330]" />
        <span className="opacity-70">Override scroll</span>
      </label>

      {props.manualOn && (
        <Slider label="Squeeze" value={props.manualSqueeze} min={0} max={1} step={0.01} onChange={props.setManualSqueeze} />
      )}
    </div>
  );
}
