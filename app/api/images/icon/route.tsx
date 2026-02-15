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
        {/* Outer gradient ring */}
        <div
          style={{
            width: 820,
            height: 820,
            borderRadius: 410,
            background: "linear-gradient(135deg, #35D07F 0%, #FBCC5C 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Dark gap ring */}
          <div
            style={{
              width: 740,
              height: 740,
              borderRadius: 370,
              background: "#0a0f1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Inner gradient circle */}
            <div
              style={{
                width: 580,
                height: 580,
                borderRadius: 290,
                background:
                  "linear-gradient(145deg, #35D07F 0%, #2BAE6A 45%, #FBCC5C 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* N letter */}
              <div
                style={{
                  fontSize: 300,
                  fontWeight: 900,
                  color: "#0a0f1a",
                  display: "flex",
                  letterSpacing: -8,
                }}
              >
                N
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1024,
      height: 1024,
    }
  );
}
