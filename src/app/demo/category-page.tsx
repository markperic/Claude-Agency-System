import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import modulesData from "@/registry/modules.json";
import { SiteNav } from "@/components/site-nav";
import { ModuleRow } from "./module-registry";

/**
 * Shared shell for every /demo category route (see src/registry/categories.ts
 * for the full list): filters the catalog by category, sorts by id, and
 * renders each module with its label bar via ModuleRow. Categories with no
 * modules yet (like Utility) render an empty-state message instead.
 */
export function CategoryModulesPage({
  category,
  title,
  description,
}: {
  category: string;
  title: string;
  description: string;
}) {
  const mods = modulesData.modules
    .filter((mod) => mod.category === category)
    .sort((a, b) => a.id - b.id);

  return (
    <main className="bg-white">
      <SiteNav />
      <div className="border-b border-zinc-200 bg-white px-6 py-16 text-center">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-800"
        >
          <ArrowLeft className="h-4 w-4" />
          All categories
        </Link>
        <p className="mb-3 text-sm font-medium tracking-wide text-zinc-500 uppercase">
          {mods.length} module{mods.length === 1 ? "" : "s"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-zinc-600">{description}</p>
      </div>

      {mods.length === 0 ? (
        <p className="px-6 py-16 text-center text-sm text-zinc-500">
          No modules here yet — check back once one&apos;s been added to this category.
        </p>
      ) : (
        mods.map((mod) => <ModuleRow key={mod.id} id={mod.id} name={mod.name} category={mod.category} />)
      )}
    </main>
  );
}
