"use client";

import { useEffect, useState } from "react";
import { ROOT_DOMAIN } from "@/lib/subdomain";

const NAMES = [
  "shivansh",
  "govind",
  "your-enemy",
  "your-boss",
  "your-ex",
  "your-bestie",
  "the-group-chat",
];

type Phase = "typing" | "hold" | "deleting";

export default function TypewriterUrl() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    const target = NAMES[idx];
    let delay = 0;
    if (phase === "typing") {
      delay = text.length < target.length ? 65 : 1300;
    } else if (phase === "hold") {
      delay = 200;
    } else {
      delay = text.length > 0 ? 30 : 200;
    }

    const t = setTimeout(() => {
      if (phase === "typing") {
        if (text.length < target.length) {
          setText(target.slice(0, text.length + 1));
        } else {
          setPhase("hold");
        }
      } else if (phase === "hold") {
        setPhase("deleting");
      } else {
        if (text.length > 0) {
          setText(text.slice(0, -1));
        } else {
          setIdx((i) => (i + 1) % NAMES.length);
          setPhase("typing");
        }
      }
    }, delay);

    return () => clearTimeout(t);
  }, [text, phase, idx]);

  return (
    <div className="typewriter" aria-hidden="true">
      <span className="typewriter-name">{text}</span>
      <span className="typewriter-caret" />
      <span className="typewriter-root">.{ROOT_DOMAIN}</span>
    </div>
  );
}
