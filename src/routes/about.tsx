import { createFileRoute } from "@tanstack/react-router";
import { Compass, Eye, HeartHandshake, Target } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";
import { useCollection } from "@/hooks/useSiteContent";
import campus from "@/assets/hero-students.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | Our Mission, Faculty & Teaching Philosophy" },
      {
        name: "description",
        content:
          "Learn how the academy teaches Cambridge O Level, A Level and IGCSE: our mission, values, history and academic approach.",
      },
      { property: "og:title", content: "About Bright Future Group of Education" },
      {
        property: "og:description",
        content: "Our mission, values, history and academic approach.",
      },
    ],
  }),
  component: AboutPage,
});

const pillars = [
  {
    Icon: Target,
    title: "Our Mission",
    text: "To give every student the technique, confidence and discipline to sit an international exam without fear.",
  },
  {
    Icon: Eye,
    title: "Our Vision",
    text: "A Pakistani academy whose teaching standards stand comfortably beside any international school.",
  },
  {
    Icon: HeartHandshake,
    title: "Core Values",
    text: "Honesty about progress, respect in the classroom, and no shortcuts around genuine understanding.",
  },
  {
    Icon: Compass,
    title: "Our Approach",
    text: "Concept first, then technique, then timing — assessed continuously against real mark schemes.",
  },
];

function AboutPage() {
  // Statistics, history and "why choose us" are all admin-managed collections.
  const stats = useCollection("statistics");
  const timeline = useCollection("timeline");
  const whyChooseUs = useCollection("whyChooseUs");

  return (
    <>
      <PageHeader
        eyebrow="Who we are"
        title="About the Academy"
        description="Founded in 2011 as a single tuition room, now a five-campus institute preparing students for Cambridge and Edexcel examinations."
      />

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <img
              src={campus}
              alt="Students studying together in the academy library"
              loading="lazy"
              width={1280}
              height={1024}
              className="rounded-2xl shadow-elegant"
            />
          </Reveal>
          <Reveal delay={120}>
            <h2 className="text-3xl font-semibold">
              Teaching built around the examiner, not the textbook
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              We teach the syllabus the way it is assessed. Every topic is introduced conceptually,
              practised through structured questions, and then rehearsed under exam timing against
              official mark schemes. Students learn why an answer earns a mark, not just what the
              answer is.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Class sizes stay small deliberately. Faculty mark work personally, keep an error log
              for each student, and meet parents each term with evidence rather than impressions.
            </p>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 70}>
              <article className="h-full rounded-2xl border border-border bg-card p-7 shadow-card">
                <span className="grid size-12 place-items-center rounded-xl bg-muted text-primary">
                  <p.Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((s, i) => (
              <Reveal key={s.id} delay={i * 60}>
                <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-card">
                  <p className="font-display text-3xl font-semibold text-primary">
                    <Counter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20">
        <h2 className="text-center text-3xl font-semibold">Our history</h2>
        <ol className="mt-12 space-y-8 border-l border-border pl-8">
          {timeline.map((t, i) => (
            <Reveal key={t.id} as="li" delay={i * 70}>
              <div className="relative">
                <span className="absolute -left-[41px] top-1.5 size-3 rounded-full bg-[image:var(--gradient-gold)]" />
                <p className="font-display text-xl font-semibold text-primary">{t.year}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-8">
        <h2 className="text-center text-3xl font-semibold">Why students choose us</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((w, i) => (
            <Reveal key={w.id} delay={(i % 4) * 60}>
              <article className="h-full rounded-2xl border border-border bg-card p-6 shadow-card">
                <h3 className="text-base font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
