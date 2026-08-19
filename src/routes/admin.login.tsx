import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginFn } from "@/server/fns";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const login = useServerFn(loginFn);
  const [email, setEmail] = useState("admin@brightfuture.edu");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="grid min-h-screen place-items-center bg-[oklch(0.22_0.06_264)] px-4">
      <form
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            const result = await login({ data: { email, password } });
            if (!result.ok) {
              toast.error(result.error);
              return;
            }
            toast.success("Welcome back");
            await router.invalidate();
            await router.navigate({ to: "/admin" });
          } finally {
            setBusy(false);
          }
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Bright Future Group of Education
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Development login: admin@brightfuture.edu / Admin@12345
        </p>
        <div className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </div>
      </form>
    </div>
  );
}
