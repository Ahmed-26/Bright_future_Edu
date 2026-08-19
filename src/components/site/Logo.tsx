import { cn } from "@/lib/utils";
import logo from "@/assets/logo/P_logo.png";
import { useSiteSettings } from "@/hooks/useSiteContent";

/**
 * Splits the institute name so the wordmark keeps its two-line look no matter
 * what the admin types. "Bright Future Group of Education" renders as
 * "Bright Future" / "Group of Education"; a two-word name puts one word on each
 * line; a single word renders on one line.
 */
function splitName(name: string): [string, string] {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return [name.trim(), ""];
  const head = Math.min(2, words.length - 1);
  return [words.slice(0, head).join(" "), words.slice(head).join(" ")];
}

export function Logo({
  inverted = false,
  className,
  showText = true,
}: {
  inverted?: boolean;
  className?: string;
  showText?: boolean;
}) {
  const site = useSiteSettings();
  // A logo uploaded in the admin panel wins; otherwise use the bundled asset.
  const src = site.logoUrl && site.logoUrl !== "/assets/logo.png" ? site.logoUrl : logo;
  const [primary, secondary] = splitName(site.name);

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <img
        src={src}
        alt={`${site.name} logo`}
        className="block h-18 w-auto max-w-none shrink-0 object-contain sm:h-20 lg:h-24"
        loading="eager"
        decoding="async"
      />
      {showText && (
        <span className="min-w-0 leading-tight">
          <span
            className="block text-sm font-bold tracking-tight sm:text-base lg:text-lg"
            style={{ color: inverted ? "#ffffff" : "#0f4879" }}
          >
            {primary}
          </span>
          {secondary && (
            <span
              className="block text-xs font-semibold tracking-[0.18em] sm:text-sm lg:text-[0.95rem]"
              style={{ color: inverted ? "rgba(255,255,255,0.72)" : "#545454" }}
            >
              {secondary}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
