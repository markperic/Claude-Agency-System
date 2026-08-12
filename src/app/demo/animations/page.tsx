import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AnimationCatalog from "../animation-catalog";

export default function AnimationsPage() {
  return (
    <main>
      <div className="border-b border-white/10 bg-zinc-950 px-6 pt-8">
        <Link
          href="/demo"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          All categories
        </Link>
      </div>
      <AnimationCatalog />
    </main>
  );
}
