import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import type { PublicCatalog } from "@/lib/cms-types";

const pages = [
  { to: "/courses", label: "Courses" },
  { to: "/subjects", label: "Subjects" },
  { to: "/teachers", label: "Teachers" },
  { to: "/achievements", label: "Achievements" },
  { to: "/results", label: "Results" },
  { to: "/admissions", label: "Admissions" },
];

export function Footer({ catalog }: { catalog: PublicCatalog }) {
  const site = catalog.settings;
  const subjects = catalog.subjects;
  return (
    <footer className="mt-24 bg-hero text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo inverted showText={false} src={site.logo} name={site.name} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
            {site.footerText}
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { href: site.socials.facebook, Icon: Facebook, label: "Facebook" },
              { href: site.socials.instagram, Icon: Instagram, label: "Instagram" },
              { href: site.socials.youtube, Icon: Youtube, label: "YouTube" },
              { href: site.socials.whatsapp, Icon: MessageCircle, label: "WhatsApp" },
            ].map(({ href, Icon, label }) => (
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
              <li key={s.slug}>
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
            © {new Date().getFullYear()} {site.name}
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
