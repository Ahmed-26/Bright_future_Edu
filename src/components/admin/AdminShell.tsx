import { Link, Outlet, useRouter, useRouterState } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Home,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  Medal,
  Settings,
  Shield,
  Star,
  Users,
  FileText,
  BarChart3,
  UserPlus,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/homepage", label: "Homepage", icon: Home },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/subjects", label: "Subjects", icon: Layers },
  { to: "/admin/teachers", label: "Teachers", icon: Users },
  { to: "/admin/exam-boards", label: "Exam Boards", icon: Shield },
  { to: "/admin/syllabus", label: "Syllabus", icon: FileText },
  { to: "/admin/statistics", label: "Statistics", icon: BarChart3 },
  { to: "/admin/results", label: "Results", icon: Medal },
  { to: "/admin/achievements", label: "Achievements", icon: Award },
  { to: "/admin/testimonials", label: "Testimonials", icon: Star },
  { to: "/admin/admissions", label: "Admissions", icon: UserPlus },
  { to: "/admin/messages", label: "Contact Messages", icon: Inbox },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
  { to: "/admin/media", label: "Media", icon: Image },
];

export function AdminShell({ children }: { children?: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();
  const logout = useServerFn(logoutFn);

  return (
    <div className="flex min-h-screen bg-[oklch(0.96_0.01_250)]">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto bg-[oklch(0.22_0.06_264)] text-white lg:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Admin</p>
          <p className="mt-1 text-sm font-semibold">Bright Future</p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "bg-white/12 text-white" : "text-white/70 hover:bg-white/8 hover:text-white",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={async () => {
              await logout();
              toast.success("Signed out");
              await router.navigate({ to: "/admin/login" });
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/8 hover:text-white"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex gap-2 overflow-x-auto lg:hidden">
            {NAV.slice(0, 6).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="whitespace-nowrap rounded-full border border-border px-3 py-1 text-xs font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p className="hidden text-sm text-muted-foreground lg:block">Website content manager</p>
          <Link to="/" className="text-xs font-semibold text-primary underline-offset-4 hover:underline">
            View site
          </Link>
        </header>
        <div className="flex-1 px-4 py-6 lg:px-8">{children ?? <Outlet />}</div>
      </div>
    </div>
  );
}
