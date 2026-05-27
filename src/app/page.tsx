import { headers } from "next/headers";
import { after } from "next/server";
import { copyFor, parseSubdomain, ROOT_DOMAIN } from "@/lib/subdomain";
import { logVisit } from "@/lib/logVisit";

export const dynamic = "force-dynamic";

export default async function Page() {
  const h = await headers();
  const host = h.get("host");
  const info = parseSubdomain(host);
  const { headline, subline, flavor, name } = copyFor(info);
  const isRoot = info.kind === "root";

  // Fire-and-forget after the response is sent. Page render does not wait on Mongo.
  after(() => logVisit({ headers: h, info, copy: { headline, subline, flavor } }));

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
            <hr className="rule" />
            <div className="try">
              <p className="try-label">how it works</p>
              <ul>
                <li>shivansh.{ROOT_DOMAIN}</li>
                <li>govind.{ROOT_DOMAIN}</li>
                <li>
                  <span className="placeholder">your-name</span>.{ROOT_DOMAIN}
                </li>
              </ul>
            </div>
          </>
        )}

        <footer className="footer">
          <hr className="rule" />a small website by{" "}
          <a href={`https://${ROOT_DOMAIN}`}>{ROOT_DOMAIN}</a>. no cookies, no
          tracking, no point.
        </footer>
      </div>
    </main>
  );
}
