import { NextRequest, NextResponse } from "next/server";
import { getAllNatillerasData, NatilleraData } from "@/lib/contract";
import { NATILLERAS } from "@/lib/natilleras";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const FALLBACK_DATA: NatilleraData[] = [
  { name: "Natillera Colombia", contributionAmount: "10.0", currentRound: 1, totalRounds: 4, status: "Activa", statusCode: 1, nextRecipient: "0x0000000000000000000000000000000000000000" },
  { name: "Ahorro Semanal Medellín", contributionAmount: "5.0", currentRound: 1, totalRounds: 4, status: "Activa", statusCode: 1, nextRecipient: "0x0000000000000000000000000000000000000000" },
  { name: "Tanda Familiar Bogotá", contributionAmount: "20.0", currentRound: 1, totalRounds: 4, status: "Pendiente", statusCode: 0, nextRecipient: "0x0000000000000000000000000000000000000000" },
  { name: "Natillera Navideña", contributionAmount: "15.0", currentRound: 1, totalRounds: 4, status: "Pendiente", statusCode: 0, nextRecipient: "0x0000000000000000000000000000000000000000" },
];

function formatOnChainState(data: NatilleraData[]): string {
  return data.map((d, i) => {
    const addr = NATILLERAS[i]?.address ?? "desconocido";
    const recipient = d.nextRecipient === "0x0000000000000000000000000000000000000000"
      ? "pendiente"
      : `${d.nextRecipient.slice(0, 6)}...${d.nextRecipient.slice(-4)}`;
    return `- ${d.name} (${addr.slice(0, 6)}...${addr.slice(-4)}): Estado=${d.status}, Ronda=${d.currentRound}/${d.totalRounds}, Cuota=${d.contributionAmount} cUSD, Próximo recipiente=${recipient}`;
  }).join("\n");
}

function buildSystemPrompt(onChainState: string, isLive: boolean): string {
  const dataLabel = isLive ? "DATOS EN TIEMPO REAL (leídos de Celo Mainnet ahora mismo)" : "DATOS DE REFERENCIA (no se pudo leer la chain, pueden estar desactualizados)";

  return `Eres el Agente Natillera #12, un agente autónomo on-chain que gestiona natilleras (grupos de ahorro rotativo) en Celo Mainnet.

IDENTIDAD:
- Eres un agente autónomo registrado bajo ERC-8004 (estándar de identidad on-chain)
- Agent ID: #12
- Reputación on-chain: ~96-97/100 (25 feedbacks verificados)
- Verificación SelfClaw: identidad verificada con ZK proof
- Operas directamente sobre los smart contracts en Celo Mainnet

${dataLabel}:
${onChainState}

CONTRATOS:
- Factory: 0x6567645D4150AbC2c7802DaD76711be8b8669171 (Celo Mainnet)
- cUSD (stablecoin): 0x765DE816845861e75A25fCA122bb6898B8B1282a

CÓMO FUNCIONA UNA NATILLERA:
- Los participantes contribuyen periódicamente en cUSD
- En cada ronda, una persona recibe el pozo completo
- Orden aleatorio de pagos (shuffle con prevrandao)
- Colateral requerido para unirse (= 1 contribución)
- Penalización por no pagar a tiempo (pierde colateral)
- Colateral devuelto al completar todas las rondas
- Todo es transparente y verificable on-chain

LINKS:
- Frontend: https://frontend-neon-nine-31.vercel.app
- Celoscan: https://celoscan.io/address/0xE9D8670897b7AEdFD7a7ACB783c229d63Ce76F2E

INSTRUCCIONES:
- Responde SIEMPRE en español
- Sé conciso, directo y técnico cuando sea apropiado
- Usa los datos on-chain para responder con información real y específica
- Cuando menciones estados o rondas, incluye los números reales
- Habla en primera persona como el agente que gestiona estas natilleras
- Si te preguntan algo que requiere una transacción, explica qué función del contrato se necesita
- Puedes recomendar verificar en Celoscan o en el frontend`;
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Agent not configured" }, { status: 500 });
    }

    // Fetch live on-chain data, fall back to hardcoded if it fails
    let natilleraData: NatilleraData[];
    let isLive = true;
    try {
      natilleraData = await getAllNatillerasData();
      if (natilleraData.length === 0) {
        natilleraData = FALLBACK_DATA;
        isLive = false;
      }
    } catch {
      natilleraData = FALLBACK_DATA;
      isLive = false;
    }

    const onChainState = formatOnChainState(natilleraData);
    const systemPrompt = buildSystemPrompt(onChainState, isLive);

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ??
      "Lo siento, no pude procesar tu pregunta.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { reply: "Lo siento, hubo un error. Por favor intenta de nuevo." },
      { status: 200 },
    );
  }
}
