/**
 * Inbox screens: enrollment applications and contact messages.
 *
 * The rows shown are clearly-labelled samples so the workflow can be reviewed.
 * Once the public forms post to the server in phase 2, real submissions land here
 * and these screens work unchanged.
 */

import { useMemo, useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  deleteEnrollment,
  deleteMessage,
  setEnrollmentStatus,
  setMessageRead,
  useAdminState,
} from "./store";
import type { Enrollment } from "./types";

const statuses: Enrollment["status"][] = ["new", "contacted", "enrolled", "declined"];

const statusStyles: Record<Enrollment["status"], string> = {
  new: "bg-primary/10 text-primary",
  contacted: "bg-amber-100 text-amber-900",
  enrolled: "bg-emerald-100 text-emerald-900",
  declined: "bg-muted text-muted-foreground",
};


function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function EnrollmentsScreen() {
  const { enrollments } = useAdminState();
  const [filter, setFilter] = useState<"all" | Enrollment["status"]>("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    return enrollments
      .filter((row) => (filter === "all" ? true : row.status === filter))
      .filter((row) =>
        term
          ? `${row.name} ${row.email} ${row.course} ${row.level}`.toLowerCase().includes(term)
          : true,
      )
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }, [enrollments, filter, query]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Enrollments</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Applications from the admissions form. Move each one through the stages as you follow up.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {(["all", ...statuses] as const).map((value) => (
          <Button
            key={value}
            variant={filter === value ? "default" : "outline"}
            size="sm"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {value === "all" ? "All" : value[0]!.toUpperCase() + value.slice(1)}
            <span className="ml-1.5 tabular-nums opacity-70">
              {value === "all"
                ? enrollments.length
                : enrollments.filter((e) => e.status === value).length}
            </span>
          </Button>
        ))}
        <Input
          className="ml-auto max-w-xs"
          placeholder="Search applicants…"
          aria-label="Search applicants"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Received</TableHead>
              <TableHead className="w-44">Status</TableHead>
              <TableHead className="w-16 text-right">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No applications match this view.
                </TableCell>
              </TableRow>
            )}

            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <span className="block font-medium">{row.name}</span>
                  {row.note && (
                    <span className="mt-0.5 block text-xs text-muted-foreground">{row.note}</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <a href={`mailto:${row.email}`} className="block hover:text-primary">
                    {row.email}
                  </a>
                  <a href={`tel:${row.phone}`} className="block text-xs hover:text-primary">
                    {row.phone}
                  </a>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <span className="block">{row.course}</span>
                  <span className="text-xs">{row.level}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(row.submittedAt)}
                </TableCell>
                <TableCell>
                  <select
                    aria-label={`Status for ${row.name}`}
                    className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={row.status}
                    onChange={async (e) => {
                      await setEnrollmentStatus(row.id, e.target.value as Enrollment["status"]);
                      toast.success("Status updated");
                    }}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status[0]!.toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete application from ${row.name}`}
                    onClick={async () => {
                      await deleteEnrollment(row.id);
                      toast.success("Application deleted");
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <Badge key={status} variant="secondary" className={statusStyles[status]}>
            {status}: {enrollments.filter((e) => e.status === status).length}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function MessagesScreen() {
  const { messages } = useAdminState();
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const rows = useMemo(
    () =>
      messages
        .filter((m) => (showUnreadOnly ? !m.read : true))
        .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)),
    [messages, showUnreadOnly],
  );

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Enquiries from the contact form. {unread} unread of {messages.length}.
          </p>
        </div>
        <Button
          variant={showUnreadOnly ? "default" : "outline"}
          size="sm"
          aria-pressed={showUnreadOnly}
          onClick={() => setShowUnreadOnly((v) => !v)}
        >
          Unread only
        </Button>
      </header>

      {rows.length === 0 && (
        <p className="rounded-xl border border-border bg-card py-10 text-center text-sm text-muted-foreground">
          {showUnreadOnly ? "Nothing unread." : "No messages yet."}
        </p>
      )}

      <div className="space-y-4">
        {rows.map((message) => (
          <Card key={message.id} className={message.read ? undefined : "border-primary/40"}>
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 pb-3">
              <div className="min-w-0">
                <CardTitle className="text-base">{message.subject}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {message.name} ·{" "}
                  <a href={`mailto:${message.email}`} className="hover:text-primary">
                    {message.email}
                  </a>{" "}
                  · {formatDate(message.submittedAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {!message.read && <Badge className="mr-1">New</Badge>}
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={message.read ? "Mark as unread" : "Mark as read"}
                  onClick={async () => {
                    await setMessageRead(message.id, !message.read);
                    toast.success(message.read ? "Marked unread" : "Marked read");
                  }}
                >
                  {message.read ? (
                    <Mail className="size-4" aria-hidden="true" />
                  ) : (
                    <MailOpen className="size-4" aria-hidden="true" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete message from ${message.name}`}
                  onClick={async () => {
                    await deleteMessage(message.id);
                    toast.success("Message deleted");
                  }}
                >
                  <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{message.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
