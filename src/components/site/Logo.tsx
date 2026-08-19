import { cn } from "@/lib/utils";
import logo from "@/assets/logo/P_logo.png";

export function Logo({
  inverted = false,
  className,
  showText = true,
  src,
  name,
}: {
  inverted?: boolean;
  className?: string;
  showText?: boolean;
  src?: string;
  name?: string;
}) {
  const title = name || "Bright Future Group of Education";
  const parts = title.split(" Group of Education");
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <img
        src={src || logo}
        alt={`${title} logo`}
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
            {parts[0] || "Bright Future"}
          </span>
          <span
            className="block text-xs font-semibold tracking-[0.18em] sm:text-sm lg:text-[0.95rem]"
            style={{ color: inverted ? "rgba(255,255,255,0.7)" : "#545454" }}
          >
            Group of Education
          </span>
        </span>
      )}
    </span>
  );
}
