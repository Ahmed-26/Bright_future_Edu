import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BookOpen, CalendarDays, CheckCircle2, Clock, GraduationCap, Landmark, UserRound, Wallet } from "lucide-react";
import { courses } from "@/data/institute";
import { CourseCard } from "@/components/site/CourseCard";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/courses/$slug")({
  loader: ({ params }) => {
    const course = courses.find((c) => c.slug === params.slug);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.course;
    const title = c ? `${c.title} (${c.code}) | Course Details` : "Course Details";
    const description = c?.short ?? "Course details.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CourseDetails,
});

function CourseDetails() {
  const { course } = Route.useLoaderData();
  const related = courses
    .filter((c) => c.slug !== course.slug && (c.subjectSlug === course.subjectSlug || c.level === course.level))
    .slice(0, 3);

  const facts = [
    { Icon: GraduationCap, label: "Level", value: course.level },
    { Icon: Landmark, label: "Exam board", value: course.board },
    { Icon: BookOpen, label: "Syllabus code", value: course.code },
    { Icon: Clock, label: "Duration", value: course.duration },
    { Icon: CalendarDays, label: "Schedule", value: course.schedule },
    { Icon: UserRound, label: "Teacher", value: course.teacher },
    { Icon: Wallet, label: "Fee", value: course.fee },
  ];

  return (
    <>
      <section className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <nav className="text-xs text-primary-foreground/60">
            <Link to="/courses" className="hover:text-accent">
              Courses
            </Link>
            <span className="px-2">/</span>
            <span>{course.subject}</span>
          </nav>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-[image:var(--gradient-gold)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-accent-foreground">
              {course.level}
            </span>
            <span className="rounded-full glass-panel px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em]">
              {course.board}
            </span>
            <span className="rounded-full glass-panel px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em]">
              Code {course.code}
            </span>
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold md:text-5xl">{course.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/70">{course.short}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-12">
            <Reveal>
              <h2 className="text-2xl font-semibold">Course description</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{course.description}</p>
            </Reveal>

            <Reveal>
              <h2 className="text-2xl font-semibold">Syllabus &amp; topics covered</h2>
              <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                {course.syllabus.map((s, i) => (
                  <li
                    key={s}
                    className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm shadow-card"
                  >
                    <span className="font-display text-sm font-semibold text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-foreground">{s}</span>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal>
              <h2 className="text-2xl font-semibold">What students will learn</h2>
              <ul className="mt-5 space-y-3">
                {course.benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-secondary" />
                    {b}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h2 className="text-2xl font-semibold">Requirements</h2>
              <ul className="mt-5 space-y-3">
                {course.requirements.map((r) => (
                  <li key={r} className="flex gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                    {r}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tuition</p>
              <p className="mt-2 font-display text-3xl font-semibold text-primary">{course.fee}</p>
              <dl className="mt-6 space-y-4 border-t border-border pt-6">
                {facts.map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="mt-0.5 size-4 shrink-0 text-secondary" />
                    <div>
                      <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
                      <dd className="text-sm font-medium text-foreground">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <Link
                to="/admissions"
                className="mt-7 block rounded-xl bg-[image:var(--gradient-primary)] px-5 py-3.5 text-center text-sm font-semibold text-primary-foreground shadow-elegant transition-transform hover:-translate-y-0.5"
              >
                Enroll in This Course
              </Link>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-semibold">Related courses</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((c, i) => (
                <Reveal key={c.slug} delay={i * 60}>
                  <CourseCard course={c} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
