import { ScrollReveal, StaggerGroup } from "@/registry/lib/motion-variants";
import { ShieldCheck, Lock, FileCheck, Server } from "lucide-react";

/**
 * Module 34 — Social Proof, Trust Badges
 * A compact row of security/compliance badges. Effect: F (stagger) of
 * Effect A.
 */
const BADGES = [
  { icon: ShieldCheck, label: "SOC 2 Type II" },
  { icon: Lock, label: "256-bit encryption" },
  { icon: FileCheck, label: "GDPR compliant" },
  { icon: Server, label: "99.9% uptime" },
];

export default function SocialTrustBadges() {
  return (
    <section className="bg-zinc-50 px-6 py-14">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal effect="A" as="p" className="mb-8 text-center text-sm font-medium tracking-wide text-zinc-500 uppercase">
          Built with confidence
        </ScrollReveal>
        <StaggerGroup className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {BADGES.map(({ icon: Icon, label }) => (
            <ScrollReveal effect="A" key={label} className="flex items-center gap-2 text-zinc-600">
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{label}</span>
            </ScrollReveal>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
