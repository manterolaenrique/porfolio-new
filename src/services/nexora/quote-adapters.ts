import { createHmac } from "node:crypto";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { Resend } from "resend";
import type { QuoteMode } from "@/domain/nexora-quote";
import type { QuoteDependencies, QuoteReceipt, QuoteStore } from "./quote-core";

export function quoteConfiguration() {
  const origins = (
    process.env.NEXORA_ALLOWED_ORIGINS ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  )
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const mailReady = !!(
    process.env.RESEND_API_KEY &&
    process.env.NEXORA_QUOTE_FROM &&
    process.env.NEXORA_QUOTE_TO
  );
  const protectionReady = !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN &&
    process.env.TURNSTILE_SECRET_KEY &&
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
    (process.env.NEXORA_HMAC_SECRET?.length || 0) >= 32
  );
  const requestedLive = process.env.NEXORA_MAIL_MODE === "live";
  const mode: QuoteMode =
    !requestedLive || !mailReady
      ? "test"
      : protectionReady
        ? "live"
        : "unavailable";
  return {
    mode,
    origins,
    siteKey:
      mode === "live" ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY : undefined,
  };
}

function receiptStore(redis: Redis): QuoteStore {
  const key = (id: string) => `nexora:quote:${id}`;
  const ttl = (receipt: QuoteReceipt) =>
    Math.max(1, Math.ceil((receipt.expiresAt - Date.now()) / 1000));
  return {
    get: (id) => redis.get<QuoteReceipt>(key(id)),
    create: async (id, receipt) =>
      !!(await redis.set(key(id), receipt, { nx: true, ex: ttl(receipt) })),
    save: async (id, receipt) => {
      await redis.set(key(id), receipt, { ex: ttl(receipt) });
    },
    lock: async (id, owner) =>
      !!(await redis.set(key(id) + ":lock", owner, { nx: true, ex: 60 })),
    unlock: async (id, owner) => {
      await redis.eval(
        'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end',
        [key(id) + ":lock"],
        [owner],
      );
    },
  };
}

export function quoteDependencies(request: Request): QuoteDependencies {
  const configuration = quoteConfiguration();
  if (configuration.mode !== "live")
    return { mode: configuration.mode, origins: configuration.origins };
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    retry: { retries: 0 },
  });
  const limits = {
    ip: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      prefix: "nexora:ip",
      analytics: false,
      timeout: 2500,
    }),
    email: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      prefix: "nexora:email",
      analytics: false,
      timeout: 2500,
    }),
  };
  const resend = new Resend(process.env.RESEND_API_KEY);
  return {
    mode: "live",
    origins: configuration.origins,
    store: receiptStore(redis),
    // Only trust the platform-owned header on Vercel. Local/proxy-free runs share a conservative bucket.
    clientIp: process.env.VERCEL
      ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() ||
        "unknown"
      : "local",
    limit: async (kind, identifier) => {
      const digest = createHmac("sha256", process.env.NEXORA_HMAC_SECRET!)
        .update(identifier)
        .digest("hex");
      const result = await limits[kind].limit(digest);
      if (result.reason === "timeout")
        throw new Error("Rate limiter unavailable");
      return { success: result.success, reset: result.reset };
    },
    verifyChallenge: async (token, hostname) => {
      const result = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: token,
          }),
          signal: AbortSignal.timeout(8000),
          cache: "no-store",
        },
      );
      if (!result.ok) return false;
      const payload = (await result.json()) as {
        success?: boolean;
        hostname?: string;
        action?: string;
      };
      return (
        payload.success === true &&
        payload.hostname === hostname &&
        payload.action === "nexora_quote"
      );
    },
    send: async (kind, input, preview) => {
      const { data, error } = await resend.emails.send(
        {
          from: process.env.NEXORA_QUOTE_FROM!,
          to: kind === "internal" ? process.env.NEXORA_QUOTE_TO! : input.email,
          replyTo: kind === "internal" ? input.email : undefined,
          subject: preview.subject,
          text: preview.text,
        },
        { idempotencyKey: `nexora/${input.requestId}/${kind}` },
      );
      if (error || !data?.id)
        throw new Error("Mail provider did not accept the message");
      return data.id;
    },
  };
}
