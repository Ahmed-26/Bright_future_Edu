// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";

// Vite only exposes VITE_-prefixed variables, and only to `import.meta.env`.
// Server-side secrets (DATABASE_URL, ADMIN_PASSCODE, SESSION_SECRET) are read
// through `process.env` inside server-only modules, so copy the unprefixed
// values from .env into process.env for `vite dev` and `vite build`. Real
// deploys set these in the hosting environment, where they already exist and
// take precedence — nothing here overwrites them.
function currentMode(): string {
  const flag = process.argv.indexOf("--mode");
  const explicit = flag === -1 ? undefined : process.argv[flag + 1];
  if (explicit) return explicit;
  return process.argv.includes("dev") || process.argv.includes("serve")
    ? "development"
    : "production";
}


function loadServerEnv(): void {
  const loaded = loadEnv(currentMode(), process.cwd(), "");
  for (const [key, value] of Object.entries(loaded)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadServerEnv();

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});


