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
          background: "#1f4a45",
          color: "#f4efe6",
          fontSize: 18,
          fontWeight: 700,
          borderRadius: 8,
        }}
      >
        ش
      </div>
    ),
    size,
  );
}
