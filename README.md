# Claude Agency System

A numbered, animated component library and Next.js starter kit for composing
client marketing sites with Claude Code — instead of designing every hero,
CTA, and pricing grid from scratch each project, Claude composes pages from a
small, fixed, well-designed catalog. See **[MODULE-LIBRARY.md](./MODULE-LIBRARY.md)**
for the full explanation and the workflow this is built around.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the homepage
(`src/app/page.tsx`) is a working example assembling nine of the fifteen
starter modules end to end, including a title on Effect B (module 5) and
scroll-linked parallax images (module 14).

## What's here

```
src/registry/
  modules/            15 numbered, self-contained marketing sections
  modules.json         the catalog Claude Code reads to resolve "module N"
  lib/motion-variants.tsx   the A–J animation effect system, shared by every module
src/app/page.tsx       worked example composing modules into a page
MODULE-LIBRARY.md      how the system works, how to extend it
CLAUDE.md              project instructions Claude Code loads automatically
```

Stack: Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Motion (the
React animation library formerly known as Framer Motion) · TypeScript.

## Using this on a new client project

This repo is meant to be the reusable base, not a one-off site. The usual
pattern: start a new project from this one (clone, or use it as a template),
strip `src/app/page.tsx` back to a blank page, then build the client's actual
pages by telling Claude Code which modules to use, in what order, with which
effects — see the worked example in MODULE-LIBRARY.md. Grow the catalog over
time as you build; new modules benefit every future project.

## Deploying

Standard Next.js app — deploys as-is to Vercel, Netlify, or any Node hosting.
See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).
