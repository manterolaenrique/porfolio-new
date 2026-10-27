const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd(), true);
const sanityPackage = require("sanity/package.json");
const cli = path.join(
  path.dirname(require.resolve("sanity/package.json")),
  sanityPackage.bin.sanity,
);
const env = {
  ...process.env,
  NEXT_PUBLIC_SANITY_DATASET: "development",
  SANITY_CLI_TELEMETRY_DISABLED: "1",
};
function sanity(args, capture = false) {
  return execFileSync(process.execPath, [cli, ...args], {
    env,
    stdio: capture ? ["ignore", "pipe", "inherit"] : "inherit",
    encoding: "utf8",
  });
}
try {
  const datasets = sanity(["dataset", "list"], true)
    .replace(/\x1b\[[0-9;]*m/g, "")
    .split(/\r?\n/)
    .map((line) => line.trim());
  if (!datasets.includes("development")) {
    const folder = path.resolve(".cache/nexora");
    fs.mkdirSync(folder, { recursive: true });
    const archive = path.join(folder, "production-readonly-export.tar.gz");
    sanity(["dataset", "export", "production", archive, "--overwrite"]);
    sanity(["dataset", "create", "development", "--visibility", "public"]);
    sanity(["dataset", "import", archive, "development"]);
  } else console.log("development ya existe; no se reemplazara su contenido.");
  sanity(["exec", "scripts/seed-nexora.ts", "--with-user-token"]);
  console.log("Nexora preparado en development. production no se modifico.");
} catch {
  console.error(
    "No se completo la preparacion DEV. Usar la sesion oficial de Sanity CLI y volver a ejecutar npm run sanity:prepare-dev. No se imprimieron credenciales.",
  );
  process.exitCode = 1;
}
