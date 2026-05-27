import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const BG = "#f4f1ea";
const ACCENT = "#b32626";

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
            width: 120,
            height: 120,
            borderRadius: 120,
            background: ACCENT,
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
