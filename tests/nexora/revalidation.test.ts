import { test } from "node:test";
import assert from "node:assert/strict";
import { authorizeRevalidation } from "../../src/services/revalidation";

const secrets = {
  legacy: "existing-hook-secret",
  webhook: "new-private-header-secret",
};
const request = (url: string, headers: HeadersInit = {}) =>
  new Request(url, { headers });
test("existing publish hooks keep working without rotating their secret", () => {
  assert.equal(
    authorizeRevalidation(
      request(
        "https://site.example/api/revalidate?secret=existing-hook-secret",
      ),
      secrets,
    ),
    "authorized",
  );
});
test("new webhook authenticates through a private header, not a public URL", () => {
  assert.equal(
    authorizeRevalidation(
      request("https://site.example/api/revalidate", {
        "x-nexora-revalidate-secret": secrets.webhook,
      }),
      secrets,
    ),
    "authorized",
  );
  assert.equal(
    authorizeRevalidation(
      request("https://site.example/api/revalidate?secret=" + secrets.webhook),
      secrets,
    ),
    "unauthorized",
  );
});
test("missing, wrong, partial and multibyte credentials fail closed", () => {
  for (const value of ["", "new-private-header-secre", "é".repeat(25), "wrong"])
    assert.equal(
      authorizeRevalidation(
        request("https://site.example/api/revalidate", {
          "x-nexora-revalidate-secret": value,
        }),
        secrets,
      ),
      "unauthorized",
    );
  assert.equal(
    authorizeRevalidation(
      request("https://site.example/api/revalidate"),
      secrets,
    ),
    "unauthorized",
  );
  assert.equal(
    authorizeRevalidation(request("https://site.example/api/revalidate"), {}),
    "unconfigured",
  );
});
test("invalid new header cannot fall back to a legacy query parameter", () => {
  assert.equal(
    authorizeRevalidation(
      request(
        "https://site.example/api/revalidate?secret=existing-hook-secret",
        { "x-nexora-revalidate-secret": "invalid" },
      ),
      secrets,
    ),
    "unauthorized",
  );
});
