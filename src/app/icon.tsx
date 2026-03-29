import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

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
          background: "linear-gradient(135deg, #8bc34a, #689f38)",
          borderRadius: "22%",
        }}
      >
        <svg width="70%" height="70%" viewBox="0 0 24 24" fill="none">
          <path
            d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 20 .5 20 .5s-4.7 4.5-6.4 10.2A7 7 0 0 1 11 20Z"
            fill="white"
          />
          <path
            d="M10.7 14c2-3 5.3-5.6 5.3-5.6"
            stroke="rgba(104,159,56,0.5)"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
