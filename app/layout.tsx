import type { Metadata } from "next";
import FarcasterInit from "./components/FarcasterInit";

export const metadata: Metadata = {
  title: "Natillera On-Chain - Farcaster Frame",
  description: "Ahorro rotativo descentralizado en Celo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>
        <FarcasterInit />
        {children}
      </body>
    </html>
  );
}
