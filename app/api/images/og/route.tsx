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
          background: "linear-gradient(135deg, #0a0f1a 0%, #141e2e 100%)",
          padding: 60,
        }}
      >
        {/* Left: Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 56,
          }}
        >
          {/* Outer ring */}
          <div
            style={{
              width: 340,
              height: 340,
              borderRadius: 170,
              background:
                "linear-gradient(135deg, #35D07F 0%, #FBCC5C 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 300,
                height: 300,
                borderRadius: 150,
                background: "#0a0f1a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 240,
                  height: 240,
                  borderRadius: 120,
                  background:
                    "linear-gradient(145deg, #35D07F 0%, #2BAE6A 45%, #FBCC5C 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 130,
                    fontWeight: 900,
                    color: "#0a0f1a",
                    display: "flex",
                    letterSpacing: -4,
                  }}
                >
                  N
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Text content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.1,
              display: "flex",
            }}
          >
            Natillera
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "#35D07F",
              lineHeight: 1.1,
              display: "flex",
            }}
          >
            On-Chain
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#FBCC5C",
              marginTop: 16,
              display: "flex",
            }}
          >
            Ahorro rotativo en Celo
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#8899AA",
              marginTop: 12,
              display: "flex",
              maxWidth: 480,
              lineHeight: 1.4,
            }}
          >
            Natilleras descentralizadas para comunidades en Celo Mainnet
          </div>
          {/* Tags */}
          <div
            style={{
              display: "flex",
              marginTop: 28,
            }}
          >
            {["DeFi", "Celo", "Savings", "LatAm"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "6px 18px",
                  borderRadius: 20,
                  background: "rgba(53, 208, 127, 0.12)",
                  color: "#35D07F",
                  fontSize: 16,
                  border: "1px solid rgba(53, 208, 127, 0.25)",
                  display: "flex",
                  marginRight: 10,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
