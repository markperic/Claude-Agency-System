@AGENTS.md

# Claude Agency System

@MODULE-LIBRARY.md

Read MODULE-LIBRARY.md above before building or editing any page. This repo's
whole point is that pages are composed from the numbered module catalog in
`src/registry/modules/` (indexed in `src/registry/modules.json`) and the
animation effect catalog in `src/registry/lib/motion-variants.tsx`, not
designed fresh per request. When asked to build or change a page, prefer
"which existing module fits" over "design something new" — and when
something new is genuinely needed, add it to the catalog (see
MODULE-LIBRARY.md's "Adding a new module" section) rather than writing a
one-off component that isn't reusable next time.
