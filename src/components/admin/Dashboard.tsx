/**
 * Dashboard: live counts pulled from the admin store, plus shortcuts.
 * Every number here is derived, never hardcoded, so it stays honest as content changes.
 */

import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Mail, MessageSquareQuote, Trophy, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useAdminState } from "./store";

export function Dashboard() {
  const { collections, enrollments, messages } = useAdminState();

  const newEnrollments = enrollments.filter((e) => e.status === "new").length;
  const unreadMessages = messages.filter((m) => !m.read).length;

  const cards = [
    {
      label: "Courses",
      value: collections.courses.length,
      sub: `${collections.courses.filter((c) => c.featured).length} featured`,
      icon: BookOpen,
      to: "/admin/courses" as const,
    },
    {
      label: "Teachers",
      value: collections.teachers.length,
      sub: `${collections.subjects.length} subjects`,
      icon: Users,
      to: "/admin/teachers" as const,
    },
    {
      label: "Results",
      value: collections.results.length,
      sub: `${collections.achievements.length} achievements`,
      icon: Trophy,
      to: "/admin/results" as const,
    },
    {
      label: "New enrollments",
      value: newEnrollments,
      sub: `${enrollments.length} total`,
      icon: MessageSquareQuote,
      to: "/admin/enrollments" as const,
    },
    {
      label: "Unread messages",
      value: unreadMessages,
      sub: `${messages.length} total`,
      icon: Mail,
      to: "/admin/messages" as const,
    },
  ];

  const contentBreakdown = [
    { label: "Courses", to: "/admin/courses" as const, rows: collections.courses },
    { label: "Subjects", to: "/admin/subjects" as const, rows: collections.subjects },
    { label: "Teachers", to: "/admin/teachers" as const, rows: collections.teachers },
    { label: "Results", to: "/admin/results" as const, rows: collections.results },
    { label: "Achievements", to: "/admin/achievements" as const, rows: collections.achievements },
    { label: "Testimonials", to: "/admin/testimonials" as const, rows: collections.testimonials },
    { label: "Exam Boards", to: "/admin/exam-boards" as const, rows: collections.examBoards },
    { label: "Statistics", to: "/admin/statistics" as const, rows: collections.statistics },
    { label: "Why Choose Us", to: "/admin/why-choose-us" as const, rows: collections.whyChooseUs },
    { label: "Timeline", to: "/admin/timeline" as const, rows: collections.timeline },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything the public site displays is managed from the sections in the sidebar.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.to}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
            >
              <span className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {card.label}
                </span>
                <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
              </span>
              <span className="mt-3 block text-3xl font-semibold tabular-nums">{card.value}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{card.sub}</span>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Content overview</CardTitle>
            <CardDescription>
              Published counts reflect what visitors can currently see.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {contentBreakdown.map((entry) => {
              const published = entry.rows.filter((row) => row.published).length;
              return (
                <Link
                  key={entry.label}
                  to={entry.to}
                  className="flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                >
                  <span className="font-medium">{entry.label}</span>
                  <span className="flex items-center gap-3 text-muted-foreground">
                    <span className="tabular-nums">
                      {published} / {entry.rows.length} published
                    </span>
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick actions</CardTitle>
              <CardDescription>The screens editors use most.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" asChild>
                <Link to="/admin/courses">Manage courses</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/homepage">Edit homepage</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/settings">Site settings</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/enrollments">Review enrollments</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Not connected yet</CardTitle>
              <CardDescription>Remaining work before this panel is live.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5 shrink-0">
                  1
                </Badge>
                A database to store content instead of this browser.
              </p>
              <p className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5 shrink-0">
                  2
                </Badge>
                Server-side login so the panel is actually protected.
              </p>
              <p className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5 shrink-0">
                  3
                </Badge>
                Public pages reading from the database, and real form submissions landing in the
                inbox.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
