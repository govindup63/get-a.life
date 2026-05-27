import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const BG = "#f4f1ea";
const ACCENT = "#b32626";

export default function Icon() {
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
            width: 22,
            height: 22,
            borderRadius: 22,
            background: ACCENT,
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
