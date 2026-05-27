import crypto from "node:crypto";
import { db } from "./mongo";
import type { SubdomainInfo } from "./subdomain";

const BOT_RE =
  /bot|crawl|spider|slurp|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|slackbot|discordbot|preview|pingdom|uptime|monitor|curl|wget|headless/i;

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT || "get-some-default-salt";
  return crypto
    .createHash("sha256")
    .update(salt + ip)
    .digest("hex")
    .slice(0, 16);
}

function clientIp(h: Headers): string | null {
  // x-forwarded-for can be a comma-separated chain; first entry is the client.
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip");
}

type VisitArgs = {
  headers: Headers;
  info: SubdomainInfo;
  copy: { headline: string; subline: string; flavor: string };
};

export async function logVisit({ headers: h, info, copy }: VisitArgs) {
  const d = await db();
  if (!d) return;

  const host = h.get("host") ?? null;
  const ua = h.get("user-agent") ?? null;
  const referer = h.get("referer") ?? h.get("referrer") ?? null;
  const country = h.get("x-vercel-ip-country") ?? null;
  const region = h.get("x-vercel-ip-country-region") ?? null;
  const city = (() => {
    const raw = h.get("x-vercel-ip-city");
    if (!raw) return null;
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  })();
  const isBot = ua ? BOT_RE.test(ua) : false;
  const ipHash = hashIp(clientIp(h));
  const subdomain = "name" in info ? info.name : null;
  const now = new Date();

  // Per-visit row. Append-only log.
  const visit = {
    ts: now,
    subdomain,
    kind: info.kind,
    host,
    copy,
    country,
    region,
    city,
    referer,
    ua,
    isBot,
    ipHash,
  };

  // Per-subdomain rollup. Counter maps stay small (top countries/referers).
  // We upsert by subdomain name; root visits get rolled up under "__root__"
  // so the leaderboard collection still has a tidy row for landing-page traffic.
  const rollupId = subdomain ?? "__root__";
  const refererHost = (() => {
    if (!referer) return null;
    try {
      return new URL(referer).hostname;
    } catch {
      return null;
    }
  })();

  const rollupInc: Record<string, number> = { visits: 1 };
  if (!isBot) rollupInc["humans"] = 1;
  if (country) rollupInc[`countries.${country}`] = 1;
  if (refererHost) {
    // Mongo keys can't contain dots — replace with underscore.
    const key = refererHost.replace(/\./g, "_");
    rollupInc[`referers.${key}`] = 1;
  }

  try {
    await Promise.all([
      d.collection("visits").insertOne(visit),
      d.collection("subdomains").updateOne(
        { _id: rollupId as unknown as never },
        {
          $set: { kind: info.kind, lastSeenAt: now },
          $setOnInsert: { firstSeenAt: now },
          $inc: rollupInc,
        },
        { upsert: true },
      ),
    ]);
  } catch (err) {
    // Never let logging break the page.
    console.warn("[logVisit] failed:", (err as Error).message);
  }
}
