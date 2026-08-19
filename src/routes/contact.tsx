import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { site } from "@/data/institute";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | Visit, Call or Message the Academy" },
      {
        name: "description",
        content: "Campus address, phone, email, opening hours and a direct message form for the academy.",
      },
      { property: "og:title", content: "Contact | Meridian Academy" },
      { property: "og:description", content: "Address, phone, email and opening hours." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().min(2, "Please add a subject").max(150),
  message: z.string().trim().min(10, "Please write at least 10 characters").max(1000),
});

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring";

function ContactPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      toast.error("Please correct the highlighted fields");
      return;
    }
    setErrors({});
    e.currentTarget.reset();
    toast.success("Message sent — we usually reply within one working day.");
  };

  const details = [
    { Icon: MapPin, label: "Campus", value: site.address },
    { Icon: Phone, label: "Phone", value: site.phone },
    { Icon: Mail, label: "Email", value: site.email },
    { Icon: Clock, label: "Opening hours", value: site.hours },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact Us"
        description="Visit the campus, call the admissions desk, or send a message and we will respond within one working day."
      />

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            {details.map(({ Icon, label, value }) => (
              <div key={label} className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-card">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
                </div>
              </div>
            ))}

            <div className="overflow-hidden rounded-2xl border border-border shadow-card">
              <div className="grid h-56 place-items-center bg-surface text-sm text-muted-foreground">
                Google Maps embed placeholder
              </div>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            noValidate
            className="grid gap-5 rounded-2xl border border-border bg-card p-8 shadow-elegant sm:grid-cols-2"
          >
            <h2 className="text-2xl font-semibold sm:col-span-2">Send a message</h2>
            {[
              { name: "name", label: "Your name", placeholder: "Full name", type: "text" },
              { name: "email", label: "Email", placeholder: "you@example.com", type: "email" },
              { name: "phone", label: "Phone (optional)", placeholder: "+92 300 0000000", type: "text" },
              { name: "subject", label: "Subject", placeholder: "Admissions enquiry", type: "text" },
            ].map((f) => (
              <label key={f.name} className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {f.label}
                </span>
                <input name={f.name} type={f.type} placeholder={f.placeholder} maxLength={255} className={inputClass} />
                {errors[f.name] && <span className="mt-1.5 block text-xs text-destructive">{errors[f.name]}</span>}
              </label>
            ))}
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Message
              </span>
              <textarea name="message" rows={5} maxLength={1000} className={inputClass} placeholder="How can we help?" />
              {errors.message && <span className="mt-1.5 block text-xs text-destructive">{errors.message}</span>}
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-[image:var(--gradient-primary)] px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                Send message
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
