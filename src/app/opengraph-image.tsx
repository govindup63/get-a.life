import { ImageResponse } from "next/og";
import { headers } from "next/headers";
import { copyFor, parseSubdomain, ROOT_DOMAIN } from "@/lib/subdomain";

export const alt = "get-some.life";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette — must match src/app/globals.css.
const BG = "#f4f1ea";
const INK = "#14110d";
const MUTED = "#6b6358";
const ACCENT = "#b32626";
const RULE = "#d8d0c0";

async function font(slug: string, weight: number): Promise<ArrayBuffer> {
  const url = `https://cdn.jsdelivr.net/fontsource/fonts/${slug}@latest/latin-${weight}-normal.ttf`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`font ${slug}@${weight} ${res.status}`);
  return res.arrayBuffer();
}

export default async function Image() {
  const h = await headers();
  const info = parseSubdomain(h.get("host"));
  const { headline, subline, flavor, name } = copyFor(info);

  const [serifRegular, serifBold, mono] = await Promise.all([
    font("source-serif-4", 400),
    font("source-serif-4", 700),
    font("jetbrains-mono", 500),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          color: INK,
          fontFamily: "Source Serif",
          padding: "72px 80px",
        }}
      >
        {/* Top — eyebrow with subdomain badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: "JetBrains Mono",
            fontSize: 24,
            color: MUTED,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 16,
              background: ACCENT,
              display: "flex",
            }}
          />
          <span>{name ? `${name}.${ROOT_DOMAIN}` : ROOT_DOMAIN}</span>
        </div>

        {/* Middle — headline + subline + flavor */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 12 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
              color: INK,
              display: "flex",
            }}
          >
            {headline}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 36,
              lineHeight: 1.35,
              color: INK,
              display: "flex",
            }}
          >
            {subline}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 26,
              color: MUTED,
              display: "flex",
            }}
          >
            — {flavor}
          </div>
        </div>

        {/* Bottom — rule + footer */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: "100%",
              height: 1,
              background: RULE,
              marginBottom: 18,
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "JetBrains Mono",
              fontSize: 20,
              color: MUTED,
            }}
          >
            <span>{ROOT_DOMAIN}</span>
            <span>a small website that reads your subdomain.</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Source Serif", data: serifRegular, weight: 400, style: "normal" },
        { name: "Source Serif", data: serifBold, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
