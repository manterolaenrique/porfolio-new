import { timingSafeEqual } from "node:crypto";

function equalSecret(
  provided: string | null,
  expected: string | undefined,
): boolean {
  if (!provided || !expected) return false;
  const actual = Buffer.from(provided),
    wanted = Buffer.from(expected);
  return actual.length === wanted.length && timingSafeEqual(actual, wanted);
}

export function authorizeRevalidation(
  request: Request,
  secrets: { legacy?: string; webhook?: string },
): "authorized" | "unauthorized" | "unconfigured" {
  if (!secrets.legacy && !secrets.webhook) return "unconfigured";
  const header = request.headers.get("x-nexora-revalidate-secret");
  const valid =
    header !== null
      ? equalSecret(header, secrets.webhook)
      : equalSecret(
          new URL(request.url).searchParams.get("secret"),
          secrets.legacy,
        );
  return valid ? "authorized" : "unauthorized";
}
