import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
  handleQuote,
  type QuoteDependencies,
  type QuoteReceipt,
  type QuoteStore,
} from "../../src/services/nexora/quote-core";

function payload(overrides: Record<string, unknown> = {}) {
  return {
    requestId: randomUUID(),
    projectType: "saas",
    budget: "defined",
    description: "Sistema para nuestro equipo",
    name: "Ana Pérez",
    email: "ana@example.com",
    company: "",
    startTime: "",
    consent: true,
    website: "",
    turnstileToken: "valid",
    ...overrides,
  };
}
function request(body = payload(), origin = "http://localhost:3000") {
  return new Request("http://localhost:3000/api/nexora/presupuesto", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}
function fixture() {
  const records = new Map<string, QuoteReceipt>(),
    locks = new Map<string, string>();
  const calls: string[] = [],
    limits: string[] = [];
  const store: QuoteStore = {
    get: async (id) =>
      records.has(id) ? structuredClone(records.get(id)!) : null,
    create: async (id, receipt) => {
      if (records.has(id)) return false;
      records.set(id, structuredClone(receipt));
      return true;
    },
    save: async (id, receipt) => {
      records.set(id, structuredClone(receipt));
    },
    lock: async (id, owner) => {
      if (locks.has(id)) return false;
      locks.set(id, owner);
      return true;
    },
    unlock: async (id, owner) => {
      if (locks.get(id) === owner) locks.delete(id);
    },
  };
  const deps: QuoteDependencies = {
    mode: "live",
    origins: ["http://localhost:3000"],
    store,
    verifyChallenge: async (token) => token === "valid",
    limit: async (kind) => {
      limits.push(kind);
      return { success: true, reset: Date.now() + 1000 };
    },
    send: async (kind) => {
      calls.push(kind);
      return kind + "-accepted";
    },
  };
  return { deps, records, calls, limits, locks };
}
test("test mode is explicit, previews both messages, and never calls providers", async () => {
  const { deps, calls } = fixture();
  deps.mode = "test";
  const response = await handleQuote(
    request(payload({ description: "<script>arbitrary text</script>" })),
    deps,
  );
  const result = await response.json();
  assert.equal(result.status, "test");
  assert.match(result.message, /no se enviaron correos/);
  assert.ok(result.previews.internal.text.includes("<script>"));
  assert.ok(!result.previews.confirmation.text.includes("<script>"));
  assert.deepEqual(calls, []);
});
test("valid defined budget needs no amount; two accepted emails are ordered and repeat is idempotent", async () => {
  const { deps, calls, limits } = fixture(),
    body = payload();
  assert.equal((await handleQuote(request(body), deps)).status, 200);
  assert.equal((await handleQuote(request(body), deps)).status, 200);
  assert.deepEqual(calls, ["internal", "confirmation"]);
  assert.equal(limits.filter((kind) => kind === "email").length, 1);
});
test("partial failure retries confirmation only and preserves reference", async () => {
  const { deps, calls } = fixture(),
    body = payload();
  let fail = true;
  deps.send = async (kind) => {
    calls.push(kind);
    if (kind === "confirmation" && fail) throw new Error("provider down");
    return kind;
  };
  const response = await handleQuote(request(body), deps),
    result = await response.json();
  assert.equal(response.status, 202);
  assert.equal(result.status, "partial");
  assert.equal(result.requestId, body.requestId);
  fail = false;
  assert.equal((await handleQuote(request(body), deps)).status, 200);
  assert.deepEqual(calls, ["internal", "confirmation", "confirmation"]);
});
test("concurrent double submit cannot send duplicate notifications", async () => {
  const { deps, calls } = fixture(),
    body = payload();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  deps.send = async (kind) => {
    calls.push(kind);
    if (kind === "internal") await gate;
    return kind;
  };
  const first = handleQuote(request(body), deps);
  while (!calls.length) await new Promise((resolve) => setImmediate(resolve));
  const second = await handleQuote(request(body), deps);
  assert.equal(second.status, 409);
  release();
  assert.equal((await first).status, 200);
  assert.deepEqual(calls, ["internal", "confirmation"]);
});
test("same reference with different content is rejected", async () => {
  const { deps, calls } = fixture(),
    body = payload();
  await handleQuote(request(body), deps);
  assert.equal(
    (await handleQuote(request({ ...body, name: "Otra persona" }), deps))
      .status,
    409,
  );
  assert.equal(calls.length, 2);
});
for (const [name, overrides] of Object.entries({
  consent: { consent: false },
  email: { email: "invalid" },
  description: { description: "x".repeat(2001) },
  type: { projectType: "invalid" },
  budget: { budget: "" },
  honeypot: { website: "spam" },
  challengeExpired: { turnstileToken: "expired" },
  challengeMissing: { turnstileToken: "" },
})) {
  test(`rejects invalid ${name} without sending`, async () => {
    const { deps, calls } = fixture();
    assert.equal(
      (await handleQuote(request(payload(overrides)), deps)).status,
      400,
    );
    assert.deepEqual(calls, []);
  });
}
test("accepts exactly 2,000 description characters", async () => {
  const { deps } = fixture();
  assert.equal(
    (
      await handleQuote(
        request(payload({ description: "x".repeat(2000) })),
        deps,
      )
    ).status,
    200,
  );
});
test("origin, payload size, and rate limits are enforced", async () => {
  const { deps, calls } = fixture();
  assert.equal(
    (await handleQuote(request(payload(), "https://evil.example"), deps))
      .status,
    403,
  );
  assert.equal(
    (
      await handleQuote(
        request(payload({ description: "x".repeat(17000) })),
        deps,
      )
    ).status,
    413,
  );
  deps.limit = async () => ({ success: false, reset: Date.now() + 60000 });
  const response = await handleQuote(request(), deps);
  assert.equal(response.status, 429);
  assert.ok(Number(response.headers.get("retry-after")) > 0);
  assert.deepEqual(calls, []);
});
test("email bucket blocks new requests; unavailable protection fails closed", async () => {
  const { deps, calls } = fixture();
  deps.limit = async (kind) => ({
    success: kind !== "email",
    reset: Date.now() + 1000,
  });
  assert.equal((await handleQuote(request(), deps)).status, 429);
  deps.limit = async () => {
    throw new Error("redis offline");
  };
  assert.equal((await handleQuote(request(), deps)).status, 503);
  assert.deepEqual(calls, []);
});
test("real email failure stays an error, never test success", async () => {
  const { deps } = fixture();
  deps.send = async () => {
    throw new Error("provider down");
  };
  const response = await handleQuote(request(), deps),
    body = await response.json();
  assert.equal(response.status, 503);
  assert.equal(body.mode, "live");
  assert.equal(body.status, "error");
});
