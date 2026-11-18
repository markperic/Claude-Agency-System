/**
 * Static stand-in for the client project's live booking-widget button.
 * There is no real booking backend for a fictional club, so this just scrolls
 * to the page's booking section instead of opening a third-party form.
 */
export function BookButton({
  className = "btn-gold",
  style,
  children = "Book a table",
}: {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <a href="#restaurant-bookings" className={className} style={style}>
      {children}
    </a>
  );
}
