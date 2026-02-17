import { NextResponse } from "next/server";

const BASE_URL = "https://natillera-frame.vercel.app";

const manifest = {
  accountAssociation: {
    header:
      "eyJmaWQiOjExNzg3OTgsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhlMTdGMEQxRDA3RjlDYThFNTQzNTIyQjQ0MjcyMjc4MEM1OTNENmM4In0",
    payload: "eyJkb21haW4iOiJuYXRpbGxlcmEtZnJhbWUudmVyY2VsLmFwcCJ9",
    signature:
      "tA2a8ukj8zsut8psMw0XzErmfBNkY8Yskzvr1NmJ4SUvbrpQtHROSFp7VPneC7yWZR8o5Dx0QFB0801OO+KnjRw=",
  },
  frame: {
    version: "1",
    name: "Natillera On-Chain",
    iconUrl: `${BASE_URL}/icon.png`,
    homeUrl: "https://frontend-neon-nine-31.vercel.app",
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
