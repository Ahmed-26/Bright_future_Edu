/**
 * Admin shell: sidebar navigation, mobile drawer and the phase-1 sign-in gate.
 *
 * SECURITY NOTE: the gate below is client-side only and protects nothing. It
 * exists so the panel is not immediately open during review. Real protection
 * requires a server session — see the phase-2 note in store.ts. Do not deploy
 * this panel publicly as-is.
 */

import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Building2,
  CalendarCheck2,
  GraduationCap,
  Image,
  LayoutDashboard,
  ListOrdered,
  Mail,
  Menu,
  MessageSquareQuote,
  Quote,
  Settings,
  ShieldAlert,
  Sparkles,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { REVIEW_PASSCODE, resetDraft, signIn, signOut, useAdminState } from "./store";

const navGroups = [
  {
    label: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/courses", label: "Courses", icon: BookOpen },
      { to: "/admin/subjects", label: "Subjects", icon: GraduationCap },
      { to: "/admin/teachers", label: "Teachers", icon: Users },
      { to: "/admin/results", label: "Results", icon: Trophy },
      { to: "/admin/achievements", label: "Achievements", icon: Award },
      { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
      { to: "/admin/exam-boards", label: "Exam Boards", icon: Building2 },
      { to: "/admin/statistics", label: "Statistics", icon: ListOrdered },
      { to: "/admin/why-choose-us", label: "Why Choose Us", icon: Sparkles },
      { to: "/admin/timeline", label: "Timeline", icon: CalendarCheck2 },
    ],
  },
  {
    label: "Pages",
    items: [
      { to: "/admin/homepage", label: "Homepage", icon: LayoutDashboard },
      { to: "/admin/media", label: "Media", icon: Image },
      { to: "/admin/settings", label: "Site Settings", icon: Settings },
    ],
  },
  {
    label: "Inbox",
    items: [
      { to: "/admin/enrollments", label: "Enrollments", icon: MessageSquareQuote },
      { to: "/admin/messages", label: "Messages", icon: Mail },
    ],
  },
] as const;

export function AdminLayout() {
  const { signedIn } = useAdminState();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!signedIn) return <SignInGate />;

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto flex max-w-[100rem]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
          <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              className="absolute inset-0 bg-foreground/40"
              onClick={() => setOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-card shadow-xl">
              <div className="flex items-center justify-between px-4 pt-4">
                <span className="text-sm font-semibold">Menu</span>
                <Button variant="ghost" size="icon" aria-label="Close navigation" onClick={() => setOpen(false)}>
                  <X className="size-4" aria-hidden="true" />
                </Button>
              </div>
              <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/95 px-5 py-3 backdrop-blur">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-4" aria-hidden="true" />
            </Button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Admin Panel</p>
              <p className="truncate text-xs text-muted-foreground">
                Bright Future Group of Education
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/">View site</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await signOut();
                  toast.success("Signed out");
                }}
              >
                Sign out
              </Button>
            </div>
          </header>

          <DraftBanner />

          <main className="px-5 py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto p-4">
      <Link to="/admin" onClick={onNavigate} className="block px-2 py-3">
        <span className="text-base font-semibold tracking-tight">Bright Future</span>
        <span className="block text-xs text-muted-foreground">Content management</span>
      </Link>
      <Separator className="my-3" />

      {navGroups.map((group) => (
        <div key={group.label} className="mb-5">
          <p className="px-2 pb-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {group.label}
          </p>
          <ul className="space-y-1">
            {group.items.map((item) => {
              // Dashboard must match exactly, otherwise it stays active on every child route.
              const active = item.to === "/admin" ? pathname === "/admin" : pathname === item.to;
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** Makes the phase-1 limitation impossible to miss while reviewing. */
function DraftBanner() {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-amber-300/60 bg-amber-50 px-5 py-2.5 text-xs text-amber-900">
      <ShieldAlert className="size-4 shrink-0" aria-hidden="true" />
      <p className="min-w-0">
        Draft mode: edits are saved in this browser only and do not change the public site yet. A
        database and server-side login are still to be connected.
      </p>
      <Button
        variant="outline"
        size="sm"
        className="ml-auto h-7 border-amber-400 bg-white text-amber-900 hover:bg-amber-100"
        onClick={() => {
          resetDraft();
          toast.success("Draft reset to the original site content");
        }}
      >
        Reset draft
      </Button>
    </div>
  );
}

function SignInGate() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const ok = await signIn(passcode.trim());
    if (!ok) {
      setError(true);
      toast.error("Incorrect passcode");
      return;
    }
    setError(false);
    toast.success("Signed in");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-5 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-card">
        <h1 className="text-xl font-semibold tracking-tight">Admin sign in</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Enter the review passcode to open the content panel.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-passcode">Passcode</Label>
            <Input
              id="admin-passcode"
              type="password"
              autoComplete="current-password"
              value={passcode}
              aria-invalid={error || undefined}
              aria-describedby="admin-passcode-help"
              onChange={(e) => {
                setPasscode(e.target.value);
                setError(false);
              }}
            />
            <p id="admin-passcode-help" className="text-xs text-muted-foreground">
              Review passcode: <code className="font-mono">{REVIEW_PASSCODE}</code>
            </p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              That passcode did not match.
            </p>
          )}

          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>

        <p className="mt-5 flex gap-2 rounded-md bg-amber-50 p-3 text-xs text-amber-900">
          <ShieldAlert className="size-4 shrink-0" aria-hidden="true" />
          <span>
            This check runs in the browser and is not real security. Server-side authentication is
            required before this panel goes live.
          </span>
        </p>
      </div>
    </div>
  );
}
