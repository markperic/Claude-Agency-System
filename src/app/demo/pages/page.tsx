import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import pagesData from "@/registry/pages.json";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

/**
 * /demo/pages — the one category route that isn't modules.json filtered by
 * category and rendered in isolation via ModuleRow (see ../category-page.tsx).
 * A "page" here is a full composition of many modules plus SiteNav/SiteFooter,
 * not a single component that makes sense shown standalone, so this route
 * reads from src/registry/pages.json instead and links out to each page's
 * real route under /examples/ rather than rendering it inline.
 */
export default function PagesCategoryPage() {
  const pages = pagesData.pages;

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
          {pages.length} page{pages.length === 1 ? "" : "s"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">Pages</h1>
        <p className="mx-auto mt-3 max-w-xl text-zinc-600">
          Full example pages assembled from the module catalog — see MODULE-LIBRARY.md for how these are built.
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {pages.map((page) => (
            <Link
              key={page.slug}
              href={page.href}
              className="group rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
            >
              <h2 className="flex items-center gap-1.5 text-lg font-semibold text-zinc-950">
                {page.title}
                <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </h2>
              <p className="mt-1.5 text-sm text-zinc-600">{page.description}</p>
            </Link>
          ))}
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
