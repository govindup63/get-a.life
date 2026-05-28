"use client";

import { useMemo, useState, type FormEvent } from "react";
import { copyFor, parseSubdomain, ROOT_DOMAIN } from "@/lib/subdomain";

const MAX_LEN = 40;

function sanitize(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, MAX_LEN);
}

function targetUrl(name: string): string | null {
  if (typeof window === "undefined") return null;
  const fullHost = window.location.host; // host includes port
  const [hostName, port] = fullHost.split(":");
  const protocol = window.location.protocol;

  // Decide the base domain to glue the new subdomain onto.
  // Falls back to the production apex if we're somewhere unexpected (e.g. a vercel preview).
  let base = "get-some.life";
  if (hostName.endsWith("localhost")) base = "localhost";
  else if (hostName.endsWith("get-some.life")) base = "get-some.life";
  else base = hostName.split(".").slice(-2).join(".") || hostName;

  const portPart = port ? `:${port}` : "";
  return `${protocol}//${name}.${base}${portPart}`;
}

export default function RoastInput() {
  const [raw, setRaw] = useState("");
  const clean = useMemo(() => sanitize(raw), [raw]);

  const preview = useMemo(() => {
    if (!clean) return null;
    const info = parseSubdomain(`${clean}.${ROOT_DOMAIN}`);
    return copyFor(info).headline;
  }, [clean]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!clean) return;
    const url = targetUrl(clean);
    if (url) window.location.assign(url);
  }

  return (
    <form className="roast-form" onSubmit={submit} noValidate>
      <div className="roast-input-row">
        <label className="roast-input-shell" htmlFor="roast-name">
          <input
            id="roast-name"
            type="text"
            inputMode="text"
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            placeholder="your-enemy"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="roast-input"
            aria-label="enter a name to roast"
            maxLength={MAX_LEN}
          />
          <span className="roast-input-suffix">.{ROOT_DOMAIN}</span>
        </label>
        <button type="submit" className="roast-submit" disabled={!clean}>
          cook →
        </button>
      </div>
      <p
        className={`roast-preview ${preview ? "is-visible" : ""}`}
        aria-live="polite"
      >
        {preview ?? " "}
      </p>
    </form>
  );
}
