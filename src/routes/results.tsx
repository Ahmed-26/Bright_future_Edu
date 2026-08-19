import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { boards, levels, results, subjects } from "@/data/institute";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Results | Grades Across O Level, A Level & IGCSE" },
      {
        name: "description",
        content:
          "Filter published academic results by year, level, subject and exam board. Demo records shown for design preview.",
      },
      { property: "og:title", content: "Results | Bright Future Group of Education" },
      {
        property: "og:description",
        content: "Academic results by year, level, subject and exam board.",
      },
    ],
  }),
  component: ResultsPage,
});

const years = Array.from(new Set(results.map((r) => r.year))).sort((a, b) => b - a);

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-medium normal-case tracking-normal text-foreground outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="All">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function ResultsPage() {
  const [year, setYear] = useState("All");
  const [level, setLevel] = useState("All");
  const [subject, setSubject] = useState("All");
  const [board, setBoard] = useState("All");

  const filtered = useMemo(
    () =>
      results.filter(
        (r) =>
          (year === "All" || String(r.year) === year) &&
          (level === "All" || r.level === level) &&
          (subject === "All" || r.subject === subject) &&
          (board === "All" || r.board === board),
      ),
    [year, level, subject, board],
  );

  return (
    <>
      <PageHeader
        eyebrow="Academic performance"
        title="Results"
        description="A transparent record of grades achieved across Cambridge and Edexcel series. All records below are demonstration data."
      />

      <section className="mx-auto max-w-7xl px-5 py-16">
        <p className="rounded-xl border border-accent/40 bg-accent/10 px-5 py-4 text-sm text-foreground">
          <strong className="font-semibold">Demo data:</strong> the records on this page are
          placeholders for the design preview and do not represent real students or grades.
        </p>

        <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-card sm:grid-cols-2 lg:grid-cols-4">
          <Select label="Year" value={year} onChange={setYear} options={years.map(String)} />
          <Select label="Level" value={level} onChange={setLevel} options={[...levels]} />
          <Select
            label="Subject"
            value={subject}
            onChange={setSubject}
            options={subjects.map((s) => s.name)}
          />
          <Select label="Exam board" value={board} onChange={setBoard} options={[...boards]} />
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center">
            <h2 className="text-xl font-semibold">No results for this combination</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Adjust the filters to see other series.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r, i) => (
              <Reveal key={`${r.student}-${r.subject}-${r.year}`} delay={(i % 3) * 60}>
                <article className="flex h-full items-start gap-5 rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant">
                  <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-gold)] font-display text-2xl font-bold text-accent-foreground">
                    {r.grade}
                  </span>
                  <div>
                    <h2 className="text-base font-semibold">
                      {r.level} {r.subject}
                    </h2>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {r.board} · {r.year}
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">{r.student}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
