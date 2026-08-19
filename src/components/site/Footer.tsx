import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import { useCollection, useSiteSettings } from "@/hooks/useSiteContent";

const pages = [
  { to: "/courses", label: "Courses" },
  { to: "/subjects", label: "Subjects" },
  { to: "/teachers", label: "Teachers" },
  { to: "/achievements", label: "Achievements" },
  { to: "/results", label: "Results" },
  { to: "/admissions", label: "Admissions" },
];

export function Footer() {
  // Live values from the admin panel; the root loader guarantees these exist.
  const site = useSiteSettings();
  const subjects = useCollection("subjects");

  return (
    <footer className="mt-24 bg-hero text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo inverted showText={false} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
            {site.footerNote}
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { href: site.facebook, Icon: Facebook, label: "Facebook" },
              { href: site.instagram, Icon: Instagram, label: "Instagram" },
              { href: site.youtube, Icon: Youtube, label: "YouTube" },
              { href: site.whatsapp, Icon: MessageCircle, label: "WhatsApp" },
            ]
              // Hide a social icon entirely when the admin clears its URL.
              .filter(({ href }) => Boolean(href))
              .map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-xl glass-panel text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Explore</h2>
          <ul className="mt-5 space-y-3 text-sm text-primary-foreground/70">
            {pages.map((p) => (
              <li key={p.to}>
                <Link to={p.to} className="transition-colors hover:text-accent">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Subjects
          </h2>
          <ul className="mt-5 space-y-3 text-sm text-primary-foreground/70">
            {subjects.slice(0, 6).map((s) => (
              <li key={s.id}>
                <Link to="/courses" className="transition-colors hover:text-accent">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Visit us
          </h2>
          <ul className="mt-5 space-y-4 text-sm text-primary-foreground/70">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" /> {site.address}
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-accent" /> {site.phone}
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-accent" /> {site.email}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-accent">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-accent">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
