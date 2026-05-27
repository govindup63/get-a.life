import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const BG = "#f4f1ea";
const ACCENT = "#b32626";

// iOS forces opaque + auto-rounds the corners, so keep the cream tile and
// scale the dot up to fill ~90% of the frame.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BG,
        }}
      >
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: 160,
            background: ACCENT,
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
