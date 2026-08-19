import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Atom,
  BookText,
  Building2,
  Calculator,
  FlaskConical,
  Globe2,
  Landmark,
  Languages,
  Leaf,
  LineChart,
  Moon,
  Terminal,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { subjects } from "@/data/institute";

export const Route = createFileRoute("/subjects")({
  head: () => ({
    meta: [
      { title: "Subjects | Accounting, Sciences, Mathematics & More" },
      {
        name: "description",
        content:
          "Explore every subject taught at the academy across O Level, A Level and IGCSE, from Accounting to Pakistan Studies.",
      },
      { property: "og:title", content: "Subjects | Meridian Academy" },
      { property: "og:description", content: "All O Level, A Level and IGCSE subjects we teach." },
    ],
  }),
  component: SubjectsPage,
});

const icons: Record<string, typeof Atom> = {
  accounting: Landmark,
  business: Building2,
  economics: LineChart,
  mathematics: Calculator,
  physics: Atom,
  chemistry: FlaskConical,
  biology: Leaf,
  "computer-science": Terminal,
  english: BookText,
  urdu: Languages,
  islamiat: Moon,
  "pakistan-studies": Globe2,
};

function SubjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="What we teach"
        title="Subjects"
        description="Twelve core subjects taught by dedicated subject heads, each with syllabus-mapped notes and a decade of past papers."
      />

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s, i) => {
            const Icon = icons[s.slug] ?? BookText;
            return (
              <Reveal key={s.slug} delay={(i % 3) * 70}>
                <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-secondary/60 hover:shadow-elegant">
                  <span className="grid size-12 place-items-center rounded-xl bg-muted text-primary transition-colors group-hover:bg-[image:var(--gradient-primary)] group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <h2 className="mt-5 text-xl font-semibold">{s.name}</h2>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.levels.map((l) => (
                      <span
                        key={l}
                        className="rounded-full bg-muted px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {s.courses} course{s.courses > 1 ? "s" : ""}
                    </span>
                    <Link
                      to="/courses"
                      className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      View courses
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
