import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Award } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { useCollection } from "@/hooks/useSiteContent";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements | Awards, Scholarships & Milestones" },
      {
        name: "description",
        content:
          "Student distinctions, academic awards, competition placings, scholarships and institute milestones.",
      },
      { property: "og:title", content: "Achievements | Bright Future Group of Education" },
      {
        property: "og:description",
        content: "Awards, scholarships and milestones from across the academy.",
      },
    ],
  }),
  component: AchievementsPage,
});

function AchievementsPage() {
  const achievements = useCollection("achievements");
  const [category, setCategory] = useState("All");

  // Filters are derived from live rows, so a new category added in the admin
  // panel appears here automatically.
  const categories = ["All", ...Array.from(new Set(achievements.map((a) => a.category)))];
  const list = achievements.filter((a) => category === "All" || a.category === category);

  return (
    <>
      <PageHeader
        eyebrow="Recognition"
        title="Achievements"
        description="Distinctions, awards and milestones recorded across the academy."
      />

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                category === c
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border px-6 py-20 text-center">
            <h2 className="text-xl font-semibold">Nothing published in this category yet</h2>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((a, i) => (
              <Reveal key={a.id} delay={(i % 3) * 70}>
                <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elegant">
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-[image:var(--gradient-gold)] text-accent-foreground">
                      <Award className="size-5" />
                    </span>
                    <span className="font-display text-sm font-semibold text-muted-foreground">
                      {a.year}
                    </span>
                  </div>
                  <p className="mt-5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-secondary">
                    {a.category}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold">{a.title}</h2>
                  {a.student && (
                    <p className="mt-2 text-sm font-medium text-foreground">{a.student}</p>
                  )}
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {a.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
