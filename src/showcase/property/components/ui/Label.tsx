/** Square dot + uppercase label. */
export function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-20 ${className}`}>
      <span className="size-10 bg-cream" />
      <span className="text-body font-medium uppercase leading-[1.5]">{children}</span>
    </div>
  );
}
