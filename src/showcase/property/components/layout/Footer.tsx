import Link from "next/link";
import type { FooterContent } from "@/showcase/property/content";
import { Button } from "@/showcase/property/components/ui/Button";
import { Icon } from "@/showcase/property/components/ui/Icon";
import { Media } from "@/showcase/property/components/ui/Media";

function FooterLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-20 text-tiny font-medium uppercase">{children}</p>;
}

export function Footer({ content }: { content: FooterContent }) {
  const { photo, menu, address, contact, social, actions, note, legal } = content;
  return (
    <footer id="location" className="bg-paper py-20 desk:py-160">
      <div className="mx-gutter flex flex-col gap-30 desk:flex-row desk:gap-97">
        <div className="relative aspect-[350/220] overflow-hidden desk:aspect-[337/419] desk:w-337 desk:shrink-0">
          <Media media={photo} sizes="(min-width: 901px) 24vw, 90vw" />
        </div>

        <nav className="desk:w-250 desk:shrink-0">
          <FooterLabel>{menu.label}</FooterLabel>
          <ul className="flex flex-col desk:gap-11">
            {menu.links.map((link) => (
              <li key={link.label} className="text-menu text-ink-alt">
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-30 desk:w-250 desk:shrink-0 desk:gap-70">
          <div className="flex flex-col gap-6">
            <FooterLabel>{address.label}</FooterLabel>
            <p className="whitespace-pre-line text-muted">{address.text}</p>
          </div>
          <div className="flex flex-col gap-6">
            <FooterLabel>{contact.label}</FooterLabel>
            <Link href={contact.email.href} className="font-medium text-brand">
              {contact.email.label}
            </Link>
            <Link href={contact.phone.href} className="mt-4 font-medium text-ink-alt">
              {contact.phone.label}
            </Link>
          </div>
          <div className="flex flex-col gap-6">
            <FooterLabel>{social.label}</FooterLabel>
            <ul className="flex gap-20">
              {social.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} aria-label={link.label} className="flex size-[24px] items-center justify-center">
                    <Icon name={link.icon} className="size-[24px]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col desk:w-250 desk:shrink-0">
          <FooterLabel>{actions.label}</FooterLabel>
          <div className="mb-24 flex flex-col items-start gap-10">
            {actions.buttons.map((button) => (
              <Button key={button.label} link={button} />
            ))}
          </div>
          {note && (
            <div className="flex flex-col gap-6 desk:mt-auto">
              <FooterLabel>{note.label}</FooterLabel>
              <p className="whitespace-pre-line text-muted">{note.text}</p>
            </div>
          )}
          <ul className={`flex flex-col gap-5 ${note ? "" : "desk:mt-auto"}`}>
            {legal.map((link) => (
              <li key={link.label} className="text-tiny text-muted">
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
