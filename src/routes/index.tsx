import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarCheck2,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Medal,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import campus from "@/assets/hero-students.jpg";
import { Counter } from "@/components/site/Counter";
import { CourseCard } from "@/components/site/CourseCard";
import { Reveal } from "@/components/site/Reveal";
import { Route as RootRoute } from "@/routes/__root";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bright Future Group of Education | O Level, A Level & IGCSE Institute" },
      {
        name: "description",
        content:
          "Premium O Level, A Level and IGCSE preparation with experienced teachers, focused learning and proven academic results.",
      },
      {
        property: "og:title",
        content: "Bright Future Group of Education | O Level, A Level & IGCSE",
      },
      {
        property: "og:description",
        content:
          "Premium O Level, A Level and IGCSE preparation with experienced teachers and proven academic results.",
      },
    ],
  }),
  component: HomePage,
});

const featureIcons = [
  Users,
  ShieldCheck,
  BookOpen,
  CalendarCheck2,
  CheckCircle2,
  Sparkles,
  Medal,
  Award,
];

function HomePage() {
  const catalog = RootRoute.useLoaderData();
  const {
    homepage,
    stats,
    examBoards,
    subjects,
    teachers,
    courses,
    results,
    achievements,
    testimonials,
    whyChooseUs,
  } = catalog;
  const popularCourses = courses.filter((course) => course.featured).slice(0, 6);
  const popularSubjects = subjects.filter((subject) => subject.featured).slice(0, 8);
  const featuredTeachers = teachers.filter((teacher) => teacher.featured).slice(0, 4);
  const featuredResults = results.filter((result) => result.featured).slice(0, 6);
  const featuredAchievements = achievements.filter((item) => item.featured).slice(0, 4);
  const testimonialsPreview = testimonials.filter((item) => item.featured).slice(0, 4);
  const heroBullets = homepage.heroBullets;
  const heroImage = homepage.heroImage || campus;

  return (
    <div className="overflow-hidden">
      <section className="relative bg-hero text-primary-foreground">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-7xl items-center gap-14 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <Reveal className="relative z-10 max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/80 backdrop-blur-md">
              <GraduationCap className="size-4 text-accent" />
              {homepage.heroEyebrow}
            </p>
            <h1 className="mt-6 text-5xl font-semibold leading-[0.98] text-balance md:text-6xl lg:text-7xl">
              {homepage.heroHeading}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/78 md:text-xl">
              {homepage.heroDescription}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {heroBullets.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-primary-foreground/82 backdrop-blur-md"
                >
                  <CheckCircle2 className="size-4 text-accent" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={homepage.heroPrimaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[image:var(--gradient-gold)] px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-elegant transition-transform duration-200 hover:-translate-y-0.5"
              >
                {homepage.heroPrimaryLabel} <ArrowRight className="size-4" />
              </a>
              <a
                href={homepage.heroSecondaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/18 bg-white/8 px-6 py-3.5 text-sm font-semibold text-primary-foreground backdrop-blur-md transition-colors hover:bg-white/14"
              >
                {homepage.heroSecondaryLabel} <ChevronRight className="size-4" />
              </a>
            </div>

            <dl className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.slice(0, 3).map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-md"
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/62">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 font-display text-3xl font-semibold text-primary-foreground">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </dd>
                  <p className="mt-1 text-xs text-primary-foreground/55">
                    Trusted academic momentum
                  </p>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={140} className="relative">
            <div className="absolute -left-6 top-10 size-20 rounded-full border border-white/20 bg-white/8 backdrop-blur-md" />
            <div className="absolute -right-4 bottom-16 size-16 rounded-2xl bg-[image:var(--gradient-gold)] shadow-elegant" />
            <div className="absolute left-10 top-0 size-12 rounded-2xl border border-white/18 bg-white/10 backdrop-blur-md" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/14 bg-white/8 p-4 shadow-elegant backdrop-blur-xl">
              <img
                src={heroImage}
                alt="Students studying together at the academy"
                loading="eager"
                width={1280}
                height={1024}
                className="aspect-[4/5] w-full rounded-[1.5rem] object-cover object-center"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-[1.25rem] border border-white/14 bg-slate-950/35 p-4 backdrop-blur-md">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/65">
                      Academic focus
                    </p>
                    <p className="mt-1 font-display text-xl font-semibold text-primary-foreground">
                      {homepage.heroCaption}
                    </p>
                  </div>
                  <div className="grid size-14 place-items-center rounded-2xl bg-[image:var(--gradient-gold)] text-accent-foreground shadow-card">
                    <Star className="size-6" />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border/60 bg-background/95">
        <div className="mx-auto max-w-7xl px-5 py-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {examBoards.map((board, index) => (
              <Reveal key={board.name} delay={index * 55}>
                <div className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elegant">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted text-primary transition-colors group-hover:bg-[image:var(--gradient-primary)] group-hover:text-primary-foreground">
                    <ShieldCheck className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{board.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {board.note}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 60}>
                <div className="rounded-2xl border border-border bg-card p-7 text-center shadow-card">
                  <p className="font-display text-4xl font-semibold text-primary">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SectionHeading
        eyebrow="Popular courses"
        title="Popular Courses"
        description="Featured programmes pulled from the existing course catalogue and presented in the same design system."
      />
      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {popularCourses.map((course, index) => (
            <Reveal key={course.slug} delay={index * 70}>
              <CourseCard course={course} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-card transition-colors hover:bg-muted"
          >
            View All Courses <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <SectionHeading
        eyebrow="What we teach"
        title="Popular Subjects"
        description="Subject coverage across O Level, A Level and IGCSE with course counts already built into the source data."
      />
      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popularSubjects.map((subject, index) => {
            const Icon = featureIcons[index % featureIcons.length];
            return (
              <Reveal key={subject.slug} delay={index * 55}>
                <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elegant">
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid size-12 place-items-center rounded-xl bg-muted text-primary transition-colors group-hover:bg-[image:var(--gradient-primary)] group-hover:text-primary-foreground">
                      <Icon className="size-5" />
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {subject.courses} course{subject.courses === 1 ? "" : "s"}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-foreground">{subject.name}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {subject.levels.map((level) => (
                      <span
                        key={level}
                        className="rounded-full bg-muted px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                      >
                        {level}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {subject.description}
                  </p>
                  <Link
                    to="/courses"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    View Courses <ArrowRight className="size-4" />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/subjects"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-card transition-colors hover:bg-muted"
          >
            Explore All Subjects <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
              Why choose us
            </p>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">{homepage.whyTitle}</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {homepage.whyDescription}
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item, index) => {
              const Icon = featureIcons[index % featureIcons.length];
              return (
                <Reveal key={item.title} delay={(index % 4) * 70}>
                  <article className="h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elegant">
                    <div className="grid size-11 place-items-center rounded-xl bg-muted text-primary">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <SectionHeading
        eyebrow="The faculty"
        title="Featured Teachers"
        description="A preview of the experienced subject specialists already powering the site’s teachers section."
      />
      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredTeachers.map((teacher, index) => (
            <Reveal key={teacher.slug} delay={index * 70}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elegant">
                <div className="relative grid h-48 place-items-center bg-[image:var(--gradient-primary)]">
                  <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_70%_20%,white,transparent_45%)]" />
                  <span className="relative grid size-20 place-items-center overflow-hidden rounded-full glass-panel font-display text-2xl font-semibold text-primary-foreground">
                    {teacher.image ? (
                      <img src={teacher.image} alt="" className="size-full object-cover" />
                    ) : (
                      teacher.initials
                    )}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold text-foreground">{teacher.name}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                    {teacher.designation}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {teacher.bio}
                  </p>
                  <dl className="mt-5 space-y-2 border-t border-border pt-5 text-xs text-muted-foreground">
                    <div className="flex justify-between gap-3">
                      <dt>Qualification</dt>
                      <dd className="text-right font-medium text-foreground">
                        {teacher.qualification}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt>Experience</dt>
                      <dd className="font-medium text-foreground">{teacher.experience}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt>Subjects</dt>
                      <dd className="text-right font-medium text-foreground">
                        {teacher.subjects.join(", ")}
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/teachers"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-card transition-colors hover:bg-muted"
          >
            Meet Our Teachers <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Reveal>
              <div className="rounded-[2rem] border border-border bg-card p-8 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
                  Results preview
                </p>
                <h2 className="mt-4 text-3xl font-semibold">Achievements and results</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  A preview of the published results and achievements already represented elsewhere
                  in the site.
                </p>

                <div className="mt-8 space-y-4">
                  {featuredAchievements.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-border bg-background/70 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            {item.category}
                          </p>
                          <h3 className="mt-1 text-base font-semibold text-foreground">
                            {item.title}
                          </h3>
                        </div>
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                          {item.year}
                        </span>
                      </div>
                      {item.student && (
                        <p className="mt-2 text-sm font-medium text-foreground">{item.student}</p>
                      )}
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/results"
                    className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-5 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform hover:-translate-y-0.5"
                  >
                    View Results <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    to="/achievements"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    View Achievements <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="grid gap-5 sm:grid-cols-2">
                {featuredResults.map((result) => (
                  <article
                    key={`${result.student}-${result.subject}-${result.year}`}
                    className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elegant"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          {result.level}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-foreground">
                          {result.subject}
                        </h3>
                      </div>
                      <span className="grid size-14 place-items-center rounded-2xl bg-[image:var(--gradient-gold)] font-display text-2xl font-bold text-accent-foreground">
                        {result.grade}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">{result.student}</p>
                    <dl className="mt-5 space-y-2 border-t border-border pt-5 text-xs text-muted-foreground">
                      <div className="flex justify-between gap-3">
                        <dt>Exam board</dt>
                        <dd className="font-medium text-foreground">{result.board}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt>Year</dt>
                        <dd className="font-medium text-foreground">{result.year}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <SectionHeading
        eyebrow="Parent and student voices"
        title="Testimonials"
        description="A lightweight slider built from the existing testimonial data, without adding a new dependency."
      />
      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:thin]">
          {testimonialsPreview.map((testimonial, index) => (
            <Reveal
              key={testimonial.name}
              delay={index * 70}
              className="min-w-[320px] flex-1 snap-start sm:min-w-[360px] lg:min-w-[420px]"
            >
              <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="grid size-12 place-items-center rounded-full bg-[image:var(--gradient-primary)] font-semibold text-primary-foreground">
                      {testimonial.initials}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {testimonial.name}
                      </h3>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {testimonial.level} · {testimonial.course}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-accent">
                    {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                      <Star key={starIndex} className="size-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="mt-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                  “{testimonial.text}”
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-hero px-8 py-14 text-center text-primary-foreground shadow-elegant sm:px-12">
          <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_32%),radial-gradient(circle_at_85%_25%,rgba(255,255,255,0.2),transparent_28%)]" />
          <div className="relative mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              {homepage.ctaEyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">{homepage.ctaHeading}</h2>
            <p className="mt-4 text-base leading-relaxed text-primary-foreground/72">
              {homepage.ctaDescription}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={homepage.ctaPrimaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[image:var(--gradient-gold)] px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-elegant transition-transform hover:-translate-y-0.5"
              >
                {homepage.ctaPrimaryLabel} <ArrowRight className="size-4" />
              </a>
              <a
                href={homepage.ctaSecondaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/18 bg-white/8 px-6 py-3.5 text-sm font-semibold text-primary-foreground backdrop-blur-md transition-colors hover:bg-white/14"
              >
                {homepage.ctaSecondaryLabel} <ChevronRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
          {eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-semibold md:text-4xl">{title}</h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </section>
  );
}
