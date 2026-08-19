import { cn } from "@/lib/utils";
import logo from "@/assets/logo/P_logo.png";
import { site } from "@/data/institute";

export function Logo({
  inverted = false,
  className,
  showText = true,
}: {
  inverted?: boolean;
  className?: string;
  showText?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <img
        src={logo}
        alt="Bright Future Group of Education logo"
        className="block h-18 w-auto max-w-none shrink-0 object-contain sm:h-20 lg:h-24"
        loading="eager"
        decoding="async"
      />
      {showText && (
        <span className="min-w-0 leading-tight">
          <span
            className="block text-sm font-bold tracking-tight sm:text-base lg:text-lg"
            style={{ color: "#0f4879" }}
          >
            Bright Future
          </span>
          <span
            className="block text-xs font-semibold tracking-[0.18em] sm:text-sm lg:text-[0.95rem]"
            style={{ color: "#545454" }}
          >
            Group of Education
          </span>
        </span>
      )}
    </span>
  );
}
