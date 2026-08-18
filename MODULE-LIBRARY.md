# Module Library — how this repo works

This project exists to solve one problem: AI-assisted page building is only as
consistent as the library it composes from. Instead of asking Claude to invent
a hero section, a pricing grid, or an animation from scratch on every project
(which is where quality swings project to project), Claude composes pages from
a small, fixed, numbered catalog of pre-built, well-designed, responsive
modules — the same way a curated Divi/Webflow layout pack works, just as real
code in this repo.

## The two catalogs

**Modules** — `src/registry/modules/`, indexed in `src/registry/modules.json`.
Each is a numbered, self-contained React component: a hero, a feature grid, a
pricing table, and so on. Numbers are stable — module 5 is always Content
Split, don't renumber existing entries when adding new ones (append instead).

**Animation effects** — `src/registry/lib/motion-variants.tsx`, catalogued as
`effectCatalog`. Eleven named effects (A–K), each used consistently everywhere
rather than one-off animations invented per component. Effects are either
`entrance` (plays once, on load or on scroll-into-view), `scroll` (linked to
scroll position, e.g. parallax), or `hover` (a micro-interaction, not an
entrance).

## The workflow this enables

Talk to Claude Code the way you'd talk about a layout pack:

> "Use module 2 at the top of the page, module 4 under that, then module 5
> with its title on effect B, then module 14 with scroll animation on the
> images."

Claude can resolve every part of that sentence to something concrete:
- "module 2" / "module 5" / "module 14" → real files, looked up in `modules.json`
- "effect B" → a real, already-implemented animation in `motion-variants.tsx`
- "scroll animation on the images" → Effect H (Scroll Parallax), already wired
  into module 14's `<ParallaxImage>` wrappers

See `src/app/example/page.tsx` for a worked example assembling nine modules
this way; the homepage itself (`src/app/page.tsx`) is the catalog index.

## Adding a new module

1. Design it — Tailwind for layout/style, pulling `Reveal` / `ScrollReveal` /
   `StaggerGroup` / `ParallaxImage` / `HoverLift` / `ShimmerText` from
   `@/registry/lib/motion-variants` for animation, exactly like the existing
   modules do. Don't hand-roll a new animation approach — pick from A–J, or
   add a new letter to the catalog if none of them fit (rare; think hard
   before adding one, the point is a small consistent set).
2. Save it as `src/registry/modules/NN-short-name.tsx`, next available number.
3. Add an entry to `src/registry/modules.json` — name, category, file,
   component, description, and which named elements are meant to be adjusted
   (the `editable` map).
4. Register it in `src/app/demo/module-registry.tsx` — import it and add the
   `id: Component` mapping. The manifest and that lookup are separate, and
   nothing checks they agree: a module listed in `modules.json` but missing
   from the lookup renders as `undefined`, which fails `next build` at the
   prerender step with "Element type is invalid" naming only the demo page.
5. Give every prop a default, so the module renders bare. The demo pages mount
   each module as `<Component />` with no props, and the lookup is typed
   `ComponentType`, which admits none — a required prop is a type error at
   build time. Follow module 86 or 98: default the data prop to a `DEFAULT_*`
   const and put `= {}` on the destructured parameter.
6. That's it — no build step, no registry to publish to. It's just a file, a
   manifest entry and a lookup line.

Run `npm run build` after adding one. Steps 4 and 5 both fail there and
nowhere else — the dev server renders the example page perfectly while the
production build cannot prerender `/demo/<category>`.

Good sources to pull inspiration or starting markup from, if you're not
designing from scratch: 21st.dev and its Magic MCP (large searchable React
component catalog, shadcn-compatible), Aceternity UI, Magic UI, and
ReactBits for animation-forward marketing components, and Tailark for
shadcn-flavored marketing blocks specifically (not app-dashboard UI). Adapt
what you pull in to use this repo's `motion-variants` system rather than
whatever animation approach the source used, so it stays consistent with
everything else in the catalog.

Note: this project's initial scaffold was built inside a sandboxed session
that blocked network access to `ui.shadcn.com` and similar registries, so the
starter set of 15 modules here was hand-authored rather than pulled from
those sources. On a normal machine those registries should be reachable
fine — this is a sandbox-specific limitation, not a limitation of the
approach itself.

## Adding a new animation effect

Edit `src/registry/lib/motion-variants.tsx`: add the effect's description to
`effectCatalog` and its actual values to `variants` (or, for scroll/hover
effects that need real logic rather than static variants — like H's
scroll-linked transform — add a new exported component alongside
`ParallaxImage` and `HoverLift`). Keep the total set small; it's meant to be
a vocabulary, not an ever-growing pile of one-offs.

## What this repo is not

It's a page-assembly and consistency layer, not a CMS. If a client needs to
self-edit content, pair this with a headless CMS (Sanity, Payload, or
similar) rather than expecting non-technical editing here.
