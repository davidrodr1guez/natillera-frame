import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0f1a",
        }}
      >
        {/* Gradient circle */}
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: 80,
            background:
              "linear-gradient(145deg, #35D07F 0%, #2BAE6A 45%, #FBCC5C 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 88,
              fontWeight: 900,
              color: "#0a0f1a",
              display: "flex",
              letterSpacing: -2,
            }}
          >
            N
          </div>
        </div>
      </div>
    ),
    {
      width: 200,
      height: 200,
    }
  );
}
