import type { Metadata } from "next";
import { headers } from "next/headers";
import { after } from "next/server";
import { copyFor, parseSubdomain, ROOT_DOMAIN } from "@/lib/subdomain";
import { logVisit } from "@/lib/logVisit";
import { totalRoasts } from "@/lib/stats";
import RoastInput from "@/components/RoastInput";
import TypewriterUrl from "@/components/TypewriterUrl";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = h.get("host") ?? ROOT_DOMAIN;
  const proto =
    h.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const info = parseSubdomain(host);
  const { headline, subline } = copyFor(info);

  const isRoot = info.kind === "root";
  const title = isRoot ? "get-some.life" : headline;
  const description = subline;
  const url = `${proto}://${host}`;

  return {
    metadataBase: new URL(url),
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "get-some.life",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page() {
  const h = await headers();
  const host = h.get("host");
  const info = parseSubdomain(host);
  const { headline, subline, flavor, name } = copyFor(info);
  const isRoot = info.kind === "root";

  after(() => logVisit({ headers: h, info, copy: { headline, subline, flavor } }));

  // Only fetch the counter for the landing page render — subdomain pages don't show it.
  const counter = isRoot ? await totalRoasts() : null;

  return (
    <main className="page">
      <div className="wrap">
        <p className="eyebrow">
          <span className="dot">●</span>{" "}
          {name ? `${name}.${ROOT_DOMAIN}` : ROOT_DOMAIN}
        </p>

        <h1 className="headline">{headline}</h1>
        <p className="subline">{subline}</p>
        <p className="flavor">— {flavor}</p>

        {isRoot && (
          <>
            <RoastInput />

            <hr className="rule" />

            <div className="try">
              <TypewriterUrl />
            </div>

            {counter !== null && counter > 0 && (
              <>
                <hr className="rule" />
                <div className="counter">
                  <span className="counter-number">
                    {counter.toLocaleString("en-US")}
                  </span>
                  <span className="counter-label">
                    names cooked since launch
                  </span>
                </div>
              </>
            )}

            <hr className="rule" />

            <aside className="disclaimer">
              <p className="disclaimer-label">disclaimers &amp; disclosures</p>
              <p>
                this site is not affiliated with: your therapist, your mother,
                the constitution of india, or any deity. roasts are
                deterministic. all opinions expressed by{" "}
                <em>[name]</em>.get-some.life are the views of an algorithm
                with poor manners and no formal training. legal review pending
                since 2026. no warranties express or implied. no refunds.
                by visiting any subdomain you agree to forfeit your right to
                be offended.
              </p>
            </aside>
          </>
        )}

        <footer className="footer">
          <hr className="rule" />
          <p className="footer-line">
            a small website by{" "}
            <a href={`https://${ROOT_DOMAIN}`}>{ROOT_DOMAIN}</a>. no cookies,
            no tracking, no point.
          </p>
          <p className="footer-credit">
            — perpetrated by{" "}
            <a
              href="https://github.com/govindup63"
              target="_blank"
              rel="noopener noreferrer"
            >
              govindup63
            </a>
            , who should also get some life.
          </p>
        </footer>
      </div>
    </main>
  );
}
