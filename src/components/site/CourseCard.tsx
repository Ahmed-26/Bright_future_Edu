import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, UserRound } from "lucide-react";
import type { CourseRecord } from "@/lib/cms-types";

export function CourseCard({ course }: { course: CourseRecord }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elegant">
      <div className="relative h-32 overflow-hidden bg-[image:var(--gradient-primary)]">
        {course.image ? (
          <img src={course.image} alt="" className="absolute inset-0 size-full object-cover opacity-80" />
        ) : (
          <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_45%)]" />
        )}
        <div className="relative flex h-full items-end justify-between p-5">
          <span className="rounded-full bg-[image:var(--gradient-gold)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-accent-foreground">
            {course.level}
          </span>
          <span className="font-display text-2xl text-primary-foreground/85">{course.code}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {course.subject} · {course.board}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-foreground">
          <Link to="/courses/$slug" params={{ slug: course.slug }} className="after:absolute">
            {course.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{course.short}</p>

        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-secondary" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserRound className="size-4 text-secondary" />
            <span className="truncate">{course.teacher}</span>
          </div>
        </dl>

        <div className="mt-6 flex items-center justify-between gap-3">
          <span className="font-display text-lg font-semibold text-primary">{course.fee}</span>
          <div className="flex gap-2">
            <Link
              to="/courses/$slug"
              params={{ slug: course.slug }}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Details <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/admissions"
              className="rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-glow"
            >
              Enroll
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}