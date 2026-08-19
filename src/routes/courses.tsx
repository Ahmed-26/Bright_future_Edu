import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CourseCard } from "@/components/site/CourseCard";
import { Reveal } from "@/components/site/Reveal";
import { levels } from "@/data/institute";
import { useCollection } from "@/hooks/useSiteContent";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses | O Level, A Level & IGCSE Programmes" },
      {
        name: "description",
        content:
          "Browse Cambridge and Edexcel O Level, A Level and IGCSE courses with fees, schedules, syllabus codes and faculty.",
      },
      { property: "og:title", content: "Courses | Bright Future Group of Education" },
      {
        property: "og:description",
        content: "Filter O Level, A Level and IGCSE courses by level, exam board and subject.",
      },
    ],
  }),
  component: CoursesPage,
});

const PER_PAGE = 6;

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
        active
          ? "border-transparent bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

function CoursesPage() {
  // Catalogue, subject filter and board chips all come from published content.
  const courses = useCollection("courses");
  const subjects = useCollection("subjects");
  const boards = useMemo(() => Array.from(new Set(courses.map((c) => c.board))).sort(), [courses]);

  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All");
  const [board, setBoard] = useState("All");
  const [subject, setSubject] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter(
      (c) =>
        (level === "All" || c.level === level) &&
        (board === "All" || c.board === board) &&
        (subject === "All" || c.subjectSlug === subject) &&
        (q === "" ||
          c.title.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)),
    );
  }, [courses, query, level, board, subject]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const reset = () => {
    setQuery("");
    setLevel("All");
    setBoard("All");
    setSubject("All");
    setPage(1);
  };

  return (
    <>
      <PageHeader
        eyebrow="Academic programmes"
        title="Courses"
        description="Every programme is mapped to the official syllabus, taught in small groups and assessed against real mark schemes."
      />

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by course, subject or syllabus code…"
              aria-label="Search courses"
              className="w-full rounded-xl border border-input bg-background py-3 pl-11 pr-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="mt-6 space-y-4">
            {[
              { label: "Level", value: level, set: setLevel, options: [...levels] },
              { label: "Exam board", value: board, set: setBoard, options: boards },
            ].map((group) => (
              <div key={group.label} className="flex flex-wrap items-center gap-2">
                <span className="mr-1 w-24 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {group.label}
                </span>
                <Chip
                  active={group.value === "All"}
                  onClick={() => {
                    group.set("All");
                    setPage(1);
                  }}
                >
                  All
                </Chip>
                {group.options.map((o) => (
                  <Chip
                    key={o}
                    active={group.value === o}
                    onClick={() => {
                      group.set(o);
                      setPage(1);
                    }}
                  >
                    {o}
                  </Chip>
                ))}
              </div>
            ))}

            <div className="flex flex-wrap items-center gap-3">
              <span className="mr-1 w-24 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Subject
              </span>
              <div className="relative">
                <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={subject}
                  aria-label="Filter by subject"
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setPage(1);
                  }}
                  className="appearance-none rounded-full border border-border bg-card py-2 pl-9 pr-8 text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="All">All subjects</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={reset}
                className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
              >
                Reset filters
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Showing {visible.length} of {filtered.length} courses
        </p>

        {visible.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center">
            <h2 className="text-xl font-semibold">No courses match your search</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different subject or clear the filters to see the full catalogue.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((c, i) => (
              <Reveal key={c.id} delay={i * 60}>
                <CourseCard course={c} />
              </Reveal>
            ))}
          </div>
        )}

        {pages > 1 && (
          <nav className="mt-12 flex justify-center gap-2" aria-label="Pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                aria-current={p === current}
                className={cn(
                  "size-10 rounded-xl border text-sm font-semibold transition-colors",
                  p === current
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-muted",
                )}
              >
                {p}
              </button>
            ))}
          </nav>
        )}

        <div className="mt-16 rounded-2xl bg-hero px-8 py-12 text-center text-primary-foreground">
          <h2 className="text-2xl font-semibold md:text-3xl">Not sure which programme fits?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-primary-foreground/70">
            Tell us the subjects and series your child is sitting and our academic team will map a
            schedule.
          </p>
          <Link
            to="/admissions"
            className="mt-7 inline-flex rounded-full bg-[image:var(--gradient-gold)] px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
          >
            Speak to admissions
          </Link>
        </div>
      </section>
    </>
  );
}
