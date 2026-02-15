import { NextResponse } from "next/server";

const BASE_URL = "https://natillera-frame.vercel.app";

const manifest = {
  accountAssociation: {
    header: process.env.FARCASTER_MANIFEST_HEADER ?? "",
    payload: process.env.FARCASTER_MANIFEST_PAYLOAD ?? "",
    signature: process.env.FARCASTER_MANIFEST_SIGNATURE ?? "",
  },
  frame: {
    version: "1",
    name: "Natillera On-Chain",
    iconUrl: `${BASE_URL}/icon.png`,
    homeUrl: `${BASE_URL}/frames`,
    imageUrl: `${BASE_URL}/og-image.png`,
    subtitle: "Ahorro rotativo en Celo",
    description:
      "Natilleras descentralizadas on-chain. Sistema de ahorro rotativo para comunidades en Celo Mainnet.",
    primaryCategory: "finance",
    tags: ["defi", "celo", "savings", "latam", "natillera"],
    splashImageUrl: `${BASE_URL}/splash.png`,
    splashBackgroundColor: "#0a0f1a",
  },
};

export async function GET() {
  return NextResponse.json(manifest);
}
