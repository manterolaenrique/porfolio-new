const { loadEnvConfig } = require("@next/env");
const { spawn, spawnSync } = require("node:child_process");
loadEnvConfig(process.cwd(), true);
if (process.env.NEXT_PUBLIC_SANITY_DATASET !== "development") {
  console.error(
    "DEV requiere NEXT_PUBLIC_SANITY_DATASET=development. No se iniciara Studio sobre production.",
  );
  process.exit(1);
}
const args = process.argv.slice(2);
const portAt = args.findIndex((arg) => arg === "--port" || arg === "-p");
const port = portAt >= 0 ? args[portAt + 1] : process.env.PORT || "3000";
const publicPort = process.env.NEXORA_PUBLIC_PORT || port;
const env = {
  ...process.env,
  NEXORA_MAIL_MODE: process.env.NEXORA_MAIL_MODE || "test",
  NEXT_PUBLIC_SITE_URL: `http://localhost:${publicPort}`,
  NEXORA_ALLOWED_ORIGINS: `http://localhost:${publicPort},http://127.0.0.1:${publicPort}`,
};
if (!env.GITHUB_TOKEN) {
  const session = spawnSync("gh", ["auth", "token"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    windowsHide: true,
  });
  if (session.status === 0) env.GITHUB_TOKEN = session.stdout.trim();
}
const child = spawn(
  process.execPath,
  [
    require.resolve("next/dist/bin/next"),
    "dev",
    "--hostname",
    "0.0.0.0",
    ...args,
  ],
  { stdio: "inherit", env },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code || 0));
