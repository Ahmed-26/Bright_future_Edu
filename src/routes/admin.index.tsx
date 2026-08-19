import { createFileRoute, Link } from "@tanstack/react-router";

import { Route as AdminRoute } from "./admin";

export const Route = createFileRoute("/admin/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { state } = AdminRoute.useLoaderData();
  if (!state) return null;
  const d = state.dashboard;
  const cards = [
    { label: "Courses", value: d.courses, hint: `${d.publishedCourses} published` },
    { label: "Subjects", value: d.subjects },
    { label: "Teachers", value: d.teachers },
    { label: "Results", value: d.results },
    { label: "Achievements", value: d.achievements },
    { label: "Testimonials", value: d.testimonials },
    { label: "Enrollments", value: d.enrollments, hint: `${d.newEnrollments} new` },
    { label: "Messages", value: d.messages, hint: `${d.unreadMessages} unread` },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Live counts from the database.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {c.label}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold text-primary">{c.value}</p>
            {c.hint ? <p className="mt-1 text-xs text-muted-foreground">{c.hint}</p> : null}
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Quick links</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground" to="/admin/courses">
            Manage courses
          </Link>
          <Link className="rounded-full border px-4 py-2 text-sm" to="/admin/homepage">
            Edit homepage
          </Link>
          <Link className="rounded-full border px-4 py-2 text-sm" to="/admin/admissions">
            View enrollments
          </Link>
        </div>
      </div>
    </div>
  );
}
