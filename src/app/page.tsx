import Link from "next/link";
import { ArrowRight } from "lucide-react";
import modulesData from "@/registry/modules.json";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CATEGORIES } from "@/registry/categories";

function countFor(slug: string) {
  return modulesData.modules.filter((mod) => mod.category === slug).length;
}

/**
 * Homepage — the catalog index, linking out to one page per module
 * category plus the animation effect catalog. This used to live at /demo
 * (see src/app/example for the old homepage, a single worked-example
 * composition); the catalog outgrew being a secondary page once the module
 * count made "browse by category" the more useful front door than any one
 * fixed layout.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <SiteNav />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <p className="mb-3 text-sm font-medium tracking-wide text-zinc-500 uppercase">
            Claude Agency System
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Module &amp; animation catalog
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-zinc-600">
            {modulesData.modules.length} modules across {CATEGORIES.length} categories, plus every
            animation effect from A to J shown on its own. Pick a category to browse.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/demo/${cat.slug}`}
              className="group rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
            >
              <p className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
                {countFor(cat.slug)} module{countFor(cat.slug) === 1 ? "" : "s"}
              </p>
              <h2 className="mt-2 flex items-center gap-1.5 text-lg font-semibold text-zinc-950">
                {cat.title}
                <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </h2>
              <p className="mt-1.5 text-sm text-zinc-600">{cat.description}</p>
            </Link>
          ))}

          <Link
            href="/demo/animations"
            className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition-colors hover:bg-zinc-900"
          >
            <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">10 effects</p>
            <h2 className="mt-2 flex items-center gap-1.5 text-lg font-semibold text-white">
              Animation catalog
              <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </h2>
            <p className="mt-1.5 text-sm text-zinc-400">Effects A–J, demonstrated live, with a replay control.</p>
          </Link>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
