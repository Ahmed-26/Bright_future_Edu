import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { useSiteSettings } from "@/hooks/useSiteContent";
import { submitMessage } from "@/lib/content/server";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | Visit, Call or Message the Academy" },
      {
        name: "description",
        content:
          "Campus address, phone, email, opening hours and a direct message form for the academy.",
      },
      { property: "og:title", content: "Contact | Bright Future Group of Education" },
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
  // Address, phone, email and hours come from admin Settings.
  const site = useSiteSettings();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Fast feedback only — submitMessage re-validates the same shape server-side.
    const parsed = schema.safeParse(Object.fromEntries(new FormData(form)));
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
      const phone = parsed.data.phone?.trim();
      await submitMessage({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          subject: parsed.data.subject,
          // The inbox row has no phone column, so append it to the body when given.
          message: (phone ? `${parsed.data.message}\n\nPhone: ${phone}` : parsed.data.message).slice(
            0,
            4000,
          ),
        },
      });
      form.reset();
      toast.success("Message sent — we usually reply within one working day.");
    } catch {
      toast.error("Could not send right now. Please call or email us instead.");
    } finally {
      setPending(false);
    }
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
              <div
                key={label}
                className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {label}
                  </p>
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
              {
                name: "phone",
                label: "Phone (optional)",
                placeholder: "+92 300 0000000",
                type: "text",
              },
              {
                name: "subject",
                label: "Subject",
                placeholder: "Admissions enquiry",
                type: "text",
              },
            ].map((f) => (
              <label key={f.name} className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {f.label}
                </span>
                <input
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  maxLength={255}
                  className={inputClass}
                />
                {errors[f.name] && (
                  <span className="mt-1.5 block text-xs text-destructive">{errors[f.name]}</span>
                )}
              </label>
            ))}
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Message
              </span>
              <textarea
                name="message"
                rows={5}
                maxLength={1000}
                className={inputClass}
                placeholder="How can we help?"
              />
              {errors["message"] && (
                <span className="mt-1.5 block text-xs text-destructive">{errors["message"]}</span>
              )}
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-xl bg-[image:var(--gradient-primary)] px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {pending ? "Sending…" : "Send message"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
