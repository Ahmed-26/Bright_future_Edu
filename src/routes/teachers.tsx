import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { teachers } from "@/data/institute";

export const Route = createFileRoute("/teachers")({
  head: () => ({
    meta: [
      { title: "Our Teachers | Experienced O, A Level & IGCSE Faculty" },
      {
        name: "description",
        content:
          "Meet the subject heads and senior faculty teaching Cambridge and Edexcel programmes at the academy.",
      },
      { property: "og:title", content: "Our Faculty | Bright Future Group of Education" },
      {
        property: "og:description",
        content: "Subject heads with a decade or more of board-level teaching.",
      },
    ],
  }),
  component: TeachersPage,
});

function TeachersPage() {
  return (
    <>
      <PageHeader
        eyebrow="The faculty"
        title="Teachers"
        description="Subject specialists, former examiners and industry professionals who teach for understanding first and marks second."
      />

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {teachers.map((t, i) => (
            <Reveal key={t.slug} delay={(i % 4) * 70}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elegant">
                <div className="relative grid h-44 place-items-center bg-[image:var(--gradient-primary)]">
                  <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_70%_20%,white,transparent_50%)]" />
                  <span className="relative grid size-20 place-items-center rounded-full glass-panel font-display text-2xl font-semibold text-primary-foreground">
                    {t.initials}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-lg font-semibold">{t.name}</h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                    {t.designation}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {t.bio}
                  </p>
                  <dl className="mt-5 space-y-2 border-t border-border pt-5 text-xs text-muted-foreground">
                    <div className="flex justify-between gap-3">
                      <dt>Qualification</dt>
                      <dd className="text-right font-medium text-foreground">{t.qualification}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt>Experience</dt>
                      <dd className="font-medium text-foreground">{t.experience}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt>Subjects</dt>
                      <dd className="font-medium text-foreground">{t.subjects.join(", ")}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-card px-8 py-12 text-center shadow-card">
          <h2 className="text-2xl font-semibold">Want to teach with us?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            We hire subject specialists who can prove results. Send your profile and we will arrange
            a demo class.
          </p>
          <Link
            to="/contact"
            className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
