import { fetchMetadata } from "frames.js/next";
import type { Metadata } from "next";
import { NATILLERAS } from "@/lib/natilleras";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  let frameMetadata = {};
  try {
    frameMetadata = await fetchMetadata(new URL("/frames", baseUrl));
  } catch {
    // During build the server isn't running — skip
  }

  return {
    title: "Natillera On-Chain | Farcaster Frame",
    description: "Ahorro rotativo descentralizado en Celo",
    other: frameMetadata,
  };
}

export default function Page() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        background: "#0a0f1a",
        color: "#fff",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "2.2rem", color: "#35D07F", marginBottom: "0.5rem" }}>
        Natillera On-Chain
      </h1>
      <p
        style={{
          color: "rgba(255,255,255,0.55)",
          marginBottom: "2rem",
          textAlign: "center",
          maxWidth: "420px",
        }}
      >
        Farcaster Frame &middot; Ahorro rotativo descentralizado en Celo
        <br />
        Abre este enlace en Warpcast para interactuar con el Frame.
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          width: "100%",
          maxWidth: "420px",
          marginBottom: "2rem",
        }}
      >
        {NATILLERAS.map((n) => (
          <div
            key={n.address}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.7rem 1rem",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span style={{ fontSize: "1.4rem" }}>{n.emoji}</span>
            <span>{n.name}</span>
          </div>
        ))}
      </div>
      <a
        href="https://frontend-neon-nine-31.vercel.app"
        style={{
          display: "inline-block",
          padding: "12px 28px",
          background: "#35D07F",
          color: "#0a0f1a",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: "1.05rem",
        }}
      >
        Ir al Frontend
      </a>
      <p
        style={{
          marginTop: "1.5rem",
          fontSize: "0.85rem",
          color: "rgba(255,255,255,0.25)",
        }}
      >
        Celo Agent Hackathon
      </p>
    </div>
  );
}
