export const ROOT_DOMAIN = "get-some.life";

export type SpecialEntry = {
  headline: string;
  subline: string;
  flavor?: string;
};

// Hand-picked subdomains get a custom roast instead of the generic one.
export const SPECIAL_SUBDOMAINS: Record<string, SpecialEntry> = {
  govind: {
    headline: "govind already has a life. you have a fleshlight and a fitbit.",
    subline:
      "he's out raw-dogging reality while you're refreshing his subdomain at 3am like it owes you child support.",
    flavor:
      "the fact that you typed his name to feel something is the most pathetic thing on the public internet today.",
  },
};

// Subdomains we never want to render a roast for (reserved / infra).
const RESERVED = new Set([
  "www",
  "api",
  "admin",
  "mail",
  "ftp",
  "static",
  "assets",
  "cdn",
]);

export type SubdomainInfo =
  | { kind: "root" }
  | { kind: "reserved"; name: string }
  | { kind: "special"; name: string; entry: SpecialEntry }
  | { kind: "generic"; name: string };

export function parseSubdomain(host: string | null): SubdomainInfo {
  if (!host) return { kind: "root" };

  // Strip port, lowercase.
  const clean = host.split(":")[0].toLowerCase().trim();
  if (!clean) return { kind: "root" };

  // Localhost dev: foo.localhost
  if (clean === "localhost" || clean === "127.0.0.1") {
    return { kind: "root" };
  }
  if (clean.endsWith(".localhost")) {
    const name = clean.slice(0, -".localhost".length);
    return classify(name);
  }

  // Production: foo.get-some.life
  if (clean === ROOT_DOMAIN) return { kind: "root" };
  if (clean.endsWith(`.${ROOT_DOMAIN}`)) {
    const name = clean.slice(0, -(ROOT_DOMAIN.length + 1));
    return classify(name);
  }

  // Unknown host (vercel preview, ip, etc.) — treat as root.
  return { kind: "root" };
}

function classify(raw: string): SubdomainInfo {
  // Only consider the leftmost label so deep subs like a.b.get-some.life
  // still resolve to "a".
  const name = raw.split(".")[0];
  if (!name) return { kind: "root" };
  if (RESERVED.has(name)) return { kind: "reserved", name };
  const special = SPECIAL_SUBDOMAINS[name];
  if (special) return { kind: "special", name, entry: special };
  return { kind: "generic", name };
}

// Deterministic pick so the same subdomain always sees the same roast.
function pick<T>(seed: string, items: readonly T[]): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return items[Math.abs(hash) % items.length];
}

const HEADLINES = [
  (n: string) => `${n}, you absolute walking sperm refund.`,
  (n: string) => `${n} has the structural integrity of a wet cigarette.`,
  (n: string) => `we autopsied ${n} while still alive. nothing changed.`,
  (n: string) => `${n}, even your shadow files restraining orders.`,
  (n: string) => `breaking: ${n} is still alive. forensics is baffled.`,
  (n: string) => `${n}'s personality is a chrome tab that won't close.`,
  (n: string) => `${n}, your search history could be entered as evidence.`,
  (n: string) => `${n}.exe crashed. so did the family bloodline.`,
  (n: string) => `${n}, every group chat mutes you on sight.`,
  (n: string) => `${n}, your own reflection ghosted you last tuesday.`,
  (n: string) => `${n}'s rizz hasn't been patched since the bush administration.`,
  (n: string) => `${n}, you are the reason your dad lifts the toilet seat and weeps.`,
  (n: string) => `${n}, NPCs in stardew valley have more depth than your soul.`,
  (n: string) => `${n}, you came in last in a race of one.`,
  (n: string) => `${n}, your parents had you and immediately started saving for a do-over.`,
  (n: string) => `${n}, the void called. it doesn't want you either.`,
];

const SUBLINES = [
  "you smell like a vape pen left in a damp hoodie.",
  "your last unprompted social interaction was a captcha and the bot won.",
  "your mom slides dinner under the door and never makes eye contact again.",
  "you have the sexual market value of an expired warranty.",
  "the gym banned you for emotional damage to the mirrors and the squat rack.",
  "your dating profile is a screenshot of your sleep schedule and a single mid selfie.",
  "the only thing you've pulled in three years is a back muscle reaching for the doritos.",
  "your therapist quit, changed careers, and entered witness protection.",
  "even your sleep paralysis demon scrolls his phone now, you're that boring.",
  "your father didn't leave for milk. he saw your report card and chose freedom.",
  "your situationship is a parasocial relationship with a discord moderator.",
  "you've been ratio'd by an autoreply.",
  "your bed has memorized the exact shape of your defeat and asked to be replaced.",
  "you are why your mother flinches at the word 'son'.",
  "your gooning chair has more mileage than your passport.",
  "you are 60% body, 40% browser tabs, 100% disappointment.",
  "your last hug came with an invoice.",
];

const FLAVORS = [
  "this site is a war crime. you typed it in anyway. checkmate.",
  "diagnosis: terminally beta with complications of cringe.",
  "step 1 of recovery: close this tab, step 2: apologize to your bloodline.",
  "you searched this at 2pm on a tuesday. unemployment radiates off you.",
  "we'd touch grass with you but the grass filed a complaint.",
  "powered by your humiliation, hosted in your insecurities, monetized by your enemies.",
  "you read every word of this in your own voice. that was the real punishment.",
  "the cringe is coming from inside the house. the house is you.",
  "imagine being so cooked the smoke alarm just gave up.",
];

export function copyFor(info: SubdomainInfo): {
  headline: string;
  subline: string;
  flavor: string;
  name: string | null;
} {
  if (info.kind === "special") {
    return {
      headline: info.entry.headline,
      subline: info.entry.subline,
      flavor: info.entry.flavor ?? pick(info.name, FLAVORS),
      name: info.name,
    };
  }
  if (info.kind === "generic") {
    return {
      headline: pick(info.name + "h", HEADLINES)(info.name),
      subline: pick(info.name + "s", SUBLINES),
      flavor: pick(info.name + "f", FLAVORS),
      name: info.name,
    };
  }
  if (info.kind === "reserved") {
    return {
      headline: "nice try, you slack-jawed url enjoyer.",
      subline: `'${info.name}' is reserved. like the last single seat on a flight you'll take alone, again.`,
      flavor: "type a real name. preferably someone who's wronged you.",
      name: info.name,
    };
  }
  return {
    headline: "type a loser's name. we'll cook them.",
    subline:
      "put any name in front of the dot. we will issue a public character assassination on demand, free of charge.",
    flavor: "they will know it was you. they will see this and weep.",
    name: null,
  };
}
