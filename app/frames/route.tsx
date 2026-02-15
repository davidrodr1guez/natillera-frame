/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { NATILLERAS, CELOSCAN_URL, FRONTEND_URL } from "@/lib/natilleras";
import { getNatilleraData } from "@/lib/contract";

const GREEN = "#35D07F";
const GOLD = "#FBCC5C";
const BG = "linear-gradient(145deg, #0a0f1a 0%, #121d2e 50%, #0a1628 100%)";

function shortAddr(a: string) {
  return `${a.slice(0, 6)}...${a.slice(-4)}`;
}

const handleRequest = frames(async (ctx) => {
  const screen = ctx.searchParams?.screen ?? "home";
  const natilleraIndex = parseInt(ctx.searchParams?.idx ?? "0", 10);

  // ─── HOME SCREEN ──────────────────────────────────────────────────────
  if (screen === "home") {
    return {
      image: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background: BG,
            padding: "40px 50px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                fontSize: "50px",
                fontWeight: 700,
                color: GREEN,
                marginBottom: "6px",
              }}
            >
              Natillera On-Chain
            </div>
            <div style={{ fontSize: "20px", color: "rgba(255,255,255,0.55)" }}>
              Ahorro rotativo descentralizado en Celo
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              width: "90%",
              maxWidth: "700px",
              height: "3px",
              background: `linear-gradient(90deg, ${GREEN}, ${GOLD}, ${GREEN})`,
              borderRadius: "2px",
              marginBottom: "24px",
            }}
          />

          {/* Natillera list */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              maxWidth: "700px",
            }}
          >
            {NATILLERAS.map((n, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  borderRadius: "12px",
                  padding: "16px 22px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  marginBottom: i < NATILLERAS.length - 1 ? "12px" : "0px",
                }}
              >
                <div style={{ fontSize: "30px", marginRight: "14px" }}>
                  {n.emoji}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: "1",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 600,
                      color: "#F1F5F9",
                    }}
                  >
                    {n.name}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.35)",
                      fontFamily: "monospace",
                    }}
                  >
                    {shortAddr(n.address)}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    color: GREEN,
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              maxWidth: "700px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              Selecciona una natillera ↓
            </div>
            <div
              style={{
                display: "flex",
                padding: "6px 14px",
                background: "rgba(53,208,127,0.15)",
                borderRadius: "8px",
                fontSize: "14px",
                color: GREEN,
              }}
            >
              Celo Agent Hackathon
            </div>
          </div>
        </div>
      ),
      imageOptions: {
        aspectRatio: "1.91:1",
      },
      buttons: NATILLERAS.map((n, i) => (
        <Button
          action="post"
          target={{ pathname: "/frames", query: { screen: "detail", idx: String(i) } }}
        >
          {`${n.emoji} ${n.name.split(" ").slice(-1)[0]}`}
        </Button>
      )),
    };
  }

  // ─── DETAIL SCREEN ────────────────────────────────────────────────────
  const natillera = NATILLERAS[natilleraIndex];
  if (!natillera) {
    return {
      image: (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            background: BG,
            justifyContent: "center",
            alignItems: "center",
            color: "#EF4444",
            fontSize: "36px",
          }}
        >
          Natillera no encontrada
        </div>
      ),
      buttons: [
        <Button
          action="post"
          target={{ pathname: "/frames", query: { screen: "home" } }}
        >
          ← Volver
        </Button>,
      ],
    };
  }

  let data;
  try {
    data = await getNatilleraData(natillera.address);
  } catch (err) {
    console.error("Contract read error:", err);
    data = null;
  }

  const statusColor =
    data?.statusCode === 1
      ? GREEN
      : data?.statusCode === 2
        ? "#3B82F6"
        : data?.statusCode === 3
          ? "#EF4444"
          : GOLD;

  return {
    image: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: BG,
          padding: "40px 50px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "700px",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ fontSize: "48px", marginRight: "14px" }}>
              {natillera.emoji}
            </div>
            <div
              style={{
                fontSize: "40px",
                fontWeight: 700,
                color: "#F1F5F9",
              }}
            >
              {data?.name ?? natillera.name}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              padding: "8px 22px",
              background: statusColor,
              borderRadius: "24px",
              fontSize: "22px",
              fontWeight: 700,
              color: "#0a0f1a",
            }}
          >
            {data?.status ?? "Cargando..."}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "700px",
            height: "3px",
            background: `linear-gradient(90deg, ${GREEN}, ${GOLD}, ${GREEN})`,
            borderRadius: "2px",
            marginBottom: "32px",
          }}
        />

        {data ? (
          <div
            style={{
              display: "flex",
              width: "100%",
              maxWidth: "700px",
              marginBottom: "28px",
            }}
          >
            {/* Contribution card */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                background: "rgba(53,208,127,0.08)",
                border: "2px solid rgba(53,208,127,0.25)",
                borderRadius: "16px",
                padding: "24px 28px",
                marginRight: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  color: GREEN,
                  marginBottom: "8px",
                  fontWeight: 600,
                }}
              >
                Contribución
              </div>
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 700,
                  color: "#F1F5F9",
                }}
              >
                {data.contributionAmount} CELO
              </div>
            </div>

            {/* Round card */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                background: "rgba(251,204,92,0.08)",
                border: "2px solid rgba(251,204,92,0.25)",
                borderRadius: "16px",
                padding: "24px 28px",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  color: GOLD,
                  marginBottom: "8px",
                  fontWeight: 600,
                }}
              >
                Ronda Actual
              </div>
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 700,
                  color: "#F1F5F9",
                }}
              >
                #{data.currentRound}
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              fontSize: "24px",
              color: "#EF4444",
              marginBottom: "28px",
            }}
          >
            Error leyendo datos del contrato
          </div>
        )}

        {/* Contract address */}
        <div
          style={{
            display: "flex",
            fontSize: "18px",
            color: "rgba(255,255,255,0.4)",
            marginBottom: "16px",
          }}
        >
          Contrato: {shortAddr(natillera.address)}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "700px",
            marginTop: "auto",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Natillera On-Chain • Celo Blockchain
          </div>
          <div
            style={{
              display: "flex",
              padding: "6px 14px",
              background: "rgba(53,208,127,0.15)",
              borderRadius: "8px",
              fontSize: "14px",
              color: GREEN,
            }}
          >
            Celo Agent Hackathon
          </div>
        </div>
      </div>
    ),
    imageOptions: {
      aspectRatio: "1.91:1",
    },
    buttons: [
      <Button
        action="post"
        target={{ pathname: "/frames", query: { screen: "home" } }}
      >
        ← Volver
      </Button>,
      <Button
        action="link"
        target={`${CELOSCAN_URL}/${natillera.address}`}
      >
        Celoscan
      </Button>,
      <Button
        action="link"
        target={FRONTEND_URL}
      >
        Contribuir
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
