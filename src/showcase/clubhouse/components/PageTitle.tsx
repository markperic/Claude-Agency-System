/** Simple title band for pages without a hero image — ported from the client project's own PageTitle, used the same way: any page whose Sanity document carries no hero slides falls back to this. */
export function PageTitle({ title, eyebrow, children }: { title: string; eyebrow?: string; children?: React.ReactNode }) {
  return (
    <section className="bg-forest-deep pb-16 pt-40 text-cream sm:pb-20 sm:pt-48">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {eyebrow && <p className="eyebrow mb-4 text-gold-light">{eyebrow}</p>}
        <h1 className="max-w-4xl font-display text-5xl leading-[1.05] [text-wrap:balance] sm:text-7xl">{title}</h1>
        {children}
      </div>
    </section>
  );
}
