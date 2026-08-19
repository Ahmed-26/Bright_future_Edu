import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Bright Future Group of Education" },
      {
        name: "description",
        content: "How the academy collects, uses and protects student and parent information.",
      },
      { property: "og:title", content: "Privacy Policy | Bright Future Group of Education" },
      { property: "og:description", content: "How we handle student and parent information." },
    ],
  }),
  component: () => (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="Placeholder policy text for the design preview. Replace with your reviewed legal copy before launch."
      />
      <article className="mx-auto max-w-3xl space-y-8 px-5 py-16 text-sm leading-relaxed text-muted-foreground">
        {[
          [
            "Information we collect",
            "We collect the details submitted through our enrollment and contact forms: student name, guardian name, email address, phone number, level, exam board and subject preferences.",
          ],
          [
            "How we use it",
            "Information is used solely to respond to admission enquiries, arrange placement assessments and share academic progress with parents or guardians.",
          ],
          [
            "Sharing",
            "We do not sell or rent personal information. Data is shared only with faculty and administrative staff who need it to deliver teaching.",
          ],
          [
            "Retention",
            "Enquiry records are retained while a student is enrolled and for a reasonable period afterwards for academic reference.",
          ],
          [
            "Your choices",
            "You may request access to, correction of, or deletion of your information at any time by contacting the administration office.",
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
