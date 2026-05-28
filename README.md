# get-some.life

a small website that reads your subdomain and roasts you.

- `shivansh.get-some.life` → roasts whoever shivansh is
- `your-boss.get-some.life` → roasts your boss
- `govind.get-some.life` → one of the few hand-written roasts (the maker)
- `*.get-some.life` → roasts whoever you typed

every share is a self-delivered insult. paste a link in a group chat
and the open graph preview lands the burn before anyone clicks.

## how it works

every page render reads the host header on the server, parses the
subdomain, and serves a deterministic roast for that name. same name
always gets the same roast, which keeps screenshots reproducible.

a few names have hand-written entries in `SPECIAL_SUBDOMAINS` (see
`src/lib/subdomain.ts`). everyone else gets a hash-picked combination
from a pool of ~116 headlines, ~117 sublines, and ~109 flavors.

the open graph image is generated per request by Next's
`opengraph-image.tsx` file convention, so the preview matches the
page exactly.

## stack

- Next.js 16 (App Router, Turbopack)
- Tailwind v4
- MongoDB Atlas (optional — logs each visit and maintains a per-subdomain
  rollup. site works fine with `MONGODB_URI` unset.)
- Vercel for hosting, edge SSL, and per-request OG image generation

## local dev

```bash
git clone git@github.com:govindup63/get-a.life.git
cd get-a.life
npm install
npm run dev
```

then:

- `http://localhost:3000` for the landing
- `http://shivansh.localhost:3000` (or any name) for a roast

modern browsers resolve `*.localhost` to `127.0.0.1` automatically, no
hosts file needed.

## env

both env vars are optional. without them the site renders fine but
nothing gets logged.

```bash
# Atlas connection string. The DB name is hardcoded to `get-some`
# in src/lib/mongo.ts, so the path in the URI is ignored.
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true

# Salt used for hashing visitor IPs before they hit Mongo. Any long
# random string. Keep it stable — rotating invalidates past unique
# visitor counts. Generate one with: openssl rand -hex 32
IP_HASH_SALT=...
```

copy `.env.example` to `.env.local` and fill these in for local testing.

## what gets logged

two collections in the `get-some` database:

- **`visits`** — one document per page render. fields: `ts`,
  `subdomain`, `kind`, `host`, `copy`, `country`, `region`, `city`,
  `referer`, `ua`, `isBot`, `ipHash`. raw IP is never stored.
- **`subdomains`** — one document per unique name, upserted on every
  visit. fast leaderboard data: `visits`, `humans`, top countries,
  top referers.

logging is fire-and-forget via `next/server`'s `after()`, so a slow or
unreachable Mongo never delays a page response.

## deploy (Vercel)

1. attach domains to the project:
   - `get-some.life` (apex)
   - `*.get-some.life` (wildcard — required for the subdomain trick)
   - optionally `www.get-some.life`
2. set DNS. wildcard SSL requires delegating nameservers to Vercel
   (`ns1.vercel-dns.com` / `ns2.vercel-dns.com`) rather than just
   adding records at your registrar.
3. add `MONGODB_URI` and `IP_HASH_SALT` in project settings (any
   environment scope).
4. push to `main`. Vercel auto-deploys.

## project layout

```
src/
├── app/
│   ├── page.tsx              landing + per-subdomain roast page
│   ├── layout.tsx            global metadata, fallback metadataBase
│   ├── globals.css           cream + ink + serif theme
│   ├── opengraph-image.tsx   per-request 1200x630 PNG via next/og
│   ├── icon.tsx              32x32 favicon (solid red disk)
│   └── apple-icon.tsx        180x180 touch icon
├── components/
│   ├── RoastInput.tsx        name input with live headline preview
│   └── TypewriterUrl.tsx     cycling URL animation on landing
└── lib/
    ├── subdomain.ts          parseSubdomain + roast copy pools
    ├── mongo.ts              cached client + index bootstrap
    ├── logVisit.ts           fire-and-forget visit write
    └── stats.ts              total roast counter
```

## license

none. don't ship this verbatim. take the idea, write your own roasts.
