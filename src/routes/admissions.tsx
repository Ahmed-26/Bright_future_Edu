import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { boards as fallbackBoards, levels } from "@/data/institute";
import { useCollection } from "@/hooks/useSiteContent";
import { submitEnrollment } from "@/lib/content/server";


export const Route = createFileRoute("/admissions")({
  head: () => ({
    meta: [
      { title: "Admissions | Enroll in O Level, A Level or IGCSE" },
      {
        name: "description",
        content:
          "Apply to the academy: admission process, available levels and subjects, and the online enrollment form.",
      },
      { property: "og:title", content: "Admissions | Bright Future Group of Education" },
      {
        property: "og:description",
        content: "How to apply and enroll for the next academic session.",
      },
    ],
  }),
  component: AdmissionsPage,
});

const schema = z.object({
  student: z.string().trim().min(2, "Please enter the student's name").max(100),
  guardian: z.string().trim().min(2, "Please enter a parent or guardian name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(30),
  level: z.string().min(1, "Select a level"),
  board: z.string().min(1, "Select an exam board"),
  subject: z.string().min(1, "Select a subject"),
  course: z.string().max(120).optional(),
  message: z.string().trim().max(1000).optional(),
});

const steps = [
  {
    title: "Submit an enquiry",
    text: "Send the enrollment form with the student's level, board and subjects.",
  },
  {
    title: "Placement discussion",
    text: "Our academic team calls within one working day to review targets.",
  },
  {
    title: "Schedule mapping",
    text: "We build a weekly timetable around the student's school hours.",
  },
  {
    title: "Confirm and begin",
    text: "Fee is settled, seat is reserved and classes begin the same week.",
  },
];

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function AdmissionsPage() {
  // Subjects, courses and boards are admin-managed, so the form options follow
  // whatever is published rather than the static seed lists.
  const subjects = useCollection("subjects");
  const courses = useCollection("courses");
  const examBoards = useCollection("examBoards");
  const boards = useMemo(() => {
    const published = examBoards.map((board) => board.name).filter(Boolean);
    const names = published.length > 0 ? published : [...fallbackBoards];
    return Array.from(new Set([...names, "Other"]));
  }, [examBoards]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);


  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    // Client-side validation is for fast feedback only; the server function
    // re-validates the same fields before anything is stored.
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      toast.error("Please correct the highlighted fields");
      return;
    }

    setErrors({});
    setPending(true);
    try {
      await submitEnrollment({
        data: {
          name: parsed.data.student,
          email: parsed.data.email,
          phone: parsed.data.phone,
          // The admin inbox stores one course label, so fall back to the chosen
          // subject when no specific course was selected.
          course: parsed.data.course?.trim() ? parsed.data.course : parsed.data.subject,
          level: parsed.data.level,
          note: [
            `Guardian: ${parsed.data.guardian}`,
            `Board: ${parsed.data.board}`,
            `Subject: ${parsed.data.subject}`,
            parsed.data.message?.trim() ? `Message: ${parsed.data.message}` : "",
          ]
            .filter(Boolean)
            .join("\n")
            .slice(0, 4000),
        },
      });
      setSubmitted(true);
      form.reset();
      toast.success("Enquiry received — our admissions team will call you shortly.");
    } catch {
      toast.error("Could not submit right now. Please call or email us instead.");
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Join the academy"
        title="Admissions"
        description="Enrollment is open across O Level, A Level and IGCSE for Cambridge and Pearson Edexcel pathways."
      />

      <section className="mx-auto max-w-7xl px-5 py-16">
        <h2 className="text-3xl font-semibold">How to apply</h2>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} as="li" delay={i * 70}>
              <div className="h-full rounded-2xl border border-border bg-card p-7 shadow-card">
                <span className="font-display text-3xl font-semibold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-7 shadow-card">
            <h2 className="text-xl font-semibold">Available levels &amp; boards</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {[...levels, ...boards.filter((b) => b !== "Other")].map((l) => (
                <span
                  key={l}
                  className="rounded-full bg-muted px-3.5 py-1.5 text-xs font-semibold text-foreground"
                >
                  {l}
                </span>
              ))}
            </div>
            <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Required information
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Student and guardian names with contact details</li>
              <li>Current school and year group</li>
              <li>Examination series the student is registered for</li>
              <li>Subjects and preferred class timings</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-7 shadow-card">
            <h2 className="text-xl font-semibold">Available subjects</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {subjects.map((s) => (
                <span
                  key={s.slug}
                  className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-card p-8 shadow-elegant md:p-10">
          <h2 className="text-2xl font-semibold">Enrollment form</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your details go straight to our admissions team. Required fields are marked by the
            validation messages below.
          </p>

          {submitted && (
            <p className="mt-6 rounded-xl border border-secondary/40 bg-secondary/10 px-5 py-4 text-sm text-foreground">
              Thank you — your enquiry has been recorded and our admissions team will be in touch.
            </p>
          )}

          <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-5 md:grid-cols-2">
            <Field label="Student name" error={errors["student"]}>
              <input
                name="student"
                maxLength={100}
                className={inputClass}
                placeholder="Full name"
              />
            </Field>
            <Field label="Parent / guardian name" error={errors["guardian"]}>
              <input
                name="guardian"
                maxLength={100}
                className={inputClass}
                placeholder="Full name"
              />
            </Field>
            <Field label="Email" error={errors["email"]}>
              <input
                name="email"
                type="email"
                maxLength={255}
                className={inputClass}
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Phone" error={errors["phone"]}>
              <input
                name="phone"
                maxLength={30}
                className={inputClass}
                placeholder="+92 300 0000000"
              />
            </Field>
            <Field label="Level" error={errors["level"]}>
              <select name="level" defaultValue="" className={inputClass}>
                <option value="">Select level</option>
                {levels.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </Field>
            <Field label="Exam board" error={errors["board"]}>
              <select name="board" defaultValue="" className={inputClass}>
                <option value="">Select board</option>
                {boards.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>
            <Field label="Subject" error={errors["subject"]}>
              <select name="subject" defaultValue="" className={inputClass}>
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s.slug}>{s.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Preferred course (optional)">
              <select name="course" defaultValue="" className={inputClass}>
                <option value="">No preference</option>
                {courses.map((c) => (
                  <option key={c.slug}>{c.title}</option>
                ))}
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Message (optional)">
                <textarea
                  name="message"
                  rows={4}
                  maxLength={1000}
                  className={inputClass}
                  placeholder="Tell us about the student's targets, school timings or anything else."
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-xl bg-[image:var(--gradient-primary)] px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
              >
                {pending ? "Submitting…" : "Submit enrollment enquiry"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
