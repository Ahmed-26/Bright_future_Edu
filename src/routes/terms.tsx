import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Bright Future Group of Education" },
      {
        name: "description",
        content: "Enrollment, fee, attendance and conduct terms for students of the academy.",
      },
      { property: "og:title", content: "Terms & Conditions | Bright Future Group of Education" },
      { property: "og:description", content: "Enrollment, fee, attendance and conduct terms." },
    ],
  }),
  component: () => (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        description="Placeholder terms for the design preview. Replace with your reviewed legal copy before launch."
      />
      <article className="mx-auto max-w-3xl space-y-8 px-5 py-16 text-sm leading-relaxed text-muted-foreground">
        {[
          [
            "Enrollment",
            "A place is confirmed once the enrollment form is submitted, the placement discussion is complete and the first month's tuition is received.",
          ],
          [
            "Fees",
            "Tuition is payable monthly in advance. Fees quoted on course pages are indicative and may vary by campus and session.",
          ],
          [
            "Attendance",
            "Students are expected to attend all scheduled sessions and assessments. Persistent absence may affect continued enrollment.",
          ],
          [
            "Conduct",
            "Respectful behaviour towards faculty and fellow students is required on all campuses and in all online sessions.",
          ],
          [
            "Content",
            "Notes, worksheets and assessment material provided by the academy are for enrolled students' personal use only.",
          ],
        ].map(([h, p]) => (
          <section key={h}>
            <h2 className="text-lg font-semibold text-foreground">{h}</h2>
            <p className="mt-3">{p}</p>
          </section>
        ))}
      </article>
    </>
  ),
});
